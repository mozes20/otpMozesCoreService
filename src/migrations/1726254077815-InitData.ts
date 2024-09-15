// src/migrations/1726254077815-InitData.ts
import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitData1726254077815 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO "users" ("userId", "name", "email") VALUES
      (1000, 'Teszt Aladár', 'teszt.aladar@otpmobil.com'),
      (2000, 'Teszt Benedek', 'teszt.benedek@otpmobil.com'),
      (3000, 'Teszt Cecília', 'teszt.cecilia@otpmobil.com');
    `);
    await queryRunner.query(`
      INSERT INTO "user_device" ("userId", "deviceHash") VALUES
      (1000, 'F67C2BCBFCFA30FCCB36F72DCA22A817'),
      (1000, '0F1674BD19D3BBDD4C39E14734FFB876'),
      (1000, '3AE5E9658FBD7D4048BD40820B7D227D'),
      (2000, 'FADDFEA562F3C914DCC81956682DB0FC'),
      (3000, 'E68560872BDB2DF2FFE7ADC091755378');
    `);
    await queryRunner.query(`
      INSERT INTO "user_token" ("userId", "token") VALUES
      (1000, 'dGVzenQuYWxhZGFyQG90cG1vYmlsLmNvbSYxMDAwJkY2N0MyQkNCRkNGQTMwRkNDQjM2RjcyRENBMjJBODE3'),
      (2000, 'dGVzenQuYmVuZWRla0BvdHBtb2JpbC5jb20mMjAwMCZGQURERkVBNTYyRjNDOTE0RENDODE5NTY2ODJEQjBGQw=='),
      (3000, 'dGVzenQuY2VjaWxpYUBvdHBtb2JpbC5jb20mMzAwMCZFNjg1NjA4NzJCREIyREYyRkZFN0FEQzA5MTc1NTM3OA=='),
      (1000, 'dGVzenQuYWxhZGFyQG90cG1vYmlsLmNvbSYxMDAwJjBGMTY3NEJEMTlEM0JCREQ0QzM5RTE0NzM0RkZCODc2'),
      (1000, 'dGVzenQuYWxhZGFyQG90cG1vYmlsLmNvbSYxMDAwJjNBRTVFOTY1OEZCRDdENDA0OEJENDA4MjBCN0QyMjdE');
    `);
    await queryRunner.query(`
      INSERT INTO "user_bank_card" ("userId", "cardId", "cardnumber", "cvc", "name", "amount", "currency") VALUES
      (1000, 'C0001', '5299706965433676', '123', 'Teszt Aladár', 1000, 'HUF'),
      (2000, 'C0002', '5390508354245119', '456', 'Teszt Benedek', 2000, 'HUF'),
      (3000, 'C0003', '4929088924014470', '789', 'Teszt Cecília', 3000, 'HUF');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "user_bank_card" WHERE "userId" IN (1000, 2000, 3000);`,
    );
    await queryRunner.query(
      `DELETE FROM "user_token" WHERE "userId" IN (1000, 2000, 3000);`,
    );
    await queryRunner.query(
      `DELETE FROM "user_device" WHERE "userId" IN (1000, 2000, 3000);`,
    );
    await queryRunner.query(
      `DELETE FROM "users" WHERE "userId" IN (1000, 2000, 3000);`,
    );
  }
}
