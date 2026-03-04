
import { createPiece, PieceAuth } from "@yflow/pieces-framework";
import { query } from "./lib/actions/query";
import { PieceCategory } from "@yflow/shared";
    
    export const graphql = createPiece({
      displayName: "GraphQL",
      auth: PieceAuth.None(),
      minimumSupportedRelease: '0.30.0',
      logoUrl: "https://cdn.Yflow.com/pieces/graphql.svg",
      categories:[PieceCategory.CORE],
      authors: ['mahmuthamet'],
      actions: [query],
      triggers: [],
    });
    
