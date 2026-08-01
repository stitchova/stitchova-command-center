import { createFileRoute } from "@tanstack/react-router";
import { CircleDollarSign, Clock, Users } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AdminShell } from "@/components/admin/AdminShell";
import { StatCard } from "@/components/admin/StatCard";
import { StatusPill } from "@/components/admin/StatusPill";
import { revenueSeries, transactions } from "@/lib/admin-data";

export const Route = createFileRoute("/revenue")({
  head: () => ({
    meta: [
      { title: "Revenue · Stitchova Admin" },
      { name: "description", content: "Track subscription revenue, paying subscribers and outstanding payments." },
      { property: "og:title", content: "Revenue · Stitchova Admin" },
      { property: "og:description", content: "Track subscription revenue, paying subscribers and outstanding payments." },
    ],
  }),
  component: RevenuePage,
});

function RevenuePage() {
  return (
    <AdminShell title="Revenue" subtitle="Subscriptions and transaction history">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={CircleDollarSign} label="Total revenue" value="₵271,350" delta={{ value: "+16.2%", direction: "up", note: "vs last month" }} />
        <StatCard icon={Users} label="Active paying subscribers" value="248" delta={{ value: "+11", direction: "up", note: "this month" }} />
        <StatCard icon={Clock} label="Outstanding payments" value="₵4,120" delta={{ value: "+2 overdue", direction: "down" }} />
      </section>

      <section className="mt-5 solid-card p-5">
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
              <Bar dataKey="revenue" fill="var(--chart-1)" radius={[8, 8, 0, 0]} maxBarSize={44} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="mt-5 solid-card overflow-hidden">
        <div className="border-b border-border px-5 py-4">
          <h2 className="text-sm font-semibold">Transactions</h2>
        </div>
        <table className="w-full border-collapse text-sm">
          <thead className="bg-muted text-left">
            <tr className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              <th className="px-5 py-3">Reference</th>
              <th className="px-5 py-3">User</th>
              <th className="px-5 py-3">Amount</th>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id} className="border-t border-border hover:bg-muted/70">
                <td className="num px-5 py-3 font-medium">{t.id}</td>
                <td className="px-5 py-3">{t.user}</td>
                <td className="num px-5 py-3 font-medium">₵{t.amount.toLocaleString()}</td>
                <td className="px-5 py-3 text-muted-foreground">{t.date}</td>
                <td className="px-5 py-3"><StatusPill value={t.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </AdminShell>
  );
}
