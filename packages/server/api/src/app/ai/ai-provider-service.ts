import {
    AIProviderAuthConfig, AIProviderModel, AIProviderName, AIProviderWithoutSensitiveData, apId, CreateAIProviderRequest,
    ErrorCode,
    GetProviderConfigResponse,
    isNil,
    PlatformId,
    spreadIfDefined,
    UpdateAIProviderRequest,
    YFLOW_PROVIDER_AUTH_CONFIG,
    yflowError,
} from '@yflow/shared'
import dayjs from 'dayjs'
import { FastifyBaseLogger } from 'fastify'
import cron from 'node-cron'
import { In } from 'typeorm'
import { repoFactory } from '../core/db/repo-factory'
import { openRouterApi } from '../ee/platform/platform-plan/openrouter/openrouter-api'
import { platformPlanService } from '../ee/platform/platform-plan/platform-plan.service'
import { flagService } from '../flags/flag.service'
import { encryptUtils } from '../helper/encryption'
import { SystemJobName } from '../helper/system-jobs/common'
import { systemJobsSchedule } from '../helper/system-jobs/system-job'
import { AIProviderEntity, AIProviderSchema } from './ai-provider-entity'
import { aiProviders } from './providers'

const aiProviderRepo = repoFactory<AIProviderSchema>(AIProviderEntity)

const modelsCache = new Map<string, AIProviderModel[]>()

export const aiProviderService = (log: FastifyBaseLogger) => ({
    async setup(): Promise<void> {
        cron.schedule('0 0 * * *', () => {
            log.info('Clearing AI provider models cache')
            modelsCache.clear()
        })
    },

    async listProviders(platformId: PlatformId): Promise<AIProviderWithoutSensitiveData[]> {
        const yflowExists = await aiProviderRepo().existsBy({
            platformId,
            provider: AIProviderName.YFLOW,
        })

        if (flagService.aiCreditsEnabled() && !yflowExists) {
            await aiProviderRepo().save({
                id: apId(),
                auth: await encryptUtils.encryptObject({}),
                config: {},
                provider: AIProviderName.YFLOW,
                displayName: 'yflow',
                platformId,
            })
        }
        const configuredProviders = await aiProviderRepo().findBy({ platformId })

        const formattedProviders: AIProviderWithoutSensitiveData[] = await Promise.all(configuredProviders.map(async p => {
            return {
                id: p.id,
                name: p.displayName,
                provider: p.provider,
                config: p.config,
            }
        }))
        return formattedProviders
    },

    async listModels(platformId: PlatformId, provider: AIProviderName): Promise<AIProviderModel[]> {
        const { config, auth } = await this.getConfigOrThrow({ platformId, provider })

        const cacheKey = `${provider}-${auth.apiKey}`
        if (modelsCache.has(cacheKey) && !('models' in config)) {
            return modelsCache.get(cacheKey)!
        }

        const data = await aiProviders[provider].listModels(auth, config)

        modelsCache.set(cacheKey, data.map(model => ({
            id: model.id,
            name: model.name,
            type: model.type,
        })))

        return modelsCache.get(cacheKey)!
    },

    async create(platformId: PlatformId, request: CreateAIProviderRequest): Promise<void> {
        await aiProviderRepo().save({
            id: apId(),
            auth: await encryptUtils.encryptObject(request.auth),
            config: request.config,
            provider: request.provider,
            displayName: request.displayName,
            platformId,
        })
    },
    async update(platformId: PlatformId, providerId: string, request: UpdateAIProviderRequest): Promise<void> {
        const aiProvider = await aiProviderRepo().findOneBy({
            platformId,
            id: providerId,
        })
        if (isNil(aiProvider) || aiProvider.provider === AIProviderName.YFLOW) {
            throw new yflowError({
                code: ErrorCode.ENTITY_NOT_FOUND,
                params: { entityId: providerId, entityType: 'AIProvider' },
            })
        }

        const encryptedAuth = !isNil(request.auth) ? await encryptUtils.encryptObject(request.auth) : undefined
        await aiProviderRepo().update(providerId, {
            ...spreadIfDefined('auth', encryptedAuth),
            ...spreadIfDefined('config', request.config),
            displayName: request.displayName,
        })
    },

    async delete(platformId: PlatformId, providerId: string): Promise<void> {
        await aiProviderRepo().delete({
            platformId,
            id: providerId,
        })
    },
    async getConfigOrThrow({ platformId, provider }: GetOrCreateyflowConfigResponse): Promise<GetProviderConfigResponse> {
        const aiProvider = await aiProviderRepo().findOneBy({
            platformId,
            provider,
        })
        if (isNil(aiProvider)) {
            throw new yflowError({
                code: ErrorCode.ENTITY_NOT_FOUND,
                params: {
                    entityId: provider,
                    entityType: 'AIProvider',
                },
            })
        }

        let auth = await encryptUtils.decryptObject<AIProviderAuthConfig>(aiProvider.auth)

        if (aiProvider.provider === AIProviderName.YFLOW) {
            const doesHaveKeys = !isNil(auth) && !isNil(auth.apiKey) && auth.apiKey !== ''
            if (!doesHaveKeys) {
                const { auth: yflowAuth } = await enrichWithKeysIfNeeded(aiProvider, platformId, log)

                auth = yflowAuth
            }

            await systemJobsSchedule(log).upsertJob({
                job: {
                    name: SystemJobName.AI_CREDIT_UPDATE_CHECK,
                    data: { apiKeyHash: (auth as YFLOW_PROVIDER_AUTH_CONFIG).apiKeyHash, platformId },
                },
                schedule: {
                    type: 'one-time',
                    date: dayjs(),
                },
            })
        }
        
        
        return { provider: aiProvider.provider, auth, config: aiProvider.config }
    },
    async getyflowProviderIfEnriched(platformId: PlatformId): Promise<YFLOW_PROVIDER_AUTH_CONFIG | null> {
        const aiProvider = await aiProviderRepo().findOneBy({
            platformId,
            provider: AIProviderName.YFLOW,
        })
        if (isNil(aiProvider)) {
            return null
        }
        const doesHaveKeys = await doesyflowProviderHasKeys(aiProvider)
        if (!doesHaveKeys) {
            return null
        }
        const { auth } = await this.getConfigOrThrow({ platformId, provider: aiProvider.provider })

        return auth as YFLOW_PROVIDER_AUTH_CONFIG
    },

    async getOrCreateyflowProviderAuthConfig(platformId: PlatformId): Promise<YFLOW_PROVIDER_AUTH_CONFIG> {
        const aiProvider = await aiProviderRepo().findOneBy({
            platformId,
            provider: AIProviderName.YFLOW,
        })
        if (isNil(aiProvider)) {
            await aiProviderRepo().save({
                id: apId(),
                auth: await encryptUtils.encryptObject({}),
                config: {},
                provider: AIProviderName.YFLOW,
                displayName: 'yflow',
                platformId,
            })
        }

        const { auth } = await this.getConfigOrThrow({ platformId, provider: AIProviderName.YFLOW })
        return auth as YFLOW_PROVIDER_AUTH_CONFIG
    },

    async getAllyflowProvidersConfigs(platformIds?: string[]): Promise<{ [platformId: string]: YFLOW_PROVIDER_AUTH_CONFIG }> {
        const aiProviders = await aiProviderRepo().find({
            where: {
                provider: AIProviderName.YFLOW,
                platformId: platformIds?.length ? In(platformIds) : undefined,
            },
        })

        const result: { [platformId: string]: YFLOW_PROVIDER_AUTH_CONFIG } = {}
        for (const aiProvider of aiProviders) {
            const hasKeys = await doesyflowProviderHasKeys(aiProvider)
            if (!hasKeys) continue

            result[aiProvider.platformId] = await encryptUtils.decryptObject<YFLOW_PROVIDER_AUTH_CONFIG>(aiProvider.auth)
        }

        return result
    },
})

type GetOrCreateyflowConfigResponse = {
    platformId: PlatformId
    provider: AIProviderName
}

async function enrichWithKeysIfNeeded(aiProvider: AIProviderSchema, platformId: PlatformId, log: FastifyBaseLogger): Promise<GetProviderConfigResponse> {
    const platformPlan = await platformPlanService(log).getOrCreateForPlatform(platformId)
    const limit = platformPlan.includedAiCredits / 1000
    const { key, data } = await openRouterApi.createKey({
        name: `Platform ${platformId}`, 
        limit,
    })
    const rawAuth: YFLOW_PROVIDER_AUTH_CONFIG = { apiKey: key, apiKeyHash: data.hash }
    const savedAiProvider = await aiProviderRepo().save({
        id: aiProvider.id,
        platformId,
        provider: AIProviderName.YFLOW,
        displayName: 'yflow',
        config: {},
        auth: await encryptUtils.encryptObject(rawAuth),
    })
    await platformPlanService(log).update({
        platformId,
        lastFreeAiCreditsRenewalDate: new Date().toISOString(),
    })
    return { provider: savedAiProvider.provider, auth: rawAuth, config: savedAiProvider.config }
}


async function doesyflowProviderHasKeys(aiProvider: AIProviderSchema): Promise<boolean> {
    if (isNil(aiProvider) || isNil(aiProvider.auth)) {
        return false
    }
    const decryptedAuth = await encryptUtils.decryptObject<YFLOW_PROVIDER_AUTH_CONFIG>(aiProvider.auth)
    return !isNil(decryptedAuth) && !isNil(decryptedAuth.apiKey) && decryptedAuth.apiKey !== ''
}
