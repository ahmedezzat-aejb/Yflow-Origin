import { createCustomApiCallAction } from '@yflow/pieces-common';
import { createPiece } from '@yflow/pieces-framework';
import { PieceCategory } from '@yflow/shared';
import { addAnnotationAction } from './lib/actions/add-annotation';
import { matomoAuth } from './lib/auth';

export const matomo = createPiece({
  displayName: 'Matomo',
  description: 'Open source alternative to Google Analytics',

  auth: matomoAuth,
  minimumSupportedRelease: '0.30.0',
  logoUrl: 'https://cdn.Yflow.com/pieces/matomo.png',
  categories: [PieceCategory.BUSINESS_INTELLIGENCE],
  authors: ["joeworkman","kishanprmr","MoShizzle","abuaboud"],
  actions: [
    addAnnotationAction,
    createCustomApiCallAction({
      baseUrl: (auth) => (auth?.props .domain ?? ''),
      auth: matomoAuth,
      authMapping: async (auth) => ({
        Authorization: `Bearer ${(auth ).props .tokenAuth}`,
      }),
    }),
  ],
  triggers: [],
});

// Matomo API Docs: https://developer.matomo.org/api-reference/reporting-api
