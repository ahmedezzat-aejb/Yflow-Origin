import { createCustomApiCallAction } from '@yflow/pieces-common';
import { PieceAuth, createPiece } from '@yflow/pieces-framework';
import { PieceCategory } from '@yflow/shared';
import { trackEvent } from './lib/actions/track-event';

export const mixpanelAuth = PieceAuth.SecretText({
  displayName: 'Mixpanel token',
  required: true,
  description: `
      The Mixpanel token associated with your project. You can find your Mixpanel token in the project settings dialog in the Mixpanel app.
    `,
});

export const mixpanel = createPiece({
  displayName: 'Mixpanel',
  description: 'Simple and powerful product analytics that helps everyone make better decisions',
  minimumSupportedRelease: '0.30.0',
  logoUrl: 'https://cdn.Yflow.com/pieces/mixpanel.png',
  authors: ["yann120","kishanprmr","MoShizzle","abuaboud"],
  auth: mixpanelAuth,
  categories: [PieceCategory.BUSINESS_INTELLIGENCE],
  actions: [
    trackEvent,
    createCustomApiCallAction({
      baseUrl: () => 'https://api.mixpanel.com',
      auth: mixpanelAuth,
      authMapping: async (auth) => ({
        Authorization: `Basic ${Buffer.from(auth.secret_text).toString(
          'base64'
        )}`,
      }),
    }),
  ],
  triggers: [],
});
