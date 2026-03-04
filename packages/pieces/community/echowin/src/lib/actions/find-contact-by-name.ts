import { createAction, Property } from '@yflow/pieces-framework';
import { echowinAuth } from '../common/auth';
import { makeRequest } from '../common/client';
import { HttpMethod } from '@yflow/pieces-common';

export const findContactByName = createAction({
  auth: echowinAuth,
  name: 'findContactByName',
  displayName: 'Find Contact ',
  description:
    'Get a paginated list of contacts and search by name, email, or phone number',
  props: {
    search: Property.ShortText({
      displayName: 'Search',
      description: 'Search contacts by name, email, or phone number',
      required: false,
    }),
  },
  async run(context) {
    const { search } = context.propsValue;

    const queryParams = new URLSearchParams();

    if (search) {
      queryParams.append('search', search);
    }

    const queryString = queryParams.toString();

    const response = await makeRequest(
      context.auth.secret_text,
      HttpMethod.GET,
      `/contacts?${queryString}`
    );

    return response.body;
  },
});
