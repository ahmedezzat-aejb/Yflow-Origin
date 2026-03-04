
import { createPiece } from "@yflow/pieces-framework";
import { PieceCategory } from "@yflow/shared";
import { alttextifyAuth } from "./lib/common/auth";
import { generateAltTextAction } from "./lib/actions/generate-alt-text";
import { createCustomApiCallAction } from "@yflow/pieces-common";

export const alttextify = createPiece({
  displayName: "AltTextify",
  categories: [PieceCategory.PRODUCTIVITY],
  auth: alttextifyAuth,
  minimumSupportedRelease: '0.36.1',
  logoUrl: "https://cdn.Yflow.com/pieces/alttextify.png",
  authors: ['kishanprmr'],
  actions: [generateAltTextAction,
    createCustomApiCallAction({
      auth: alttextifyAuth,
      baseUrl: () => 'https://api.alttextify.net/api/v1',
      authMapping: async (auth) => {
        return {
          'X-API-Key': auth.secret_text
        }
      }
    })
  ],
  triggers: [],
});
