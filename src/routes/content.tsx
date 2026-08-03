import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Megaphone, Sparkles, Tags, Users as UsersIcon } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/content")({
  head: () => ({
    meta: [
      { title: "Content Control · Stitchova Admin" },
      { name: "description", content: "Edit pricing tiers, publish in-app announcements and feature designers." },
      { property: "og:title", content: "Content Control · Stitchova Admin" },
      { property: "og:description", content: "Edit pricing tiers, publish in-app announcements and feature designers." },
    ],
  }),
  component: ContentPage,
});

const tiers = [
  { id: "free", name: "Free", price: "0", features: "3 active orders, basic measurements", subs: 412 },
  { id: "pro", name: "Pro", price: "180", features: "Unlimited orders, invoices, workshop chat", subs: 186 },
  { id: "atelier", name: "Atelier", price: "420", features: "Everything in Pro, team seats, showcase", subs: 41 },
];

const featured = [
  { name: "Ama Serwaa", location: "Osu, Accra", on: true },
  { name: "Kwabena Mensah", location: "Kumasi", on: true },
  { name: "Kojo Baidoo", location: "Cape Coast", on: false },
];

function ContentPage() {
  const [published, setPublished] = useState(false);
  const [message, setMessage] = useState("");
  const [flags, setFlags] = useState(featured.map((f) => f.on));

  return (
    <AdminShell title="Content Control" subtitle="Pricing, announcements and featured designers">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat icon={Tags} label="Active tiers" value={String(tiers.length)} />
        <Stat icon={UsersIcon} label="Paid subscribers" value="227" />
        <Stat icon={Sparkles} label="Featured designers" value={String(flags.filter(Boolean).length)} />
        <Stat icon={Megaphone} label="Banner" value={published ? "Live" : "Draft"} />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <section className="solid-card p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold">Pricing tiers</h2>
              <p className="text-xs text-muted-foreground">Changes sync to the mobile app paywall.</p>
            </div>
            <button
              type="button"
              onClick={() => toast.success("Pricing saved. Paywall updated in the mobile app.")}
              className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Save pricing
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {tiers.map((t) => (
              <div key={t.id} className="rounded-xl border border-border p-4">
                <div className="flex flex-wrap items-center gap-3">
                  <input
                    defaultValue={t.name}
                    aria-label={`${t.name} tier name`}
                    className="h-9 w-32 rounded-lg border border-border bg-card px-3 text-sm font-medium outline-none focus:ring-2 focus:ring-ring/40"
                  />
                  <div className="flex h-9 items-center rounded-lg border border-border bg-card px-3">
                    <span className="text-sm text-muted-foreground">₵</span>
                    <input
                      defaultValue={t.price}
                      aria-label={`${t.name} monthly price`}
                      className="num h-full w-16 bg-transparent px-1 text-sm outline-none"
                    />
                    <span className="text-xs text-muted-foreground">/mo</span>
                  </div>
                  <span className="num ml-auto rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                    {t.subs} subscribers
                  </span>
                </div>
                <textarea
                  defaultValue={t.features}
                  aria-label={`${t.name} features`}
                  rows={2}
                  className="mt-3 w-full resize-none rounded-lg border border-border bg-card p-3 text-sm outline-none focus:ring-2 focus:ring-ring/40"
                />
              </div>
            ))}
          </div>
        </section>

        <div className="space-y-5">
          <section className="solid-card p-5">
            <h2 className="text-sm font-semibold">Announcement banner</h2>
            <p className="text-xs text-muted-foreground">Pushes live to the Stitchova mobile app.</p>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write the banner message…"
              aria-label="Announcement message"
              className="mt-4 w-full resize-none rounded-xl border border-border bg-card p-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/40"
            />
            {message.trim() && (
              <div className="mt-3 rounded-xl bg-primary/8 p-3">
                <p className="text-[11px] font-semibold tracking-wide text-primary uppercase">Preview</p>
                <p className="mt-1 text-sm">{message}</p>
              </div>
            )}
            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm font-medium">{published ? "Published" : "Draft"}</span>
              <Toggle
                on={published}
                label="Publish announcement"
                onToggle={() => {
                  setPublished((v) => {
                    toast.success(v ? "Banner unpublished." : "Banner published to the mobile app.");
                    return !v;
                  });
                }}
              />
            </div>
          </section>

          <section className="solid-card p-5">
            <h2 className="text-sm font-semibold">Featured designers</h2>
            <p className="text-xs text-muted-foreground">Shown on the mobile app discover tab.</p>
            <ul className="mt-3 space-y-2">
              {featured.map((f, i) => (
                <li key={f.name} className="flex items-center gap-3 rounded-xl border border-border px-3 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{f.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{f.location}</p>
                  </div>
                  <Toggle
                    className="ml-auto"
                    on={Boolean(flags[i])}
                    label={`Feature ${f.name}`}
                    onToggle={() => {
                      setFlags((prev) => prev.map((v, idx) => (idx === i ? !v : v)));
                      toast.success(flags[i] ? `${f.name} removed from featured.` : `${f.name} is now featured.`);
                    }}
                  />
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </AdminShell>
  );
}

function Toggle({
  on,
  label,
  onToggle,
  className,
}: {
  on: boolean;
  label: string;
  onToggle: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onToggle}
      className={cn(
        "relative h-6 w-11 shrink-0 rounded-full transition-colors",
        on ? "bg-primary" : "bg-muted ring-1 ring-border ring-inset",
        className,
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 size-5 rounded-full bg-card shadow-sm transition-all",
          on ? "left-5.5" : "left-0.5",
        )}
      />
    </button>
  );
}

function Stat({ icon: Icon, label, value }: { icon: typeof Tags; label: string; value: string }) {
  return (
    <div className="glass-card flex items-center gap-3 p-4">
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent/20 text-primary">
        <Icon className="size-5" strokeWidth={1.75} />
      </span>
      <div className="min-w-0">
        <p className="truncate text-[11px] text-muted-foreground">{label}</p>
        <p className="num text-xl font-semibold tracking-tight">{value}</p>
      </div>
    </div>
  );
}
