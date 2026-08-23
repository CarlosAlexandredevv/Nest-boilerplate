import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUser1755900000000 implements MigrationInterface {
  name = 'CreateUser1755900000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "tenant" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "name" character varying NOT NULL, "slug" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_tenant_id" PRIMARY KEY ("id"), CONSTRAINT "UQ_tenant_slug" UNIQUE ("slug"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "isSuperAdmin" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_user_id" PRIMARY KEY ("id"), CONSTRAINT "UQ_user_email" UNIQUE ("email"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."membership_role_enum" AS ENUM('ADMIN', 'USER')`,
    );
    await queryRunner.query(
      `CREATE TABLE "membership" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "userId" uuid NOT NULL, "tenantId" uuid NOT NULL, "role" "public"."membership_role_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_membership_id" PRIMARY KEY ("id"), CONSTRAINT "UQ_membership_user_tenant" UNIQUE ("userId", "tenantId"), CONSTRAINT "FK_membership_user" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_membership_tenant" FOREIGN KEY ("tenantId") REFERENCES "tenant"("id") ON DELETE CASCADE ON UPDATE NO ACTION)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "membership"`);
    await queryRunner.query(`DROP TYPE "public"."membership_role_enum"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "tenant"`);
  }
}
