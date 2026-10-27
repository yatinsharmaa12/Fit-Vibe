import { RegisterForm } from "@/components/auth/register/register-form";
import { AuthShell } from "@/components/auth/auth-shell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FitVibe | Register",
  description: "Create your FitVibe account and start tracking your workouts.",
};

export default function RegisterPage() {
  return <AuthShell registering><RegisterForm /></AuthShell>;
}
