import pkg from "env-var";
import "dotenv/config";

const { get } = pkg;

export const env = {
  NODE_ENV: get("NODE_ENV").default("development").asString(),
  PORT: get("PORT").default(3000).asPortNumber(),

  // Configuración DB
  DB_HOST: get("DB_HOST").default("localhost").asString(),
  DB_PORT: get("DB_PORT").default("5432").asPortNumber(),
  DB_USERNAME: get("DB_USERNAME").default("postgres").asString(),
  DB_PASSWORD: get("DB_PASSWORD").default("123456").asString(),
  DB_NAME: get("DB_NAME").default("pacefic").asString(),

  // JWT
  JWT_SECRET: get("JWT_SECRET").required().asString(),
  JWT_EXPIRATION: get("JWT_EXPIRATION").default("1h").asString(),
};
