import { mysqlPool } from "../config/mysql.db.ts";

export const fetchUsers = async () => {
  const [rows] = await mysqlPool.query("SELECT * FROM users");
  return rows;
};

export const fetchUser = async (id: number) => {
  const [rows] = await mysqlPool.query("SELECT * FROM users WHERE id = ?", [
    id,
  ]);
  return rows;
};
