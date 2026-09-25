import { CredentialsLoginForm } from "@/components/auth/CredentialsLoginForm";

export default function TeacherLoginPage() {
  return (
    <CredentialsLoginForm
      title="Teacher Log In"
      subtitle="Access your classroom dashboard."
      loginEndpoint="/api/auth/teacher-login"
      redirectTo="/teacher"
      forgotPasswordHref="/login/forgot-password"
      signUpHref="/login/sign-up?role=teacher"
    />
  );
}
