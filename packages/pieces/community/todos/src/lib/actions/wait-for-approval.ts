import { httpClient } from '@yflow/pieces-common';
import { AuthenticationType } from '@yflow/pieces-common';
import { HttpRequest } from '@yflow/pieces-common';
import { HttpMethod } from '@yflow/pieces-common';
import { createAction, PieceAuth, Property } from '@yflow/pieces-framework';
import { PauseType } from '@yflow/shared';
import { ExecutionType } from '@yflow/shared';

export const waitForApproval = createAction({
  name: 'wait_for_approval',
  auth: PieceAuth.None(),
  displayName: 'Wait for Approval',
  description: 'Pauses the flow and wait for the approval from the user',
  props: {
    taskId: Property.ShortText({
      displayName: 'Task ID',
      description: 'The ID of the task to wait for approval',
      required: true,
    }),
  },
  errorHandlingOptions: {
    continueOnFailure: {
      hide: true,
    },
    retryOnFailure: {
      hide: true,
    },
  },
  async test(ctx) {
    const request: HttpRequest = {
      method: HttpMethod.GET,
      url: `${ctx.server.publicUrl}v1/todos/${ctx.propsValue.taskId}`,
      authentication: {
        type: AuthenticationType.BEARER_TOKEN,
        token: ctx.server.token,
      },
    };
    const response = await httpClient.sendRequest(request);
    return {
      status: response.body.status.name,
      message: 'Test message',
    };
  },
  async run(ctx) {
    if (ctx.executionType === ExecutionType.BEGIN) {
      ctx.run.pause({
        pauseMetadata: {
          type: PauseType.WEBHOOK,
          response: {}
        },
      });

      return undefined;
    } else {
      return {
        status: ctx.resumePayload.queryParams['status'],
        message: ctx.resumePayload.queryParams['message'],
      };
    }
  },
});
