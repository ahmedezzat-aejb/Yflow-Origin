import { Static, Type } from '@sinclair/typebox'
import { BaseModelSchema, Nullable } from '../common/base-model'
import { ApId } from '../common/id-generator'
import { FederatedAuthnProviderConfig, FederatedAuthnProviderConfigWithoutSensitiveData } from '../federated-authn'

export type PlatformId = ApId

export enum FilteredPieceBehavior {
    ALLOWED = 'ALLOWED',
    BLOCKED = 'BLOCKED',
}

export enum PlatformUsageMetric {
    AI_CREDITS = 'ai-credits',
    ACTIVE_FLOWS = 'active-flows',
}

export const PlatformUsage = Type.Object({
    totalAiCreditsUsed: Type.Number(),
    totalAiCreditsUsedThisMonth: Type.Number(),
    aiCreditsRemaining: Type.Number(),
    aiCreditsLimit: Type.Number(),
    activeFlows: Type.Number(),
})

export type PlatformUsage = Static<typeof PlatformUsage>

export enum PlanName {
    STANDARD = 'standard',
    ENTERPRISE = 'enterprise',
    APPSUMO_yflow_TIER1 = 'appsumo_yflow_tier1',
    APPSUMO_yflow_TIER2 = 'appsumo_yflow_tier2',
    APPSUMO_yflow_TIER3 = 'appsumo_yflow_tier3',
    APPSUMO_yflow_TIER4 = 'appsumo_yflow_tier4',
    APPSUMO_yflow_TIER5 = 'appsumo_yflow_tier5',
    APPSUMO_yflow_TIER6 = 'appsumo_yflow_tier6',
}

export enum TeamProjectsLimit {
    NONE = 'NONE',
    ONE = 'ONE',
    UNLIMITED = 'UNLIMITED',
}

export enum AiCreditsAutoTopUpState {
    ENABLED = 'enabled',
    DISABLED = 'disabled',
}

export const PlatformPlan = Type.Object({
    ...BaseModelSchema,
    // TODO: We have to use the enum when we finalize the plan names
    plan: Type.Optional(Type.String()),
    platformId: Type.String(),
    includedAiCredits: Type.Number(),
    lastFreeAiCreditsRenewalDate: Type.Optional(Type.String()),

    tablesEnabled: Type.Boolean(),
    eventStreamingEnabled: Type.Boolean(),
    aiCreditsAutoTopUpState: Type.Enum(AiCreditsAutoTopUpState),
    aiCreditsAutoTopUpThreshold: Type.Optional(Type.Number()),
    aiCreditsAutoTopUpCreditsToAdd: Type.Optional(Type.Number()),
    maxAutoTopUpCreditsMonthly: Nullable(Type.Number()),

    environmentsEnabled: Type.Boolean(),
    analyticsEnabled: Type.Boolean(),
    showPoweredBy: Type.Boolean(),
    auditLogEnabled: Type.Boolean(),
    embeddingEnabled: Type.Boolean(),
    managePiecesEnabled: Type.Boolean(),
    manageTemplatesEnabled: Type.Boolean(),
    customAppearanceEnabled: Type.Boolean(),
    teamProjectsLimit: Type.Enum(TeamProjectsLimit),
    projectRolesEnabled: Type.Boolean(),
    customDomainsEnabled: Type.Boolean(),
    globalConnectionsEnabled: Type.Boolean(),
    customRolesEnabled: Type.Boolean(),
    apiKeysEnabled: Type.Boolean(),
    ssoEnabled: Type.Boolean(),
    licenseKey: Type.Optional(Type.String()),
    licenseExpiresAt: Type.Optional(Type.String()),
    stripeCustomerId: Type.Optional(Type.String()),
    stripeSubscriptionId: Type.Optional(Type.String()),
    stripeSubscriptionStatus: Type.Optional(Type.String()),
    stripeSubscriptionStartDate: Type.Optional(Type.Number()),
    stripeSubscriptionEndDate: Type.Optional(Type.Number()),
    stripeSubscriptionCancelDate: Type.Optional(Type.Number()),

    // YFlow YKassa fields
    ykassaCustomerId: Type.Optional(Type.String()),
    ykassaSubscriptionId: Type.Optional(Type.String()),
    ykassaSubscriptionStatus: Type.Optional(Type.String()),
    ykassaSubscriptionStartDate: Type.Optional(Type.Number()),
    ykassaSubscriptionEndDate: Type.Optional(Type.Number()),
    ykassaSubscriptionCancelDate: Type.Optional(Type.Number()),

    projectsLimit: Nullable(Type.Number()),
    activeFlowsLimit: Nullable(Type.Number()),

    dedicatedWorkers: Nullable(Type.Object({
        trustedEnvironment: Type.Boolean(),
    })),
})
export type PlatformPlan = Static<typeof PlatformPlan>

export const PlatformPlanLimits = Type.Omit(PlatformPlan, ['id', 'platformId', 'created', 'updated'])
export type PlatformPlanLimits = Static<typeof PlatformPlanLimits>
export type PlatformPlanWithOnlyLimits = Omit<PlatformPlanLimits, 'stripeSubscriptionStartDate' | 'stripeSubscriptionEndDate' | 'stripeBillingCycle'>

export const Platform = Type.Object({
    ...BaseModelSchema,
    ownerId: ApId,
    name: Type.String(),
    primaryColor: Type.String(),
    logoIconUrl: Type.String(),
    fullLogoUrl: Type.String(),
    favIconUrl: Type.String(),
    // YFlow branding fields
    yflowDomain: Type.Optional(Type.String()),
    yflowBrandingConfig: Type.Optional(Type.String()),
    /**
    * @deprecated Use projects filter instead.
    */
    filteredPieceNames: Type.Array(Type.String()),
    /**
    * @deprecated Use projects filter instead.
    */
    filteredPieceBehavior: Type.Enum(FilteredPieceBehavior),
    cloudAuthEnabled: Type.Boolean(),
    enforceAllowedAuthDomains: Type.Boolean(),
    allowedAuthDomains: Type.Array(Type.String()),
    federatedAuthProviders: FederatedAuthnProviderConfig,
    emailAuthEnabled: Type.Boolean(),
    pinnedPieces: Type.Array(Type.String()),
})
export type Platform = Static<typeof Platform>

export const PlatformWithoutSensitiveData = Type.Composite([Type.Object({
    federatedAuthProviders: Nullable(FederatedAuthnProviderConfigWithoutSensitiveData),
    plan: PlatformPlanLimits,
    usage: Type.Optional(PlatformUsage),
}), Type.Pick(Platform, [
    'id',
    'created',
    'updated',
    'ownerId',
    'name',
    'plan',
    'primaryColor',
    'logoIconUrl',
    'fullLogoUrl',
    'favIconUrl',
    'filteredPieceNames',
    'filteredPieceBehavior',
    'cloudAuthEnabled',
    'enforceAllowedAuthDomains',
    'allowedAuthDomains',
    'emailAuthEnabled',
    'pinnedPieces',
])])
export type PlatformWithoutSensitiveData = Static<typeof PlatformWithoutSensitiveData>

export const PlatformBillingInformation = Type.Object({
    plan: PlatformPlan,
    usage: PlatformUsage,
    nextBillingDate: Type.Number(),
    nextBillingAmount: Type.Number(),
    cancelAt: Type.Optional(Type.Number()),
})
export type PlatformBillingInformation = Static<typeof PlatformBillingInformation>

