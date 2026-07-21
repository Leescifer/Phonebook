import { AuthCard } from "@/components/authCard";
import type { AuthForm } from "@/types/types";

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
    <main className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        {/* Left Side - Hidden on smaller screens */}
        <section className="hidden lg:flex items-center px-8 py-12 xl:px-16">
          <div className="mx-auto max-w-xl space-y-8">
            <span className="inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
              Phonebook Management System
            </span>

            <h1 className="text-4xl font-bold leading-tight tracking-tight text-slate-900 xl:text-5xl">
              Secure contact sharing for modern teams
            </h1>

            <p className="text-lg leading-8 text-slate-600">
              Build a connected address book with authentication, role-based
              permissions, and instant contact sharing from anywhere.
            </p>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border bg-white p-4 shadow-sm">
                <h3 className="font-semibold text-slate-900">Secure</h3>
                <p className="mt-2 text-sm text-slate-500">
                  Keep your contacts protected.
                </p>
              </div>

              <div className="rounded-xl border bg-white p-4 shadow-sm">
                <h3 className="font-semibold text-slate-900">Fast</h3>
                <p className="mt-2 text-sm text-slate-500">
                  Search and manage instantly.
                </p>
              </div>

              <div className="rounded-xl border bg-white p-4 shadow-sm">
                <h3 className="font-semibold text-slate-900">Teams</h3>
                <p className="mt-2 text-sm text-slate-500">
                  Share contacts easily.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Right Side - Login Form */}
        <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8 lg:border-l">
          <div className="w-full max-w-md">
            <AuthCard
              authMode={authMode}
              setAuthMode={setAuthMode}
              authForm={authForm}
              updateField={updateField}
              onSubmit={onSubmit}
            />

            {error && (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
