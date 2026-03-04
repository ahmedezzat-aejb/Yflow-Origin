import { ApplicationEvent } from '@yflow/ee-shared'
import { BADGES } from '@yflow/shared'

export type BadgeCheckResult = {
    userId: string | null
    badges: (keyof typeof BADGES)[]
}

export type BadgeCheck = {
    eval: (applicationEvent: ApplicationEvent) => Promise<BadgeCheckResult>
}
