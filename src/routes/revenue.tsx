import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AlertTriangle, CircleDollarSign, Clock, PieChart, Search, Users } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AdminShell } from "@/components/admin/AdminShell";
import { StatCard } from "@/components/admin/StatCard";
import { StatusPill } from "@/components/admin/StatusPill";
import { revenueSeries } from "@/lib/admin-data";
import { cedis, splitTransactions } from "@/lib/designer-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/revenue")({
  head: () => ({
    meta: [
      { title: "Revenue · Stitchova Admin" },
      { name: "description", content: "Track split payments, designer shares and platform commission across Paystack subaccounts." },
      { property: "og:title", content: "Revenue · Stitchova Admin" },
      { property: "og:description", content: "Track split payments, designer shares and platform commission across Paystack subaccounts." },
    ],
  }),
  component: RevenuePage,
});

function RevenuePage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [onlyUnconnected, setOnlyUnconnected] = useState(false);

  const rows = useMemo(
    () =>
      splitTransactions.filter(
        (t) =>
          (status === "all" || t.status === status) &&
          (!onlyUnconnected || t.paystack === "not_connected") &&
          (query.trim() === "" || `${t.designer} ${t.client} ${t.id}`.toLowerCase().includes(query.trim().toLowerCase())),
      ),
    [query, status, onlyUnconnected],
  );

  const commissionThisMonth = splitTransactions
    .filter((t) => t.date.includes("Aug 2026") || t.date.includes("Jul 2026"))
    .reduce((sum, t) => sum + t.commission, 0);
  const unconnected = new Set(splitTransactions.filter((t) => t.paystack === "not_connected").map((t) => t.designerId)).size;

  return (
    <AdminShell title="Revenue" subtitle="Split payments via Paystack subaccounts · August 2026">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard glass icon={CircleDollarSign} label="Total processed" value="₵271,350" delta={{ value: "+16.2%", direction: "up", note: "vs last month" }} />
        <StatCard glass icon={PieChart} label="Total platform commission (this month)" value={cedis(commissionThisMonth)} delta={{ value: "+12.8%", direction: "up", note: "vs July" }} />
        <StatCard glass icon={Users} label="Active paying subscribers" value="248" delta={{ value: "+11", direction: "up", note: "this month" }} />
        <StatCard glass icon={Clock} label="Outstanding payments" value="₵4,120" delta={{ value: "+2 overdue", direction: "down" }} />
      </section>

      {unconnected > 0 && (
        <div className="mt-5 flex flex-wrap items-center gap-3 rounded-2xl border border-warning/40 bg-warning/12 px-4 py-3">
          <AlertTriangle className="size-4.5 shrink-0 text-warning" strokeWidth={2} />
          <p className="text-sm text-warning-foreground">
            <span className="font-semibold">{unconnected} designers</span> have not connected a Paystack subaccount — their payouts are held.
          </p>
          <button
            type="button"
            onClick={() => setOnlyUnconnected(true)}
            className="ml-auto rounded-lg border border-warning/50 px-3 py-1.5 text-sm font-medium text-warning-foreground transition-colors hover:bg-warning/20"
          >
            Show affected transactions
          </button>
        </div>
      )}

      <section className="solid-card mt-5 p-5">
        <h2 className="text-sm font-semibold">Revenue over time</h2>
        <p className="text-xs text-muted-foreground">Monthly recurring revenue, last 7 months</p>
        <div className="mt-5 h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueSeries} margin={{ top: 4, right: 8, left: -8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
              <Tooltip
                cursor={{ fill: "var(--muted)" }}
                contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--card)", fontSize: 12 }}
              />
              <Bar dataKey="revenue" isAnimationActive={false} fill="var(--chart-1)" radius={[8, 8, 0, 0]} maxBarSize={44} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Filter bar */}
      <div className="solid-card mt-5 flex flex-wrap items-center gap-3 p-3">
        <div className="relative min-w-56 flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" strokeWidth={1.75} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search designer, client or reference"
            aria-label="Search transactions"
            className="h-9 w-full rounded-xl border border-border bg-card pl-9 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/40"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          aria-label="Filter by payment status"
          className="h-9 rounded-xl border border-border bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring/40"
        >
          <option value="all">All statuses</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>
        <button
          type="button"
          onClick={() => setOnlyUnconnected((v) => !v)}
          className={cn(
            "h-9 rounded-xl border px-3 text-sm font-medium transition-colors",
            onlyUnconnected
              ? "border-warning/50 bg-warning/15 text-warning-foreground"
              : "border-border bg-card text-muted-foreground hover:text-foreground",
          )}
        >
          Paystack not connected
        </button>
      </div>

      <section className="solid-card mt-5 overflow-hidden">
        <div className="border-b border-border px-5 py-4">
          <h2 className="text-sm font-semibold">Split transactions</h2>
          <p className="text-xs text-muted-foreground">Total charged, designer share and platform commission per payment</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-muted text-left">
              <tr className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                <th className="px-5 py-3">Reference</th>
                <th className="px-5 py-3">Designer</th>
                <th className="px-5 py-3">Client</th>
                <th className="px-5 py-3">Total</th>
                <th className="px-5 py-3">Designer share</th>
                <th className="px-5 py-3">Commission</th>
                <th className="px-5 py-3">Payout account</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((t) => (
                <tr key={t.id} className="border-t border-border hover:bg-muted/70">
                  <td className="num px-5 py-3 font-medium whitespace-nowrap">{t.id}</td>
                  <td className="px-5 py-3 whitespace-nowrap">
                    <Link to="/designers/$id" params={{ id: t.designerId }} className="font-medium hover:text-primary hover:underline">
                      {t.designer}
                    </Link>
                    <span className="num block text-[11px] text-muted-foreground">{t.date}</span>
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap text-muted-foreground">{t.client}</td>
                  <td className="num px-5 py-3 font-medium whitespace-nowrap">{cedis(t.amount)}</td>
                  <td className="num px-5 py-3 whitespace-nowrap text-muted-foreground">{cedis(t.designerShare)}</td>
                  <td className="num px-5 py-3 font-medium whitespace-nowrap text-primary">{cedis(t.commission)}</td>
                  <td className="px-5 py-3"><StatusPill value={t.paystack} /></td>
                  <td className="px-5 py-3"><StatusPill value={t.status} /></td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-14 text-center text-muted-foreground">No transactions match these filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </AdminShell>
  );
}
