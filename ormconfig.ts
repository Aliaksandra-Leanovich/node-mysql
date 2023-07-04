import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
import { Test, User } from "./src/entities";

dotenv.config();

export const AppDataSource = new DataSource({
  migrationsTableName: "migrations",
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3307,
  username: process.env.DB_USER || "user",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_DATABASE || "db",
  logging: process.env.DB_LOGGING as any,
  synchronize: Boolean(process.env.DB_SYNCHRONIZE),
  name: "default",
  entities: ["src/entities/*.ts"],
  // entities: [User, Test]
  migrations: ["src/migrations/*.ts"],
  subscribers: ["src/subscribers/**/*{.ts,.js}"],
});
