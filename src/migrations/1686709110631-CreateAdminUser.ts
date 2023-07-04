import { MigrationInterface, QueryRunner } from "typeorm";
import { User } from "../entities";
import { UserType } from "../const";
import { utils } from "../utils";

export class CreateAdminUser1686709110631 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const adminUser = new User();
    adminUser.email = "admin@gmail.com";
    adminUser.password = await utils.hashPassword("admin");
    adminUser.user_type = UserType.ADMIN;

    await queryRunner.query(
      `
        INSERT INTO users (email, password, user_type)
        VALUES (?, ?, ?)
      `,
      [adminUser.email, adminUser.password, adminUser.user_type]
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.delete(User, { email: "admin@gmail.com" });
  }
}
