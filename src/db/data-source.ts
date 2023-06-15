import "reflect-metadata";
import { DataSource } from "typeorm";
import { Test, User } from "../entities";
import * as dotenv from "dotenv";
import { UserSubscriber } from "../subscribers/UserSubscriber";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: Boolean(process.env.DB_SYNCHRONIZE),
  logging: process.env.DB_LOGGING as any,
  entities: ["src/entities/*.ts"],
  migrations: ["src/migrations/*.ts"],
  migrationsTableName: "migrations",
  subscribers: [UserSubscriber],
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
