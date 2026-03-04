import { createAction } from '@yflow/pieces-framework';
import { HttpMethod, httpClient } from '@yflow/pieces-common';
import { endpoint, kizeoFormsCommon } from '../common';
import { kizeoFormsAuth } from '../..';

export const getListDefinition = createAction({
  auth: kizeoFormsAuth,

  name: 'get_list_definition',
  displayName: 'Get List Definition',
  description: 'Get the definition of a list',
  props: {
    listId: kizeoFormsCommon.listId,
  },
  async run(context) {
    const { listId } = context.propsValue;
    const response = await httpClient.sendRequest<{ list: unknown }>({
      method: HttpMethod.GET,
      url:
        endpoint +
        `public/v4/lists/${listId}/definition?used-with-Yflow=`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: context.auth.secret_text,
      },
    });
    if (response.status === 200) {
      return response.body;
    }

    return [];
  },
});
