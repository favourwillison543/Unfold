import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveEmailVerificationFields1792085451429 implements MigrationInterface {
    name = 'RemoveEmailVerificationFields1792085451429'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "emailVerified"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "verificationOtpExpiresAt"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "verificationOtpHash"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "verificationOtpHash" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "verificationOtpExpiresAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "user" ADD "emailVerified" boolean NOT NULL DEFAULT false`);
    }

}
