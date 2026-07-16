import { mysqlPool } from "../config/mysql.db.ts";

class UserRepository {
  async fetchUser(id: number) {
    const [rows] = await mysqlPool.query("SELECT * FROM users WHERE id = ?", [
      id,
    ]);
    return rows;
  }

  async fetchUserEmail(email: string) {
    const [rows] = await mysqlPool.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
    );
    return rows;
  }

  async fetchUsers() {
    const [rows] = await mysqlPool.query("SELECT * FROM users");
    return rows;
  }

  async createUser(user: any) {
    await mysqlPool.execute(
      `
      INSERT INTO users (email, password, first_name, last_name, is_approved, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
      [
        user.email,
        user.password,
        user.first_name,
        user.last_name,
        user.is_approved,
        user.status,
      ],
    );
  }

  async approve(id: number) {
    await mysqlPool.execute("UPDATE users SET is_approved=TRUE WHERE id = ?", [
      [id],
    ]);
  }

  async deactivate(id: number) {
    await mysqlPool.execute("UPDATE users SET status='INACTIVE' WHERE id = ?", [
      [id],
    ]);
  }
}

export default new UserRepository();
