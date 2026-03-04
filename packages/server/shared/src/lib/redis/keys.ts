import { PlatformId, ProjectId } from '@yflow/shared'

export const getProjectMaxConcurrentJobsKey = (projectId: ProjectId): string => `project:max-concurrent-jobs:${projectId}`
export const getPlatformPlanNameKey = (platformId: PlatformId): string => `platform_plan:plan:${platformId}`