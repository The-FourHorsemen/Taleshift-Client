/**
 * Owner: unassigned.
 * TODO: wire these fields to the parent's real account/family
 * settings instead of the static defaults below.
 */
import { ParentPageShell } from "@/components/layout/parent/ParentPageShell";

export default function ParentSettingsPage() {
  return (
    <ParentPageShell active="Settings">
      <h1 className="font-display text-[32px] font-bold text-text-primary">Settings</h1>
      <p className="text-text-secondary">Manage your family account and preferences.</p>

      <div className="mt-6 flex max-w-2xl flex-col gap-6">
        <section className="rounded-xl border border-border-light bg-surface p-6 shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
          <h2 className="mb-4 font-display text-lg font-bold text-text-primary">Account</h2>
          <div className="flex flex-col gap-4">
            <label className="flex flex-col gap-1 text-sm font-semibold text-text-secondary">
              Full Name
              <input
                defaultValue="Jordan Johnson"
                className="rounded-lg border border-border-default px-3 py-2 text-sm font-normal text-text-primary"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm font-semibold text-text-secondary">
              Email
              <input
                defaultValue="jordan@family.com"
                className="rounded-lg border border-border-default px-3 py-2 text-sm font-normal text-text-primary"
              />
            </label>
          </div>
        </section>

        <section className="rounded-xl border border-border-light bg-surface p-6 shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
          <h2 className="mb-4 font-display text-lg font-bold text-text-primary">Notifications</h2>
          <div className="flex flex-col gap-3 text-sm text-text-primary">
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="accent-brand-600" />
              Weekly progress summary email
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="accent-brand-600" />
              Alert me when my child needs support
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="accent-brand-600" />
              Daily reading reminders
            </label>
          </div>
        </section>

        <section className="rounded-xl border border-border-light bg-surface p-6 shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
          <h2 className="mb-4 font-display text-lg font-bold text-text-primary">Children</h2>
          <div className="flex items-center justify-between rounded-lg border border-border-light p-3">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-full bg-indigo-100 text-lg">🐨</div>
              <div>
                <p className="text-sm font-bold text-text-primary">Alex Johnson</p>
                <p className="text-xs text-text-secondary">Grade 3 • Level M</p>
              </div>
            </div>
            <button className="rounded-full border border-border-default px-3 py-1 text-xs font-semibold text-text-secondary">
              Manage
            </button>
          </div>
        </section>

        <button className="w-fit rounded-full bg-brand-600 px-6 py-2.5 text-sm font-bold text-white">Save Changes</button>
      </div>
    </ParentPageShell>
  );
}
