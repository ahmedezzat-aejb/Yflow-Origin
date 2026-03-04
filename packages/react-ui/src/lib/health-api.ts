import { GetSystemHealthChecksResponse } from '@yflow/shared';

import { api } from './api';

export const healthApi = {
  getSystemHealthChecks(): Promise<GetSystemHealthChecksResponse> {
    return api.get<GetSystemHealthChecksResponse>('/v1/health/system');
  },
};
