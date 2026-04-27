import { t } from 'i18next';
import { SearchX } from 'lucide-react';

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';

export const EmptyTemplatesView = () => {
  return (
    <Empty className="min-h-[300px]">
      <EmptyHeader className="max-w-xl">
        <EmptyMedia variant="icon">
          <SearchX />
        </EmptyMedia>
        <EmptyTitle>{t('No templates found')}</EmptyTitle>
        <EmptyDescription>
          {t(
            'Templates are loading or no templates are available. Try refreshing the page or check your connection.',
          )}
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
};
