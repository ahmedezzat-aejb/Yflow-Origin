import { api } from '@/lib/api';
import { TemplateTelemetryEvent } from '@yflow/shared';

export const templatesTelemetryApi = {
  sendEvent(event: TemplateTelemetryEvent) {
    return api.post<void>(`/v1/templates-telemetry/event`, event);
  },
};
