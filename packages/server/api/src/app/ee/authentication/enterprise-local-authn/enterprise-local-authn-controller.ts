import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import {
    ResetPasswordRequestBody,
    VerifyEmailRequestBody } from '@yflow/ee-shared'
import { securityAccess } from '@yflow/server-shared'
import { enterpriseLocalAuthnService } from './enterprise-local-authn-service'

export const enterpriseLocalAuthnController: FastifyPluginAsyncTypebox = async (
    app,
) => {
    app.post('/verify-email', VerifyEmailRequest, async (req) => {
        await enterpriseLocalAuthnService(req.log).verifyEmail(req.body)
    })

    app.post('/reset-password', ResetPasswordRequest, async (req) => {
        await enterpriseLocalAuthnService(req.log).resetPassword(req.body)
    }) 
}

const VerifyEmailRequest = {
    config: {
        security: securityAccess.public(),
    },
    schema: {
        body: VerifyEmailRequestBody,
    },
}

const ResetPasswordRequest = {
    config: {
        security: securityAccess.public(),
    },
    schema: {
        body: ResetPasswordRequestBody,
    },
}