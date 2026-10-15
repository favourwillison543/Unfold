import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1792031417487 implements MigrationInterface {
    name = 'InitialSchema1792031417487'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "project_invitation" ("id" SERIAL NOT NULL, "projectId" integer NOT NULL, "email" character varying NOT NULL, "role" character varying NOT NULL DEFAULT 'viewer', "token" character varying NOT NULL, "expiresAt" TIMESTAMP NOT NULL, "acceptedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_5e84c0df2e65260518ad1d96da4" UNIQUE ("token"), CONSTRAINT "UQ_0404aa92fb07a236bf43051d1f3" UNIQUE ("projectId", "email"), CONSTRAINT "PK_ba41c49adf5e2c6e828de7a108d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "project_member" ("id" SERIAL NOT NULL, "projectId" integer NOT NULL, "userId" integer NOT NULL, "role" character varying NOT NULL DEFAULT 'viewer', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_1f95533c37d5a7215c796d6ac9f" UNIQUE ("projectId", "userId"), CONSTRAINT "PK_64dba8e9dcf96ce383cfd19d6fb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product_type" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "analysisId" integer, CONSTRAINT "PK_e0843930fbb8854fe36ca39dae1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product_area" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" text, "analysisId" integer, CONSTRAINT "PK_a0f0f4eeac41f8ae51073a275c5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "person" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "type" text, "responsibilities" text array, "description" text, "analysisId" integer, CONSTRAINT "PK_5fdaf670315c4b7e70cce85daa3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "question" ("id" SERIAL NOT NULL, "question" character varying NOT NULL, "options" jsonb NOT NULL, "answer" text, "reason" text, "analysisId" integer, CONSTRAINT "PK_21e5786aa0ea704ae185a79b2d5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "actor_goal" ("id" SERIAL NOT NULL, "actor" character varying NOT NULL, "goal" text NOT NULL, "analysisId" integer, CONSTRAINT "PK_e451b81f3b455d21af788a65ba7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product_entity" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" text NOT NULL, "analysisId" integer, CONSTRAINT "PK_6e8f75045ddcd1c389c765c896e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product_relationship" ("id" SERIAL NOT NULL, "from" character varying NOT NULL, "relationship" character varying NOT NULL, "to" character varying NOT NULL, "analysisId" integer, CONSTRAINT "PK_cfdcc47ad2b2d3460f6def2627c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "analysis" ("id" SERIAL NOT NULL, "understanding" text, "productModel" jsonb, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "projectId" integer, CONSTRAINT "REL_0c55929c37d981ded07299eacb" UNIQUE ("projectId"), CONSTRAINT "PK_300795d51c57ef52911ed65851f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "project" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" text, "productFormat" character varying NOT NULL, "createdById" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_4d68b1358bb5b766d3e78f32f57" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "public_project_share" ("id" SERIAL NOT NULL, "projectId" integer NOT NULL, "token" character varying NOT NULL, "enabled" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e9bb0f41b8ff1941be81b766ec5" UNIQUE ("token"), CONSTRAINT "UQ_1447d1100a3a439c9d58d8a731c" UNIQUE ("projectId"), CONSTRAINT "PK_da61664438f9404bd90a0716187" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "emailVerified" boolean NOT NULL DEFAULT false, "verificationOtpHash" character varying, "verificationOtpExpiresAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "challenge" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" text NOT NULL, "severity" character varying NOT NULL, "relatedActor" text, "relatedWorkflow" text, "suggestedQuestion" text, "resolved" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "projectId" integer, CONSTRAINT "PK_5f31455ad09ea6a836a06871b7a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "actor_pages" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "purpose" character varying NOT NULL, "description" text NOT NULL, "actorId" integer NOT NULL, CONSTRAINT "PK_b08aab3400d11d8b60619cdbb4c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "actors" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" text NOT NULL, "projectId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d8608598c2c4f907a78de2ae461" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "actor_capabilities" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" text NOT NULL, "actorId" integer NOT NULL, CONSTRAINT "PK_1b6f9e5896ff512c2f410678f01" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "public_flow_pages" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "purpose" character varying NOT NULL, "description" text, "projectId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a7f40a49d427ce7826a27a9ba7b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "workflow_step" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "type" character varying NOT NULL, "actor" character varying, "page" character varying, "description" text, "stepOrder" integer NOT NULL, "workflowId" integer, CONSTRAINT "PK_6c155e8aa140495dbf88eae4f4a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "workflow_page" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "purpose" text NOT NULL, "workflowId" integer, CONSTRAINT "PK_3577b3148b5b2f5c588709d0e0e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "workflow" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" text, "actor" character varying NOT NULL, "goal" character varying NOT NULL, "entryPoint" text, "completion" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "projectId" integer, CONSTRAINT "PK_eb5e4cc1a9ef2e94805b676751b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "workflow_connection" ("id" SERIAL NOT NULL, "from" character varying NOT NULL, "to" character varying NOT NULL, "condition" text, "workflowId" integer, CONSTRAINT "PK_55bcfd0f136e73d3924edbc0285" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "product_type" ADD CONSTRAINT "FK_9f794849a3a6bee4615610cdc16" FOREIGN KEY ("analysisId") REFERENCES "analysis"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_area" ADD CONSTRAINT "FK_7ac83585160b774027baae3510f" FOREIGN KEY ("analysisId") REFERENCES "analysis"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "person" ADD CONSTRAINT "FK_849115407ab32a334c3a2110966" FOREIGN KEY ("analysisId") REFERENCES "analysis"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "FK_2a18912aae58463ae40901f812a" FOREIGN KEY ("analysisId") REFERENCES "analysis"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "actor_goal" ADD CONSTRAINT "FK_a3d664dd7aa0d81e806c2c0a42d" FOREIGN KEY ("analysisId") REFERENCES "analysis"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_entity" ADD CONSTRAINT "FK_2efa1dc1ee5e1a4c64c810d807b" FOREIGN KEY ("analysisId") REFERENCES "analysis"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_relationship" ADD CONSTRAINT "FK_0ded6e780f7286877ae77fba18a" FOREIGN KEY ("analysisId") REFERENCES "analysis"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "analysis" ADD CONSTRAINT "FK_0c55929c37d981ded07299eacbb" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "challenge" ADD CONSTRAINT "FK_e5074b40d66a2cea6a1edbdb454" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "actor_pages" ADD CONSTRAINT "FK_5ab79fab8fcef9eea19495b76ac" FOREIGN KEY ("actorId") REFERENCES "actors"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "actors" ADD CONSTRAINT "FK_55f2d26e97b633d54b83d43f4b9" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "actor_capabilities" ADD CONSTRAINT "FK_83d6f1156a7daf172354bc736ac" FOREIGN KEY ("actorId") REFERENCES "actors"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "public_flow_pages" ADD CONSTRAINT "FK_6812f757eb8982e57a7e25ff071" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "workflow_step" ADD CONSTRAINT "FK_1ad97e48f44bfd1483b8f14b98a" FOREIGN KEY ("workflowId") REFERENCES "workflow"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "workflow_page" ADD CONSTRAINT "FK_a03267efd2b7631a19b8c56afd5" FOREIGN KEY ("workflowId") REFERENCES "workflow"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "workflow" ADD CONSTRAINT "FK_b77c7678b1ec41b60d48a7e3978" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "workflow_connection" ADD CONSTRAINT "FK_b7b780368bd0a36d6e26e2fd52f" FOREIGN KEY ("workflowId") REFERENCES "workflow"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "workflow_connection" DROP CONSTRAINT "FK_b7b780368bd0a36d6e26e2fd52f"`);
        await queryRunner.query(`ALTER TABLE "workflow" DROP CONSTRAINT "FK_b77c7678b1ec41b60d48a7e3978"`);
        await queryRunner.query(`ALTER TABLE "workflow_page" DROP CONSTRAINT "FK_a03267efd2b7631a19b8c56afd5"`);
        await queryRunner.query(`ALTER TABLE "workflow_step" DROP CONSTRAINT "FK_1ad97e48f44bfd1483b8f14b98a"`);
        await queryRunner.query(`ALTER TABLE "public_flow_pages" DROP CONSTRAINT "FK_6812f757eb8982e57a7e25ff071"`);
        await queryRunner.query(`ALTER TABLE "actor_capabilities" DROP CONSTRAINT "FK_83d6f1156a7daf172354bc736ac"`);
        await queryRunner.query(`ALTER TABLE "actors" DROP CONSTRAINT "FK_55f2d26e97b633d54b83d43f4b9"`);
        await queryRunner.query(`ALTER TABLE "actor_pages" DROP CONSTRAINT "FK_5ab79fab8fcef9eea19495b76ac"`);
        await queryRunner.query(`ALTER TABLE "challenge" DROP CONSTRAINT "FK_e5074b40d66a2cea6a1edbdb454"`);
        await queryRunner.query(`ALTER TABLE "analysis" DROP CONSTRAINT "FK_0c55929c37d981ded07299eacbb"`);
        await queryRunner.query(`ALTER TABLE "product_relationship" DROP CONSTRAINT "FK_0ded6e780f7286877ae77fba18a"`);
        await queryRunner.query(`ALTER TABLE "product_entity" DROP CONSTRAINT "FK_2efa1dc1ee5e1a4c64c810d807b"`);
        await queryRunner.query(`ALTER TABLE "actor_goal" DROP CONSTRAINT "FK_a3d664dd7aa0d81e806c2c0a42d"`);
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "FK_2a18912aae58463ae40901f812a"`);
        await queryRunner.query(`ALTER TABLE "person" DROP CONSTRAINT "FK_849115407ab32a334c3a2110966"`);
        await queryRunner.query(`ALTER TABLE "product_area" DROP CONSTRAINT "FK_7ac83585160b774027baae3510f"`);
        await queryRunner.query(`ALTER TABLE "product_type" DROP CONSTRAINT "FK_9f794849a3a6bee4615610cdc16"`);
        await queryRunner.query(`DROP TABLE "workflow_connection"`);
        await queryRunner.query(`DROP TABLE "workflow"`);
        await queryRunner.query(`DROP TABLE "workflow_page"`);
        await queryRunner.query(`DROP TABLE "workflow_step"`);
        await queryRunner.query(`DROP TABLE "public_flow_pages"`);
        await queryRunner.query(`DROP TABLE "actor_capabilities"`);
        await queryRunner.query(`DROP TABLE "actors"`);
        await queryRunner.query(`DROP TABLE "actor_pages"`);
        await queryRunner.query(`DROP TABLE "challenge"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "public_project_share"`);
        await queryRunner.query(`DROP TABLE "project"`);
        await queryRunner.query(`DROP TABLE "analysis"`);
        await queryRunner.query(`DROP TABLE "product_relationship"`);
        await queryRunner.query(`DROP TABLE "product_entity"`);
        await queryRunner.query(`DROP TABLE "actor_goal"`);
        await queryRunner.query(`DROP TABLE "question"`);
        await queryRunner.query(`DROP TABLE "person"`);
        await queryRunner.query(`DROP TABLE "product_area"`);
        await queryRunner.query(`DROP TABLE "product_type"`);
        await queryRunner.query(`DROP TABLE "project_member"`);
        await queryRunner.query(`DROP TABLE "project_invitation"`);
    }

}
