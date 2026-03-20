import { SignUp } from "@clerk/nextjs";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Sign Up – RNDR" };

export default function SignUpPage() {
  return <SignUp />;
}
