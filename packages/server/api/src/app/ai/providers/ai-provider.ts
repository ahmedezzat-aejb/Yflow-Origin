import { AIProviderAuthConfig, AIProviderConfig, AIProviderModel } from '@yflow/shared'

export type AIProviderStrategy<T extends AIProviderAuthConfig, C extends AIProviderConfig> = {
    name: string
    listModels(authConfig: T, config: C): Promise<AIProviderModel[]>
}
