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

  // AWS S3
  AWS_ACCESS_KEY: get("AWS_ACCESS_KEY").required().asString(),
  AWS_SECRET_KEY: get("AWS_SECRET_KEY").required().asString(),
  AWS_REGION: get("AWS_REGION").required().asString(),
  AWS_BUCKET_NAME: get("AWS_BUCKET_NAME").required().asString(),
};
