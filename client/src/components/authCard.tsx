import type { AuthForm } from "../types/types";

import { Button } from "../../@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../@/components/ui/card";
import { Input } from "../../@/components/ui/input";
import { Label } from "../../@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "../../@/components/ui/tabs";

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
    <Card className="w-full max-w-md rounded-lg border border-gray-200 bg-white shadow-sm">
      <CardHeader className="space-y-4">
        <CardTitle className="text-center text-2xl font-bold text-black sm:text-3xl">
          Welcome
        </CardTitle>

        <Tabs
          value={authMode}
          onValueChange={(value: string) =>
            setAuthMode(value as "login" | "register")
          }
        >
          <TabsList className="grid w-full grid-cols-2 rounded-md border border-gray-200 bg-gray-50 p-1">
            <TabsTrigger
              value="login"
              className="rounded-sm text-sm font-semibold text-gray-600 data-[state=active]:bg-blue-700 data-[state=active]:text-white"
            >
              Login
            </TabsTrigger>
            <TabsTrigger
              value="register"
              className="rounded-sm text-sm font-semibold text-gray-600 data-[state=active]:bg-blue-700 data-[state=active]:text-white"
            >
              Register
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>

      <CardContent>
        <form onSubmit={onSubmit} className="space-y-5">
          {authMode === "register" && (
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-sm font-semibold text-gray-700"
              >
                Full Name
              </Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={authForm.name}
                onChange={(e) => updateField("name", e.target.value)}
                className="border-gray-200 focus-visible:border-blue-700 focus-visible:ring-2 focus-visible:ring-blue-100"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-semibold text-gray-700"
            >
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={authForm.email}
              onChange={(e) => updateField("email", e.target.value)}
              className="border-gray-200 focus-visible:border-blue-700 focus-visible:ring-2 focus-visible:ring-blue-100"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-sm font-semibold text-gray-700"
            >
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={authForm.password}
              onChange={(e) => updateField("password", e.target.value)}
              className="border-gray-200 focus-visible:border-blue-700 focus-visible:ring-2 focus-visible:ring-blue-100"
            />
          </div>

          <Button
            type="submit"
            className="w-full rounded-md bg-blue-700 font-semibold text-white hover:bg-blue-800"
          >
            {authMode === "login" ? "Sign In" : "Create Account"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
