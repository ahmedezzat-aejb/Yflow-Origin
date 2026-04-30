import { apDayjs, AppSystemProp, WorkerSystemProp } from '@yflow/server-shared'
import { ApEdition, assertNotNullOrUndefined, isNil, UserWithMetaInformation } from '@yflow/shared'
import { FastifyBaseLogger } from 'fastify'
import axios from 'axios'
import { system } from '../../../helper/system/system'
import { platformPlanService } from './platform-plan.service'

export const sberbankWebhookSecret = system.get(AppSystemProp.SBERBANK_WEBHOOK_SECRET)!
const frontendUrl = system.get(WorkerSystemProp.FRONTEND_URL)

export const sberbankHelper = (log: FastifyBaseLogger) => ({
    getSberbankClient: () => {
        if (system.getEdition() !== ApEdition.CLOUD) return undefined

        const apiKey = system.getOrThrow(AppSystemProp.SBERBANK_API_KEY)
        const merchantId = system.getOrThrow(AppSystemProp.SBERBANK_MERCHANT_ID)
        
        return {
            apiKey,
            merchantId,
            baseUrl: system.get(AppSystemProp.SBERBANK_BASE_URL) || 'https://api.sberbank.ru/v1'
        }
    },

    async createCustomer(user: UserWithMetaInformation, platformId: string): Promise<string> {
        const client = this.getSberbankClient()
        assertNotNullOrUndefined(client, 'Sberbank is not configured')

        try {
            const response = await axios.post(`${client.baseUrl}/customers`, {
                email: user.email,
                name: `${user.firstName} ${user.lastName}`,
                description: `Platform ID: ${platformId}, user ${user.id}`,
                metadata: {
                    platformId,
                    customer_key: `ps_cus_key_${user.email}`,
                },
            }, {
                headers: {
                    'Authorization': `Bearer ${client.apiKey}`,
                    'X-Merchant-ID': client.merchantId,
                    'Content-Type': 'application/json'
                }
            })

            return response.data.id
        } catch (error) {
            log.error({ error, platformId }, 'Failed to create Sberbank customer')
            throw error
        }
    },

    async createPaymentSession(params: {
        customerId: string
        platformId: string
        amountInRub: number
        description: string
        returnUrl?: string
    }): Promise<string> {
        const client = this.getSberbankClient()
        assertNotNullOrUndefined(client, 'Sberbank is not configured')

        const { customerId, platformId, amountInRub, description, returnUrl } = params

        try {
            const response = await axios.post(`${client.baseUrl}/payment-sessions`, {
                customer_id: customerId,
                amount: amountInRub * 100, // Convert to kopecks
                currency: 'RUB',
                description,
                metadata: {
                    platformId,
                },
                success_url: `${frontendUrl}/platform/setup/billing/success?action=sberbank-payment`,
                cancel_url: `${frontendUrl}/platform/setup/billing/error`,
                return_url: returnUrl || `${frontendUrl}/platform/setup/billing`,
            }, {
                headers: {
                    'Authorization': `Bearer ${client.apiKey}`,
                    'X-Merchant-ID': client.merchantId,
                    'Content-Type': 'application/json'
                }
            })

            return response.data.payment_url
        } catch (error) {
            log.error({ error, params }, 'Failed to create Sberbank payment session')
            throw error
        }
    },

    async createSubscriptionSession(params: {
        customerId: string
        platformId: string
        planId: string
        amountInRub: number
        interval: 'month' | 'year'
    }): Promise<string> {
        const client = this.getSberbankClient()
        assertNotNullOrUndefined(client, 'Sberbank is not configured')

        const { customerId, platformId, planId, amountInRub, interval } = params

        try {
            const response = await axios.post(`${client.baseUrl}/subscription-sessions`, {
                customer_id: customerId,
                plan_id: planId,
                amount: amountInRub * 100, // Convert to kopecks
                currency: 'RUB',
                interval,
                metadata: {
                    platformId,
                },
                success_url: `${frontendUrl}/platform/setup/billing/success?action=sberbank-subscription`,
                cancel_url: `${frontendUrl}/platform/setup/billing/error`,
            }, {
                headers: {
                    'Authorization': `Bearer ${client.apiKey}`,
                    'X-Merchant-ID': client.merchantId,
                    'Content-Type': 'application/json'
                }
            })

            return response.data.subscription_url
        } catch (error) {
            log.error({ error, params }, 'Failed to create Sberbank subscription session')
            throw error
        }
    },

    async getPaymentDetails(paymentId: string): Promise<any> {
        const client = this.getSberbankClient()
        assertNotNullOrUndefined(client, 'Sberbank is not configured')

        try {
            const response = await axios.get(`${client.baseUrl}/payments/${paymentId}`, {
                headers: {
                    'Authorization': `Bearer ${client.apiKey}`,
                    'X-Merchant-ID': client.merchantId,
                    'Content-Type': 'application/json'
                }
            })

            return response.data
        } catch (error) {
            log.error({ error, paymentId }, 'Failed to get Sberbank payment details')
            throw error
        }
    },

    async getSubscriptionDetails(subscriptionId: string): Promise<any> {
        const client = this.getSberbankClient()
        assertNotNullOrUndefined(client, 'Sberbank is not configured')

        try {
            const response = await axios.get(`${client.baseUrl}/subscriptions/${subscriptionId}`, {
                headers: {
                    'Authorization': `Bearer ${client.apiKey}`,
                    'X-Merchant-ID': client.merchantId,
                    'Content-Type': 'application/json'
                }
            })

            return response.data
        } catch (error) {
            log.error({ error, subscriptionId }, 'Failed to get Sberbank subscription details')
            throw error
        }
    },

    async cancelSubscription(subscriptionId: string): Promise<void> {
        const client = this.getSberbankClient()
        assertNotNullOrUndefined(client, 'Sberbank is not configured')

        try {
            await axios.post(`${client.baseUrl}/subscriptions/${subscriptionId}/cancel`, {}, {
                headers: {
                    'Authorization': `Bearer ${client.apiKey}`,
                    'X-Merchant-ID': client.merchantId,
                    'Content-Type': 'application/json'
                }
            })
        } catch (error) {
            log.error({ error, subscriptionId }, 'Failed to cancel Sberbank subscription')
            throw error
        }
    },

    verifyWebhookSignature(payload: string, signature: string): boolean {
        const webhookSecret = system.get(AppSystemProp.SBERBANK_WEBHOOK_SECRET)
        if (isNil(webhookSecret)) return false

        try {
            const crypto = require('crypto')
            const expectedSignature = crypto
                .createHmac('sha256', webhookSecret)
                .update(payload)
                .digest('hex')
            
            return signature === expectedSignature
        } catch (error) {
            log.error({ error }, 'Failed to verify Sberbank webhook signature')
            return false
        }
    }
})

export enum SberbankCheckoutType {
    AI_CREDIT_PAYMENT = 'sberbank-ai-credit-payment',
    SUBSCRIPTION_PAYMENT = 'sberbank-subscription-payment',
}

type CreateSberbankPaymentParams = {
    platformId: string
    customerId: string
    amountInRub: number
    description: string
}

type CreateSberbankSubscriptionParams = {
    platformId: string
    customerId: string
    planId: string
    amountInRub: number
    interval: 'month' | 'year'
}
