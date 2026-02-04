import { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Login | TestPrep",
  description: "Sign in to your TestPrep account",
};

export default function LoginPage() {
  return <LoginForm />;
}
