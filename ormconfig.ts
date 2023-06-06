import { DataSource } from "typeorm";

export const connectionSource = new DataSource({
  migrationsTableName: "migrations",
  type: "mysql",
  host: "localhost",
  port: 3307,
  username: "test",
  password: "testpass",
  database: "testdb",
  logging: false,
  synchronize: false,
  name: "default",
  entities: ["src/entities/*.ts"],
  migrations: ["src/migrations/*.ts"],
  subscribers: ["src/subscriber/**/*{.ts,.js}"],
});
