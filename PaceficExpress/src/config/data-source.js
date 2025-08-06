import "reflect-metadata";
import { DataSource } from "typeorm";
import { env } from "./envs.js";
import User from "../models/user.entity.js";
import Package from "../models/package.entity.js";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  synchronize: true,
  logging: false,
  ssl: { rejectUnauthorized: false },
  entities: [User, Package],
});
