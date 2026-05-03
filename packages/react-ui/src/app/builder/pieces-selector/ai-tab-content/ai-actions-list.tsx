import { ApFlagId, FlowActionType, TelemetryEventName } from '@yflow/shared';
import { t } from 'i18next';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { usePieceSearchContext } from '../../../../features/pieces/lib/piece-search-context';
import { useBuilderStateContext } from '../../builder-hooks';
import { convertStepMetadataToPieceSelectorItems } from '../piece-actions-or-triggers-list';

import AIActionItem from './ai-action';

import { useTelemetry } from '@/components/telemetry-provider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { flagsHooks } from '@/hooks/flags-hooks';
import {
  PieceSelectorOperation,
  StepMetadataWithSuggestions,
} from '@/lib/types';

type AIPieceActionsListProps = {
  hidePieceIconAndDescription: boolean;
  stepMetadataWithSuggestions: StepMetadataWithSuggestions;
  operation: PieceSelectorOperation;
};

const ACTION_ICON_MAP: Record<string, string> = {
  run_agent: 'https://cdn.activepieces.com/pieces/new-core/agent.svg',
  generateImage: 'https://cdn.activepieces.com/pieces/new-core/image-ai.svg',
  askAi: 'https://cdn.activepieces.com/pieces/new-core/text-ai.svg',
  summarizeText: 'https://cdn.activepieces.com/pieces/new-core/text-ai.svg',
  classifyText: 'https://cdn.activepieces.com/pieces/new-core/text-ai.svg',
  extractStructuredData:
    'https://cdn.activepieces.com/pieces/new-core/utility-ai.svg',
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
  const isAgentsConfigured = true; // Force AI actions to work for Community Edition
  const navigate = useNavigate();

  const aiActions = convertStepMetadataToPieceSelectorItems(
    stepMetadataWithSuggestions,
  );

  return (
    <ScrollArea className="h-full" viewPortClassName="h-full">
      <div className="grid grid-cols-3 p-2 gap-3 min-w-[350px]">
        {aiActions.map((item, index) => {
          const actionIcon =
            item.type === FlowActionType.PIECE
              ? ACTION_ICON_MAP[item.actionOrTrigger.name]
              : 'https://cdn.activepieces.com/pieces/new-core/image-ai.svg';
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
                // Direct execution for Community Edition - no flag checks
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
