import { ApSubscriptionStatus, STANDARD_CLOUD_PLAN } from '@yflow/ee-shared'
import { AppSystemProp, exceptionHandler, securityAccess } from '@yflow/server-shared'
import { isNil, PlanName } from '@yflow/shared'
import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { FastifyRequest } from 'fastify'
import { StatusCodes } from 'http-status-codes'
import { system } from '../../../helper/system/system'
import { platformAiCreditsService } from './platform-ai-credits.service'
import { platformPlanService } from './platform-plan.service'
import { yookassaHelper } from './yookassa-helper'

const WebhookRequest = {
    config: {
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

                const event = request.body as any
                const payment = event.object

                switch (event.event) {
                    case 'payment.succeeded': {
                        if (isNil(payment.metadata)) {
                            break
                        }

                        const platformId = payment.metadata.platformId as string
                        const amount = parseFloat(payment.amount.value)
                        const paymentType = payment.metadata.paymentType || 'CARD'

                        if (payment.metadata.type === 'AI_CREDIT_PAYMENT') {
                            await platformAiCreditsService(request.log).aiCreditsPaymentSucceeded(
                                platformId, 
                                amount, 
                                'AI_CREDIT_PAYMENT'
                            )
                        } else {
                            // Handle subscription payment
                            await platformPlanService(request.log).handleSuccessfulPayment(
                                platformId,
                                amount,
                                paymentType
                            )
                        }
                        break
                    }
                    case 'payment.canceled': {
                        const platformId = payment.metadata?.platformId as string
                        if (platformId) {
                            await platformPlanService(request.log).handlePaymentCanceled(platformId)
                        }
                        break
                    }
                }

                return await reply.status(StatusCodes.OK).send({ received: true })
            } catch (error) {
                exceptionHandler.handle(error, request.log)
                return await reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
                    error: 'Internal server error',
                })
            }
        },
    )

    fastify.post(
        '/yookassa/create-payment-session',
        {
            config: {
                allowedHttpMethods: ['POST'],
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
                const { platformId, amount, description, paymentMethod, type } = request.body as any
                
                securityAccess.throwUnlessPlatformAdmin(request)

                const platformBilling = await platformPlanService(request.log).getOrCreateForPlatform(platformId)
                const user = request.principal

                let paymentUrl: string

                if (paymentMethod === 'sbp') {
                    paymentUrl = await yookassaHelper(request.log).createSbpPayment(
                        user,
                        platformId,
                        amount,
                        description
                    )
                } else {
                    paymentUrl = await yookassaHelper(request.log).createPayment(
                        user,
                        platformId,
                        amount,
                        description
                    )
                }

                return await reply.status(StatusCodes.OK).send({
                    paymentUrl,
                    paymentMethod,
                    amount,
                    currency: 'RUB'
                })
            } catch (error) {
                exceptionHandler.handle(error, request.log)
                return await reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
                    error: 'Failed to create payment session',
                })
            }
        },
    )
}
