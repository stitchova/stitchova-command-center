import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import {
  users as seedUsers,
  flaggedIssues,
  type AdminUser,
  type Plan,
  type UserStatus,
} from "@/lib/admin-data";
import {
  designerProfiles as seedProfiles,
  pendingDesigners,
  type ApprovalStatus,
  type DesignerProfile,
  type PendingDesigner,
} from "@/lib/designer-data";

export interface PricingTier {
  id: string;
  name: string;
  price: string;
  features: string;
  subs: number;
}

const seedTiers: PricingTier[] = [
  { id: "free", name: "Free", price: "0", features: "3 active orders, basic measurements", subs: 412 },
  { id: "pro", name: "Pro", price: "180", features: "Unlimited orders, invoices, workshop chat", subs: 186 },
  { id: "atelier", name: "Atelier", price: "420", features: "Everything in Pro, team seats, showcase", subs: 41 },
];

export interface SupportIssue {
  id: string;
  user: string;
  subject: string;
  severity: "high" | "medium" | "low";
  opened: string;
}

const seedIssues: SupportIssue[] = flaggedIssues.map((i) => ({
  ...i,
  severity: i.severity as SupportIssue["severity"],
}));

export interface ApprovalDecision {
  status: ApprovalStatus;
  reason?: string | undefined;
  decidedAt: string;
}

interface AdminStore {
  users: AdminUser[];
  profiles: Record<string, DesignerProfile>;
  decisions: Record<string, ApprovalDecision>;
  tiers: PricingTier[];
  setUserStatus: (id: string, status: UserStatus) => void;
  toggleUserSuspension: (id: string) => UserStatus;
  setDesignerPlan: (id: string, plan: Plan) => void;
  setDesignerNotes: (id: string, notes: string) => void;
  decideApplication: (applicant: PendingDesigner, status: ApprovalStatus, reason?: string) => void;
  saveTiers: (next: PricingTier[]) => void;
}

const AdminDataContext = createContext<AdminStore | null>(null);

const today = "06 Sep 2026";

export function AdminDataProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<AdminUser[]>(seedUsers);
  const [profiles, setProfiles] = useState<Record<string, DesignerProfile>>(seedProfiles);
  const [decisions, setDecisions] = useState<Record<string, ApprovalDecision>>({});
  const [tiers, setTiers] = useState<PricingTier[]>(seedTiers);

  const setUserStatus = useCallback((id: string, status: UserStatus) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status } : u)));
    setProfiles((prev) => (prev[id] ? { ...prev, [id]: { ...prev[id]!, status } } : prev));
  }, []);

  const toggleUserSuspension = useCallback((id: string): UserStatus => {
    let next: UserStatus = "active";
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== id) return u;
        next = u.status === "suspended" ? "active" : "suspended";
        return { ...u, status: next };
      }),
    );
    setProfiles((prev) => {
      const p = prev[id];
      if (!p) return prev;
      const status = p.status === "suspended" ? "active" : "suspended";
      next = status;
      return { ...prev, [id]: { ...p, status } };
    });
    return next;
  }, []);

  const setDesignerPlan = useCallback((id: string, plan: Plan) => {
    setProfiles((prev) => (prev[id] ? { ...prev, [id]: { ...prev[id]!, plan } } : prev));
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, plan } : u)));
  }, []);

  const setDesignerNotes = useCallback((id: string, notes: string) => {
    setProfiles((prev) => (prev[id] ? { ...prev, [id]: { ...prev[id]!, notes } } : prev));
  }, []);

  const decideApplication = useCallback(
    (applicant: PendingDesigner, status: ApprovalStatus, reason?: string) => {
      const decision: ApprovalDecision = reason?.trim()
        ? { status, reason: reason.trim(), decidedAt: today }
        : { status, decidedAt: today };
      setDecisions((prev) => ({ ...prev, [applicant.id]: decision }));

      if (status !== "approved") return;

      setUsers((prev) => {
        if (prev.some((u) => u.id === applicant.id)) return prev;
        const newUser: AdminUser = {
          id: applicant.id,
          name: applicant.name,
          initials: applicant.initials,
          phone: applicant.phone,
          email: applicant.email,
          role: "designer",
          plan: "free",
          status: "active",
          lastActive: "Just now",
          signupDate: today,
          location: applicant.location,
          ordersCount: 0,
          lifetimeValue: 0,
          measurements: [],
          orders: [],
          payments: [],
        };
        return [newUser, ...prev];
      });

      setProfiles((prev) => {
        if (prev[applicant.id]) return prev;
        const profile: DesignerProfile = {
          id: applicant.id,
          name: applicant.name,
          initials: applicant.initials,
          phone: applicant.phone,
          email: applicant.email,
          location: applicant.location,
          status: "active",
          signupDate: today,
          lastActive: "Just now",
          yearsActive: applicant.yearsActive,
          clothingType: applicant.clothingType,
          plan: "free",
          planStart: today,
          nextBilling: "—",
          subscriptionPayments: [],
          paystack: "not_connected",
          revenueLifetime: 0,
          revenueThisMonth: 0,
          commissionEarned: 0,
          clientTransactions: [],
          clients: [],
          orders: [],
          workers: [],
          notes: `${today} — Approved from the application queue.`,
        };
        return { ...prev, [applicant.id]: profile };
      });
    },
    [],
  );

  const saveTiers = useCallback((next: PricingTier[]) => setTiers(next), []);

  const value = useMemo(
    () => ({
      users,
      profiles,
      decisions,
      tiers,
      setUserStatus,
      toggleUserSuspension,
      setDesignerPlan,
      setDesignerNotes,
      decideApplication,
      saveTiers,
    }),
    [users, profiles, decisions, tiers, setUserStatus, toggleUserSuspension, setDesignerPlan, setDesignerNotes, decideApplication, saveTiers],
  );

  return <AdminDataContext.Provider value={value}>{children}</AdminDataContext.Provider>;
}

export function useAdminData(): AdminStore {
  const ctx = useContext(AdminDataContext);
  if (!ctx) throw new Error("useAdminData must be used inside AdminDataProvider");
  return ctx;
}

export { pendingDesigners };
