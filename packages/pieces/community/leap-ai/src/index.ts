import { createPiece, PieceAuth } from '@yflow/pieces-framework';
import { leapAiAuth } from './lib/common/auth';
import { getAWorkflowRun } from './lib/actions/get-a-workflow-run';
import { runAWorkflow } from './lib/actions/run-a-workflow';
import { PieceCategory } from '@yflow/shared';

export const leapAi = createPiece({
  displayName: 'Leap AI',
  auth: leapAiAuth,
  minimumSupportedRelease: '0.36.1',
  logoUrl: 'https://cdn.Yflow.com/pieces/leap-ai.png',
  categories: [PieceCategory.ARTIFICIAL_INTELLIGENCE],
  description:
    'Automate any workflow with AI. Build custom AI automations to scale your marketing, sales, and operations.',
  authors: ['sanket-a11y'],
  actions: [getAWorkflowRun, runAWorkflow],
  triggers: [],
});
