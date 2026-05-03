import { AIProviderName, apId, YFLOW_PROVIDER_AUTH_CONFIG } from '@yflow/shared'
import { MigrationInterface, QueryRunner } from 'typeorm'
import { encryptUtils } from '../../../helper/encryption'

export class RemoveOpenRouterKeysFromPlatformPlan1766094015801 implements MigrationInterface {
    name = 'RemoveOpenRouterKeysFromPlatformPlan1766094015801'

    public async up(queryRunner: QueryRunner): Promise<void> {
        const plans = await queryRunner.query(`
            SELECT id, "platformId", "openRouterApiKey", "openRouterApiKeyHash"
            FROM "platform_plan"
            WHERE "openRouterApiKey" IS NOT NULL
        `)

        for (const plan of plans) {
            const config: YFLOW_PROVIDER_AUTH_CONFIG = {
                apiKey: plan.openRouterApiKey,
                apiKeyHash: plan.openRouterApiKeyHash,
            }

            const encryptedConfig = await encryptUtils.encryptObject(config)

            await queryRunner.query(`
                INSERT INTO "ai_provider" ("id", "platformId", "provider", "displayName", "config", "created", "updated")
                VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
            `, [
                apId(),
                plan.platformId,
                AIProviderName.YFLOW,
                'yflow',
                encryptedConfig,
            ])
        }

        await queryRunner.query(`
            ALTER TABLE "platform_plan" DROP COLUMN "openRouterApiKeyHash"
        `)
        await queryRunner.query(`
            ALTER TABLE "platform_plan" DROP COLUMN "openRouterApiKey"
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "platform_plan"
            ADD "openRouterApiKey" character varying
        `)
        await queryRunner.query(`
            ALTER TABLE "platform_plan"
            ADD "openRouterApiKeyHash" character varying
        `)
    }

}
