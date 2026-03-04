import { createPiece, PieceAuth } from '@yflow/pieces-framework';
import { smsmodeAuth } from './lib/common/auth';
import { sendMessage } from './lib/actions/send-message';
import { createCustomApiCallAction } from '@yflow/pieces-common';
import { PieceCategory } from '@yflow/shared';

export const smsmode = createPiece({
  displayName: 'smsmode',
  auth: smsmodeAuth,
  minimumSupportedRelease: '0.36.1',
  logoUrl: 'https://cdn.yflow.com/pieces/smsmode.png',
  authors: ['sanket-a11y'],
  categories: [PieceCategory.COMMUNICATION],
  description:
    'smsmode is an SMS messaging platform that allows you to send and receive SMS messages easily.',
  actions: [
    sendMessage,
    createCustomApiCallAction({
      auth: smsmodeAuth,
      baseUrl: () => 'https://rest.smsmode.com/sms/v1',
      authMapping: async (auth) => ({
        'X-Api-Key': auth.secret_text,
      }),
    }),
  ],
  triggers: [],
});
