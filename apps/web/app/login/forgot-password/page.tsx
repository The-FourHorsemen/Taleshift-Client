/**
 * Owner: unassigned.
 * TODO: wire this to a real password-reset email flow instead of
 * just toggling a "sent" confirmation state.
 */
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
