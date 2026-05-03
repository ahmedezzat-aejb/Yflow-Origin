import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddFlowVersionBackupFileSqlite1759964539150 implements MigrationInterface {
    name = 'AddFlowVersionBackupFileSqlite1759964539150'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "flow_version"
            ADD "backupFiles" text
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "flow_version"
                RENAME TO "temporary_flow_version"
        `)
        await queryRunner.query(`
            CREATE TABLE "flow_version" AS
            SELECT "id", "created", "updated", "flowId", "displayName", "schemaVersion", "trigger", "connectionIds", "agentIds", "updatedBy", "valid", "state", "notes"
            FROM "temporary_flow_version"
        `)
        await queryRunner.query(`
            DROP TABLE "temporary_flow_version"
        `)
    }
}
