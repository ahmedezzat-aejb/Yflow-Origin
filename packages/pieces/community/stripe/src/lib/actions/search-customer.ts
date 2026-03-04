import { createAction, Property } from '@yflow/pieces-framework';
import { httpClient, HttpMethod } from '@yflow/pieces-common';
import { stripeAuth } from '../..';

export const stripeSearchCustomer = createAction({
  name: 'search_customer',
  auth: stripeAuth,
  displayName: 'Search Customer',
  description: 'Search for a customer in stripe by email',
  props: {
    email: Property.ShortText({
      displayName: 'Email',
      description: undefined,
      required: true,
    }),
  },
  async run(context) {
    const customer = {
      email: context.propsValue.email,
    };
    const response = await httpClient.sendRequest({
      method: HttpMethod.GET,
      url: 'https://api.stripe.com/v1/customers/search',
      headers: {
        Authorization: 'Bearer ' + context.auth.secret_text,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: {
        query: 'email:' + "'" + customer.email + "'",
      },
    });
    return response.body;
  },
});
