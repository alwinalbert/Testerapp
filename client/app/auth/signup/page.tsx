import { Metadata } from "next";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = {
  title: "Sign Up | TestPrep",
  description: "Create a new TestPrep account",
};

export default function SignupPage() {
  return <SignupForm />;
}
