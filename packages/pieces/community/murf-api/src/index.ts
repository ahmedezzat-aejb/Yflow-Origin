import { createPiece } from '@yflow/pieces-framework';
import { murfAuth } from './lib/common/auth';

import { listVoices } from './lib/actions/list-voices';
import { translateText } from './lib/actions/translate-text';
import { voiceChange } from './lib/actions/voice-change';
import { textToSpeech } from './lib/actions/text-to-speech';
import { PieceCategory } from '@yflow/shared';
import { createCustomApiCallAction } from '@yflow/pieces-common';
import { BASE_URL } from './lib/common/client';

export const murfApi = createPiece({
  displayName: "Murf AI",
  auth: murfAuth,
  minimumSupportedRelease: '0.36.1',
  logoUrl: 'https://cdn.Yflow.com/pieces/murf-api.png',
  authors: ['Niket2035'],
  categories: [PieceCategory.ARTIFICIAL_INTELLIGENCE],
  actions: [
    listVoices,
    translateText,
    voiceChange,
    textToSpeech,
    createCustomApiCallAction({
      auth: murfAuth,
      baseUrl: () => BASE_URL,
      authMapping: async (auth) => {
        return {
          'api-key': auth.secret_text,
        };
      },
    }),
  ],
  triggers: [],
});
