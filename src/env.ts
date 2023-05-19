// SERVER
export const SERVER_PORT = process.env["SERVER_PORT"] || "3000";

// DB
export const DB_HOST = process.env["DB_HOST"] || "DB_HOST";
export const DB_PORT = Number(process.env["DB_PORT"]) || 5432;
export const DB_USERNAME = process.env["DB_USERNAME"] || "DB_USERNAME";
export const DB_PASSWORD = process.env["DB_PASSWORD"] || "DB_PASSWORD";
export const DB_DATABASE = process.env["DB_DATABASE"] || "DB_DATABASE";
export const DB_TYPEORM_ENTITIES = process.env["DB_TYPEORM_ENTITIES"] || "src/entity/*.ts";

// REDIS
export const REDIS_HOST = process.env["REDIS_HOST"] || "REDIS_HOST";
export const REDIS_PORT = Number(process.env["REDIS_PORT"]) || 6379;
export const REDIS_DB = Number(process.env["REDIS_DB"]) || 0;

// S3
export const S3_REGION = process.env["S3_REGION"] || "ap-northeast-1";
export const S3_BUCKET = process.env["S3_BUCKET"] || "S3_BUCKET";
export const S3_ENDPOINT = process.env["S3_ENDPOINT"]; // ローカルモック用