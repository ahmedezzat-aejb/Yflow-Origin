import { createAction, Property } from '@yflow/pieces-framework';
import { HttpMethod, httpClient } from '@yflow/pieces-common';

import { ghostAuth } from '../..';
import { common } from '../common';

export const findMember = createAction({
  name: 'find_member',
  displayName: 'Find Member',
  description: 'Find a member by email',
  auth: ghostAuth,
  props: {
    email: Property.ShortText({
      displayName: 'Email',
      required: true,
    }),
  },

  async run(context) {
    const response = await httpClient.sendRequest({
      url: `${context.auth.props.baseUrl}/ghost/api/admin/members`,
      method: HttpMethod.GET,
      headers: {
        Authorization: `Ghost ${common.jwtFromApiKey(context.auth.props.apiKey)}`,
      },
      queryParams: {
        filter: `email:${context.propsValue.email}`,
      },
    });

    return response.body;
  },
});
