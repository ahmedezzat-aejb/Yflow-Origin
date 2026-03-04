import { createAction } from '@yflow/pieces-framework';
import { promptmateAuth } from '../..';
import { httpClient, HttpMethod } from '@yflow/pieces-common';

export const listApps = createAction({
  auth: promptmateAuth,
  name: 'list_apps',
  displayName: 'List Apps',
  description: 'Retrieve a list of available apps',
  props: {},
  async run({ auth }) {
    const response = await httpClient.sendRequest<{
      appId: string;
      appName: string;
      creditEstimate: number;
      dataFields: string[];
    }[]>({
      method: HttpMethod.GET,
      url: 'https://api.promptmate.io/v1/apps',
      headers: {
        'x-api-key': auth.secret_text,
      },
    });

    return response.body;
  },
});
