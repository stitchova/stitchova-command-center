import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  CheckCircle2,
  Clock,
  KeyRound,
  LifeBuoy,
  MailCheck,
  Search,
  ShieldAlert,
  Siren,
  User as UserIcon,
  X,
} from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { StatusPill } from "@/components/admin/StatusPill";
import { flaggedIssues, users } from "@/lib/admin-data";
import { designerProfiles } from "@/lib/designer-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "Support Tools · Stitchova Admin" },
      { name: "description", content: "Look up accounts, run quick actions and work through the flagged issue queue." },
      { property: "og:title", content: "Support Tools · Stitchova Admin" },
      { property: "og:description", content: "Look up accounts, run quick actions and work through the flagged issue queue." },
    ],
  }),
  component: SupportPage,
});

type Issue = (typeof flaggedIssues)[number];
const severities = ["all", "high", "medium", "low"] as const;

function SupportPage() {
  const [lookup, setLookup] = useState("");
  const [severity, setSeverity] = useState<(typeof severities)[number]>("all");
  const [issueQuery, setIssueQuery] = useState("");
  const [resolved, setResolved] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(flaggedIssues[0]?.id ?? null);

  const match = lookup.trim()
    ? users.find((u) => `${u.name} ${u.phone} ${u.id}`.toLowerCase().includes(lookup.trim().toLowerCase()))
    : null;

  const rows = useMemo(
    () =>
      flaggedIssues.filter(
        (i) =>
          (severity === "all" || i.severity === severity) &&
          (issueQuery.trim() === "" ||
            `${i.id} ${i.user} ${i.subject}`.toLowerCase().includes(issueQuery.trim().toLowerCase())),
      ),
    [severity, issueQuery],
  );

  const selected = rows.find((i) => i.id === selectedId) ?? null;
  const open = flaggedIssues.length - resolved.length;
  const high = flaggedIssues.filter((i) => i.severity === "high" && !resolved.includes(i.id)).length;

  return (
    <AdminShell title="Support Tools" subtitle="Account lookup and issue triage">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat icon={LifeBuoy} label="Open issues" value={String(open)} />
        <Stat icon={Siren} label="High severity" value={String(high)} tone="danger" />
        <Stat icon={CheckCircle2} label="Resolved today" value={String(resolved.length)} />
        <Stat icon={Clock} label="Avg. first reply" value="42m" />
      </div>

      {/* Account lookup */}
      <section className="solid-card mt-5 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold">Account lookup</h2>
            <p className="text-xs text-muted-foreground">Find an account, then run a quick action.</p>
          </div>
          <div className="relative min-w-64 flex-1 md:max-w-sm">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" strokeWidth={1.75} />
            <input
              value={lookup}
              onChange={(e) => setLookup(e.target.value)}
              placeholder="Name, phone or user ID"
              aria-label="Look up a user"
              className="h-10 w-full rounded-xl border border-border bg-card pl-9 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/40"
            />
          </div>
        </div>

        {match ? (
          <div className="mt-4 flex flex-wrap items-center gap-4 rounded-xl border border-border p-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-accent/20 text-sm font-semibold text-primary">
              {match.initials}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{match.name}</p>
              <p className="num truncate text-xs text-muted-foreground">
                {match.id} · {match.phone}
              </p>
            </div>
            <div className="flex gap-1.5">
              <StatusPill value={match.plan} />
              <StatusPill value={match.status} />
            </div>
            <div className="ml-auto flex flex-wrap gap-2">
              {designerProfiles[match.id] && (
                <Link
                  to="/designers/$id"
                  params={{ id: match.id }}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                >
                  <UserIcon className="size-4" strokeWidth={1.75} /> Open profile
                </Link>
              )}
              <button
                type="button"
                onClick={() => toast.success(`Password reset link sent to ${match.email}.`)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
              >
                <KeyRound className="size-4" strokeWidth={1.75} /> Reset password
              </button>
              <button
                type="button"
                onClick={() => toast.success(`Approval email resent to ${match.email}.`)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
              >
                <MailCheck className="size-4" strokeWidth={1.75} /> Resend email
              </button>
              <button
                type="button"
                onClick={() => toast.error(`${match.name} suspended. Notification sent.`)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-destructive/30 px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
              >
                <ShieldAlert className="size-4" strokeWidth={1.75} /> Suspend
              </button>
            </div>
          </div>
        ) : (
          <p className="mt-4 rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            {lookup.trim() ? "No account matched that search." : "Search for an account to reveal quick actions."}
          </p>
        )}
      </section>

      {/* Filter bar */}
      <div className="solid-card mt-5 flex flex-wrap items-center gap-3 p-3">
        <div className="flex rounded-xl bg-muted p-1">
          {severities.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSeverity(s)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition-colors",
                severity === s ? "bg-card text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="relative min-w-56 flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" strokeWidth={1.75} />
          <input
            value={issueQuery}
            onChange={(e) => setIssueQuery(e.target.value)}
            placeholder="Search issues"
            aria-label="Search issues"
            className="h-9 w-full rounded-xl border border-border bg-card pl-9 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/40"
          />
        </div>
      </div>

      {/* Queue + detail */}
      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]">
        <div className="solid-card overflow-hidden">
          <div className="max-h-[calc(100vh-24rem)] overflow-auto">
            <table className="w-full border-collapse text-sm">
              <thead className="sticky top-0 z-10 bg-muted text-left">
                <tr className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  <th className="px-5 py-3">ID</th>
                  <th className="px-5 py-3">User</th>
                  <th className="px-5 py-3">Issue</th>
                  <th className="px-5 py-3">Severity</th>
                  <th className="px-5 py-3">Opened</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((i) => (
                  <tr
                    key={i.id}
                    onClick={() => setSelectedId(i.id)}
                    className={cn(
                      "cursor-pointer border-t border-border transition-colors",
                      selectedId === i.id ? "bg-primary/8" : "hover:bg-muted/70",
                    )}
                  >
                    <td className="num px-5 py-3 font-medium">{i.id}</td>
                    <td className="px-5 py-3">{i.user}</td>
                    <td className="px-5 py-3 text-muted-foreground">
                      {i.subject}
                      {resolved.includes(i.id) && (
                        <span className="ml-2 text-xs font-medium text-success">Resolved</span>
                      )}
                    </td>
                    <td className="px-5 py-3"><StatusPill value={i.severity} /></td>
                    <td className="px-5 py-3 whitespace-nowrap text-muted-foreground">{i.opened}</td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-14 text-center text-muted-foreground">
                      No issues match these filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <IssuePanel
          issue={selected}
          resolved={selected ? resolved.includes(selected.id) : false}
          onResolve={(id) => {
            setResolved((prev) => (prev.includes(id) ? prev : [...prev, id]));
            toast.success(`${id} marked resolved. User notified.`);
          }}
          onClose={() => setSelectedId(null)}
        />
      </div>
    </AdminShell>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof LifeBuoy;
  label: string;
  value: string;
  tone?: "danger";
}) {
  return (
    <div className="glass-card flex items-center gap-3 p-4">
      <span
        className={cn(
          "grid size-10 shrink-0 place-items-center rounded-xl",
          tone === "danger" ? "bg-destructive/12 text-destructive" : "bg-accent/20 text-primary",
        )}
      >
        <Icon className="size-5" strokeWidth={1.75} />
      </span>
      <div className="min-w-0">
        <p className="truncate text-[11px] text-muted-foreground">{label}</p>
        <p className="num text-xl font-semibold tracking-tight">{value}</p>
      </div>
    </div>
  );
}

function IssuePanel({
  issue,
  resolved,
  onResolve,
  onClose,
}: {
  issue: Issue | null;
  resolved: boolean;
  onResolve: (id: string) => void;
  onClose: () => void;
}) {
  const [note, setNote] = useState("");

  if (!issue) {
    return (
      <aside className="glass-panel grid min-h-72 place-items-center p-8 text-center">
        <div>
          <p className="text-sm font-medium">No issue selected</p>
          <p className="mt-1 text-sm text-muted-foreground">Pick a row to triage the report.</p>
        </div>
      </aside>
    );
  }

  const user = users.find((u) => u.name === issue.user);

  return (
    <aside className="glass-panel sticky top-24 h-fit max-h-[calc(100vh-8rem)] overflow-auto p-5">
      <div className="flex items-start gap-3">
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-accent/20 text-primary">
          <LifeBuoy className="size-5" strokeWidth={1.75} />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="num truncate text-base font-semibold">{issue.id}</h2>
          <p className="truncate text-xs text-muted-foreground">Opened {issue.opened}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <StatusPill value={issue.severity} />
            {resolved && (
              <span className="inline-flex items-center gap-1 rounded-full bg-success/12 px-2.5 py-0.5 text-[11px] font-medium text-success">
                <CheckCircle2 className="size-3" strokeWidth={2} /> Resolved
              </span>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close detail panel"
          className="grid size-8 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="size-4" strokeWidth={1.75} />
        </button>
      </div>

      <p className="mt-5 rounded-xl border border-border bg-card p-3 text-sm">{issue.subject}</p>

      <dl className="mt-3 space-y-2">
        <PanelRow label="Reported by" value={issue.user} />
        <PanelRow label="Account" value={user?.id ?? "—"} />
        <PanelRow label="Phone" value={user?.phone ?? "—"} />
      </dl>

      <label className="mt-5 block text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        Internal note
      </label>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={3}
        placeholder="Staff-only — never shown to the user"
        className="mt-2 w-full resize-none rounded-xl border border-border bg-card p-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/40"
      />

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={resolved}
          onClick={() => onResolve(issue.id)}
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary px-3 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          <CheckCircle2 className="size-4" strokeWidth={1.75} /> Mark resolved
        </button>
        <button
          type="button"
          onClick={() => toast.success(note.trim() ? "Note saved to the case log." : "Nothing to save yet.")}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
        >
          Save note
        </button>
      </div>
    </aside>
  );
}

function PanelRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-3 py-2.5">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="ml-auto truncate text-sm font-medium">{value}</dd>
    </div>
  );
}
