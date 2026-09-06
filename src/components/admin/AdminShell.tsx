import { Link, useNavigate, useRouter, useRouterState } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowLeft,
  Banknote,
  Bell,
  CalendarDays,
  CheckCheck,
  CreditCard,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Megaphone,
  Package,
  RefreshCw,
  Scissors,
  Search,
  Settings,
  SlidersHorizontal,
  UserCheck,
  UserRound,
  Users,
} from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { platformOrders } from "@/lib/admin-data";
import { pendingDesigners } from "@/lib/designer-data";
import { useAdminData } from "@/lib/admin-store";
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
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifSeen, setNotifSeen] = useState(false);

  const { users, decisions, profiles } = useAdminData();

  const pendingCount = pendingDesigners.filter((d) => !decisions[d.id]).length;
  const stuckOrders = useMemo(() => platformOrders.filter((o) => o.stuckDays >= 3), []);
  const unconnected = users.filter(
    (u) => u.role === "designer" && profiles[u.id]?.paystack === "not_connected",
  );
  const notifCount = pendingCount + stuckOrders.length + unconnected.length;

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
            <IconButton label="Search" onClick={() => setSearchOpen(true)}>
              <Search className="size-4.5" strokeWidth={1.75} />
            </IconButton>

            <Popover>
              <PopoverTrigger asChild>
                <span>
                  <IconButton label="Calendar">
                    <CalendarDays className="size-4.5" strokeWidth={1.75} />
                  </IconButton>
                </span>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-72">
                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  Today · 06 Sep 2026
                </p>
                <ul className="mt-3 space-y-2.5 text-sm">
                  <CalRow label="Orders in progress" value={String(platformOrders.filter((o) => o.stage !== "completed").length)} />
                  <CalRow label="Completed this week" value={String(platformOrders.filter((o) => o.stage === "completed").length)} />
                  <CalRow label="New signups" value={String(users.filter((u) => u.lastActive === "Just now").length || 3)} />
                  <CalRow label="Awaiting review" value={String(pendingCount)} tone={pendingCount > 0 ? "warn" : undefined} />
                </ul>
                <Link
                  to="/orders"
                  className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Open today's orders
                </Link>
              </PopoverContent>
            </Popover>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <span>
                  <IconButton label="Settings">
                    <Settings className="size-4.5" strokeWidth={1.75} />
                  </IconButton>
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60">
                <DropdownMenuLabel>Administration</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/content" className="cursor-pointer">
                    <CreditCard className="size-4" /> Pricing tiers
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/content" className="cursor-pointer">
                    <Megaphone className="size-4" /> Announcement banner
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/support" className="cursor-pointer">
                    <LifeBuoy className="size-4" /> Support tools
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => toast.success("Console preferences saved.", { description: "Density, timezone and notification defaults applied." })}
                  className="cursor-pointer"
                >
                  <CheckCheck className="size-4" /> Save console preferences
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Popover onOpenChange={(open) => open && setNotifSeen(true)}>
              <PopoverTrigger asChild>
                <span>
                  <IconButton label="Notifications">
                    <Bell className="size-4.5" strokeWidth={1.75} />
                    {!notifSeen && notifCount > 0 && (
                      <span className="absolute top-2 right-2.5 size-1.5 rounded-full bg-destructive" />
                    )}
                  </IconButton>
                </span>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-80">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">Notifications</p>
                  <span className="rounded-full bg-primary/12 px-2 py-0.5 text-[11px] font-medium text-primary">
                    {notifCount} open
                  </span>
                </div>
                <ul className="mt-3 space-y-1">
                  <NotifRow
                    to="/approvals"
                    icon={<UserCheck className="size-4" strokeWidth={1.75} />}
                    tone="bg-warning/18 text-warning-foreground"
                    title={`${pendingCount} designer${pendingCount === 1 ? "" : "s"} awaiting review`}
                    body="New applications need an approve / reject decision."
                  />
                  <NotifRow
                    to="/orders"
                    icon={<AlertTriangle className="size-4" strokeWidth={1.75} />}
                    tone="bg-destructive/12 text-destructive"
                    title={`${stuckOrders.length} stuck order${stuckOrders.length === 1 ? "" : "s"}`}
                    body="No progress update in 3+ days."
                  />
                  <NotifRow
                    to="/revenue"
                    icon={<Banknote className="size-4" strokeWidth={1.75} />}
                    tone="bg-info/12 text-info"
                    title={`${unconnected.length} payout account${unconnected.length === 1 ? "" : "s"} not connected`}
                    body="Designers missing a Paystack subaccount can't be paid."
                  />
                </ul>
              </PopoverContent>
            </Popover>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label="Account menu"
                  className="ml-1 grid size-9 shrink-0 cursor-pointer place-items-center rounded-full bg-accent/25 text-xs font-semibold text-primary transition-colors hover:bg-accent/40"
                >
                  JA
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60">
                <DropdownMenuLabel>
                  <span className="block text-sm">Joseph Asante</span>
                  <span className="block text-xs font-normal text-muted-foreground">Super Admin · joseph@stitchova.com</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => toast.success("Admin profile opened.", { description: "Profile editing is handled by the platform team." })}
                >
                  <UserRound className="size-4" /> My admin profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer text-destructive focus:text-destructive"
                  onClick={() => toast.success("Signed out.", { description: "Demo session — sign-in is not enforced in this prototype." })}
                >
                  <LogOut className="size-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
                onClick={() => {
                  router.invalidate();
                  toast.success("View refreshed.", { description: "Latest platform data loaded." });
                }}
                className="grid size-10 cursor-pointer place-items-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Refresh view"
              >
                <RefreshCw className="size-4.5" strokeWidth={1.75} />
              </button>
            )}
          </div>
        </div>
        {children}
      </main>

      <GlobalSearch open={searchOpen} onOpenChange={setSearchOpen} />
    </div>
  );
}

function CalRow({ label, value, tone }: { label: string; value: string; tone?: "warn" }) {
  return (
    <li className="flex items-center justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn("font-semibold tabular-nums", tone === "warn" && "text-warning-foreground")}>{value}</span>
    </li>
  );
}

function NotifRow({
  to,
  icon,
  tone,
  title,
  body,
}: {
  to: string;
  icon: ReactNode;
  tone: string;
  title: string;
  body: string;
}) {
  return (
    <li>
      <Link to={to} className="flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-muted">
        <span className={cn("mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg", tone)}>{icon}</span>
        <span className="min-w-0">
          <span className="block text-[13px] font-medium">{title}</span>
          <span className="block text-xs text-muted-foreground">{body}</span>
        </span>
      </Link>
    </li>
  );
}

function GlobalSearch({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { users, profiles } = useAdminData();
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users.slice(0, 6);
    return users
      .filter((u) =>
        [u.name, u.email, u.phone, u.role, u.plan].some((f) => f.toLowerCase().includes(q)),
      )
      .slice(0, 8);
  }, [users, query]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="top-[18%] max-w-lg translate-y-0 p-0" aria-describedby={undefined}>
        <DialogTitle className="sr-only">Search the platform</DialogTitle>
        <div className="flex items-center gap-2.5 border-b border-border px-4">
          <Search className="size-4 shrink-0 text-muted-foreground" strokeWidth={1.75} />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search users by name, email, phone, role or plan…"
            aria-label="Search users"
            className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <ul className="max-h-72 overflow-auto p-2">
          {results.length === 0 && (
            <li className="px-3 py-8 text-center text-sm text-muted-foreground">
              No users match “{query}”.
            </li>
          )}
          {results.map((u) => (
            <li key={u.id}>
              <button
                type="button"
                onClick={() => {
                  onOpenChange(false);
                  setQuery("");
                  if (profiles[u.id]) {
                    void navigate({ to: "/designers/$id", params: { id: u.id } });
                  } else {
                    void navigate({ to: "/users" });
                    toast.info(`${u.name} — ${u.role}`, { description: "Non-designer accounts open in the Users list." });
                  }
                }}
                className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-muted"
              >
                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary/12 text-xs font-semibold text-primary">
                  {u.initials}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{u.name}</span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {u.role} · {u.email}
                  </span>
                </span>
                <span className="shrink-0 text-xs text-muted-foreground capitalize">{u.plan}</span>
              </button>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick?: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="relative hidden size-9 cursor-pointer place-items-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:text-foreground md:grid"
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
