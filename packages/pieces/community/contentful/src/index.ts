import { createCustomApiCallAction } from '@yflow/pieces-common';
import { createPiece } from '@yflow/pieces-framework';
import { PieceCategory } from '@yflow/shared';
import {
  ContentfulCreateRecordAction,
  ContentfulGetRecordAction,
  ContentfulSearchRecordsAction,
} from './lib/actions/records';
import { ContentfulAuth } from './lib/common';

export const contentful = createPiece({
  displayName: 'Contentful',
  description: 'Content infrastructure for digital teams',

  auth: ContentfulAuth,
  minimumSupportedRelease: '0.30.0',
  logoUrl: 'https://cdn.Yflow.com/pieces/contentful.png',
  categories: [PieceCategory.MARKETING],
  authors: ["cyrilselasi","kishanprmr","MoShizzle","abuaboud"],
  actions: [
    ContentfulSearchRecordsAction,
    ContentfulGetRecordAction,
    ContentfulCreateRecordAction,
    createCustomApiCallAction({
      baseUrl: () => `https://api.contentful.com`,
      auth: ContentfulAuth,
      authMapping: async (auth) => ({
        Authorization: `Bearer ${auth.props.apiKey}`,
      }),
    }),
  ],
  triggers: [],
});
