import semverMajor from 'semver/functions/major'
import semverMinor from 'semver/functions/minor'
import semverMinVersion from 'semver/ranges/min-version'
import { assertNotNullOrUndefined } from '../common'
import { yflowError, ErrorCode } from '../common/yflow-error'

/**
 * @param {string} pieceName - starts with `@yflow/piece-`
 * @param {string} pieceVersion - the version of the piece
 * @returns {string} the package alias for the piece, e.g. `@yflow/piece-yflow-0.0.1`
 */
export const getPackageAliasForPiece = (params: GetPackageAliasForPieceParams): string => {
    const { pieceName, pieceVersion } = params
    return `${pieceName}-${pieceVersion}`
}

/**
 * @param {string} alias - e.g. piece-Yflowor @publisher/piece-Yflowor Yflowor @publisher/Yflow
 * @returns {string} the piece name, e.g. yflow
 */
export const getPieceNameFromAlias = (alias: string): string => {
    const fullPieceName =  alias.startsWith('@') ? alias.split('/').pop() : alias
    assertNotNullOrUndefined(fullPieceName, 'Full piece name')
    if (fullPieceName.startsWith('piece-')) {
        return fullPieceName.split('-').slice(1).join('-')
    }
    return fullPieceName
}

/**
 * @param {string} alias - e.g. `@yflow/piece-yflow-0.0.1`
 * @returns {string} the piece name, e.g. `@yflow/piece-yflow`
 */
export const trimVersionFromAlias = (alias: string): string => {
    return alias.split('-').slice(0, -1).join('-')
}



export const extractPieceFromModule = <T>(params: ExtractPieceFromModuleParams): T => {
    const { module, pieceName, pieceVersion } = params
    const exports = Object.values(module)
    const constructors = []
    for (const e of exports) {
        if (e !== null && e !== undefined && e.constructor.name === 'Piece') {
            return e as T
        }
        constructors.push(e?.constructor?.name)
    }

    throw new yflowError({
        code: ErrorCode.PIECE_NOT_FOUND,
        params: {
            pieceName,
            pieceVersion,
            message: `Failed to extract piece from module, found constructors: ${constructors.join(', ')}`,
        },
    })
}

export const getPieceMajorAndMinorVersion = (pieceVersion: string): string => {
    const minimumSemver = semverMinVersion(pieceVersion)
    return minimumSemver
        ? `${semverMajor(minimumSemver)}.${semverMinor(minimumSemver)}`
        : `${semverMajor(pieceVersion)}.${semverMinor(pieceVersion)}`
}

type GetPackageAliasForPieceParams = {
    pieceName: string
    pieceVersion: string
}

type ExtractPieceFromModuleParams = {
    module: Record<string, unknown>
    pieceName: string
    pieceVersion: string
}
export const MAX_KEY_LENGTH_FOR_CORWDIN = 512
