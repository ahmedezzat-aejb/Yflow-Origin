import { CardListItem } from '@/components/custom/card-list';
import { PieceIcon } from '@/features/pieces/components/piece-icon';
import { PieceSelectorItem, StepMetadataWithSuggestions } from '@/lib/types';
import { FlowActionType, FlowTriggerType } from '@yflow/shared';

type AIActionItemProps = {
  item: PieceSelectorItem;
  hidePieceIconAndDescription: boolean;
  stepMetadataWithSuggestions: StepMetadataWithSuggestions;
  onClick: () => void;
};

const getPieceSelectorItemInfo = (item: PieceSelectorItem) => {
  if (
    item.type === FlowActionType.PIECE ||
    item.type === FlowTriggerType.PIECE
  ) {
    return {
      displayName: item.actionOrTrigger.displayName,
      description: item.actionOrTrigger.description,
    };
  }
  return {
    displayName: item.displayName,
    description: item.description,
  };
};

const AIActionItem = ({
  item,
  stepMetadataWithSuggestions,
  onClick,
}: AIActionItemProps) => {
  const pieceSelectorItemInfo = getPieceSelectorItemInfo(item);

  console.log('AI Action Item rendering:', {
    item,
    stepMetadataWithSuggestions,
    pieceSelectorItemInfo
  });

  return (
    <CardListItem
      className="p-4 w-full h-full rounded-md flex flex-col justify-between h-[125px] bg-blue-50 border border-blue-200"
      onClick={onClick}
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-center">
          <PieceIcon
            logoUrl={stepMetadataWithSuggestions.logoUrl}
            displayName={stepMetadataWithSuggestions.displayName}
            showTooltip={false}
            size={'lg'}
          />
        </div>
        <div className="flex flex-col gap-1 text-center">
          <div className="text-sm font-medium leading-tight">
            {pieceSelectorItemInfo.displayName}
          </div>
          <div className="text-xs text-gray-600">
            {pieceSelectorItemInfo.description}
          </div>
        </div>
      </div>
    </CardListItem>
  );
};

AIActionItem.displayName = 'AIActionItem';
export default AIActionItem;
