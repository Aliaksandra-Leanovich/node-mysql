import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1686004502211 implements MigrationInterface {
    name = 'Init1686004502211'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`user_type\` enum ('admin', 'candidate') NOT NULL DEFAULT 'candidate', UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`candidates\` (\`id\` int NOT NULL AUTO_INCREMENT, \`level\` enum ('junior', 'middle', 'senior') NOT NULL, \`userId\` int NULL, UNIQUE INDEX \`REL_10d0384a816526f8c7f6b1e67b\` (\`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`candidates\` ADD CONSTRAINT \`FK_10d0384a816526f8c7f6b1e67b3\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`candidates\` DROP FOREIGN KEY \`FK_10d0384a816526f8c7f6b1e67b3\``);
        await queryRunner.query(`DROP INDEX \`REL_10d0384a816526f8c7f6b1e67b\` ON \`candidates\``);
        await queryRunner.query(`DROP TABLE \`candidates\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
    }

}
