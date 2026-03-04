import { createPiece, PieceAuth } from '@yflow/pieces-framework';
import { PieceCategory } from '@yflow/shared';
import { simplePDFNewSubmission } from './lib/triggers/new-submission';

export const simplepdf = createPiece({
  displayName: 'SimplePDF',
  description: 'PDF editing and generation tool',
  auth: PieceAuth.None(),
  minimumSupportedRelease: '0.30.0',
  logoUrl: 'https://cdn.yflow.com/pieces/simplepdf.png',
  authors: ["bendersej","kishanprmr","khaledmashaly","abuaboud"],
  categories: [PieceCategory.CONTENT_AND_FILES],
  actions: [],
  triggers: [simplePDFNewSubmission],
});
