import { AuthCard } from "@/components/authCard.tsx";
import type { AuthForm } from "@/types/types.tsx";

type LoginPageProps = {
  authMode: "login" | "register";
  setAuthMode: (mode: "login" | "register") => void;
  authForm: AuthForm;
  updateField: (field: keyof AuthForm, value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  error: string;
};

export function LoginPage({
  authMode,
  setAuthMode,
  authForm,
  updateField,
  onSubmit,
  error,
}: LoginPageProps) {
  return (
    <div className="app-shell">
      <section className="hero-card">
        <div>
          <p className="eyebrow">Phonebook management system</p>
          <h1>Secure contact sharing for modern teams</h1>
          <p className="hero-copy">
            Build a connected address book with authentication, role-based
            controls, and instant contact sharing.
          </p>
        </div>
        <AuthCard
          authMode={authMode}
          setAuthMode={setAuthMode}
          authForm={authForm}
          updateField={updateField}
          onSubmit={onSubmit}
        />
      </section>
      {error ? <p className="error-banner">{error}</p> : null}
    </div>
  );
}
