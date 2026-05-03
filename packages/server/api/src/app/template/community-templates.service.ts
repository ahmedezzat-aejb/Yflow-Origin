import {
    ErrorCode,
    ListTemplatesRequestQuery,
    SeekPage,
    Template,
    TemplateStatus,
    TemplateType,
    yflowError,
} from '@yflow/shared'

const TEMPLATES_SOURCE_URL = 'https://api.github.com/repos/activepieces/activepieces/contents/community-templates'
const createMockTemplate = (template: Pick<Template, 'id' | 'name' | 'description' | 'categories'>): Template => ({
    ...template,
    summary: template.description,
    tags: [],
    blogUrl: null,
    metadata: null,
    author: 'Yflow',
    pieces: [],
    type: TemplateType.OFFICIAL,
    platformId: null,
    status: TemplateStatus.PUBLISHED,
    created: new Date().toISOString(),
    updated: new Date().toISOString(),
})

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
            createMockTemplate({
                id: 'slack-notifications',
                name: 'Slack Notifications',
                description: 'Send notifications to Slack channels',
                categories: ['Communication'],
            }),
            createMockTemplate({
                id: 'email-marketing',
                name: 'Email Marketing',
                description: 'Automated email marketing campaigns',
                categories: ['Marketing'],
            }),
            createMockTemplate({
                id: 'data-sync',
                name: 'Data Synchronization',
                description: 'Sync data between different systems',
                categories: ['Data'],
            }),
        ]

        return {
            data: mockTemplates,
            next: null,
            previous: null,
        }
    },
}
