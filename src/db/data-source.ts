import * as dotenv from "dotenv";
import "reflect-metadata";
import { DataSource } from "typeorm";
import { UserSubscriber } from "../subscribers";

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
  entities: [__dirname + "/../**/*.entity.{js,ts}"],
  migrations: ["src/migrations/*.ts"],
  subscribers: ["src/subscribers/**/*{.ts,.js}"],
});

const userSubscriber = new UserSubscriber();

AppDataSource.subscribers.push(userSubscriber);

export const initializeDatabase = async function () {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log("Database connection initialized");
    }
  } catch (error) {
    console.log(error);
  }
};
