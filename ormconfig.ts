import { DataSource } from "typeorm";
import * as dotenv from "dotenv";

dotenv.config();

export const connectionSource = new DataSource({
  migrationsTableName: "migrations",
  type: "mysql",
  host: "localhost",
  port: Number(process.env.DB_PORT) || 3307,
  username: process.env.DB_USER || "user",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_DATABASE || "db",
  logging: false,
  synchronize: false,
  name: "default",
  entities: ["src/entities/*.ts"],
  migrations: ["src/migrations/*.ts"],
  subscribers: ["src/subscriber/**/*{.ts,.js}"],
});
