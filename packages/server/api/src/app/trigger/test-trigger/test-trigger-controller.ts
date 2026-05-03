import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { ProjectResourceType, securityAccess } from '@yflow/server-shared'
import { CancelTestTriggerRequestBody, PrincipalType, TestTriggerRequestBody } from '@yflow/shared'
import { testTriggerService } from '../../trigger/test-trigger/test-trigger-service'

export const testTriggerController: FastifyPluginAsyncTypebox = async (app) => {
    app.post('/', TestTriggerRequest, async (req) => {
        const { flowId, flowVersionId, testStrategy } = req.body

        const logWithContext = req.log.child({
            flowId,
            flowVersionId,
            projectId: req.projectId,
            testStrategy,
        })
        return testTriggerService(logWithContext).test({
            flowId,
            flowVersionId,
            projectId: req.projectId,
            testStrategy,
        })
    })
    app.delete('/', CancelTestTriggerRequest, async (req) => {
        const { flowId } = req.body

        return testTriggerService(req.log).cancel({
            flowId,
            projectId: req.projectId,
        })
    })
}

const TestTriggerRequest = {
    schema: {
        body: TestTriggerRequestBody,
    },
    config: {
        security: securityAccess.project([PrincipalType.USER], undefined, {
            type: ProjectResourceType.BODY,
        }),
    },
}

const CancelTestTriggerRequest = {
    schema: {
        body: CancelTestTriggerRequestBody,
    },
    config: {
        security: securityAccess.project([PrincipalType.USER], undefined, {
            type: ProjectResourceType.BODY,
        }),
    },
}