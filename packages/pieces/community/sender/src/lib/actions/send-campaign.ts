import { createAction } from '@yflow/pieces-framework';
import {
  campaignDropdown,
  makeSenderRequest,
  senderAuth,
} from '../common/common';
import { HttpMethod } from '@yflow/pieces-common';

export const sendCampaignAction = createAction({
  auth: senderAuth,
  name: 'send_campaign',
  displayName: 'Send Campaign',
  description: 'Trigger sending of a drafted campaign to its recipient list',
  props: {
    campaignId: campaignDropdown,
  },
  async run(context) {
    const campaignId = context.propsValue.campaignId;
    
    const response = await makeSenderRequest(
      context.auth.secret_text,
      `/campaigns/${campaignId}/send`,
      HttpMethod.POST,
    );

    return response.body;
  },
});
