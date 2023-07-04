import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities";
import * as dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT) || 3307,
  username: process.env.DB_USER || "user",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_DATABASE || "db",
  synchronize: true,
  logging: false,
  entities: [User],
  migrations: [],
  migrationsTableName: "migrations",
  subscribers: [],
});
