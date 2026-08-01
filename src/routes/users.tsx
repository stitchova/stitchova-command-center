import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowUpRight, Mail, MapPin, Phone, Ruler, Search, ShieldAlert, X } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { StatusPill } from "@/components/admin/StatusPill";
import { users, type AdminUser, type UserRole } from "@/lib/admin-data";
import { designerProfiles } from "@/lib/designer-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/users")({
  head: () => ({
    meta: [
      { title: "Users · Stitchova Admin" },
      { name: "description", content: "Browse designers, clients and workers with profiles, orders and payment history." },
      { property: "og:title", content: "Users · Stitchova Admin" },
      { property: "og:description", content: "Browse designers, clients and workers with profiles, orders and payment history." },
    ],
  }),
  component: UsersPage,
});

const tabs: { id: UserRole | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "designer", label: "Designers" },
  { id: "client", label: "Clients" },
  { id: "worker", label: "Workers" },
];

function UsersPage() {
  const [tab, setTab] = useState<UserRole | "all">("all");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [plan, setPlan] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(users[0]?.id ?? null);
  const navigate = useNavigate();

  const filtered = useMemo(
    () =>
      users.filter(
        (u) =>
          (tab === "all" || u.role === tab) &&
          (status === "all" || u.status === status) &&
          (plan === "all" || u.plan === plan) &&
          (query.trim() === "" ||
            `${u.name} ${u.phone} ${u.id}`.toLowerCase().includes(query.trim().toLowerCase())),
      ),
    [tab, status, plan, query],
  );

  const selected = filtered.find((u) => u.id === selectedId) ?? null;
  const counts = (id: UserRole | "all") => (id === "all" ? users.length : users.filter((u) => u.role === id).length);

  return (
    <AdminShell
      title="Users"
      subtitle="Designers, clients and workers across the platform"
      actions={
        <Link
          to="/approvals"
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Pending approvals
        </Link>
      }
    >
      {/* Filter bar */}
      <div className="solid-card flex flex-wrap items-center gap-3 p-3">
        <div className="flex rounded-xl bg-muted p-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                tab === t.id ? "bg-card text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t.label}
              <span className="num ml-1.5 text-xs text-muted-foreground">{counts(t.id)}</span>
            </button>
          ))}
        </div>

        <div className="relative min-w-56 flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" strokeWidth={1.75} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, phone or ID"
            aria-label="Search users"
            className="h-9 w-full rounded-xl border border-border bg-card pl-9 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/40"
          />
        </div>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          aria-label="Filter by status"
          className="h-9 rounded-xl border border-border bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring/40"
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="suspended">Suspended</option>
        </select>

        <select
          value={plan}
          onChange={(e) => setPlan(e.target.value)}
          aria-label="Filter by plan"
          className="h-9 rounded-xl border border-border bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring/40"
        >
          <option value="all">All plans</option>
          <option value="free">Free</option>
          <option value="pro">Pro</option>
          <option value="atelier">Atelier</option>
        </select>
      </div>

      {/* Two-column working layout */}
      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]">
        <div className="solid-card overflow-hidden">
          <div className="max-h-[calc(100vh-19rem)] overflow-auto">
            <table className="w-full border-collapse text-sm">
              <thead className="sticky top-0 z-10 bg-muted text-left">
                <tr className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Plan</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Last active</th>
                  <th className="px-4 py-3">Signed up</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => {
                  const hasProfile = Boolean(designerProfiles[u.id]);
                  return (
                    <tr
                      key={u.id}
                      onClick={() => setSelectedId(u.id)}
                      onDoubleClick={() => hasProfile && navigate({ to: "/designers/$id", params: { id: u.id } })}
                      className={cn(
                        "cursor-pointer border-t border-border transition-colors",
                        selectedId === u.id ? "bg-primary/8" : "hover:bg-muted/70",
                      )}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-accent/20 text-xs font-semibold text-primary">
                            {u.initials}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate font-medium">{u.name}</p>
                            <p className="num truncate text-xs text-muted-foreground">{u.id} · {u.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="num px-4 py-3 whitespace-nowrap text-muted-foreground">{u.phone}</td>
                      <td className="px-4 py-3"><StatusPill value={u.plan} /></td>
                      <td className="px-4 py-3"><StatusPill value={u.status} /></td>
                      <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">{u.lastActive}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">{u.signupDate}</td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-14 text-center text-muted-foreground">
                      No users match these filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <DetailPanel user={selected} onClose={() => setSelectedId(null)} />
      </div>
    </AdminShell>
  );
}

function DetailPanel({ user, onClose }: { user: AdminUser | null; onClose: () => void }) {
  if (!user) {
    return (
      <aside className="glass-panel grid min-h-72 place-items-center p-8 text-center">
        <div>
          <p className="text-sm font-medium">No user selected</p>
          <p className="mt-1 text-sm text-muted-foreground">Pick a row to open their support profile.</p>
        </div>
      </aside>
    );
  }

  const hasProfile = Boolean(designerProfiles[user.id]);

  return (
    <aside className="glass-panel sticky top-24 h-fit max-h-[calc(100vh-8rem)] overflow-auto p-5">
      <div className="flex items-start gap-3">
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-accent/20 text-base font-semibold text-primary">
          {user.initials}
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-base font-semibold">{user.name}</h2>
          <p className="num text-xs text-muted-foreground">{user.id}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <StatusPill value={user.role} />
            <StatusPill value={user.plan} />
            <StatusPill value={user.status} />
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

      {hasProfile && (
        <Link
          to="/designers/$id"
          params={{ id: user.id }}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-3 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Open full designer profile
          <ArrowUpRight className="size-4" strokeWidth={2} />
        </Link>
      )}

      <dl className="mt-5 space-y-2 text-sm">
        <Row icon={Phone} value={user.phone} />
        <Row icon={Mail} value={user.email} />
        <Row icon={MapPin} value={user.location} />
      </dl>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <Metric label="Orders" value={String(user.ordersCount)} />
        <Metric label="Lifetime value" value={`₵${user.lifetimeValue.toLocaleString()}`} />
      </div>

      {user.measurements.length > 0 && (
        <Section title="Measurements" icon={Ruler}>
          <div className="grid grid-cols-2 gap-2">
            {user.measurements.map((m) => (
              <div key={m.label} className="rounded-lg bg-muted px-3 py-2">
                <p className="text-[11px] text-muted-foreground">{m.label}</p>
                <p className="num text-sm font-medium">{m.value}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      <Section title="Orders">
        {user.orders.length === 0 ? (
          <p className="text-sm text-muted-foreground">No orders yet.</p>
        ) : (
          <ul className="space-y-2">
            {user.orders.map((o) => (
              <li key={o.id} className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{o.garment}</p>
                  <p className="num text-[11px] text-muted-foreground">{o.id} · due {o.due}</p>
                </div>
                <StatusPill value={o.stage} />
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title="Payments">
        {user.payments.length === 0 ? (
          <p className="text-sm text-muted-foreground">No payments on record.</p>
        ) : (
          <ul className="space-y-2">
            {user.payments.map((p) => (
              <li key={p.id} className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2">
                <div className="min-w-0 flex-1">
                  <p className="num text-sm font-medium">₵{p.amount.toLocaleString()}</p>
                  <p className="num text-[11px] text-muted-foreground">{p.id} · {p.date}</p>
                </div>
                <StatusPill value={p.status} />
              </li>
            ))}
          </ul>
        )}
      </Section>

      <div className="mt-5 flex gap-2">
        <button
          type="button"
          className="flex-1 rounded-xl bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-muted"
        >
          Message user
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-xl border border-destructive/30 px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
        >
          <ShieldAlert className="size-4" strokeWidth={1.75} />
          Suspend
        </button>
      </div>
    </aside>
  );
}

function Row({ icon: Icon, value }: { icon: typeof Phone; value: string }) {
  return (
    <div className="flex items-center gap-2.5 text-muted-foreground">
      <Icon className="size-4 shrink-0" strokeWidth={1.75} />
      <span className="truncate text-foreground">{value}</span>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card px-3 py-2.5">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="num text-lg font-semibold tracking-tight">{value}</p>
    </div>
  );
}

function Section({ title, icon: Icon, children }: { title: string; icon?: typeof Ruler; children: React.ReactNode }) {
  return (
    <div className="mt-5">
      <h3 className="mb-2 flex items-center gap-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        {Icon && <Icon className="size-3.5" strokeWidth={2} />}
        {title}
      </h3>
      {children}
    </div>
  );
}
