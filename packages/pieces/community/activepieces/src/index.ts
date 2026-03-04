import {
  createPiece,
  PieceAuth,
  Property,
} from '@yflow/pieces-framework';
import { createProject } from './lib/actions/create-project';
import { listProject } from './lib/actions/list-project';
import { updateProject } from './lib/actions/update-project';
import { createCustomApiCallAction } from '@yflow/pieces-common';

const markdown = `
YflowPlatform API is available under the Platform Edition.
(https://www.yflow.com/docs/admin-console/overview)

**Note**: The API Key is available in the Platform Dashboard.

`;

export const activePieceAuth = PieceAuth.CustomAuth({
  description: markdown,
  required: true,
  props: {
    baseApiUrl: Property.ShortText({
      displayName: 'Base URL',
      required: true,
      defaultValue: 'https://cloud.yflow.com/api/v1',
    }),
    apiKey: PieceAuth.SecretText({
      displayName: 'API Key',
      required: true,
    }),
  },
});

export const Yflow= createPiece({
  displayName: 'YflowPlatform',
  description: 'Open source no-code business automation',
  auth: activePieceAuth,
  minimumSupportedRelease: '0.30.0',
  logoUrl: 'https://cdn.yflow.com/pieces/yflow.png',
  authors: ['doskyft', 'abuaboud', 'AdamSelene'],
  actions: [
    createProject,
    updateProject,
    listProject,
    createCustomApiCallAction({
      baseUrl: (auth) => {
        return `${auth?.props.baseApiUrl}`;
      },
      auth: activePieceAuth,
      authMapping: async (auth) => ({
        Authorization: `Bearer ${auth.props.apiKey}`,
      }),
    }),
  ],
  triggers: [],
});
