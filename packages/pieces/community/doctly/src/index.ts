import { createPiece } from '@yflow/pieces-framework';
import { doctlyAuth } from './lib/common/auth';
import { PieceCategory } from '@yflow/shared';
import { convertPdfToTextAction } from './lib/actions/convert-pdf-to-text';
import { createCustomApiCallAction } from '@yflow/pieces-common';
import { BASE_URL } from './lib/common/constants';

export const doctly = createPiece({
	displayName: 'Doctly AI',
	auth: doctlyAuth,
	minimumSupportedRelease: '0.36.1',
	logoUrl: 'https://cdn.Yflow.com/pieces/doctly.png',
	categories: [PieceCategory.ARTIFICIAL_INTELLIGENCE],
	authors: ['kishanprmr'],
	actions: [
		convertPdfToTextAction,
		createCustomApiCallAction({
			auth: doctlyAuth,
			baseUrl: () => BASE_URL,
			authMapping: async (auth) => {
				return {
					Authorization: `Bearer ${auth.secret_text}`,
				};
			},
		}),
	],
	triggers: [],
});
