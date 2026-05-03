import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { STANDARD_CLOUD_PLAN } from '@yflow/ee-shared'
import { exceptionHandler, securityAccess } from '@yflow/server-shared'
import { PrincipalType, TeamProjectsLimit } from '@yflow/shared'
import { FastifyRequest } from 'fastify'
import { StatusCodes } from 'http-status-codes'
import { platformAiCreditsService } from './platform-ai-credits.service'
import { platformPlanService } from './platform-plan.service'
import { StripeCheckoutType } from './stripe-helper'
import { yookassaHelper } from './yookassa-helper'

const WebhookRequest = {
    config: {
        security: securityAccess.public(),
        allowedHttpMethods: ['POST'],
    },
    schema: {
        description: 'YooKassa webhook handler',
        tags: ['Platform Billing'],
        body: {
            type: 'object',
            properties: {
                event: { type: 'string' },
                object: { type: 'object' },
            },
        },
    },
}

export const yookassaBillingController: FastifyPluginAsyncTypebox = async (fastify) => {
    fastify.post(
        '/yookassa/webhook',
        WebhookRequest,
        async (request: FastifyRequest, reply) => {
            try {
                const payload = JSON.stringify(request.body)
                const signature = request.headers['yookassa-signature'] as string

                if (!yookassaHelper(request.log).verifyWebhook(payload, signature)) {
                    return await reply.status(StatusCodes.BAD_REQUEST).send({ error: 'Invalid signature' })
                }

                const event = request.body as YooKassaWebhookEvent
                const payment = event.object

                switch (event.event) {
                    case 'payment.succeeded': {
                        if (!payment.metadata) {
                            break
                        }

                        const platformId = payment.metadata.platformId as string
                        const amount = parseFloat(payment.amount.value)
                        if (payment.metadata.type === 'AI_CREDIT_PAYMENT') {
                            await platformAiCreditsService(request.log).aiCreditsPaymentSucceeded(
                                platformId, 
                                amount, 
                                StripeCheckoutType.AI_CREDIT_PAYMENT,
                            )
                        }
                        else {
                            await platformPlanService(request.log).update({
                                platformId,
                                ...STANDARD_CLOUD_PLAN,
                                teamProjectsLimit: TeamProjectsLimit.UNLIMITED,
                            })
                        }
                        break
                    }
                    case 'payment.canceled': {
                        const platformId = payment.metadata?.platformId as string
                        if (platformId) {
                            request.log.info({ platformId }, 'YooKassa payment was canceled')
                        }
                        break
                    }
                }

                return await reply.status(StatusCodes.OK).send({ received: true })
            }
            catch (error) {
                exceptionHandler.handle(error, request.log)
                return reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
                    error: 'Internal server error',
                })
            }
        },
    )

    fastify.post(
        '/yookassa/create-payment-session',
        {
            config: {
                security: securityAccess.platformAdminOnly([PrincipalType.USER]),
            },
            schema: {
                description: 'Create YooKassa payment session',
                tags: ['Platform Billing'],
                body: {
                    type: 'object',
                    properties: {
                        platformId: { type: 'string' },
                        amount: { type: 'number' },
                        description: { type: 'string' },
                        paymentMethod: { type: 'string', enum: ['card', 'sbp'] },
                        type: { type: 'string', enum: ['SUBSCRIPTION', 'AI_CREDIT_PAYMENT'] },
                    },
                    required: ['platformId', 'amount', 'description', 'paymentMethod', 'type'],
                },
            },
        },
        async (request: FastifyRequest, reply) => {
            try {
                const { platformId, amount, description, paymentMethod } = request.body as CreateYooKassaPaymentSessionBody
                
                const user = request.principal

                let paymentUrl: string

                if (paymentMethod === 'sbp') {
                    paymentUrl = await yookassaHelper(request.log).createSbpPayment(
                        user,
                        platformId,
                        amount,
                        description,
                    )
                }
                else {
                    paymentUrl = await yookassaHelper(request.log).createPayment(
                        user,
                        platformId,
                        amount,
                        description,
                    )
                }

                return await reply.status(StatusCodes.OK).send({
                    paymentUrl,
                    paymentMethod,
                    amount,
                    currency: 'RUB',
                })
            }
            catch (error) {
                exceptionHandler.handle(error, request.log)
                return reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
                    error: 'Failed to create payment session',
                })
            }
        },
    )
}

type YooKassaWebhookEvent = {
    event: string
    object: {
        amount: {
            value: string
        }
        metadata?: {
            platformId?: string
            type?: string
        }
    }
}

type CreateYooKassaPaymentSessionBody = {
    platformId: string
    amount: number
    description: string
    paymentMethod: 'card' | 'sbp'
}
