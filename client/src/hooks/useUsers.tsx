import { useCallback, useState } from "react";
import { apiRequest } from "../utils/index.ts";
import type { User } from "../types/types.tsx";

export function useUsers(
  token: string | null,
  onError: (message: string) => void,
) {
  const [users, setUsers] = useState<User[]>([]);

  const loadUsers = useCallback(
    async (authToken: string) => {
      try {
        const response = await apiRequest("/api/users", authToken);
        setUsers(response.users ?? []);
      } catch (err) {
        onError(err instanceof Error ? err.message : "Unable to load data");
      }
    },
    [onError],
  );

  const updateUserStatus = useCallback(
    async (userId: string, status: User["status"]) => {
      if (!token) return;
      try {
        const response = await apiRequest(
          `/api/users/${userId}/status`,
          token,
          { status },
          "POST",
        );
        setUsers((current) =>
          current.map((user) => (user.id === userId ? response.user : user)),
        );
      } catch (err) {
        onError(err instanceof Error ? err.message : "Unable to update user");
      }
    },
    [token, onError],
  );

  const clearUsers = useCallback(() => setUsers([]), []);

  return { users, loadUsers, updateUserStatus, clearUsers };
}
