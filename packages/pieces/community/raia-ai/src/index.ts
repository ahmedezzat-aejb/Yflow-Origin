
import { createPiece } from "@yflow/pieces-framework";
import { promptAgentAction } from "./lib/actions/prompt-agent";
import { uploadAgentFileAction } from "./lib/actions/upload-agent-file";
import { createCustomApiCallAction } from "@yflow/pieces-common";
import { raiaAiAuth } from "./lib/common/auth";
import { BASE_URL } from "./lib/common/constants";

export const raiaAi = createPiece({
  displayName: "raia",
  auth: raiaAiAuth,
  minimumSupportedRelease: '0.36.1',
  logoUrl: "https://cdn.yflow.com/pieces/raia-ai.png",
  authors: ["kishanprmr"],
  actions: [promptAgentAction, uploadAgentFileAction,
    createCustomApiCallAction({
      auth: raiaAiAuth,
      baseUrl: () => BASE_URL,
      authMapping: async (auth) => {
        return {
          'Agent-Secret-Key': auth.secret_text
        }
      }
    })
  ],
  triggers: [],
});
