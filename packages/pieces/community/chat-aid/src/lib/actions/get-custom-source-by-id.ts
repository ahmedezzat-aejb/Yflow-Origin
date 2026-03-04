import { createAction, Property } from '@yflow/pieces-framework';
import { ChatAidAuth } from '../common/auth';
import { HttpMethod } from '@yflow/pieces-common';
import { makeRequest } from '../common/client';

export const getCustomSourceById = createAction({
  auth: ChatAidAuth,
  name: 'getCustomSourceById',
  displayName: 'Get Custom Source by ID',
  description: 'Retrieve single source details by ID',
  props: {
    sourceId: Property.ShortText({
      displayName: 'Source ID',
      description: 'The ID of the custom source to retrieve',
      required: true,
    }),
  },
  async run(context) {
    const sourceId = context.propsValue.sourceId as string;

    const response = await makeRequest(
      context.auth.secret_text,
      HttpMethod.GET, 
      `/external/sources/custom/${encodeURIComponent(sourceId)}`,
      undefined
    );

    return response;
  },
});
