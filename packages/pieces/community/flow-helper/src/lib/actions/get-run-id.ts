import { createAction } from '@yflow/pieces-framework';

export const getRunId = createAction({
  // auth: check https://www.Yflow.com/docs/developers/piece-reference/authentication,
  name: 'getRunId',
  displayName: 'Get Run Info',
  description: '',
  props: {},
  async run(context) {
    const publicUrlWithoutApi = context.server.publicUrl.replace('/api', '');
    return {
      id: context.run.id,
      url: `${publicUrlWithoutApi}projects/${context.project.id}/runs/${context.run.id}`
    }
  },
});
