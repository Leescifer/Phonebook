import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const requiredEnv = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable ${name}`);
  }
  return value;
};

export const mysqlPool = mysql.createPool({
  host: requiredEnv("MYSQL_HOST"),
  port: Number(requiredEnv("MYSQL_PORT")),
  user: requiredEnv("MYSQL_USER"),
  password: requiredEnv("MYSQL_PASSWORD"),
  database: requiredEnv("MYSQL_DATABASE"),

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
