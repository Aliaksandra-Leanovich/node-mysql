import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1686522199485 implements MigrationInterface {
    name = 'Init1686522199485'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`user_type\` enum ('admin', 'candidate') NOT NULL DEFAULT 'candidate', UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`candidates\` (\`id\` int NOT NULL AUTO_INCREMENT, \`level\` enum ('junior', 'middle', 'senior') NOT NULL, \`userId\` int NULL, UNIQUE INDEX \`REL_10d0384a816526f8c7f6b1e67b\` (\`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`testcandidates\` (\`id\` int NOT NULL AUTO_INCREMENT, \`candidateIdId\` int NULL, \`testIdId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`tests\` (\`id\` int NOT NULL AUTO_INCREMENT, \`duration\` int NOT NULL, \`level\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`questions\` (\`id\` int NOT NULL AUTO_INCREMENT, \`question\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`testquestions\` (\`id\` int NOT NULL AUTO_INCREMENT, \`testIdId\` int NULL, \`questionIdId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`answers\` (\`id\` int NOT NULL AUTO_INCREMENT, \`answer_text\` varchar(255) NOT NULL, \`testcandidateIdId\` int NULL, \`questionIdId\` int NULL, UNIQUE INDEX \`REL_e6803a520e3f9f6ce24819745e\` (\`questionIdId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`candidates\` ADD CONSTRAINT \`FK_10d0384a816526f8c7f6b1e67b3\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`testcandidates\` ADD CONSTRAINT \`FK_0b74490e18fad6fe816a402e1bf\` FOREIGN KEY (\`candidateIdId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`testcandidates\` ADD CONSTRAINT \`FK_88a8ab81bd78537f33a7958dfcb\` FOREIGN KEY (\`testIdId\`) REFERENCES \`tests\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`testquestions\` ADD CONSTRAINT \`FK_a410bc9d79143206f2cbc447580\` FOREIGN KEY (\`testIdId\`) REFERENCES \`tests\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`testquestions\` ADD CONSTRAINT \`FK_500cd9ba9bd1ea1eca3360d88a6\` FOREIGN KEY (\`questionIdId\`) REFERENCES \`questions\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`answers\` ADD CONSTRAINT \`FK_dbca528826fff776d9f6f14d313\` FOREIGN KEY (\`testcandidateIdId\`) REFERENCES \`testcandidates\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`answers\` ADD CONSTRAINT \`FK_e6803a520e3f9f6ce24819745e5\` FOREIGN KEY (\`questionIdId\`) REFERENCES \`questions\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`answers\` DROP FOREIGN KEY \`FK_e6803a520e3f9f6ce24819745e5\``);
        await queryRunner.query(`ALTER TABLE \`answers\` DROP FOREIGN KEY \`FK_dbca528826fff776d9f6f14d313\``);
        await queryRunner.query(`ALTER TABLE \`testquestions\` DROP FOREIGN KEY \`FK_500cd9ba9bd1ea1eca3360d88a6\``);
        await queryRunner.query(`ALTER TABLE \`testquestions\` DROP FOREIGN KEY \`FK_a410bc9d79143206f2cbc447580\``);
        await queryRunner.query(`ALTER TABLE \`testcandidates\` DROP FOREIGN KEY \`FK_88a8ab81bd78537f33a7958dfcb\``);
        await queryRunner.query(`ALTER TABLE \`testcandidates\` DROP FOREIGN KEY \`FK_0b74490e18fad6fe816a402e1bf\``);
        await queryRunner.query(`ALTER TABLE \`candidates\` DROP FOREIGN KEY \`FK_10d0384a816526f8c7f6b1e67b3\``);
        await queryRunner.query(`DROP INDEX \`REL_e6803a520e3f9f6ce24819745e\` ON \`answers\``);
        await queryRunner.query(`DROP TABLE \`answers\``);
        await queryRunner.query(`DROP TABLE \`testquestions\``);
        await queryRunner.query(`DROP TABLE \`questions\``);
        await queryRunner.query(`DROP TABLE \`tests\``);
        await queryRunner.query(`DROP TABLE \`testcandidates\``);
        await queryRunner.query(`DROP INDEX \`REL_10d0384a816526f8c7f6b1e67b\` ON \`candidates\``);
        await queryRunner.query(`DROP TABLE \`candidates\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
    }

}
