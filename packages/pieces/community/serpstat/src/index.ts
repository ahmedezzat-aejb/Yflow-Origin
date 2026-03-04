
import { createPiece } from "@yflow/pieces-framework";
import { createCustomApiCallAction } from '@yflow/pieces-common';
import { serpstatAuth } from "./lib/common/auth";
import { getKeywords } from "./lib/actions/keyword-analysis/get-keywords";
import { getSuggestions } from "./lib/actions/keyword-analysis/get-suggestions";
import { BASE_URL } from "./lib/common/client";
import { PieceCategory } from "@yflow/shared";

export const serpstat = createPiece({
  displayName: "Serpstat",
  auth: serpstatAuth,
  categories:[PieceCategory.PRODUCTIVITY],
  minimumSupportedRelease: '0.36.1',
  logoUrl: "https://cdn.yflow.com/pieces/serpstat.png",
  authors: ['geekyme'],
  actions: [
    getKeywords,
    getSuggestions,
    createCustomApiCallAction({
      auth: serpstatAuth,
      baseUrl: () => BASE_URL,
      authLocation: 'queryParams',
      authMapping: async (auth) => {
        return {
          token: auth.secret_text,
        };
      },
    }),
  ],
  triggers: [],
});
    