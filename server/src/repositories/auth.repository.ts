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
      `SELECT u.*, r.role_name FROM users u LEFT JOIN roles r ON u.role_id = r.id WHERE u.email = ? LIMIT 1`,
      [email],
    );

    return rows[0] ?? null;
  }

  async findById(id: number) {
    const [rows] = await mysqlPool.query<RowDataPacket[]>(
      `SELECT u.*, r.role_name FROM users u LEFT JOIN roles r ON u.role_id = r.id WHERE u.id = ? LIMIT 1`,
      [id],
    );

    return rows[0] ?? null;
  }

  async register(user: CreateUserDto) {
    const [result] = await mysqlPool.execute<ResultSetHeader>(
      `
      INSERT INTO users
      (email, password, first_name, last_name, is_approved, status, role_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        user.email,
        user.password,
        user.first_name,
        user.last_name,
        false,
        "ACTIVE",
        3,
      ],
    );

    return result.insertId;
  }

  async updatePassword(id: number, password: string) {
    await mysqlPool.execute("UPDATE users SET password = ? WHERE id = ?", [
      password,
      id,
    ]);
  }
}

export default new AuthRepository();
