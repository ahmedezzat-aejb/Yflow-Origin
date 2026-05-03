import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { apDayjs, exceptionHandler, securityAccess } from '@yflow/server-shared'
import { isNil, PlanName, TeamProjectsLimit, UserWithMetaInformation } from '@yflow/shared'
import { FastifyRequest } from 'fastify'
import { StatusCodes } from 'http-status-codes'
import { platformAiCreditsService } from './platform-ai-credits.service'
import { platformPlanService } from './platform-plan.service'
import { SberbankCheckoutType, sberbankHelper } from './sberbank-helper'
import { StripeCheckoutType } from './stripe-helper'

export const sberbankBillingController: FastifyPluginAsyncTypebox = async (fastify) => {
    fastify.post(
        '/sberbank/webhook',
        WebhookRequest,
        async (request: FastifyRequest, reply) => {
            try {
                const payload = request.rawBody as string
                const signature = request.headers['x-sberbank-signature'] as string

                const helper = sberbankHelper(request.log)

                if (!(await helper.verifyWebhookSignature(payload, signature))) {
                    request.log.warn('⚠️  Sberbank webhook signature verification failed.')
                    return await reply
                        .status(StatusCodes.BAD_REQUEST)
                        .send('Invalid webhook signature')
                }

                const webhook = JSON.parse(payload)

                switch (webhook.type) {
                    case 'payment.succeeded': {
                        const payment = webhook.data.object
                        if (isNil(payment.metadata)) {
                            break
                        }

                        if (payment.metadata.type === SberbankCheckoutType.AI_CREDIT_PAYMENT) {
                            const platformId = payment.metadata.platformId as string
                            const amountInRub = payment.amount / 100 // Convert from kopecks to RUB

                            // Convert RUB to USD (approximate rate, you should use real-time rate)
                            const amountInUsd = amountInRub * 0.011

                            await platformAiCreditsService(request.log).aiCreditsPaymentSucceeded(
                                platformId,
                                amountInUsd,
                                StripeCheckoutType.AI_CREDIT_PAYMENT,
                            )
                        }
                        break
                    }
                    case 'subscription.created':
                    case 'subscription.updated':
                    case 'subscription.cancelled': {
                        const subscription = webhook.data.object
                        const platformId = subscription.metadata.platformId as string

                        const { startDate, endDate, cancelDate } = await getSubscriptionCycleDates(subscription)

                        const newLimits = {
                            includedAiCredits: 1000,
                            tablesEnabled: true,
                            eventStreamingEnabled: true,
                            environmentsEnabled: true,
                            analyticsEnabled: true,
                            showPoweredBy: false,
                            auditLogEnabled: true,
                            embeddingEnabled: true,
                            managePiecesEnabled: true,
                            manageTemplatesEnabled: true,
                            customAppearanceEnabled: true,
                            teamProjectsLimit: TeamProjectsLimit.UNLIMITED,
                            projectRolesEnabled: true,
                            customDomainsEnabled: true,
                            globalConnectionsEnabled: true,
                            customRolesEnabled: true,
                            apiKeysEnabled: true,
                            ssoEnabled: true,
                        }

                        const subscriptionCancelled = webhook.type === 'subscription.cancelled'
                        if (subscriptionCancelled) {
                            await platformPlanService(request.log).update({
                                ...newLimits,
                                platformId,
                                plan: PlanName.STANDARD,
                                sberbankSubscriptionStatus: 'CANCELED',
                                sberbankSubscriptionId: undefined,
                                sberbankSubscriptionStartDate: undefined,
                                sberbankSubscriptionEndDate: undefined,
                                sberbankSubscriptionCancelDate: undefined,
                            })
                            break
                        }

                        await platformPlanService(request.log).update({
                            ...newLimits,
                            platformId,
                            plan: PlanName.STANDARD,
                            sberbankSubscriptionId: subscription.id,
                            sberbankSubscriptionStatus: subscription.status,
                            sberbankSubscriptionStartDate: startDate,
                            sberbankSubscriptionEndDate: endDate,
                            sberbankSubscriptionCancelDate: cancelDate,
                        })
                        break
                    }
                    default:
                        request.log.info(`Unhandled webhook event type: ${webhook.type}`)
                        break
                }

                return await reply.status(StatusCodes.OK).send({ received: true })
            }
            catch (err) {
                request.log.error(err)
                request.log.warn('⚠️  Sberbank webhook processing failed.')
                exceptionHandler.handle(err, request.log)
                return reply
                    .status(StatusCodes.BAD_REQUEST)
                    .send('Webhook processing failed')
            }
        },
    )

    fastify.post(
        '/sberbank/create-payment-session',
        CreatePaymentSessionRequest,
        async (request: FastifyRequest, reply) => {
            try {
                const body = request.body as {
                    platformId: string
                    amountInRub: number
                    description: string
                }
                const { platformId, amountInRub, description } = body

                const platformBilling = await platformPlanService(request.log).getOrCreateForPlatform(platformId)
                const helper = sberbankHelper(request.log)

                if (isNil(platformBilling.sberbankCustomerId)) {
                    // TODO: Get user from authentication context
                    // For now, create customer with minimal data
                    const user = {
                        id: 'system',
                        email: `platform-${platformId}@yflow.local`,
                        firstName: 'Platform',
                        lastName: 'User',
                    } as UserWithMetaInformation
                    const customerId = await helper.createCustomer(user, platformId)
                    await platformPlanService(request.log).update({
                        platformId,
                        sberbankCustomerId: customerId,
                    })
                }

                const paymentUrl = await helper.createPaymentSession({
                    customerId: platformBilling.sberbankCustomerId!,
                    platformId,
                    amountInRub,
                    description,
                })

                return await reply.status(StatusCodes.OK).send({ paymentUrl })
            }
            catch (err) {
                request.log.error(err)
                exceptionHandler.handle(err, request.log)
                return reply
                    .status(StatusCodes.INTERNAL_SERVER_ERROR)
                    .send('Failed to create payment session')
            }
        },
    )

    fastify.post(
        '/sberbank/create-subscription-session',
        CreateSubscriptionSessionRequest,
        async (request: FastifyRequest, reply) => {
            try {
                const body = request.body as {
                    platformId: string
                    planId: string
                    amountInRub: number
                    interval: 'month' | 'year'
                }
                const { platformId, planId, amountInRub, interval } = body

                const platformBilling = await platformPlanService(request.log).getOrCreateForPlatform(platformId)
                const helper = sberbankHelper(request.log)

                if (isNil(platformBilling.sberbankCustomerId)) {
                    // TODO: Get user from authentication context
                    // For now, create customer with minimal data
                    const user = {
                        id: 'system',
                        email: `platform-${platformId}@yflow.local`,
                        firstName: 'Platform',
                        lastName: 'User',
                    } as UserWithMetaInformation
                    const customerId = await helper.createCustomer(user, platformId)
                    await platformPlanService(request.log).update({
                        platformId,
                        sberbankCustomerId: customerId,
                    })
                }

                const subscriptionUrl = await helper.createSubscriptionSession({
                    customerId: platformBilling.sberbankCustomerId!,
                    platformId,
                    planId,
                    amountInRub,
                    interval,
                })

                return await reply.status(StatusCodes.OK).send({ subscriptionUrl })
            }
            catch (err) {
                request.log.error(err)
                exceptionHandler.handle(err, request.log)
                return reply
                    .status(StatusCodes.INTERNAL_SERVER_ERROR)
                    .send('Failed to create subscription session')
            }
        },
    )
}

async function getSubscriptionCycleDates(subscription: unknown): Promise<{ startDate: number, endDate: number, cancelDate?: number }> {
    const defaultStartDate = apDayjs().startOf('month').unix()
    const defaultEndDate = apDayjs().endOf('month').unix()
    const defaultCancelDate = undefined

    if (isSberbankSubscription(subscription)) {
        return {
            startDate: subscription.current_period_start,
            endDate: subscription.current_period_end,
            cancelDate: subscription.cancel_at ?? undefined,
        }
    }

    return { startDate: defaultStartDate, endDate: defaultEndDate, cancelDate: defaultCancelDate }
}

type SberbankSubscription = {
    current_period_start: number
    current_period_end: number
    cancel_at?: number
}

function isSberbankSubscription(subscription: unknown): subscription is SberbankSubscription {
    return subscription !== null &&
        typeof subscription === 'object' &&
        'current_period_start' in subscription &&
        typeof subscription.current_period_start === 'number' &&
        'current_period_end' in subscription &&
        typeof subscription.current_period_end === 'number'
}

const WebhookRequest = {
    config: {
        security: securityAccess.public(),
        rawBody: true,
    },
}

const CreatePaymentSessionRequest = {
    schema: {
        body: {
            type: 'object',
            properties: {
                platformId: { type: 'string' },
                amountInRub: { type: 'number' },
                description: { type: 'string' },
            },
            required: ['platformId', 'amountInRub', 'description'],
        },
    },
}

const CreateSubscriptionSessionRequest = {
    schema: {
        body: {
            type: 'object',
            properties: {
                platformId: { type: 'string' },
                planId: { type: 'string' },
                amountInRub: { type: 'number' },
                interval: { type: 'string', enum: ['month', 'year'] },
            },
            required: ['platformId', 'planId', 'amountInRub', 'interval'],
        },
    },
}
