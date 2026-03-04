import { httpClient, HttpMethod } from '@yflow/pieces-common';
import { createAction } from '@yflow/pieces-framework';
import { aiAnswerConfig } from '../common/models';
import { aiAnswerAuth } from '../../index';

export const gmailGetListOfAgents = createAction({
  name: 'gmailGetListOfAgents',
  auth: aiAnswerAuth,
  displayName: 'Gmail get list of Agents',
  description: 'get the lists of agents with Gmail',
  props: {},
  async run(context) {
    const res = await httpClient.sendRequest<string[]>({
      method: HttpMethod.GET,
      url: `${aiAnswerConfig.baseUrl}/gmail/list_agents`,
      headers: {
        [aiAnswerConfig.accessTokenHeaderKey]: context.auth.secret_text,
        },
    });
    return res.body;
  },
});
