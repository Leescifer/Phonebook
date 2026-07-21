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
    <Card className="w-full max-w-md border-0 shadow-xl">
      <CardHeader className="space-y-4">
        <CardTitle className="text-center text-3xl font-bold">
          Welcome
        </CardTitle>

        <Tabs
          value={authMode}
          onValueChange={(value: string) =>
            setAuthMode(value as "login" | "register")
          }
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>

      <CardContent>
        <form onSubmit={onSubmit} className="space-y-5">
          {authMode === "register" && (
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={authForm.name}
                onChange={(e) => updateField("name", e.target.value)}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={authForm.email}
              onChange={(e) => updateField("email", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={authForm.password}
              onChange={(e) => updateField("password", e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full">
            {authMode === "login" ? "Sign In" : "Create Account"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
