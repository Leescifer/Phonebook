import { mysqlPool } from "../config/mysql.db.ts";
import { type ResultSetHeader, type RowDataPacket } from "mysql2";

export interface CreateUserDto {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

class AuthRepository {
  async findByEmail(email: string) {
    const [rows] = await mysqlPool.query<RowDataPacket[]>(
      "SELECT * FROM users WHERE email = ? LIMIT 1",
      [email],
    );

    return rows[0] ?? null;
  }

  async findById(id: number) {
    const [rows] = await mysqlPool.query<RowDataPacket[]>(
      "SELECT * FROM users WHERE id = ? LIMIT 1",
      [id],
    );

    return rows[0] ?? null;
  }

  async register(user: CreateUserDto) {
    const [result] = await mysqlPool.execute<ResultSetHeader>(
      `
      INSERT INTO users
      (email, password, first_name, last_name, is_approved, status)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        user.email,
        user.password,
        user.first_name,
        user.last_name,
        false,
        "PENDING",
      ],
    );

    return result.insertId;
  }
}

export default new AuthRepository();
