import { PieceAuth } from '@yflow/pieces-framework';

export const signrequestAuth = PieceAuth.SecretText({
  displayName: 'API Key',
  description: 'Signrequest API Key',
  required: true,
});
