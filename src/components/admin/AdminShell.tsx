import { Link, useRouter, useRouterState } from "@tanstack/react-router";
import {
  ArrowLeft,
  Bell,
  CalendarDays,
  CreditCard,
  LayoutDashboard,
  LifeBuoy,
  Megaphone,
  Package,
  Scissors,
  Search,
  Settings,
  SlidersHorizontal,
  UserCheck,
  Users,
} from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Overview", icon: LayoutDashboard },
  { to: "/users", label: "Users", icon: Users },
  { to: "/approvals", label: "Approvals", icon: UserCheck },
  { to: "/revenue", label: "Revenue", icon: CreditCard },
  { to: "/orders", label: "Orders", icon: Package },
  { to: "/content", label: "Content", icon: Megaphone },
  { to: "/support", label: "Support", icon: LifeBuoy },
] as const;

export function AdminShell({
  title,
  subtitle,
  actions,
  back,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  back?: boolean;
  children: ReactNode;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const router = useRouter();

  return (
    <div className="admin-canvas min-h-screen">
      <header className="sticky top-0 z-40 px-4 pt-4">
        <div className="glass-bar mx-auto flex max-w-[1500px] items-center gap-3 px-3 py-2.5">
          <Link to="/" className="flex shrink-0 items-center gap-2.5 pr-1 pl-1.5">
            <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Scissors className="size-4.5" strokeWidth={2} />
            </span>
            <span className="hidden leading-tight sm:block">
              <span className="block text-sm font-semibold tracking-tight">Stitchova</span>
              <span className="block text-[11px] text-muted-foreground">Admin Console</span>
            </span>
          </Link>

          <nav className="mx-auto flex min-w-0 items-center gap-1 overflow-x-auto rounded-full bg-panel p-1 text-panel-foreground">
            {nav.map((item) => {
              const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-medium whitespace-nowrap transition-colors",
                    active
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-panel-muted hover:text-panel-foreground",
                  )}
                >
                  <item.icon className="size-3.5" strokeWidth={2} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-1.5">
            <IconButton label="Search"><Search className="size-4.5" strokeWidth={1.75} /></IconButton>
            <IconButton label="Calendar"><CalendarDays className="size-4.5" strokeWidth={1.75} /></IconButton>
            <IconButton label="Settings"><Settings className="size-4.5" strokeWidth={1.75} /></IconButton>
            <IconButton label="Notifications">
              <Bell className="size-4.5" strokeWidth={1.75} />
              <span className="absolute top-2 right-2.5 size-1.5 rounded-full bg-destructive" />
            </IconButton>
            <span className="ml-1 grid size-9 shrink-0 place-items-center rounded-full bg-accent/25 text-xs font-semibold text-primary">
              JA
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1500px] px-4 pt-6 pb-12">
        <div className="mb-5 flex flex-wrap items-start gap-4">
          {back && (
            <button
              type="button"
              onClick={() => router.history.back()}
              aria-label="Go back"
              className="mt-1.5 grid size-10 shrink-0 place-items-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-4.5" strokeWidth={1.75} />
            </button>
          )}
          <div className="min-w-0">
            <h1 className="truncate text-3xl font-semibold tracking-tight">{title}</h1>
            {subtitle && <p className="mt-1 truncate text-sm text-muted-foreground">{subtitle}</p>}
          </div>
          <div className="ml-auto flex items-center gap-2">
            {actions ?? (
              <button
                type="button"
                className="grid size-10 place-items-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
                aria-label="View options"
              >
                <SlidersHorizontal className="size-4.5" strokeWidth={1.75} />
              </button>
            )}
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}

function IconButton({ label, children }: { label: string; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="relative hidden size-9 place-items-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:text-foreground md:grid"
    >
      {children}
    </button>
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
