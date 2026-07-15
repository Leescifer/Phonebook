import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const mysqlConfig: mysql.PoolOptions = {
  host: process.env.MYSQL_HOST!,
  user: process.env.MYSQL_USER!,
  password: process.env.MYSQL_PASSWORD!,
  database: process.env.MYSQL_DATABASE!,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

if (process.env.MYSQL_PORT) {
  mysqlConfig.port = Number(process.env.MYSQL_PORT);
}

export const mysqlPool = mysql.createPool(mysqlConfig);

export const initDB = async (): Promise<void> => {
  try {
    const connection = await mysqlPool.getConnection();

    await connection.ping();

    console.log("Connected to MySQL database");

    connection.release();
  } catch (error) {
    console.error("Failed to connect to MySQL:", error);
    throw error;
  }
};
