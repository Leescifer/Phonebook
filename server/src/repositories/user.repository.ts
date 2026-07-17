import { mysqlPool } from "../config/mysql.db.ts";
import { type RowDataPacket } from "mysql2";

class UserRepository {
  async fetchUser(id: number) {
    const [rows] = await mysqlPool.query<RowDataPacket[]>(
      `SELECT u.*, r.role_name FROM users u LEFT JOIN roles r ON u.role_id = r.id WHERE u.id = ?`,
      [id],
    );
    return rows;
  }

  async fetchUserEmail(email: string) {
    const [rows] = await mysqlPool.query<RowDataPacket[]>(
      `SELECT u.*, r.role_name FROM users u LEFT JOIN roles r ON u.role_id = r.id WHERE u.email = ?`,
      [email],
    );
    return rows;
  }

  async fetchUsers() {
    const [rows] = await mysqlPool.query<RowDataPacket[]>(
      `SELECT u.*, r.role_name FROM users u LEFT JOIN roles r ON u.role_id = r.id ORDER BY u.created_at DESC`,
    );
    return rows;
  }

  async createUser(user: any) {
    await mysqlPool.execute(
      `
      INSERT INTO users (email, password, first_name, last_name, is_approved, status, role_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
      [
        user.email,
        user.password,
        user.first_name,
        user.last_name,
        user.is_approved,
        user.status,
        user.role_id ?? 3,
      ],
    );
  }

  async approve(id: number) {
    await mysqlPool.execute(
      "UPDATE users SET is_approved = TRUE WHERE id = ?",
      [id],
    );
  }

  async deactivate(id: number) {
    await mysqlPool.execute(
      "UPDATE users SET status = 'INACTIVE' WHERE id = ?",
      [id],
    );
  }

  async updateUser(id: number, updates: Record<string, any>) {
    const entries = Object.entries(updates).filter(
      ([, value]) => value !== undefined,
    );
    if (entries.length === 0) {
      return;
    }

    const setClause = entries.map(([key]) => `${key} = ?`).join(", ");
    const values = entries.map(([, value]) => value);

    await mysqlPool.execute(`UPDATE users SET ${setClause} WHERE id = ?`, [
      ...values,
      id,
    ]);
  }

  async deleteUser(id: number) {
    await mysqlPool.execute("DELETE FROM users WHERE id = ?", [id]);
  }
}

export default new UserRepository();
