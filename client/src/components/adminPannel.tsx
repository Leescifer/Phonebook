import type { User } from "@/types/types.tsx";

type AdminPanelProps = {
  users: User[];
  onStatusChange: (userId: string, status: User["status"]) => void;
};

export function AdminPanel({ users, onStatusChange }: AdminPanelProps) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold text-black">
          Admin user approvals
        </h3>
      </div>

      <div className="flex flex-col gap-3">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex flex-col gap-3 rounded-lg border border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <strong className="font-semibold text-black">{user.name}</strong>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                  user.status === "approved"
                    ? "border-blue-700 bg-blue-50 text-blue-700"
                    : "border-gray-200 bg-white text-gray-600"
                }`}
              >
                {user.status}
              </span>
              <button
                className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
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
