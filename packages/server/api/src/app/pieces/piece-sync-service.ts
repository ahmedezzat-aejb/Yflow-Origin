import { AppSystemProp, rejectedPromiseHandler } from '@yflow/server-shared'
import { PieceSyncMode, PieceType } from '@yflow/shared'
import { FastifyBaseLogger } from 'fastify'
import { system } from '../helper/system/system'
import { SystemJobName } from '../helper/system-jobs/common'
import { systemJobHandlers } from '../helper/system-jobs/job-handlers'
import { systemJobsSchedule } from '../helper/system-jobs/system-job'
import { localPieceCache } from './metadata/local-piece-cache'
import { PieceMetadataSchema } from './metadata/piece-metadata-entity'
import { pieceMetadataService, pieceRepos } from './metadata/piece-metadata-service'

const CLOUD_API_URL = 'https://api.github.com/repos/activepieces/activepieces/contents/community-templates'
const syncMode = system.get<PieceSyncMode>(AppSystemProp.PIECES_SYNC_MODE)

export const pieceSyncService = (log: FastifyBaseLogger) => ({
    async setup(): Promise<void> {
        systemJobHandlers.registerJobHandler(SystemJobName.PIECES_SYNC, async function syncPiecesJobHandler(): Promise<void> {
            await pieceSyncService(log).sync()
        })
        rejectedPromiseHandler(pieceSyncService(log).sync(), log)
        await systemJobsSchedule(log).upsertJob({
            job: {
                name: SystemJobName.PIECES_SYNC,
                data: {},
            },
            schedule: {
                type: 'repeated',
                cron: `${Math.floor(Math.random() * 5)} */1 * * *`,
            },
        })
    },
    async sync(): Promise<void> {
        if (syncMode !== PieceSyncMode.OFFICIAL_AUTO) {
            log.info('Piece sync service is disabled')
            return
        }
        try {
            log.info('Starting piece synchronization')
            const startTime = performance.now()
            const [dbPieces, cloudPieces] = await Promise.all([pieceRepos().find({
                select: {
                    name: true,
                    version: true,
                    pieceType: true,
                },
            }), listCloudPieces()])
            const added = await installNewPieces(cloudPieces, dbPieces, log)
            const deleted = await deletePiecesIfNotOnCloud(dbPieces, cloudPieces, log)
            const endTime = performance.now()
            log.info({
                added,
                deleted,
                durationMs: Math.floor(endTime - startTime),
            }, 'Piece synchronization completed')
            await localPieceCache(log).refresh()
        }
        catch (error) {
            log.error({ error }, 'Error syncing pieces')
        }
    },
})

async function deletePiecesIfNotOnCloud(dbPieces: PieceMetadataOnly[], cloudPieces: PieceRegistryResponse[], log: FastifyBaseLogger): Promise<number> {
    const cloudMap = new Map<string, true>(cloudPieces.map(cloudPiece => [`${cloudPiece.name}:${cloudPiece.version}`, true]))
    const piecesToDelete = dbPieces.filter(piece => piece.pieceType === PieceType.OFFICIAL && !cloudMap.has(`${piece.name}:${piece.version}`))
    await pieceMetadataService(log).bulkDelete(piecesToDelete.map(piece => ({ name: piece.name, version: piece.version })))
    return piecesToDelete.length
}

async function installNewPieces(cloudPieces: PieceRegistryResponse[], dbPieces: PieceMetadataOnly[], log: FastifyBaseLogger): Promise<number> {
    const dbMap = new Map<string, true>(dbPieces.map(dbPiece => [`${dbPiece.name}:${dbPiece.version}`, true]))
    const newPiecesToFetch = cloudPieces.filter(piece => !dbMap.has(`${piece.name}:${piece.version}`))
    const batchSize = 5
    for (let done = 0; done < newPiecesToFetch.length; done += batchSize) {
        const currentBatch = newPiecesToFetch.slice(done, done + batchSize)
        await Promise.all(currentBatch.map(async (piece) => {
            const url = `${CLOUD_API_URL}/${piece.name}${piece.version ? '?version=' + piece.version : ''}`
            const response = await fetch(url)
            if (!response.ok) {
                log.warn({ name: piece.name, version: piece.version, status: response.status }, 'Error reading piece metadata')
                return
            }
            const pieceMetadata = await response.json()
            await pieceMetadataService(log).create({
                pieceMetadata,
                packageType: pieceMetadata.packageType,
                pieceType: pieceMetadata.pieceType,
            })
        }))
    }
    return newPiecesToFetch.length
}


async function listCloudPieces(): Promise<PieceRegistryResponse[]> {
    // Return mock pieces for Community Edition
    return [
        {
            name: 'slack',
            version: '1.0.0',
        },
        {
            name: 'gmail',
            version: '1.0.0',
        },
        {
            name: 'discord',
            version: '1.0.0',
        },
        {
            name: 'google-sheets',
            version: '1.0.0',
        },
        {
            name: 'webhook',
            version: '1.0.0',
        },
        {
            name: 'http',
            version: '1.0.0',
        },
        {
            name: 'ai-agent',
            version: '1.0.0',
        },
        {
            name: 'image-ai',
            version: '1.0.0',
        },
        {
            name: 'text-ai',
            version: '1.0.0',
        },
    ]
}


type PieceRegistryResponse = {
    name: string
    version: string
}


type PieceMetadataOnly = Pick<PieceMetadataSchema, 'name' | 'version' | 'pieceType'>
