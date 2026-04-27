import {
    ErrorCode,
    isNil,
    ListTemplatesRequestQuery,
    SeekPage,
    Template,
    TemplateType,
    yflowError,
} from '@yflow/shared'

const TEMPLATES_SOURCE_URL = 'https://api.github.com/repos/activepieces/activepieces/contents/community-templates'
export const communityTemplates = {
    getOrThrow: async (id: string): Promise<Template> => {
        const url = `${TEMPLATES_SOURCE_URL}/${id}`
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        if (!response.ok) {
            throw new yflowError({
                code: ErrorCode.ENTITY_NOT_FOUND,
                params: {
                    entityType: 'template',
                    entityId: id,
                    message: `Template ${id} not found`,
                },
            })
        }
        const template = await response.json()
        return template
    },
    getCategories: async (): Promise<string[]> => {
        // Return mock categories for Community Edition
        return ['Communication', 'Marketing', 'Data', 'Productivity', 'Automation']
    },
    list: async (_request: ListTemplatesRequestQuery): Promise<SeekPage<Template>> => {
        // Return mock templates for Community Edition
        const mockTemplates: Template[] = [
            {
                id: 'slack-notifications',
                name: 'Slack Notifications',
                description: 'Send notifications to Slack channels',
                categories: ['Communication'],
                type: TemplateType.OFFICIAL,
                platformId: null,
                created: new Date().toISOString(),
                updated: new Date().toISOString(),
            },
            {
                id: 'email-marketing',
                name: 'Email Marketing',
                description: 'Automated email marketing campaigns',
                categories: ['Marketing'],
                type: TemplateType.OFFICIAL,
                platformId: null,
                created: new Date().toISOString(),
                updated: new Date().toISOString(),
            },
            {
                id: 'data-sync',
                name: 'Data Synchronization',
                description: 'Sync data between different systems',
                categories: ['Data'],
                type: TemplateType.OFFICIAL,
                platformId: null,
                created: new Date().toISOString(),
                updated: new Date().toISOString(),
            },
        ];

        return {
            data: mockTemplates,
            next: null,
            previous: null,
        };
    },
}


