import { LoginForm } from "@/components/auth/login/login-form";
import { AuthShell } from "@/components/auth/auth-shell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FitVibe | Login",
  description: "Sign in to FitVibe and continue your fitness journey.",
};

export default function LoginPage() {
  return <AuthShell><LoginForm /></AuthShell>;
}
