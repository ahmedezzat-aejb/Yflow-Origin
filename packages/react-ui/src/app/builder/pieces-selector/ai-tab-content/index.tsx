import { CardListItemSkeleton } from '@/components/custom/card-list';
import {
  PieceSelectorTabType,
  usePieceSelectorTabs,
} from '@/features/pieces/lib/piece-selector-tabs-provider';
import { piecesHooks } from '@/features/pieces/lib/pieces-hooks';
import { stepUtils } from '@/features/pieces/lib/step-utils';
import { PieceSelectorOperation } from '@/lib/types';
import { FlowOperationType, isNil } from '@yflow/shared';

import { AIPieceActionsList } from './ai-actions-list';

const AITabContent = ({ operation }: { operation: PieceSelectorOperation }) => {
  const { selectedTab } = usePieceSelectorTabs();

  console.log('AITabContent rendering:', { selectedTab, operation });

  if (selectedTab !== PieceSelectorTabType.AI_AND_AGENTS) {
    return null;
  }

  // Mock AI piece data for Community Edition
  const mockPieceModel = {
    name: 'ai-agent',
    displayName: 'AI Agent',
    description: 'AI Agent for various tasks',
    logoUrl: '/pieces/new-core/agent.svg',
    actions: {
      askAi: {
        name: 'askAi',
        displayName: 'Ask AI',
        description: 'Ask AI for help with text generation',
      },
      generateImage: {
        name: 'generateImage',
        displayName: 'Generate Image',
        description: 'Generate images using AI',
      },
      summarizeText: {
        name: 'summarizeText',
        displayName: 'Summarize Text',
        description: 'Summarize long text using AI',
      },
      classifyText: {
        name: 'classifyText',
        displayName: 'Classify Text',
        description: 'Classify text into categories',
      },
      extractStructuredData: {
        name: 'extractStructuredData',
        displayName: 'Extract Data',
        description: 'Extract structured data from text',
      },
      run_agent: {
        name: 'run_agent',
        displayName: 'Run Agent',
        description: 'Run an AI agent',
      },
    },
    triggers: {},
  };

  const metadata = stepUtils.mapPieceToMetadata({
    piece: mockPieceModel,
    type: 'action',
  });

  const pieceMetadataWithSuggestion = {
    ...metadata,
    suggestedActions: Object.values(mockPieceModel.actions),
    suggestedTriggers: Object.values(mockPieceModel.triggers),
  };

  return (
    <div className="w-full">
      <AIPieceActionsList
        stepMetadataWithSuggestions={pieceMetadataWithSuggestion}
        hidePieceIconAndDescription={false}
        operation={operation}
      />
    </div>
  );
};

export { AITabContent };
