/**
 * Owner: unassigned.
 * TODO: wire this to real account creation instead of navigating
 * straight to the dashboard on submit.
 */
import { Suspense } from "react";
import { SignUpForm } from "@/components/auth/SignUpForm";

export default function SignUpPage() {
  return (
    <Suspense fallback={null}>
      <SignUpForm />
    </Suspense>
  );
}
