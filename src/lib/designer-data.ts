export type ApprovalStatus = "pending" | "approved" | "rejected";

export interface PortfolioItem {
  id: string;
  label: string;
  hue: number;
}

export interface PendingDesigner {
  id: string;
  name: string;
  initials: string;
  phone: string;
  email: string;
  submitted: string;
  location: string;
  yearsActive: number;
  clothingType: string;
  businessName: string;
  about: string;
  portfolio: PortfolioItem[];
}

export const pendingDesigners: PendingDesigner[] = [
  {
    id: "STV-1102",
    name: "Akosua Danquah",
    initials: "AD",
    phone: "+233 24 551 7702",
    email: "akosua.d@stitchova.app",
    submitted: "29 Jul 2026",
    location: "Adenta, Accra",
    yearsActive: 7,
    clothingType: "Bridal & occasion wear",
    businessName: "Danquah Atelier",
    about: "Runs a 4-machine workshop with two apprentices. Referred by Ama Serwaa.",
    portfolio: [
      { id: "p1", label: "Bridal gown", hue: 145 },
      { id: "p2", label: "Kaba & slit", hue: 55 },
      { id: "p3", label: "Reception dress", hue: 305 },
      { id: "p4", label: "Bridesmaids set", hue: 250 },
    ],
  },
  {
    id: "STV-1103",
    name: "Ibrahim Sulley",
    initials: "IS",
    phone: "+233 20 884 1190",
    email: "ibrahim.s@stitchova.app",
    submitted: "31 Jul 2026",
    location: "Tamale",
    yearsActive: 3,
    clothingType: "Smocks & menswear",
    businessName: "Sulley & Sons Tailoring",
    about: "Family smock business, moving from WhatsApp orders to Stitchova.",
    portfolio: [
      { id: "p1", label: "Fugu smock", hue: 55 },
      { id: "p2", label: "Kaftan set", hue: 145 },
    ],
  },
  {
    id: "STV-1104",
    name: "Priscilla Ofori",
    initials: "PO",
    phone: "+233 55 730 4418",
    email: "priscilla.o@stitchova.app",
    submitted: "01 Aug 2026",
    location: "Spintex, Accra",
    yearsActive: 1,
    clothingType: "Ready-to-wear ankara",
    businessName: "Prissy Threads",
    about: "New business, no workshop address submitted yet — needs follow-up call.",
    portfolio: [],
  },
];

/* ------------------------------------------------------------------ */

export type ConnectionStatus = "connected" | "not_connected";

export interface DesignerProfile {
  id: string;
  name: string;
  initials: string;
  phone: string;
  email: string;
  location: string;
  status: "active" | "pending" | "rejected" | "suspended" | "inactive";
  signupDate: string;
  lastActive: string;
  yearsActive: number;
  clothingType: string;
  plan: "free" | "pro" | "atelier";
  planStart: string;
  nextBilling: string;
  subscriptionPayments: { id: string; date: string; amount: number; status: "paid" | "pending" | "failed" | "refunded" }[];
  paystack: ConnectionStatus;
  revenueLifetime: number;
  revenueThisMonth: number;
  commissionEarned: number;
  clientTransactions: { id: string; date: string; client: string; amount: number; designerShare: number; commission: number; status: "paid" | "pending" | "failed" | "refunded" }[];
  clients: { id: string; name: string; orders: number; lastOrder: string }[];
  orders: { id: string; client: string; garment: string; stage: "cutting" | "sewing" | "fitting" | "completed"; due: string; daysSinceUpdate: number }[];
  workers: { id: string; name: string; role: string; status: "active" | "inactive" }[];
  notes: string;
}

export const designerProfiles: Record<string, DesignerProfile> = {
  "STV-1041": {
    id: "STV-1041",
    name: "Ama Serwaa",
    initials: "AS",
    phone: "+233 24 118 4420",
    email: "ama.serwaa@stitchova.app",
    location: "Osu, Accra",
    status: "active",
    signupDate: "14 Jan 2026",
    lastActive: "12 min ago",
    yearsActive: 11,
    clothingType: "Bridal & occasion wear",
    plan: "atelier",
    planStart: "14 Jan 2026",
    nextBilling: "01 Sep 2026",
    subscriptionPayments: [
      { id: "PAY-3391", date: "01 Aug 2026", amount: 420, status: "paid" },
      { id: "PAY-3288", date: "01 Jul 2026", amount: 420, status: "paid" },
      { id: "PAY-3190", date: "01 Jun 2026", amount: 420, status: "paid" },
      { id: "PAY-3088", date: "01 May 2026", amount: 420, status: "paid" },
    ],
    paystack: "connected",
    revenueLifetime: 184200,
    revenueThisMonth: 22480,
    commissionEarned: 9210,
    clientTransactions: [
      { id: "TRX-99401", date: "01 Aug 2026", client: "Adwoa Pokuaa", amount: 3200, designerShare: 3040, commission: 160, status: "paid" },
      { id: "TRX-99388", date: "30 Jul 2026", client: "Efua Boateng", amount: 1800, designerShare: 1710, commission: 90, status: "paid" },
      { id: "TRX-99362", date: "27 Jul 2026", client: "Kofi Danso", amount: 5400, designerShare: 5130, commission: 270, status: "paid" },
      { id: "TRX-99340", date: "24 Jul 2026", client: "Selorm Dzide", amount: 2100, designerShare: 1995, commission: 105, status: "pending" },
    ],
    clients: [
      { id: "CL-201", name: "Adwoa Pokuaa", orders: 9, lastOrder: "01 Aug 2026" },
      { id: "CL-208", name: "Efua Boateng", orders: 4, lastOrder: "30 Jul 2026" },
      { id: "CL-214", name: "Kofi Danso", orders: 6, lastOrder: "27 Jul 2026" },
      { id: "CL-231", name: "Selorm Dzide", orders: 2, lastOrder: "24 Jul 2026" },
    ],
    orders: [
      { id: "ORD-8841", client: "Adwoa Pokuaa", garment: "Kaba & Slit", stage: "sewing", due: "12 Aug 2026", daysSinceUpdate: 2 },
      { id: "ORD-8802", client: "Efua Boateng", garment: "Bridal Gown", stage: "fitting", due: "18 Aug 2026", daysSinceUpdate: 1 },
      { id: "ORD-8649", client: "Kofi Danso", garment: "Groom Agbada", stage: "cutting", due: "09 Aug 2026", daysSinceUpdate: 17 },
      { id: "ORD-8760", client: "Kofi Danso", garment: "Agbada Set", stage: "completed", due: "02 Aug 2026", daysSinceUpdate: 0 },
    ],
    workers: [
      { id: "WK-11", name: "Yaw Antwi", role: "Cutter", status: "inactive" },
      { id: "WK-14", name: "Abena Frimpong", role: "Machinist", status: "active" },
      { id: "WK-19", name: "Kwesi Baah", role: "Finisher", status: "active" },
    ],
    notes: "02 Aug — Called about Atelier renewal, happy. Wants bulk order tooling next quarter.",
  },
  "STV-1042": {
    id: "STV-1042",
    name: "Kwabena Mensah",
    initials: "KM",
    phone: "+233 20 774 3319",
    email: "kwabena.m@stitchova.app",
    location: "Kumasi",
    status: "active",
    signupDate: "02 Feb 2026",
    lastActive: "1 hr ago",
    yearsActive: 6,
    clothingType: "Tailored menswear",
    plan: "pro",
    planStart: "02 Feb 2026",
    nextBilling: "01 Sep 2026",
    subscriptionPayments: [
      { id: "PAY-3372", date: "01 Aug 2026", amount: 180, status: "paid" },
      { id: "PAY-3271", date: "01 Jul 2026", amount: 180, status: "pending" },
      { id: "PAY-3166", date: "01 Jun 2026", amount: 180, status: "paid" },
    ],
    paystack: "not_connected",
    revenueLifetime: 62400,
    revenueThisMonth: 7800,
    commissionEarned: 3120,
    clientTransactions: [
      { id: "TRX-99377", date: "29 Jul 2026", client: "Michael Osei", amount: 4200, designerShare: 3990, commission: 210, status: "paid" },
      { id: "TRX-99310", date: "21 Jul 2026", client: "Nii Armah", amount: 1600, designerShare: 1520, commission: 80, status: "failed" },
    ],
    clients: [
      { id: "CL-244", name: "Michael Osei", orders: 5, lastOrder: "29 Jul 2026" },
      { id: "CL-251", name: "Nii Armah", orders: 2, lastOrder: "21 Jul 2026" },
    ],
    orders: [
      { id: "ORD-8830", client: "Michael Osei", garment: "Three-piece Suit", stage: "cutting", due: "22 Aug 2026", daysSinceUpdate: 3 },
      { id: "ORD-8791", client: "Nii Armah", garment: "Kente Blazer", stage: "sewing", due: "15 Aug 2026", daysSinceUpdate: 21 },
    ],
    workers: [{ id: "WK-22", name: "Sena Agbo", role: "Machinist", status: "active" }],
    notes: "18 Jul — Payout blocked: Paystack subaccount never completed. Follow up weekly.",
  },
  "STV-1045": {
    id: "STV-1045",
    name: "Nana Adjoa Owusu",
    initials: "NO",
    phone: "+233 24 990 5512",
    email: "nana.owusu@stitchova.app",
    location: "East Legon, Accra",
    status: "suspended",
    signupDate: "11 Apr 2026",
    lastActive: "3 days ago",
    yearsActive: 4,
    clothingType: "Ankara ready-to-wear",
    plan: "pro",
    planStart: "11 Apr 2026",
    nextBilling: "—",
    subscriptionPayments: [
      { id: "PAY-3210", date: "01 Jul 2026", amount: 180, status: "failed" },
      { id: "PAY-3101", date: "01 Jun 2026", amount: 180, status: "paid" },
    ],
    paystack: "connected",
    revenueLifetime: 28600,
    revenueThisMonth: 0,
    commissionEarned: 1430,
    clientTransactions: [
      { id: "TRX-99204", date: "12 Jul 2026", client: "Linda Asare", amount: 2400, designerShare: 2280, commission: 120, status: "refunded" },
    ],
    clients: [{ id: "CL-262", name: "Linda Asare", orders: 3, lastOrder: "12 Jul 2026" }],
    orders: [
      { id: "ORD-8688", client: "Linda Asare", garment: "Ankara Two-piece", stage: "sewing", due: "05 Aug 2026", daysSinceUpdate: 26 },
    ],
    workers: [],
    notes: "24 Jul — Suspended after 3 failed renewals and an unresolved refund dispute.",
  },
  "STV-1048": {
    id: "STV-1048",
    name: "Kojo Baidoo",
    initials: "KB",
    phone: "+233 23 810 2277",
    email: "kojo.baidoo@stitchova.app",
    location: "Cape Coast",
    status: "active",
    signupDate: "21 Jun 2026",
    lastActive: "Yesterday",
    yearsActive: 2,
    clothingType: "Smocks & casual wear",
    plan: "free",
    planStart: "21 Jun 2026",
    nextBilling: "—",
    subscriptionPayments: [],
    paystack: "not_connected",
    revenueLifetime: 4200,
    revenueThisMonth: 1200,
    commissionEarned: 210,
    clientTransactions: [
      { id: "TRX-99399", date: "31 Jul 2026", client: "Yaa Mensimah", amount: 1200, designerShare: 1140, commission: 60, status: "paid" },
    ],
    clients: [{ id: "CL-288", name: "Yaa Mensimah", orders: 1, lastOrder: "31 Jul 2026" }],
    orders: [
      { id: "ORD-8852", client: "Yaa Mensimah", garment: "Smock Set", stage: "cutting", due: "27 Aug 2026", daysSinceUpdate: 1 },
    ],
    workers: [],
    notes: "",
  },
};

/* Platform-wide split transactions for the Revenue page */
export const splitTransactions: {
  id: string;
  date: string;
  designer: string;
  designerId: string;
  client: string;
  amount: number;
  designerShare: number;
  commission: number;
  paystack: ConnectionStatus;
  status: "paid" | "pending" | "failed" | "refunded";
}[] = [
  { id: "TRX-99401", date: "01 Aug 2026", designer: "Ama Serwaa", designerId: "STV-1041", client: "Adwoa Pokuaa", amount: 3200, designerShare: 3040, commission: 160, paystack: "connected", status: "paid" },
  { id: "TRX-99399", date: "31 Jul 2026", designer: "Kojo Baidoo", designerId: "STV-1048", client: "Yaa Mensimah", amount: 1200, designerShare: 1140, commission: 60, paystack: "not_connected", status: "pending" },
  { id: "TRX-99388", date: "30 Jul 2026", designer: "Ama Serwaa", designerId: "STV-1041", client: "Efua Boateng", amount: 1800, designerShare: 1710, commission: 90, paystack: "connected", status: "paid" },
  { id: "TRX-99377", date: "29 Jul 2026", designer: "Kwabena Mensah", designerId: "STV-1042", client: "Michael Osei", amount: 4200, designerShare: 3990, commission: 210, paystack: "not_connected", status: "pending" },
  { id: "TRX-99362", date: "27 Jul 2026", designer: "Ama Serwaa", designerId: "STV-1041", client: "Kofi Danso", amount: 5400, designerShare: 5130, commission: 270, paystack: "connected", status: "paid" },
  { id: "TRX-99340", date: "24 Jul 2026", designer: "Ama Serwaa", designerId: "STV-1041", client: "Selorm Dzide", amount: 2100, designerShare: 1995, commission: 105, paystack: "connected", status: "pending" },
  { id: "TRX-99310", date: "21 Jul 2026", designer: "Kwabena Mensah", designerId: "STV-1042", client: "Nii Armah", amount: 1600, designerShare: 1520, commission: 80, paystack: "not_connected", status: "failed" },
  { id: "TRX-99204", date: "12 Jul 2026", designer: "Nana Adjoa Owusu", designerId: "STV-1045", client: "Linda Asare", amount: 2400, designerShare: 2280, commission: 120, paystack: "connected", status: "refunded" },
];

export const cedis = (n: number) => `₵${n.toLocaleString()}`;
