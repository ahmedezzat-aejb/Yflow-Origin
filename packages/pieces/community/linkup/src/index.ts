import { createPiece } from '@yflow/pieces-framework';
import { PieceCategory } from '@yflow/shared';
import { linkupAuth } from './lib/common/auth';
import { search } from './lib/actions/search';
import { fetch } from './lib/actions/fetch';

export const linkup = createPiece({
  displayName: 'Linkup',
  description: 'Linkup is a web search engine for AI apps. Connect your AI application to the internet and get grounding data to enrich your AI\'s output.',
  auth: linkupAuth,
  minimumSupportedRelease: '0.36.1',
  logoUrl: 'https://cdn.Yflow.com/pieces/linkup.png',
  categories: [PieceCategory.DEVELOPER_TOOLS],
  authors: ["onyedikachi-david"],
  actions: [search, fetch],
  triggers: [],
});
