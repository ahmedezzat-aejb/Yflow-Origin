import { api } from '@/lib/api';
import { WorkerMachineWithStatus } from '@yflow/shared';

export const workersApi = {
  list() {
    return api.get<WorkerMachineWithStatus[]>('/v1/worker-machines');
  },
};
