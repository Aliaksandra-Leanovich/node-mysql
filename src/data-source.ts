import "reflect-metadata";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "127.0.0.1",
  port: 3307,
  username: "test",
  password: "testpass",
  database: "testdb",
  synchronize: true,
  logging: false,
  migrations: [],
  migrationsTableName: "migrations",
  subscribers: [],
});
