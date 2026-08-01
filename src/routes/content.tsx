import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
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
  { id: "free", name: "Free", price: "0", features: "3 active orders, basic measurements" },
  { id: "pro", name: "Pro", price: "180", features: "Unlimited orders, invoices, workshop chat" },
  { id: "atelier", name: "Atelier", price: "420", features: "Everything in Pro, team seats, showcase" },
];

const featured = [
  { name: "Ama Serwaa", on: true },
  { name: "Kwabena Mensah", on: true },
  { name: "Kojo Baidoo", on: false },
];

function ContentPage() {
  const [published, setPublished] = useState(false);
  const [flags, setFlags] = useState(featured.map((f) => f.on));

  return (
    <AdminShell title="Content Control" subtitle="Pricing, announcements and featured designers">
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <section className="solid-card p-5">
          <h2 className="text-sm font-semibold">Pricing tiers</h2>
          <p className="text-xs text-muted-foreground">Changes sync to the mobile app paywall.</p>
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
          <button type="button" className="mt-4 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
            Save pricing
          </button>
        </section>

        <div className="space-y-5">
          <section className="solid-card p-5">
            <h2 className="text-sm font-semibold">Announcement banner</h2>
            <p className="text-xs text-muted-foreground">Pushes live to the Stitchova mobile app.</p>
            <textarea
              rows={4}
              placeholder="Write the banner message…"
              aria-label="Announcement message"
              className="mt-4 w-full resize-none rounded-xl border border-border bg-card p-3 text-sm outline-none focus:ring-2 focus:ring-ring/40"
            />
            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm font-medium">{published ? "Published" : "Draft"}</span>
              <button
                type="button"
                role="switch"
                aria-checked={published}
                aria-label="Publish announcement"
                onClick={() => setPublished((v) => !v)}
                className={cn(
                  "relative h-6 w-11 rounded-full transition-colors",
                  published ? "bg-primary" : "bg-muted ring-1 ring-border ring-inset",
                )}
              >
                <span
                  className={cn(
                    "absolute top-0.5 size-5 rounded-full bg-card shadow-sm transition-all",
                    published ? "left-5.5" : "left-0.5",
                  )}
                />
              </button>
            </div>
          </section>

          <section className="solid-card p-5">
            <h2 className="text-sm font-semibold">Featured designers</h2>
            <ul className="mt-3 space-y-2">
              {featured.map((f, i) => (
                <li key={f.name} className="flex items-center justify-between rounded-xl border border-border px-3 py-2.5">
                  <span className="text-sm font-medium">{f.name}</span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={flags[i]}
                    aria-label={`Feature ${f.name}`}
                    onClick={() => setFlags((prev) => prev.map((v, idx) => (idx === i ? !v : v)))}
                    className={cn(
                      "relative h-6 w-11 rounded-full transition-colors",
                      flags[i] ? "bg-primary" : "bg-muted ring-1 ring-border ring-inset",
                    )}
                  >
                    <span
                      className={cn(
                        "absolute top-0.5 size-5 rounded-full bg-card shadow-sm transition-all",
                        flags[i] ? "left-5.5" : "left-0.5",
                      )}
                    />
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </AdminShell>
  );
}
