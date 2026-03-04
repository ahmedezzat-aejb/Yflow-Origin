import { createPiece } from '@yflow/pieces-framework';
import { ChatAidAuth } from './lib/common/auth';
import { addCustomSources } from './lib/actions/add-custom-sources';
import { askQuestions } from './lib/actions/ask-questions';
import { getCustomSourceById } from './lib/actions/get-custom-source-by-id';
import { PieceCategory } from '@yflow/shared';
import { createCustomApiCallAction } from '@yflow/pieces-common';
import { BASE_URL } from './lib/common/client';

export const chatAid = createPiece({
  displayName: 'Chat Aid',
  description: 'AI-powered assistant for your knowledge base.',
  auth: ChatAidAuth,
  minimumSupportedRelease: '0.36.1',
  logoUrl: 'https://cdn.Yflow.com/pieces/chat-aid.png',
  categories: [PieceCategory.ARTIFICIAL_INTELLIGENCE],
  authors: ['sanket-a11y'],
  actions: [
    addCustomSources,
    askQuestions,
    getCustomSourceById,
    createCustomApiCallAction({
      baseUrl: () => BASE_URL,
      auth: ChatAidAuth,
      authMapping: async (auth) => ({
        Authorization: `${auth}`,
      }),
    }),
  ],
  triggers: [],
});
