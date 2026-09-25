/**
 * Owner: unassigned.
 * TODO: wire this form to actually create a linked learner account
 * via @taleshift/db.
 */
import { ParentPageShell } from "@/components/layout/parent/ParentPageShell";
import { AddChildForm } from "@/components/parent/AddChildForm";

export default function AddChildPage() {
  return (
    <ParentPageShell active="None">
      <h1 className="font-display text-[32px] font-bold text-text-primary">Add Another Child</h1>
      <p className="text-text-secondary">Link another learner to your family account.</p>
      <AddChildForm />
    </ParentPageShell>
  );
}
