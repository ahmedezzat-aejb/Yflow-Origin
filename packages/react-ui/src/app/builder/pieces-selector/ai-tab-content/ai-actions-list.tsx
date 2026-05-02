import React from 'react';

import { useTelemetry } from '@/components/telemetry-provider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AI_ACTIONS_METADATA } from '@/features/pieces/lib/step-utils';
import {
  PieceSelectorOperation,
  StepMetadataWithSuggestions,
} from '@/lib/types';
import { FlowActionType, TelemetryEventName } from '@yflow/shared';

import { usePieceSearchContext } from '../../../../features/pieces/lib/piece-search-context';
import { useBuilderStateContext } from '../../builder-hooks';

import AIActionItem from './ai-action';

type AIPieceActionsListProps = {
  hidePieceIconAndDescription: boolean;
  stepMetadataWithSuggestions: StepMetadataWithSuggestions;
  operation: PieceSelectorOperation;
};

const ACTION_ICON_MAP: Record<string, string> = {
  run_agent: '/pieces/new-core/agent.svg',
  generateImage: '/pieces/new-core/image-ai.svg',
  askAi: '/pieces/new-core/text-ai.svg',
  summarizeText: '/pieces/new-core/text-ai.svg',
  classifyText: '/pieces/new-core/text-ai.svg',
  extractStructuredData: '/pieces/new-core/utility-ai.svg',
};

export const AIPieceActionsList: React.FC<AIPieceActionsListProps> = ({
  stepMetadataWithSuggestions,
  hidePieceIconAndDescription,
  operation,
}) => {
  const { capture } = useTelemetry();
  const { searchQuery } = usePieceSearchContext();
  const [handleAddingOrUpdatingStep] = useBuilderStateContext((state) => [
    state.handleAddingOrUpdatingStep,
  ]);
  const isAgentsConfigured = true; // Enable AI actions for Community Edition
  const navigate = useNavigate();

  // Create simple AI actions that work without backend
  const aiActions = [
    {
      displayName: 'Ask AI',
      logoUrl: '/pieces/new-core/text-ai.svg',
      description: 'Ask AI for help with text generation',
      type: FlowActionType.PIECE,
      actionOrTrigger: {
        name: 'askAi',
        displayName: 'Ask AI',
        description: 'Ask AI for help with text generation',
      },
      pieceMetadata: {
        name: 'ai-agent',
        displayName: 'AI Agent',
        description: 'AI Agent for text generation',
        logoUrl: '/pieces/new-core/text-ai.svg',
      },
    },
    {
      displayName: 'Generate Image',
      logoUrl: '/pieces/new-core/image-ai.svg',
      description: 'Generate images using AI',
      type: FlowActionType.PIECE,
      actionOrTrigger: {
        name: 'generateImage',
        displayName: 'Generate Image',
        description: 'Generate images using AI',
      },
      pieceMetadata: {
        name: 'ai-agent',
        displayName: 'AI Agent',
        description: 'AI Agent for image generation',
        logoUrl: '/pieces/new-core/image-ai.svg',
      },
    },
    {
      displayName: 'Summarize Text',
      logoUrl: '/pieces/new-core/text-ai.svg',
      description: 'Summarize long text using AI',
      type: FlowActionType.PIECE,
      actionOrTrigger: {
        name: 'summarizeText',
        displayName: 'Summarize Text',
        description: 'Summarize long text using AI',
      },
      pieceMetadata: {
        name: 'ai-agent',
        displayName: 'AI Agent',
        description: 'AI Agent for text summarization',
        logoUrl: '/pieces/new-core/text-ai.svg',
      },
    },
    {
      displayName: 'Classify Text',
      logoUrl: '/pieces/new-core/text-ai.svg',
      description: 'Classify text into categories',
      type: FlowActionType.PIECE,
      actionOrTrigger: {
        name: 'classifyText',
        displayName: 'Classify Text',
        description: 'Classify text into categories',
      },
      pieceMetadata: {
        name: 'ai-agent',
        displayName: 'AI Agent',
        description: 'AI Agent for text classification',
        logoUrl: '/pieces/new-core/text-ai.svg',
      },
    },
    {
      displayName: 'Extract Data',
      logoUrl: '/pieces/new-core/utility-ai.svg',
      description: 'Extract structured data from text',
      type: FlowActionType.PIECE,
      actionOrTrigger: {
        name: 'extractStructuredData',
        displayName: 'Extract Data',
        description: 'Extract structured data from text',
      },
      pieceMetadata: {
        name: 'ai-agent',
        displayName: 'AI Agent',
        description: 'AI Agent for data extraction',
        logoUrl: '/pieces/new-core/utility-ai.svg',
      },
    },
    {
      displayName: 'Run Agent',
      logoUrl: '/pieces/new-core/agent.svg',
      description: 'Run an AI agent',
      type: FlowActionType.PIECE,
      actionOrTrigger: {
        name: 'run_agent',
        displayName: 'Run Agent',
        description: 'Run an AI agent',
      },
      pieceMetadata: {
        name: 'ai-agent',
        displayName: 'AI Agent',
        description: 'AI Agent for general tasks',
        logoUrl: '/pieces/new-core/agent.svg',
      },
    },
  ];

  // Simple test AI actions
  const testActions = [
    { name: 'Ask AI', description: 'Ask AI for help' },
    { name: 'Generate Image', description: 'Generate images using AI' },
    { name: 'Summarize Text', description: 'Summarize long text' },
    { name: 'Classify Text', description: 'Classify text into categories' },
    { name: 'Extract Data', description: 'Extract structured data' },
    { name: 'Run Agent', description: 'Run an AI agent' },
  ];

  console.log('Test AI Actions:', testActions);

  return (
    <div className="p-4">
      <div className="text-lg font-bold mb-4">AI Actions List</div>
      <div className="grid grid-cols-2 gap-4">
        {testActions.map((action, index) => (
          <div
            key={index}
            className="bg-blue-100 border border-blue-300 rounded-lg p-4 cursor-pointer hover:bg-blue-200 transition-colors"
            onClick={() => {
              console.log('AI Action clicked:', action);
              alert(`AI Action: ${action.name}`);
            }}
          >
            <div className="font-semibold text-blue-900">{action.name}</div>
            <div className="text-sm text-blue-700 mt-1">{action.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
