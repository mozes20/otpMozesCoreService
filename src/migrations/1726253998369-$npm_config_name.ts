// src/migrations/1726253998369-%24npm_config_name.ts
import { MigrationInterface, QueryRunner } from 'typeorm';

export class $npmConfigName1726253998369 implements MigrationInterface {
  name = ' $npmConfigName1726253998369';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_device" ("userId" integer NOT NULL, "deviceHash" character varying NOT NULL, CONSTRAINT "PK_user_device" PRIMARY KEY ("userId", "deviceHash"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_bank_card" ("cardId" character varying NOT NULL, "cardnumber" character varying NOT NULL, "cvc" character varying NOT NULL, "name" character varying NOT NULL, "amount" numeric NOT NULL, "currency" character varying NOT NULL, "userId" integer, CONSTRAINT "PK_227be6678ca4ad4939c9b426b64" PRIMARY KEY ("cardId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("userId" SERIAL NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, CONSTRAINT "PK_8bf09ba754322ab9c22a215c919" PRIMARY KEY ("userId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_token" ("userId" integer NOT NULL, "token" character varying NOT NULL, CONSTRAINT "PK_user_token" PRIMARY KEY ("userId", "token"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_device" ADD CONSTRAINT "FK_93b7bd5286a602279011d41e84b" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_bank_card" ADD CONSTRAINT "FK_e9c9fccd8e60243e033f79cabb4" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_token" ADD CONSTRAINT "FK_624156deaa65fac5fa6f9fffaf4" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_token" DROP CONSTRAINT "FK_624156deaa65fac5fa6f9fffaf4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_bank_card" DROP CONSTRAINT "FK_e9c9fccd8e60243e033f79cabb4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_device" DROP CONSTRAINT "FK_93b7bd5286a602279011d41e84b"`,
    );
    await queryRunner.query(`DROP TABLE "user_token"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "user_bank_card"`);
    await queryRunner.query(`DROP TABLE "user_device"`);
  }
}
