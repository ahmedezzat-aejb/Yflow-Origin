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

  if (selectedTab !== PieceSelectorTabType.AI_AND_AGENTS) {
    return null;
  }

  // Use mock AI piece metadata for Community Edition
  const pieceMetadataWithSuggestion = {
    name: 'ai-agent',
    displayName: 'AI Agent',
    description: 'AI Agent for various tasks',
    logoUrl: '/pieces/new-core/agent.svg',
    type: FlowActionType.PIECE,
    suggestedActions: [
      {
        name: 'askAi',
        displayName: 'Ask AI',
        description: 'Ask AI for help with text generation',
      },
      {
        name: 'generateImage',
        displayName: 'Generate Image',
        description: 'Generate images using AI',
      },
      {
        name: 'summarizeText',
        displayName: 'Summarize Text',
        description: 'Summarize long text using AI',
      },
      {
        name: 'classifyText',
        displayName: 'Classify Text',
        description: 'Classify text into categories',
      },
      {
        name: 'extractStructuredData',
        displayName: 'Extract Data',
        description: 'Extract structured data from text',
      },
      {
        name: 'run_agent',
        displayName: 'Run Agent',
        description: 'Run an AI agent',
      },
    ],
    suggestedTriggers: [],
  };

  return (
    <div className="w-full p-4">
      <div className="text-lg font-bold mb-4">AI Actions Test</div>
      <div className="bg-blue-100 p-4 rounded">
        <p>AI Tab is working! This is a test.</p>
        <p>Operation: {operation.type}</p>
        <p>Selected Tab: {selectedTab}</p>
      </div>
      <AIPieceActionsList
        stepMetadataWithSuggestions={pieceMetadataWithSuggestion}
        hidePieceIconAndDescription={false}
        operation={operation}
      />
    </div>
  );
};

export { AITabContent };
