import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { securityAccess } from '@yflow/server-shared'
import { TemplateTelemetryEvent } from '@yflow/shared'
import { StatusCodes } from 'http-status-codes'
import { templateTelemetryService } from './template-telemetry.service'

export const templateTelemetryController: FastifyPluginAsyncTypebox = async (app) => {
    app.post('/event', SendEventParams, async (request, reply) => {
        templateTelemetryService(app.log).sendEvent(request.body)
        return reply.status(StatusCodes.OK).send()
    })
}

const SendEventParams = {
    config: {
        security: securityAccess.public(),
    },
    schema: {
        body: TemplateTelemetryEvent,
    },
}

