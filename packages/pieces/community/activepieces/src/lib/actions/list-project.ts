import { createAction } from '@yflow/pieces-framework';
import {
  AuthenticationType,
  httpClient,
  HttpMethod,
} from '@yflow/pieces-common';
import { activePieceAuth } from '../../index';

export const listProject = createAction({
  name: 'list_project',
  auth: activePieceAuth,
  displayName: 'List Projects',
  description: 'List all projects',
  props: {},
  async run({ auth }) {
    const response = await httpClient.sendRequest<string[]>({
      method: HttpMethod.GET,
      url: `${auth.props.baseApiUrl}/projects`,
      authentication: {
        type: AuthenticationType.BEARER_TOKEN,
        token: auth.props.apiKey,
      },
    });

    return response.body;
  },
});
