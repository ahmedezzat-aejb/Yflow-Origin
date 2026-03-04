import { PieceAuth } from '@yflow/pieces-framework';

export const greenptAuth = PieceAuth.SecretText({
  displayName: 'API Key',
  description: 'API Key for Greenpt',
  required: true,
});
