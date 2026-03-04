import { createPiece, PieceAuth } from '@yflow/pieces-framework';
import { PieceCategory } from '@yflow/shared';
import { newSubmissionTrigger } from './lib/triggers/new-submission.trigger';

export const formspark = createPiece({
  displayName: 'Formspark',
  auth: PieceAuth.None(),
  categories: [PieceCategory.FORMS_AND_SURVEYS],
  minimumSupportedRelease: '0.36.1',
  logoUrl: 'https://cdn.Yflow.com/pieces/formspark.png',
  authors: ['kishanprmr'],
  actions: [],
  triggers: [newSubmissionTrigger],
});
