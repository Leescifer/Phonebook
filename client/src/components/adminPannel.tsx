import type { User } from "@/types/types.tsx";

type AdminPanelProps = {
  users: User[];
  onStatusChange: (userId: string, status: User["status"]) => void;
};

export function AdminPanel({ users, onStatusChange }: AdminPanelProps) {
  return (
    <section className="card admin-panel">
      <div className="section-heading">
        <h3>Admin user approvals</h3>
      </div>
      <div className="user-list">
        {users.map((user) => (
          <div key={user.id} className="user-row">
            <div>
              <strong>{user.name}</strong>
              <p>{user.email}</p>
            </div>
            <div className="user-actions">
              <span className={`status-pill ${user.status}`}>
                {user.status}
              </span>
              <button
                className="secondary-btn"
                onClick={() =>
                  onStatusChange(
                    user.id,
                    user.status === "approved" ? "pending" : "approved",
                  )
                }
              >
                {user.status === "approved" ? "Pending" : "Approve"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
