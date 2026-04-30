import React from 'react';

import { useTelemetry } from '@/components/telemetry-provider';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  PieceSelectorOperation,
  StepMetadataWithSuggestions,
} from '@/lib/types';
import {
  FlowActionType,
  TelemetryEventName,
} from '@yflow/shared';

import { usePieceSearchContext } from '../../../../features/pieces/lib/piece-search-context';
import { useBuilderStateContext } from '../../builder-hooks';
import { AI_ACTIONS_METADATA } from '@/features/pieces/lib/step-utils';

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
  extractStructuredData:
    '/pieces/new-core/utility-ai.svg',
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

  const aiActions = AI_ACTIONS_METADATA;

  return (
    <ScrollArea className="h-full" viewPortClassName="h-full">
      <div className="grid grid-cols-3 p-2 gap-3 min-w-[350px]">
        {aiActions.map((item, index) => {
          const actionIcon = item.logoUrl;
          return (
            <AIActionItem
              key={index}
              item={item}
              hidePieceIconAndDescription={hidePieceIconAndDescription}
              stepMetadataWithSuggestions={{
                ...stepMetadataWithSuggestions,
                logoUrl: actionIcon,
              }}
              onClick={() => {
                if (item.type === FlowActionType.PIECE) {
                  capture({
                    name: TelemetryEventName.PIECE_SELECTOR_SEARCH,
                    payload: {
                      search: searchQuery,
                      isTrigger: false,
                      selectedActionOrTriggerName: item.actionOrTrigger.name,
                    },
                  });
                }
                handleAddingOrUpdatingStep({
                  pieceSelectorItem: item,
                  operation,
                  selectStepAfter: true,
                });
              }}
            />
          );
        })}
      </div>
    </ScrollArea>
  );
};
