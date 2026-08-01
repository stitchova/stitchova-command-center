import { createFileRoute } from "@tanstack/react-router";
import { Banknote, CircleDollarSign, Package, TrendingUp, UserPlus, Users, Zap } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AdminShell } from "@/components/admin/AdminShell";
import { StatCard } from "@/components/admin/StatCard";
import { activityFeed, signupSeries, type ActivityKind } from "@/lib/admin-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Overview · Stitchova Admin" },
      { name: "description", content: "Monitor designers, revenue, signups and platform activity across Stitchova." },
      { property: "og:title", content: "Overview · Stitchova Admin" },
      { property: "og:description", content: "Monitor designers, revenue, signups and platform activity across Stitchova." },
    ],
  }),
  component: Overview,
});

const activityIcon: Record<ActivityKind, typeof Users> = {
  signup: UserPlus,
  order: Package,
  payment: Banknote,
  flag: Zap,
};

const activityTone: Record<ActivityKind, string> = {
  signup: "bg-info/12 text-info",
  order: "bg-primary/12 text-primary",
  payment: "bg-success/12 text-success",
  flag: "bg-destructive/12 text-destructive",
};

function Overview() {
  return (
    <AdminShell title="Overview" subtitle="Platform health at a glance · August 2026">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard glass icon={Users} label="Total designers" value="164" delta={{ value: "+16.3%", direction: "up", note: "vs last month" }} />
        <StatCard glass icon={Zap} label="Active this week" value="1,208" delta={{ value: "+8.1%", direction: "up", note: "vs last week" }} />
        <StatCard glass icon={CircleDollarSign} label="Revenue this month" value="₵61,350" delta={{ value: "+16.2%", direction: "up", note: "vs July" }} />
        <StatCard glass icon={UserPlus} label="New signups" value="382" delta={{ value: "-3.4%", direction: "down", note: "vs July" }} />
      </section>

      <section className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="solid-card flex flex-col p-5 xl:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold">Signups over time</h2>
              <p className="text-xs text-muted-foreground">Designers vs clients, last 7 months</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-chart-1" /> Designers
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-chart-3" /> Clients
              </span>
            </div>
          </div>

          <div className="mt-5 min-h-64 w-full flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={signupSeries} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="gDesigners" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gClients" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-3)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="var(--chart-3)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                <Tooltip
                  cursor={{ stroke: "var(--border)" }}
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid var(--border)",
                    background: "var(--card)",
                    fontSize: 12,
                  }}
                />
                <Area type="monotone" dataKey="clients" isAnimationActive={false} stroke="var(--chart-3)" strokeWidth={2} fill="url(#gClients)" />
                <Area type="monotone" dataKey="designers" isAnimationActive={false} stroke="var(--chart-1)" strokeWidth={2} fill="url(#gDesigners)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="solid-card flex flex-col p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Recent activity</h2>
            <TrendingUp className="size-4 text-muted-foreground" strokeWidth={1.75} />
          </div>
          <ul className="mt-4 -mr-1 flex-1 space-y-1 overflow-y-auto pr-1">
            {activityFeed.map((item) => {
              const Icon = activityIcon[item.kind];
              return (
                <li key={item.id} className="flex gap-3 rounded-xl p-2.5 transition-colors hover:bg-muted">
                  <span className={`grid size-8 shrink-0 place-items-center rounded-lg ${activityTone[item.kind]}`}>
                    <Icon className="size-4" strokeWidth={1.75} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{item.title}</p>
                    <p className="truncate text-xs text-muted-foreground">{item.detail}</p>
                  </div>
                  <span className="shrink-0 text-[11px] whitespace-nowrap text-muted-foreground">{item.time}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </AdminShell>
  );
}
