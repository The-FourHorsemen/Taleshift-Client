import { CredentialsLoginForm } from "@/components/auth/CredentialsLoginForm";

export default function ParentLoginPage() {
  return (
    <CredentialsLoginForm
      title="Parent Log In"
      subtitle="See how your child is progressing."
      loginEndpoint="/api/auth/parent-login"
      redirectTo="/parent"
      forgotPasswordHref="/login/forgot-password"
      signUpHref="/login/sign-up?role=parent"
    />
  );
}
