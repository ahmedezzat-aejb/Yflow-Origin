import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { entitiesMustBeOwnedByCurrentProject } from '../../../authentication/authorization'
import { platformMustHaveFeatureEnabled } from '../../authentication/ee-authorization'
import { projectMemberController } from './project-member.controller'

export const projectMemberModule: FastifyPluginAsyncTypebox = async (app) => {
    app.addHook('preSerialization', entitiesMustBeOwnedByCurrentProject)
    // Remove project roles requirement for Community Edition
    // app.addHook('preHandler', platformMustHaveFeatureEnabled((platform) => platform.plan.projectRolesEnabled))
    await app.register(projectMemberController, {
        prefix: '/v1/project-members',
    })
}
