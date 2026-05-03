import { apDayjs, AppSystemProp, WorkerSystemProp } from '@yflow/server-shared'
import { ApEdition, assertNotNullOrUndefined, isNil, UserWithMetaInformation } from '@yflow/shared'
import { FastifyBaseLogger } from 'fastify'
import { system } from '../../../helper/system/system'
import { platformPlanService } from './platform-plan.service'

export const yookassaWebhookSecret = system.get(AppSystemProp.YOOKASSA_WEBHOOK_SECRET)!
const frontendUrl = system.get(WorkerSystemProp.FRONTEND_URL)

export const yookassaHelper = (log: FastifyBaseLogger) => ({
    async createPayment(user: UserWithMetaInformation, platformId: string, amount: number, description: string): Promise<string> {
        const yookassaApiKey = system.getOrThrow(AppSystemProp.YOOKASSA_API_KEY)
        const yookassaShopId = system.getOrThrow(AppSystemProp.YOOKASSA_SHOP_ID)
        
        const response = await fetch('https://api.yookassa.ru/v3/payments', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${Buffer.from(`${yookassaShopId}:${yookassaApiKey}`).toString('base64')}`,
                'Content-Type': 'application/json',
                'Idempotence-Key': `${platformId}-${Date.now()}`,
            },
            body: JSON.stringify({
                amount: {
                    value: amount,
                    currency: 'RUB',
                },
                payment_method_data: {
                    type: 'bank_card',
                },
                confirmation: {
                    type: 'redirect',
                    return_url: `${frontendUrl}/platform/billing/success`,
                },
                description,
                metadata: {
                    platformId,
                    userId: user.id,
                    userEmail: user.email,
                },
                capture: true,
            }),
        })
        
        const payment = await response.json()
        return payment.confirmation.confirmation_url
    },

    async createSbpPayment(user: UserWithMetaInformation, platformId: string, amount: number, description: string): Promise<string> {
        const yookassaApiKey = system.getOrThrow(AppSystemProp.YOOKASSA_API_KEY)
        const yookassaShopId = system.getOrThrow(AppSystemProp.YOOKASSA_SHOP_ID)
        
        const response = await fetch('https://api.yookassa.ru/v3/payments', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${Buffer.from(`${yookassaShopId}:${yookassaApiKey}`).toString('base64')}`,
                'Content-Type': 'application/json',
                'Idempotence-Key': `${platformId}-sbp-${Date.now()}`,
            },
            body: JSON.stringify({
                amount: {
                    value: amount,
                    currency: 'RUB',
                },
                payment_method_data: {
                    type: 'sbp',
                },
                confirmation: {
                    type: 'redirect',
                    return_url: `${frontendUrl}/platform/billing/success`,
                },
                description,
                metadata: {
                    platformId,
                    userId: user.id,
                    userEmail: user.email,
                    paymentType: 'SBP',
                },
                capture: true,
            }),
        })
        
        const payment = await response.json()
        return payment.confirmation.confirmation_url
    },

    async getPaymentStatus(paymentId: string): Promise<any> {
        const yookassaApiKey = system.getOrThrow(AppSystemProp.YOOKASSA_API_KEY)
        const yookassaShopId = system.getOrThrow(AppSystemProp.YOOKASSA_SHOP_ID)
        
        const response = await fetch(`https://api.yookassa.ru/v3/payments/${paymentId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${Buffer.from(`${yookassaShopId}:${yookassaApiKey}`).toString('base64')}`,
                'Content-Type': 'application/json',
            },
        })
        
        return response.json()
    },

    verifyWebhook(payload: string, signature: string): boolean {
        const secret = yookassaWebhookSecret
        const crypto = require('crypto')
        const hmac = crypto.createHmac('sha256', secret)
        hmac.update(payload)
        const expectedSignature = hmac.digest('hex')
        return signature === expectedSignature
    },
})

type CreateAICreditAutoTopUpCheckoutSessionParams = {
    platformId: string
    amount: number
    description: string
}
