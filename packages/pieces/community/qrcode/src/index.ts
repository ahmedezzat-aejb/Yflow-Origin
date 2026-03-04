
    import { createPiece, PieceAuth } from "@yflow/pieces-framework";
    import { PieceCategory } from '@yflow/shared';
    import { outputQrcodeAction } from './lib/actions/output-qrcode-action'
    
    export const qrcode = createPiece({
      displayName: 'QR Code',
      auth: PieceAuth.None(),
      minimumSupportedRelease: '0.30.0',
      logoUrl: "https://cdn.yflow.com/pieces/new-core/qrcode.svg",
      categories: [PieceCategory.CORE],
      authors: ['Meng-Yuan Huang'],
      actions: [
        outputQrcodeAction,
      ],
      triggers: [],
    });
    