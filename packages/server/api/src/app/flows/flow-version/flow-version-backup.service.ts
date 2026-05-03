import { FileCompression, FileType, FlowVersion } from '@yflow/shared'
import { fileService } from '../../file/file.service'
import { system } from '../../helper/system/system'

const log = system.globalLogger()

export const flowVersionBackupService = {
    async store(flowVersion: FlowVersion): Promise<string> {
        const file = await fileService(log).save({
            data: Buffer.from(JSON.stringify(flowVersion)),
            size: Buffer.byteLength(JSON.stringify(flowVersion)),
            type: FileType.FLOW_VERSION_BACKUP,
            compression: FileCompression.NONE,
            fileName: `${flowVersion.id}-${flowVersion.schemaVersion ?? 'unknown'}.json`,
        })

        return file.id
    },
}
