import { useState } from "react";
import { emptyAuthForm } from "../types/types.tsx";
import type { AuthForm } from "../types/types.tsx";

type AuthResult = { success: boolean; message?: string };

type AuthActions = {
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (payload: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
  }) => Promise<AuthResult>;
};

export function useAuthForm(
  { login, register }: AuthActions,
  onError: (message: string) => void,
) {
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authForm, setAuthForm] = useState<AuthForm>(emptyAuthForm);

  const updateField = (field: keyof AuthForm, value: string) => {
    setAuthForm((current) => ({ ...current, [field]: value }));
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onError("");

    try {
      if (authMode === "login") {
        const res = await login(authForm.email, authForm.password);
        if (!res.success) throw new Error(res.message || "Login failed");
        setAuthForm(emptyAuthForm);
      } else {
        const res = await register({
          email: authForm.email,
          password: authForm.password,
          first_name: authForm.name.split(" ")[0] ?? "",
          last_name: authForm.name.split(" ").slice(1).join(" ") ?? "",
        });
        if (!res.success) throw new Error(res.message || "Registration failed");
        setAuthMode("login");
        setAuthForm(emptyAuthForm);
      }
    } catch (err) {
      onError(err instanceof Error ? err.message : "Authentication failed");
    }
  };

  return { authMode, setAuthMode, authForm, updateField, submit };
}
