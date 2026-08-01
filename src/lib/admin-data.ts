export type UserRole = "designer" | "client" | "worker";
export type UserStatus = "active" | "inactive" | "suspended";
export type Plan = "free" | "pro" | "atelier";
export type OrderStage = "cutting" | "sewing" | "fitting" | "completed";
export type PaymentStatus = "paid" | "pending" | "failed" | "refunded";

export interface AdminUser {
  id: string;
  name: string;
  initials: string;
  phone: string;
  email: string;
  role: UserRole;
  plan: Plan;
  status: UserStatus;
  lastActive: string;
  signupDate: string;
  location: string;
  ordersCount: number;
  lifetimeValue: number;
  measurements: { label: string; value: string }[];
  orders: { id: string; garment: string; stage: OrderStage; due: string }[];
  payments: { id: string; amount: number; date: string; status: PaymentStatus }[];
}

const cedi = (n: number) => n;

export const users: AdminUser[] = [
  {
    id: "STV-1041",
    name: "Ama Serwaa",
    initials: "AS",
    phone: "+233 24 118 4420",
    email: "ama.serwaa@stitchova.app",
    role: "designer",
    plan: "atelier",
    status: "active",
    lastActive: "12 min ago",
    signupDate: "14 Jan 2026",
    location: "Osu, Accra",
    ordersCount: 148,
    lifetimeValue: cedi(18420),
    measurements: [
      { label: "Bust", value: "94 cm" },
      { label: "Waist", value: "72 cm" },
      { label: "Hip", value: "102 cm" },
      { label: "Sleeve", value: "58 cm" },
    ],
    orders: [
      { id: "ORD-8841", garment: "Kaba & Slit", stage: "sewing", due: "12 Aug" },
      { id: "ORD-8802", garment: "Bridal Gown", stage: "fitting", due: "18 Aug" },
      { id: "ORD-8760", garment: "Agbada Set", stage: "completed", due: "02 Aug" },
    ],
    payments: [
      { id: "PAY-3391", amount: 420, date: "01 Aug 2026", status: "paid" },
      { id: "PAY-3288", amount: 420, date: "01 Jul 2026", status: "paid" },
      { id: "PAY-3190", amount: 420, date: "01 Jun 2026", status: "paid" },
    ],
  },
  {
    id: "STV-1042",
    name: "Kwabena Mensah",
    initials: "KM",
    phone: "+233 20 774 3319",
    email: "kwabena.m@stitchova.app",
    role: "designer",
    plan: "pro",
    status: "active",
    lastActive: "1 hr ago",
    signupDate: "02 Feb 2026",
    location: "Kumasi",
    ordersCount: 96,
    lifetimeValue: cedi(11280),
    measurements: [
      { label: "Chest", value: "108 cm" },
      { label: "Waist", value: "88 cm" },
      { label: "Inseam", value: "79 cm" },
      { label: "Shoulder", value: "48 cm" },
    ],
    orders: [
      { id: "ORD-8830", garment: "Three-piece Suit", stage: "cutting", due: "22 Aug" },
      { id: "ORD-8791", garment: "Kente Blazer", stage: "sewing", due: "15 Aug" },
    ],
    payments: [
      { id: "PAY-3372", amount: 180, date: "01 Aug 2026", status: "paid" },
      { id: "PAY-3271", amount: 180, date: "01 Jul 2026", status: "pending" },
    ],
  },
  {
    id: "STV-1043",
    name: "Efua Boateng",
    initials: "EB",
    phone: "+233 55 209 8871",
    email: "efua.b@stitchova.app",
    role: "client",
    plan: "free",
    status: "active",
    lastActive: "4 hrs ago",
    signupDate: "19 Mar 2026",
    location: "Tema",
    ordersCount: 6,
    lifetimeValue: cedi(1940),
    measurements: [
      { label: "Bust", value: "88 cm" },
      { label: "Waist", value: "66 cm" },
      { label: "Hip", value: "96 cm" },
      { label: "Height", value: "165 cm" },
    ],
    orders: [{ id: "ORD-8844", garment: "Cocktail Dress", stage: "fitting", due: "10 Aug" }],
    payments: [{ id: "PAY-3401", amount: 640, date: "28 Jul 2026", status: "paid" }],
  },
  {
    id: "STV-1044",
    name: "Yaw Antwi",
    initials: "YA",
    phone: "+233 27 663 1204",
    email: "yaw.antwi@stitchova.app",
    role: "worker",
    plan: "free",
    status: "inactive",
    lastActive: "9 days ago",
    signupDate: "07 Apr 2026",
    location: "Takoradi",
    ordersCount: 34,
    lifetimeValue: cedi(0),
    measurements: [],
    orders: [{ id: "ORD-8712", garment: "Uniform Batch (24)", stage: "completed", due: "21 Jul" }],
    payments: [],
  },
  {
    id: "STV-1045",
    name: "Nana Adjoa Owusu",
    initials: "NO",
    phone: "+233 24 990 5512",
    email: "nana.owusu@stitchova.app",
    role: "designer",
    plan: "pro",
    status: "suspended",
    lastActive: "3 days ago",
    signupDate: "11 Apr 2026",
    location: "East Legon, Accra",
    ordersCount: 52,
    lifetimeValue: cedi(6120),
    measurements: [
      { label: "Bust", value: "92 cm" },
      { label: "Waist", value: "74 cm" },
    ],
    orders: [{ id: "ORD-8688", garment: "Ankara Two-piece", stage: "sewing", due: "05 Aug" }],
    payments: [{ id: "PAY-3210", amount: 180, date: "01 Jul 2026", status: "failed" }],
  },
  {
    id: "STV-1046",
    name: "Selorm Dzide",
    initials: "SD",
    phone: "+233 50 441 7788",
    email: "selorm.d@stitchova.app",
    role: "client",
    plan: "pro",
    status: "active",
    lastActive: "26 min ago",
    signupDate: "23 May 2026",
    location: "Ho",
    ordersCount: 11,
    lifetimeValue: cedi(3480),
    measurements: [
      { label: "Chest", value: "100 cm" },
      { label: "Waist", value: "84 cm" },
      { label: "Inseam", value: "81 cm" },
    ],
    orders: [
      { id: "ORD-8849", garment: "Wedding Agbada", stage: "cutting", due: "30 Aug" },
      { id: "ORD-8801", garment: "Linen Shirt x3", stage: "completed", due: "26 Jul" },
    ],
    payments: [{ id: "PAY-3398", amount: 180, date: "01 Aug 2026", status: "paid" }],
  },
  {
    id: "STV-1047",
    name: "Abena Frimpong",
    initials: "AF",
    phone: "+233 26 335 9014",
    email: "abena.f@stitchova.app",
    role: "worker",
    plan: "free",
    status: "active",
    lastActive: "2 hrs ago",
    signupDate: "08 Jun 2026",
    location: "Kasoa",
    ordersCount: 71,
    lifetimeValue: cedi(0),
    measurements: [],
    orders: [{ id: "ORD-8836", garment: "Choir Robes (12)", stage: "sewing", due: "19 Aug" }],
    payments: [],
  },
  {
    id: "STV-1048",
    name: "Kojo Baidoo",
    initials: "KB",
    phone: "+233 23 810 2277",
    email: "kojo.baidoo@stitchova.app",
    role: "designer",
    plan: "free",
    status: "active",
    lastActive: "Yesterday",
    signupDate: "21 Jun 2026",
    location: "Cape Coast",
    ordersCount: 9,
    lifetimeValue: cedi(0),
    measurements: [],
    orders: [{ id: "ORD-8852", garment: "Smock Set", stage: "cutting", due: "27 Aug" }],
    payments: [],
  },
];

export const signupSeries = [
  { month: "Feb", designers: 42, clients: 88 },
  { month: "Mar", designers: 61, clients: 122 },
  { month: "Apr", designers: 74, clients: 151 },
  { month: "May", designers: 96, clients: 188 },
  { month: "Jun", designers: 118, clients: 236 },
  { month: "Jul", designers: 141, clients: 302 },
  { month: "Aug", designers: 164, clients: 358 },
];

export const revenueSeries = [
  { month: "Feb", revenue: 18400 },
  { month: "Mar", revenue: 24900 },
  { month: "Apr", revenue: 31200 },
  { month: "May", revenue: 38600 },
  { month: "Jun", revenue: 44100 },
  { month: "Jul", revenue: 52800 },
  { month: "Aug", revenue: 61350 },
];

export type ActivityKind = "signup" | "order" | "payment" | "flag";

export const activityFeed: { id: string; kind: ActivityKind; title: string; detail: string; time: string }[] = [
  { id: "a1", kind: "signup", title: "Kojo Baidoo joined", detail: "Designer · Cape Coast · Free plan", time: "12 min ago" },
  { id: "a2", kind: "payment", title: "₵420 received", detail: "Ama Serwaa · Atelier renewal", time: "38 min ago" },
  { id: "a3", kind: "order", title: "ORD-8852 created", detail: "Smock Set · due 27 Aug", time: "1 hr ago" },
  { id: "a4", kind: "flag", title: "Order flagged as stuck", detail: "ORD-8688 · no update in 9 days", time: "2 hrs ago" },
  { id: "a5", kind: "signup", title: "Abena Frimpong joined", detail: "Worker · Kasoa", time: "4 hrs ago" },
  { id: "a6", kind: "payment", title: "₵180 failed", detail: "Nana Adjoa Owusu · Pro renewal", time: "6 hrs ago" },
  { id: "a7", kind: "order", title: "ORD-8760 completed", detail: "Agbada Set · Ama Serwaa", time: "Yesterday" },
];

export const transactions = [
  { id: "PAY-3401", user: "Efua Boateng", amount: 640, date: "28 Jul 2026", status: "paid" as PaymentStatus },
  { id: "PAY-3398", user: "Selorm Dzide", amount: 180, date: "01 Aug 2026", status: "paid" as PaymentStatus },
  { id: "PAY-3391", user: "Ama Serwaa", amount: 420, date: "01 Aug 2026", status: "paid" as PaymentStatus },
  { id: "PAY-3372", user: "Kwabena Mensah", amount: 180, date: "01 Aug 2026", status: "paid" as PaymentStatus },
  { id: "PAY-3271", user: "Kwabena Mensah", amount: 180, date: "01 Jul 2026", status: "pending" as PaymentStatus },
  { id: "PAY-3210", user: "Nana Adjoa Owusu", amount: 180, date: "01 Jul 2026", status: "failed" as PaymentStatus },
  { id: "PAY-3188", user: "Efua Boateng", amount: 260, date: "24 Jun 2026", status: "refunded" as PaymentStatus },
];

export const platformOrders = [
  { id: "ORD-8852", client: "Kojo Baidoo", designer: "Kojo Baidoo", stage: "cutting" as OrderStage, due: "27 Aug 2026", stuckDays: 0 },
  { id: "ORD-8849", client: "Selorm Dzide", designer: "Ama Serwaa", stage: "cutting" as OrderStage, due: "30 Aug 2026", stuckDays: 0 },
  { id: "ORD-8844", client: "Efua Boateng", designer: "Ama Serwaa", stage: "fitting" as OrderStage, due: "10 Aug 2026", stuckDays: 1 },
  { id: "ORD-8841", client: "Adwoa Pokuaa", designer: "Ama Serwaa", stage: "sewing" as OrderStage, due: "12 Aug 2026", stuckDays: 0 },
  { id: "ORD-8836", client: "Grace Chapel", designer: "Abena Frimpong", stage: "sewing" as OrderStage, due: "19 Aug 2026", stuckDays: 2 },
  { id: "ORD-8830", client: "Michael Osei", designer: "Kwabena Mensah", stage: "cutting" as OrderStage, due: "22 Aug 2026", stuckDays: 0 },
  { id: "ORD-8688", client: "Linda Asare", designer: "Nana Adjoa Owusu", stage: "sewing" as OrderStage, due: "05 Aug 2026", stuckDays: 9 },
  { id: "ORD-8760", client: "Kofi Danso", designer: "Ama Serwaa", stage: "completed" as OrderStage, due: "02 Aug 2026", stuckDays: 0 },
];

export const flaggedIssues = [
  { id: "ISS-114", user: "Linda Asare", subject: "Order stalled for 9 days", severity: "high", opened: "2 hrs ago" },
  { id: "ISS-112", user: "Nana Adjoa Owusu", subject: "Payment failed 3× — card declined", severity: "high", opened: "6 hrs ago" },
  { id: "ISS-109", user: "Efua Boateng", subject: "Requested refund on ORD-8712", severity: "medium", opened: "Yesterday" },
  { id: "ISS-104", user: "Yaw Antwi", subject: "Cannot upload workshop photos", severity: "low", opened: "3 days ago" },
];
