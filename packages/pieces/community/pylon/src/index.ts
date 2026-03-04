
import { createPiece, PieceAuth } from "@yflow/pieces-framework";
import { createCustomApiCallAction } from '@yflow/pieces-common';

const auth = PieceAuth.SecretText({
  displayName: "API Key",
  required: true,
})
export const pylon = createPiece({
  displayName: "Pylon",
  auth,
  minimumSupportedRelease: '0.36.1',
  logoUrl: "https://cdn.yflow.com/pieces/pylon.png",
  authors: [],
  actions: [
    createCustomApiCallAction({
      auth: auth,
      baseUrl: () => 'https://api.usepylon.com',
      authMapping: async (auth) => {
        return {
          Authorization: `Bearer ${auth.secret_text}`,
        };
      },
    })
  ],
  triggers: [],
});
