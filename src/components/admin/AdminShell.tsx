import { Link, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  CreditCard,
  LayoutDashboard,
  LifeBuoy,
  Megaphone,
  Package,
  Scissors,
  Search,
  Settings,
  Users,
} from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Overview", icon: LayoutDashboard },
  { to: "/users", label: "Users", icon: Users },
  { to: "/revenue", label: "Revenue", icon: CreditCard },
  { to: "/orders", label: "Orders", icon: Package },
  { to: "/content", label: "Content Control", icon: Megaphone },
  { to: "/support", label: "Support Tools", icon: LifeBuoy },
] as const;

export function AdminShell({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="admin-canvas min-h-screen">
      <div className="flex min-h-screen">
        {/* Sidebar — solid for legibility */}
        <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
          <div className="flex items-center gap-2.5 px-5 py-5">
            <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Scissors className="size-4.5" strokeWidth={2} />
            </span>
            <div className="leading-tight">
              <p className="text-sm font-semibold tracking-tight">Stitchova</p>
              <p className="text-[11px] text-muted-foreground">Admin Console</p>
            </div>
          </div>

          <nav className="flex-1 space-y-1 px-3 py-2">
            {nav.map((item) => {
              const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
                  )}
                >
                  <item.icon className="size-4.5 shrink-0" strokeWidth={1.75} />
                  {item.label}
                  {active && <span className="ml-auto h-4 w-1 rounded-full bg-primary" />}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-sidebar-border p-3">
            <div className="flex items-center gap-3 rounded-xl px-2 py-2">
              <span className="grid size-9 place-items-center rounded-full bg-accent/20 text-sm font-semibold text-primary">
                JA
              </span>
              <div className="min-w-0 leading-tight">
                <p className="truncate text-sm font-medium">John Amissah</p>
                <p className="truncate text-[11px] text-muted-foreground">Founder · Owner</p>
              </div>
              <Settings className="ml-auto size-4 text-muted-foreground" strokeWidth={1.75} />
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          {/* Glass top bar */}
          <header className="glass-nav sticky top-0 z-30">
            <div className="flex items-center gap-4 px-6 py-4">
              <div className="min-w-0">
                <h1 className="truncate text-xl font-semibold tracking-tight">{title}</h1>
                {subtitle && <p className="truncate text-sm text-muted-foreground">{subtitle}</p>}
              </div>

              <div className="ml-auto hidden items-center md:flex">
                <div className="relative">
                  <Search
                    className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                    strokeWidth={1.75}
                  />
                  <input
                    type="search"
                    placeholder="Search users, orders…"
                    aria-label="Global search"
                    className="h-9 w-64 rounded-xl border border-border bg-card pl-9 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/40"
                  />
                </div>
              </div>

              <button
                type="button"
                aria-label="Notifications"
                className="relative grid size-9 shrink-0 place-items-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
              >
                <Bell className="size-4.5" strokeWidth={1.75} />
                <span className="absolute top-2 right-2.5 size-1.5 rounded-full bg-destructive" />
              </button>
              {actions}
            </div>
          </header>

          <main className="flex-1 px-6 pt-6 pb-10">{children}</main>
        </div>
      </div>
    </div>
  );
}

export function PlaceholderSection({ title, description }: { title: string; description: string }) {
  return (
    <div className="solid-card grid min-h-52 place-items-center p-8 text-center">
      <div className="max-w-sm">
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
