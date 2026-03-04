import { PieceAuth } from '@yflow/pieces-framework';

export const gptzeroDetectAiAuth = PieceAuth.SecretText({
  displayName: 'GPTZero API Key',
  description: 'https://app.gptzero.me/app/api to get your API key',
  required: true,
});
