import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { KeyRound, Search, ShieldAlert } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { StatusPill } from "@/components/admin/StatusPill";
import { flaggedIssues, users } from "@/lib/admin-data";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "Support Tools · Stitchova Admin" },
      { name: "description", content: "Look up accounts, run quick actions and work through flagged issues." },
      { property: "og:title", content: "Support Tools · Stitchova Admin" },
      { property: "og:description", content: "Look up accounts, run quick actions and work through flagged issues." },
    ],
  }),
  component: SupportPage,
});

function SupportPage() {
  const [query, setQuery] = useState("");
  const match = query.trim()
    ? users.find((u) => `${u.name} ${u.phone} ${u.id}`.toLowerCase().includes(query.trim().toLowerCase()))
    : null;

  return (
    <AdminShell title="Support Tools" subtitle="Account lookup and issue triage">
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
        <section className="solid-card p-5">
          <h2 className="text-sm font-semibold">User lookup</h2>
          <div className="relative mt-3">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" strokeWidth={1.75} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Name, phone or user ID"
              aria-label="Look up a user"
              className="h-10 w-full rounded-xl border border-border bg-card pl-9 text-sm outline-none focus:ring-2 focus:ring-ring/40"
            />
          </div>

          {match ? (
            <div className="mt-4 rounded-xl border border-border p-4">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-full bg-accent/20 text-sm font-semibold text-primary">
                  {match.initials}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{match.name}</p>
                  <p className="num truncate text-xs text-muted-foreground">{match.id} · {match.phone}</p>
                </div>
                <div className="ml-auto flex gap-1.5">
                  <StatusPill value={match.plan} />
                  <StatusPill value={match.status} />
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button type="button" className="inline-flex items-center gap-1.5 rounded-xl border border-destructive/30 px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10">
                  <ShieldAlert className="size-4" strokeWidth={1.75} /> Suspend account
                </button>
                <button type="button" className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-sm font-medium hover:bg-muted">
                  <KeyRound className="size-4" strokeWidth={1.75} /> Reset password
                </button>
              </div>
            </div>
          ) : (
            <p className="mt-4 rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              {query.trim() ? "No account matched that search." : "Search for an account to reveal quick actions."}
            </p>
          )}
        </section>

        <section className="solid-card overflow-hidden">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-sm font-semibold">Flagged issues</h2>
          </div>
          <table className="w-full border-collapse text-sm">
            <thead className="bg-muted text-left">
              <tr className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                <th className="px-5 py-3">ID</th>
                <th className="px-5 py-3">User</th>
                <th className="px-5 py-3">Issue</th>
                <th className="px-5 py-3">Severity</th>
                <th className="px-5 py-3">Opened</th>
              </tr>
            </thead>
            <tbody>
              {flaggedIssues.map((i) => (
                <tr key={i.id} className="border-t border-border hover:bg-muted/70">
                  <td className="num px-5 py-3 font-medium">{i.id}</td>
                  <td className="px-5 py-3">{i.user}</td>
                  <td className="px-5 py-3 text-muted-foreground">{i.subject}</td>
                  <td className="px-5 py-3"><StatusPill value={i.severity} /></td>
                  <td className="px-5 py-3 whitespace-nowrap text-muted-foreground">{i.opened}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </AdminShell>
  );
}
