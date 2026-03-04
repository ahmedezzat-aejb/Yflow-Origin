import { createAction, Property } from '@yflow/pieces-framework';
import { aminosAuth } from '../..';
export const createUser = createAction({
  auth: aminosAuth,
  name: 'createUser',
  displayName: 'Create User on Aminos One',
  description: 'Create a user and plan in Aminos One Panel',
  props: {
   useremail: Property.ShortText({
      displayName: 'Username (e-mail)',
      description: 'Username, should be an e-mail address',
      required:true,
    }),
    userfriendlyname: Property.ShortText({
      displayName: 'Name of user',
      description: 'The name of user',
      required:true,
    }),
    userplanid: Property.Number({
      displayName: 'Plan ID',
      description: 'Plan ID number from plans in your Aminos One panel',
      required:true,
    })
  },
  async run(context) {
    const baseUrl = context.auth.props.base_url.replace(/\/$/, '');
    const headers = {
      'Content-Type': 'application/json',
    };
    const createAminosRequestBody = {
      api_key: context.auth.props.access_token,
      name: context.propsValue.userfriendlyname,
      email: context.propsValue.useremail,
      price_plan_id: context.propsValue.userplanid,
    };
    const createAminosResponse = await fetch(`${baseUrl}/api/users`, {
      method: 'POST',
      headers,
      body: JSON.stringify(createAminosRequestBody),
    });
    if (!createAminosResponse.ok) {
      throw new Error(`Failed to create user. Status: ${createAminosResponse.status}`);
    }
    const createAminosResponseBody = await createAminosResponse.json();
    return createAminosResponseBody; 
  },
});
