import type { AuthForm } from "../types/types.tsx";

type AuthCardProps = {
  authMode: "login" | "register";
  setAuthMode: (mode: "login" | "register") => void;
  authForm: AuthForm;
  updateField: (field: keyof AuthForm, value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export function AuthCard({
  authMode,
  setAuthMode,
  authForm,
  updateField,
  onSubmit,
}: AuthCardProps) {
  return (
    <form className="card auth-card" onSubmit={onSubmit}>
      <div className="tabs">
        <button
          type="button"
          className={authMode === "login" ? "active" : ""}
          onClick={() => setAuthMode("login")}
        >
          Login
        </button>
        <button
          type="button"
          className={authMode === "register" ? "active" : ""}
          onClick={() => setAuthMode("register")}
        >
          Register
        </button>
      </div>
      {authMode === "register" ? (
        <input
          value={authForm.name}
          onChange={(event) => updateField("name", event.target.value)}
          placeholder="Full name"
        />
      ) : null}
      <input
        value={authForm.email}
        onChange={(event) => updateField("email", event.target.value)}
        placeholder="Email address"
      />
      <input
        type="password"
        value={authForm.password}
        onChange={(event) => updateField("password", event.target.value)}
        placeholder="Password"
      />
      <button type="submit" className="primary-btn">
        {authMode === "login" ? "Sign in" : "Create account"}
      </button>
    </form>
  );
}
