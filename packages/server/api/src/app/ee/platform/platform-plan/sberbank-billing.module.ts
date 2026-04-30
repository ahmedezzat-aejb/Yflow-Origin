import { FastifyPluginAsync } from 'fastify'
import { sberbankBillingController } from './sberbank-billing.controller'

export const sberbankBillingModule: FastifyPluginAsync = async (fastify) => {
    await fastify.register(sberbankBillingController)
}
