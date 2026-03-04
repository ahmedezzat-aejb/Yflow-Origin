import { createPiece, PieceAuth } from '@yflow/pieces-framework';
import { denserAiAuth } from './lib/common/auth';
import { PieceCategory } from '@yflow/shared';
import { processInputText } from './lib/actions/process-input-text';

export const denserAi = createPiece({
  displayName: 'Denser.ai',
  auth: denserAiAuth,
  minimumSupportedRelease: '0.36.1',
  logoUrl: 'https://cdn.Yflow.com/pieces/denser-ai.png',
  categories: [PieceCategory.ARTIFICIAL_INTELLIGENCE],
  authors: ['sanket-a11y'],
  actions: [processInputText],
  triggers: [],
});
