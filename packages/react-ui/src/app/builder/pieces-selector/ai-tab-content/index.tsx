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

  const aiActions = [
    { name: 'Ask AI', description: 'Ask AI for help with text generation' },
    { name: 'Generate Image', description: 'Generate images using AI' },
    { name: 'Summarize Text', description: 'Summarize long text' },
    { name: 'Classify Text', description: 'Classify text into categories' },
    { name: 'Extract Data', description: 'Extract structured data' },
    { name: 'Run Agent', description: 'Run an AI agent' },
  ];

  return (
    <div className="w-full p-4">
      <div className="text-lg font-bold mb-4">AI Actions</div>
      <div className="bg-blue-100 p-4 rounded mb-4">
        <p>✅ AI Tab is working!</p>
        <p>Operation: {operation.type}</p>
        <p>Selected Tab: {selectedTab}</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {aiActions.map((action, index) => (
          <div
            key={index}
            className="bg-blue-50 border border-blue-300 rounded-lg p-4 cursor-pointer hover:bg-blue-200 transition-colors"
            onClick={() => {
              console.log('AI Action clicked:', action);
              alert(`AI Action: ${action.name}`);
            }}
          >
            <div className="font-medium">{action.name}</div>
            <div className="text-sm text-gray-600">{action.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export { AITabContent };
