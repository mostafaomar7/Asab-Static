import "./_group.css";
import { useState, ReactNode } from "react";
import {
  LayoutDashboard, TrendingUp, Wallet, ShoppingCart, Package, Building2, Clock,
  Users, ArrowLeftRight, BarChart3, Settings, Bell, LogOut, ChevronRight,
  ChevronDown, ChevronUp, CheckCircle2, XCircle, MessageSquare, Eye, Download,
  AlertTriangle, Paperclip, ThumbsUp, ThumbsDown, RefreshCw, Filter, Star,
  Upload, ChevronsRight, Phone, Search, Plus, Trash2, Edit2, X, FileText,
  Truck, Home, ArrowRight, ArrowLeft, Shield
} from "lucide-react";

// ══════════════════════════════════════════════════════════════
// TYPES
// ══════════════════════════════════════════════════════════════
type RoleId = "admin" | "head" | "accountant" | "branch" | "procurement" | "supplier";
type PageId = string;

interface NavSection { section: string }
interface NavItem { id: string; label: string; icon: ReactNode; badge?: number; badgeColor?: "red" | "yellow" }
type NavEntry = NavSection | NavItem;

function isSection(e: NavEntry): e is NavSection { return "section" in e; }
function isItem(e: NavEntry): e is NavItem { return "id" in e; }

interface AppState {
  role: RoleId | null;
  page: PageId;
  detailId: string | null;
  modal: string | null;
}

// ══════════════════════════════════════════════════════════════
// NAVIGATION CONFIG
// ══════════════════════════════════════════════════════════════
const NAV_CONFIG: Record<RoleId, NavEntry[]> = {
  accountant: [
    { section: "الرئيسية" },
    { id: "acc-dashboard", label: "لوحة التحكم", icon: <LayoutDashboard size={16} /> },
    { section: "الموديولات" },
    { id: "acc-sales", label: "المبيعات", icon: <TrendingUp size={16} />, badge: 14 },
    { id: "acc-expenses", label: "المصروفات", icon: <Wallet size={16} />, badge: 22 },
    { id: "acc-purchases", label: "المشتريات", icon: <ShoppingCart size={16} />, badge: 8 },
    { id: "acc-inventory", label: "المخزون", icon: <Package size={16} />, badge: 5 },
    { id: "acc-assets", label: "الأصول الثابتة", icon: <Building2 size={16} /> },
    { id: "acc-shifts", label: "إدارة الشفتات", icon: <Clock size={16} />, badge: 3 },
    { id: "acc-employees", label: "كشف حساب الموظفين", icon: <Users size={16} />, badge: 6 },
    { id: "acc-cash", label: "إدارة العهد النقدية", icon: <ArrowLeftRight size={16} />, badge: 2 },
    { section: "التقارير" },
    { id: "acc-reports", label: "التقارير", icon: <BarChart3 size={16} /> },
  ],
  head: [
    { section: "الرئيسية" },
    { id: "head-dashboard", label: "لوحة التحكم", icon: <LayoutDashboard size={16} /> },
    { section: "المراجعة والاعتماد" },
    { id: "head-pending", label: "بانتظار الاعتماد", icon: <Clock size={16} />, badge: 125 },
    { id: "head-approved", label: "المعتمدة نهائياً", icon: <CheckCircle2 size={16} /> },
    { id: "head-rejected", label: "المرفوضة", icon: <XCircle size={16} /> },
    { section: "الموديولات" },
    { id: "head-sales", label: "المبيعات", icon: <TrendingUp size={16} /> },
    { id: "head-expenses", label: "المصروفات", icon: <Wallet size={16} /> },
    { id: "head-purchases", label: "المشتريات", icon: <ShoppingCart size={16} /> },
    { id: "head-inventory", label: "المخزون", icon: <Package size={16} /> },
    { id: "head-shifts", label: "الشفتات", icon: <Clock size={16} /> },
    { id: "head-employees", label: "كشف حساب الموظفين", icon: <Users size={16} /> },
    { id: "head-cash", label: "العهد النقدية", icon: <ArrowLeftRight size={16} /> },
    { section: "الإدارة" },
    { id: "head-accountants", label: "أداء المحاسبين", icon: <Users size={16} /> },
    { id: "head-erp", label: "التصدير لـ ERP", icon: <ChevronsRight size={16} /> },
    { id: "head-reports", label: "التقارير", icon: <BarChart3 size={16} /> },
  ],
  admin: [
    { section: "الرئيسية" },
    { id: "admin-overview", label: "نظرة عامة", icon: <LayoutDashboard size={16} /> },
    { section: "الإدارة" },
    { id: "admin-users", label: "المستخدمون", icon: <Users size={16} />, badge: 3 },
    { id: "admin-restaurants", label: "المطاعم والفروع", icon: <Home size={16} /> },
    { id: "admin-subscriptions", label: "الاشتراكات", icon: <Shield size={16} />, badge: 2, badgeColor: "yellow" },
    { id: "admin-permissions", label: "الصلاحيات", icon: <Settings size={16} /> },
    { section: "التقارير" },
    { id: "admin-reports", label: "مدير التقارير", icon: <BarChart3 size={16} /> },
    { id: "admin-audit", label: "سجل النشاطات", icon: <FileText size={16} /> },
    { section: "النظام" },
    { id: "admin-settings", label: "إعدادات النظام", icon: <Settings size={16} /> },
  ],
  branch: [
    { section: "الرئيسية" },
    { id: "branch-overview", label: "نظرة عامة", icon: <LayoutDashboard size={16} /> },
    { section: "إدارة البيانات" },
    { id: "branch-employees", label: "الموظفون", icon: <Users size={16} /> },
    { id: "branch-items", label: "الأصناف", icon: <Package size={16} /> },
    { id: "branch-suppliers", label: "الموردون", icon: <Truck size={16} /> },
    { id: "branch-upload", label: "رفع البيانات", icon: <Upload size={16} /> },
    { section: "الإعدادات" },
    { id: "branch-settings", label: "إعدادات الفرع", icon: <Settings size={16} /> },
  ],
  procurement: [
    { section: "الرئيسية" },
    { id: "proc-overview", label: "لوحة التحكم", icon: <LayoutDashboard size={16} /> },
    { section: "الطلبات" },
    { id: "proc-new", label: "الطلبات الجديدة", icon: <ShoppingCart size={16} />, badge: 45 },
    { id: "proc-grouped", label: "الطلبات المجمعة", icon: <Package size={16} /> },
    { id: "proc-sent", label: "المرسلة للموردين", icon: <Truck size={16} /> },
    { section: "الإدارة" },
    { id: "proc-items", label: "الأصناف", icon: <Package size={16} /> },
    { id: "proc-suppliers", label: "الموردون", icon: <Truck size={16} /> },
    { id: "proc-reports", label: "التقارير", icon: <BarChart3 size={16} /> },
  ],
  supplier: [
    { section: "الرئيسية" },
    { id: "sup-overview", label: "لوحة التحكم", icon: <LayoutDashboard size={16} /> },
    { section: "الطلبات" },
    { id: "sup-new", label: "الطلبات الجديدة", icon: <ShoppingCart size={16} />, badge: 3 },
    { id: "sup-accepted", label: "المقبولة", icon: <CheckCircle2 size={16} /> },
    { id: "sup-rejected", label: "المرفوضة", icon: <XCircle size={16} /> },
    { section: "الكتالوج" },
    { id: "sup-items", label: "الأصناف والأسعار", icon: <Package size={16} /> },
    { id: "sup-reports", label: "تقارير المبيعات", icon: <BarChart3 size={16} /> },
  ],
};

const ROLE_PROFILES: Record<RoleId, { name: string; avatar: string; label: string; defaultPage: PageId }> = {
  admin: { name: "عبدالله الأحمد", avatar: "عب", label: "أدمن النظام", defaultPage: "admin-overview" },
  head: { name: "خالد العمري", avatar: "خع", label: "رئيس الحسابات", defaultPage: "head-dashboard" },
  accountant: { name: "أحمد محمد", avatar: "أم", label: "محاسب — الفروع 1–50", defaultPage: "acc-dashboard" },
  branch: { name: "أحمد الشمري", avatar: "أش", label: "مدير فرع الرياض - العليا", defaultPage: "branch-overview" },
  procurement: { name: "سعيد أحمد", avatar: "سأ", label: "مدير المشتريات", defaultPage: "proc-overview" },
  supplier: { name: "محمد العلي", avatar: "مع", label: "شركة الدواجن الوطنية", defaultPage: "sup-overview" },
};

function getPageTitle(role: RoleId, page: PageId): string {
  const nav = NAV_CONFIG[role];
  for (const e of nav) if (isItem(e) && e.id === page) return e.label;
  if (page === "acc-sales-detail") return "تفاصيل عملية المبيعات";
  if (page === "acc-inventory-items") return "تحديد أصناف الجرد اليومي";
  return "—";
}

// ══════════════════════════════════════════════════════════════
// SHARED DATA
// ══════════════════════════════════════════════════════════════
const OPERATIONS = [
  { id: "OPS-2401", branch: "فرع الرياض - العليا", module: "مبيعات", amount: "18,340", timeAgo: "قبل ساعة", match: "exact" as const, attachments: 3, status: "pending" as const },
  { id: "OPS-2400", branch: "فرع جدة - الحمراء", module: "مصروفات", amount: "12,500", timeAgo: "قبل 3 ساعات", match: "review" as const, attachments: 2, status: "pending" as const },
  { id: "OPS-2399", branch: "فرع مكة - المعابدة", module: "مشتريات", amount: "8,200", timeAgo: "قبل 5 ساعات", match: "diff" as const, attachments: 4, status: "pending" as const, diff: "فرق في الكمية: 5 كجم" },
  { id: "OPS-2398", branch: "فرع الدمام - الكورنيش", module: "مبيعات", amount: "45,230", timeAgo: "قبل 6 ساعات", match: "exact" as const, attachments: 3, status: "approved" as const },
  { id: "OPS-2397", branch: "فرع الرياض - النزهة", module: "مصروفات", amount: "3,800", timeAgo: "أمس", match: "review" as const, attachments: 1, status: "rejected" as const },
  { id: "OPS-2396", branch: "فرع الطائف - المحطة", module: "مخزون", amount: "6,100", timeAgo: "أمس", match: "exact" as const, attachments: 2, status: "pending" as const },
  { id: "OPS-2395", branch: "فرع الرياض - النزهة", module: "مبيعات", amount: "22,100", timeAgo: "قبل يومين", match: "exact" as const, attachments: 3, status: "approved" as const },
];

const MATCH_CONFIG = {
  exact: { label: "متطابق", cls: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
  review: { label: "يحتاج مراجعة", cls: "bg-amber-50 text-amber-700 border-amber-200", dot: "bg-amber-500" },
  diff: { label: "فرق في الكمية", cls: "bg-red-50 text-red-700 border-red-200", dot: "bg-red-500" },
};
const STATUS_CONFIG = {
  pending: { label: "معلق", cls: "bg-amber-50 text-amber-700" },
  approved: { label: "موافق عليه", cls: "bg-blue-50 text-blue-700" },
  rejected: { label: "مرفوض", cls: "bg-red-50 text-red-700" },
};

// ══════════════════════════════════════════════════════════════
// MICRO-COMPONENTS
// ══════════════════════════════════════════════════════════════
function Badge({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${className}`}>{children}</span>;
}

function Btn({ children, onClick, variant = "ghost", size = "md", className = "" }: {
  children: ReactNode; onClick?: () => void;
  variant?: "primary" | "success" | "danger" | "ghost" | "outline" | "amber";
  size?: "sm" | "md"; className?: string
}) {
  const base = "inline-flex items-center gap-1.5 font-semibold cursor-pointer border transition-colors rounded-lg";
  const sizes = { sm: "px-3 py-1.5 text-xs", md: "px-4 py-2 text-sm" };
  const variants = {
    primary: "bg-purple-600 text-white border-purple-600 hover:bg-purple-700",
    success: "bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700",
    danger: "bg-red-50 text-red-700 border-red-200 hover:bg-red-100",
    amber: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
    ghost: "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100",
    outline: "bg-white text-gray-700 border-gray-200 hover:bg-gray-50",
  };
  return <button onClick={onClick} className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}>{children}</button>;
}

function KpiCard({ label, value, sub, icon, borderColor = "border-l-purple-400" }: {
  label: string; value: string; sub?: string; icon: ReactNode; borderColor?: string
}) {
  return (
    <div className={`bg-white rounded-xl p-4 shadow-sm border-l-4 ${borderColor} flex items-start gap-3`}>
      <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">{icon}</div>
      <div>
        <p className="text-gray-500 text-xs">{label}</p>
        <p className="text-gray-900 font-bold text-2xl mt-0.5">{value}</p>
        {sub && <p className="text-gray-400 text-xs mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function Card({ title, children, actions, className = "" }: { title?: string; children: ReactNode; actions?: ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden ${className}`}>
      {title && (
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-800 text-sm">{title}</h3>
          {actions}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
}

function Modal({ title, children, onClose, width = "480px" }: { title: string; children: ReactNode; onClose: () => void; width?: string }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl" style={{ width, maxWidth: "95vw", maxHeight: "90vh", overflowY: "auto" }} dir="rtl">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="font-bold text-gray-800 text-base">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function Breadcrumb({ items }: { items: { label: string; onClick?: () => void }[] }) {
  return (
    <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-4" dir="rtl">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-1.5">
          {i > 0 && <ChevronRight size={13} className="text-gray-300 rotate-180" />}
          {item.onClick ? (
            <button onClick={item.onClick} className="text-purple-600 hover:underline">{item.label}</button>
          ) : (
            <span className="font-semibold text-gray-700">{item.label}</span>
          )}
        </div>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// LOGIN SCREEN
// ══════════════════════════════════════════════════════════════
function LoginScreen({ onLogin }: { onLogin: (role: RoleId) => void }) {
  const roles: { id: RoleId; icon: string; title: string; desc: string; badge: string; badgeCls: string }[] = [
    { id: "admin", icon: "🧠", title: "أدمن النظام", desc: "إدارة المستخدمين، الاشتراكات، وإعدادات النظام الكاملة", badge: "نظام", badgeCls: "bg-red-500/20 text-red-200" },
    { id: "head", icon: "👑", title: "رئيس الحسابات", desc: "الاعتماد النهائي للعمليات والإشراف على أداء المحاسبين", badge: "اعتماد نهائي", badgeCls: "bg-amber-500/20 text-amber-200" },
    { id: "accountant", icon: "🧮", title: "المحاسب", desc: "مراجعة وتدقيق العمليات اليومية من جميع الفروع المخصصة", badge: "مراجعة يومية", badgeCls: "bg-blue-500/20 text-blue-200" },
    { id: "branch", icon: "🏪", title: "مدير الفرع", desc: "رفع البيانات اليومية وإدارة موظفي وموردي الفرع", badge: "فرع", badgeCls: "bg-emerald-500/20 text-emerald-200" },
    { id: "procurement", icon: "🛒", title: "مدير المشتريات", desc: "تجميع طلبات الشراء والتنسيق مع الموردين", badge: "مشتريات", badgeCls: "bg-purple-500/20 text-purple-200" },
    { id: "supplier", icon: "🏭", title: "المورد", desc: "استلام طلبات التوريد وإدارة الكتالوج والأسعار", badge: "مورد", badgeCls: "bg-cyan-500/20 text-cyan-200" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0F1C35 0%, #1B3A6B 60%, #2A5298 100%)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 40, padding: 24 }}>
      {/* Logo */}
      <div style={{ textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, marginBottom: 8 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: "linear-gradient(135deg, #7C3AED, #00D9FF)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#fff", fontWeight: 900, fontSize: 26 }}>ع</span>
          </div>
          <div>
            <div style={{ color: "#fff", fontWeight: 800, fontSize: 36, letterSpacing: -1 }}>عصب <span style={{ color: "#E8A020" }}>ASAB</span></div>
          </div>
        </div>
        <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 15 }}>نظام إدارة مالية المطاعم متعدد الفروع</p>
        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, marginTop: 6 }}>اختر دورك للدخول إلى النموذج التفاعلي</p>
      </div>

      {/* Role Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, maxWidth: 900, width: "100%" }}>
        {roles.map(r => (
          <button
            key={r.id}
            onClick={() => onLogin(r.id)}
            style={{ background: "rgba(255,255,255,0.07)", border: "1.5px solid rgba(255,255,255,0.14)", borderRadius: 16, padding: "24px 20px", cursor: "pointer", textAlign: "center", transition: "all 0.25s ease", fontFamily: "inherit" }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.13)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "#E8A020"; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-4px)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.07)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.14)"; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; }}
          >
            <div style={{ fontSize: 40, marginBottom: 12 }}>{r.icon}</div>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{r.title}</div>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, lineHeight: 1.6, marginBottom: 12 }}>{r.desc}</div>
            <span style={{ display: "inline-block", padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700 }} className={r.badgeCls}>{r.badge}</span>
          </button>
        ))}
      </div>
      <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 11 }}>نموذج أولي تفاعلي — ASAB Financial Management System v2.0</p>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// APP SHELL
// ══════════════════════════════════════════════════════════════
function AppShell({ state, navigate, logout, setModal, setDetailId }: {
  state: AppState;
  navigate: (page: PageId) => void;
  logout: () => void;
  setModal: (id: string | null) => void;
  setDetailId: (id: string | null) => void;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const role = state.role!;
  const profile = ROLE_PROFILES[role];
  const nav = NAV_CONFIG[role];

  return (
    <div className="flex h-screen overflow-hidden bg-[#F0F4FA]" dir="rtl">
      {/* ── Sidebar ── */}
      <aside
        className="flex flex-col transition-all duration-300 flex-shrink-0"
        style={{
          width: sidebarCollapsed ? 64 : 252,
          background: "linear-gradient(180deg, #0F1C35 0%, #1B3A6B 100%)",
          minHeight: "100vh",
          boxShadow: "-4px 0 20px rgba(0,0,0,0.2)"
        }}
      >
        {/* Brand */}
        <div className="flex items-center gap-2.5 px-3 py-4 border-b border-white/10">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg,#7C3AED,#00D9FF)" }}>
            <span className="text-white font-black text-sm">ع</span>
          </div>
          {!sidebarCollapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-white font-bold text-base leading-tight">عصب</div>
              <div className="text-white/40 text-[10px]">ASAB System</div>
            </div>
          )}
          <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="text-white/30 hover:text-white transition-colors ml-auto">
            {sidebarCollapsed ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>

        {/* Role badge */}
        {!sidebarCollapsed && (
          <div className="px-3 py-2.5 border-b border-white/10">
            <div className="text-[11px] px-2 py-1 rounded-full inline-block font-semibold bg-white/10 text-white/80">{profile.label}</div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
          {nav.map((entry, i) => {
            if (isSection(entry)) {
              return !sidebarCollapsed ? (
                <div key={i} className="text-white/30 text-[10px] font-bold uppercase tracking-widest px-3 pt-4 pb-1">{entry.section}</div>
              ) : <div key={i} className="my-2 border-t border-white/10" />;
            }
            const active = state.page === entry.id || (entry.id === "acc-sales" && (state.page === "acc-sales-detail" || state.page === "acc-sales-list"));
            return (
              <button
                key={entry.id}
                onClick={() => navigate(entry.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all text-right ${active ? "bg-white/15 text-white" : "text-white/55 hover:bg-white/8 hover:text-white/90"}`}
              >
                <span className={`flex-shrink-0 ${active ? "text-[#00D9FF]" : ""}`}>{entry.icon}</span>
                {!sidebarCollapsed && (
                  <>
                    <span className="text-[13px] font-medium flex-1 text-right leading-tight">{entry.label}</span>
                    {entry.badge ? (
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center ${entry.badgeColor === "yellow" ? "bg-amber-500 text-white" : "bg-red-500 text-white"}`}>
                        {entry.badge}
                      </span>
                    ) : null}
                  </>
                )}
              </button>
            );
          })}
        </nav>

        {/* User + Logout */}
        <div className="p-3 border-t border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-cyan-400 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">{profile.avatar}</span>
            </div>
            {!sidebarCollapsed && (
              <>
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm font-medium truncate">{profile.name}</div>
                  <div className="text-white/40 text-[10px] truncate">{profile.label}</div>
                </div>
                <button onClick={logout} title="تسجيل الخروج" className="text-white/30 hover:text-red-300 transition-colors">
                  <LogOut size={14} />
                </button>
              </>
            )}
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-100 px-5 py-3 flex items-center gap-4 flex-shrink-0 shadow-sm z-10">
          <div className="flex-1 min-w-0">
            <h1 className="text-gray-800 font-bold text-base leading-tight">{getPageTitle(role, state.page)}</h1>
            <p className="text-gray-400 text-xs">{profile.label}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-xs text-gray-400 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg hidden sm:block">
              الإثنين، 14 أكتوبر 2025
            </div>
            <select className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 bg-gray-50 cursor-pointer">
              <option>هذا الشهر</option>
              <option>هذا الأسبوع</option>
              <option>اليوم</option>
            </select>
            <button className="relative w-9 h-9 flex items-center justify-center rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-500 transition-colors">
              <Bell size={16} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button onClick={logout} className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 flex items-center gap-1">
              <LogOut size={13} /> خروج
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-5">
          <PageRouter state={state} navigate={navigate} setModal={setModal} setDetailId={setDetailId} />
        </main>
      </div>

      {/* Modals */}
      {state.modal === "reject" && (
        <Modal title={`رفض العملية ${state.detailId || "OPS-2401"}`} onClose={() => setModal(null)}>
          <p className="text-gray-500 text-sm mb-4">ستُعاد العملية إلى مدير الفرع مع سبب الرفض.</p>
          <label className="text-sm font-semibold text-gray-700 block mb-1.5">سبب الرفض <span className="text-red-500">*</span></label>
          <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 mb-3">
            <option>اختر السبب...</option>
            <option>بيانات غير مكتملة</option>
            <option>فاتورة مفقودة أو غير واضحة</option>
            <option>تناقض في المبالغ</option>
            <option>فرق في الكميات</option>
            <option>مورد غير معتمد</option>
            <option>أخرى</option>
          </select>
          <textarea className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 resize-none mb-4" rows={3} placeholder="تفاصيل إضافية..." />
          <div className="flex gap-3">
            <Btn onClick={() => setModal(null)} variant="danger" className="flex-1 justify-center">✕ تأكيد الرفض وإعادة للفرع</Btn>
            <Btn onClick={() => setModal(null)} variant="ghost" className="flex-1 justify-center">إلغاء</Btn>
          </div>
        </Modal>
      )}
      {state.modal === "add-user" && (
        <Modal title="إضافة مستخدم جديد" onClose={() => setModal(null)} width="580px">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs font-semibold text-gray-600 block mb-1">الاسم الكامل</label><input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="أحمد محمد السعد" /></div>
              <div><label className="text-xs font-semibold text-gray-600 block mb-1">البريد الإلكتروني</label><input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="ahmed@asab.sa" /></div>
              <div><label className="text-xs font-semibold text-gray-600 block mb-1">الدور</label>
                <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
                  <option>محاسب</option><option>رئيس حسابات</option><option>مدير فرع</option><option>مدير مشتريات</option><option>مورد</option>
                </select>
              </div>
              <div><label className="text-xs font-semibold text-gray-600 block mb-1">المطعم</label>
                <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
                  <option>مطعم الريم</option><option>هرفي</option><option>ماكدونالدز</option>
                </select>
              </div>
            </div>
            <div><label className="text-xs font-semibold text-gray-600 block mb-1.5">الموديولات المخصصة</label>
              <div className="grid grid-cols-3 gap-2">
                {["المبيعات","المصروفات","المشتريات","المخزون","الشفتات","كشف الحساب","العهد النقدية","الأصول الثابتة"].map(m => (
                  <label key={m} className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                    <input type="checkbox" defaultChecked={["المبيعات","المصروفات"].includes(m)} className="rounded" /> {m}
                  </label>
                ))}
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Btn onClick={() => setModal(null)} variant="primary" className="flex-1 justify-center">✓ إضافة المستخدم</Btn>
              <Btn onClick={() => setModal(null)} variant="ghost" className="flex-1 justify-center">إلغاء</Btn>
            </div>
          </div>
        </Modal>
      )}
      {state.modal === "contact-employee" && (
        <Modal title="التواصل مع الموظف" onClose={() => setModal(null)} width="400px">
          <div className="text-center py-2">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-cyan-400 flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold text-xl">خش</span>
            </div>
            <h4 className="font-bold text-gray-800">خالد الشمري</h4>
            <p className="text-gray-500 text-sm">مشرف الشفت — فرع الرياض العليا</p>
          </div>
          <div className="space-y-3 mt-5">
            <a href="tel:+966512345678" className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center"><Phone size={18} className="text-emerald-600" /></div>
              <div><p className="font-semibold text-sm text-gray-800">اتصال هاتفي</p><p className="text-xs text-gray-400">+966 51 234 5678</p></div>
            </a>
            <a href="#" className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#25D366" }}><span className="text-white text-lg">📱</span></div>
              <div><p className="font-semibold text-sm text-gray-800">واتساب</p><p className="text-xs text-gray-400">فتح المحادثة في واتساب</p></div>
            </a>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// PAGE ROUTER
// ══════════════════════════════════════════════════════════════
function PageRouter({ state, navigate, setModal, setDetailId }: {
  state: AppState;
  navigate: (page: PageId) => void;
  setModal: (id: string | null) => void;
  setDetailId: (id: string | null) => void;
}) {
  const { role, page } = state;
  const props = { navigate, setModal, setDetailId, detailId: state.detailId };

  if (role === "accountant") {
    if (page === "acc-dashboard") return <AccDashboard {...props} />;
    if (page === "acc-sales") return <AccSalesList {...props} />;
    if (page === "acc-sales-detail") return <AccSalesDetail {...props} />;
    if (page === "acc-expenses") return <AccExpenses {...props} />;
    if (page === "acc-purchases") return <AccPurchases {...props} />;
    if (page === "acc-inventory") return <AccInventory {...props} />;
    if (page === "acc-inventory-items") return <AccInventoryItems {...props} />;
    if (page === "acc-shifts") return <AccShifts {...props} />;
    if (page === "acc-employees") return <AccEmployees {...props} />;
    if (page === "acc-cash") return <AccCash {...props} />;
    if (page === "acc-assets") return <AccAssets {...props} />;
    if (page === "acc-reports") return <AccReports {...props} />;
  }
  if (role === "head") {
    if (page === "head-dashboard") return <HeadDashboard {...props} />;
    if (page === "head-pending") return <HeadPending {...props} />;
    if (page === "head-approved") return <HeadApproved {...props} />;
    if (page === "head-rejected") return <HeadRejected {...props} />;
    if (page === "head-accountants") return <HeadAccountants {...props} />;
    if (page === "head-erp") return <HeadERP {...props} />;
    if (page === "head-reports") return <AccReports {...props} />;
    return <HeadModulePage module={page.replace("head-","")} {...props} />;
  }
  if (role === "admin") {
    if (page === "admin-overview") return <AdminOverview {...props} />;
    if (page === "admin-users") return <AdminUsers {...props} />;
    if (page === "admin-restaurants") return <AdminRestaurants {...props} />;
    if (page === "admin-subscriptions") return <AdminSubscriptions {...props} />;
    if (page === "admin-reports") return <AdminReports {...props} />;
    if (page === "admin-audit") return <AdminAudit {...props} />;
    if (page === "admin-permissions") return <AdminPermissions {...props} />;
    if (page === "admin-settings") return <AdminSettings {...props} />;
  }
  if (role === "branch") {
    if (page === "branch-overview") return <BranchOverview {...props} />;
    if (page === "branch-employees") return <BranchEmployees {...props} />;
    if (page === "branch-items") return <BranchItems {...props} />;
    if (page === "branch-suppliers") return <BranchSuppliers {...props} />;
    if (page === "branch-upload") return <BranchUpload {...props} />;
    if (page === "branch-settings") return <SimplePage title="إعدادات الفرع" icon="⚙️" desc="إعدادات وبيانات الفرع الأساسية" />;
  }
  if (role === "procurement") {
    if (page === "proc-overview") return <ProcOverview {...props} />;
    if (page === "proc-new") return <ProcNewOrders {...props} />;
    if (page === "proc-grouped") return <ProcGrouped {...props} />;
    if (page === "proc-sent") return <ProcSent {...props} />;
    if (page === "proc-items") return <SimplePage title="الأصناف" icon="🍗" desc="إدارة قائمة الأصناف ومعايير الجودة" />;
    if (page === "proc-suppliers") return <SimplePage title="الموردون" icon="🏢" desc="قائمة الموردين المعتمدين والتقييمات" />;
    if (page === "proc-reports") return <AccReports {...props} />;
  }
  if (role === "supplier") {
    if (page === "sup-overview") return <SupOverview {...props} />;
    if (page === "sup-new") return <SupNewOrders {...props} />;
    if (page === "sup-accepted") return <SimplePage title="الطلبات المقبولة" icon="✅" desc="قائمة الطلبات التي تم قبولها وجاري تنفيذها" />;
    if (page === "sup-rejected") return <SimplePage title="الطلبات المرفوضة" icon="❌" desc="الطلبات التي تم رفضها أو إلغاؤها" />;
    if (page === "sup-items") return <SimplePage title="الأصناف والأسعار" icon="📦" desc="قائمة الأصناف والأسعار المعتمدة" />;
    if (page === "sup-reports") return <AccReports {...props} />;
  }
  return <SimplePage title="قيد التطوير" icon="🚧" desc="هذه الصفحة قيد التطوير" />;
}

type PageProps = { navigate: (p: PageId) => void; setModal: (id: string | null) => void; setDetailId: (id: string | null) => void; detailId: string | null };

function SimplePage({ title, icon, desc }: { title: string; icon: string; desc: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
      <div className="text-6xl mb-4">{icon}</div>
      <h2 className="text-xl font-bold text-gray-700 mb-2">{title}</h2>
      <p className="text-gray-400 text-sm">{desc}</p>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// ACCOUNTANT PAGES
// ══════════════════════════════════════════════════════════════

function OperationRow({ op, onView, onApprove, onReject, onClarify }: {
  op: typeof OPERATIONS[0];
  onView: () => void; onApprove?: () => void; onReject: () => void; onClarify?: () => void;
}) {
  const match = MATCH_CONFIG[op.match];
  const status = STATUS_CONFIG[op.status];
  return (
    <div className={`px-5 py-4 flex items-start gap-4 hover:bg-gray-50/70 transition-colors border-b border-gray-100 last:border-0 ${op.match === "diff" ? "border-r-4 border-r-red-400" : op.match === "review" ? "border-r-4 border-r-amber-400" : ""}`}>
      <span className="mt-0.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-50 text-purple-700 flex-shrink-0">{op.module}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-gray-800 text-sm">{op.branch}</span>
          <span className="text-gray-300">·</span>
          <span className="text-xs text-gray-400 font-mono">{op.id}</span>
          <span className="text-gray-300">·</span>
          <span className="text-xs text-gray-400">⏰ {op.timeAgo}</span>
        </div>
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          <Badge className={`${match.cls} border`}><span className={`inline-block w-1.5 h-1.5 rounded-full mr-1 ${match.dot}`}></span>{match.label}</Badge>
          {op.diff && <span className="text-xs text-red-600 font-medium">⚠ {op.diff}</span>}
          <span className="flex items-center gap-1 text-xs text-gray-500"><Paperclip size={10} /> {op.attachments}</span>
          <Badge className={status.cls}>{status.label}</Badge>
        </div>
      </div>
      <div className="font-bold text-gray-800 font-mono text-sm flex-shrink-0">{op.amount} ر.س</div>
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <Btn size="sm" onClick={onView}><Eye size={12} /> عرض</Btn>
        {op.status === "pending" && (
          <>
            {onApprove && <Btn size="sm" variant="success" onClick={onApprove}><ThumbsUp size={12} /></Btn>}
            <Btn size="sm" variant="danger" onClick={onReject}><ThumbsDown size={12} /></Btn>
            {onClarify && <Btn size="sm" variant="amber" onClick={onClarify}><MessageSquare size={12} /></Btn>}
          </>
        )}
      </div>
    </div>
  );
}

function AccDashboard({ navigate, setModal, setDetailId }: PageProps) {
  const modules = [
    { id: "acc-sales", label: "المبيعات", icon: "💰", pending: 14, total: 42, color: "bg-emerald-500", urgent: true },
    { id: "acc-expenses", label: "المصروفات", icon: "💸", pending: 22, total: 67, color: "bg-red-500", urgent: true },
    { id: "acc-purchases", label: "المشتريات", icon: "🛒", pending: 8, total: 31, color: "bg-blue-500", urgent: false },
    { id: "acc-inventory", label: "المخزون", icon: "📦", pending: 5, total: 18, color: "bg-amber-500", urgent: false },
    { id: "acc-assets", label: "الأصول الثابتة", icon: "🏢", pending: 0, total: 4, color: "bg-purple-500", urgent: false },
    { id: "acc-shifts", label: "إدارة الشفتات", icon: "⏰", pending: 3, total: 12, color: "bg-cyan-500", urgent: false },
    { id: "acc-employees", label: "كشف الموظفين", icon: "👥", pending: 6, total: 25, color: "bg-indigo-500", urgent: false },
    { id: "acc-cash", label: "العهد النقدية", icon: "💼", pending: 2, total: 9, color: "bg-orange-500", urgent: false },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-800 font-bold text-xl">ملخص اليوم — الإثنين 14 أكتوبر 2025</h2>
          <p className="text-gray-400 text-sm mt-0.5">الفروع المخصصة: 1–50 | الموديولات: المبيعات، المصروفات</p>
        </div>
        <div className="flex gap-2">
          <Btn size="sm"><Filter size={13} /> فلترة</Btn>
          <Btn size="sm" variant="primary"><RefreshCw size={13} /> تحديث</Btn>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <KpiCard label="عمليات جديدة اليوم" value="45" sub="من الفروع المخصصة" icon={<BarChart3 size={20} className="text-purple-600" />} borderColor="border-l-purple-500" />
        <KpiCard label="وافقت عليها" value="32" sub="تم إرسالها لرئيس الحسابات" icon={<CheckCircle2 size={20} className="text-emerald-600" />} borderColor="border-l-emerald-500" />
        <KpiCard label="معلقة - تنتظرني" value="13" sub="يجب المراجعة" icon={<Clock size={20} className="text-amber-600" />} borderColor="border-l-amber-500" />
        <KpiCard label="معدل الموافقة" value="71%" sub="هذا الشهر" icon={<TrendingUp size={20} className="text-blue-600" />} borderColor="border-l-blue-500" />
      </div>

      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2">
          <Card title="الموديولات التسعة" actions={<span className="text-xs text-gray-400">المعلق / الإجمالي</span>}>
            <div className="p-4 grid grid-cols-4 gap-3">
              {modules.map(m => (
                <button key={m.id} onClick={() => navigate(m.id)}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-gray-100 hover:border-purple-300 hover:bg-purple-50/40 transition-all relative cursor-pointer">
                  {m.urgent && <span className="absolute top-1.5 left-1.5 w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg text-white ${m.color}`}>{m.icon}</div>
                  <span className="text-xs font-medium text-gray-700 text-center leading-tight">{m.label}</span>
                  <div className="flex items-center gap-1">
                    {m.pending > 0 && <span className="bg-red-100 text-red-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">{m.pending}</span>}
                    <span className="text-gray-300 text-[10px]">/</span>
                    <span className="text-gray-500 text-[10px]">{m.total}</span>
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </div>
        <div>
          <Card title="فلاتر البحث">
            <div className="p-4 space-y-3">
              {[
                { label: "🏪 الفرع", opts: ["الكل (الفروع 1-50)", "الرياض - العليا", "جدة - الحمراء"] },
                { label: "📦 الموديول", opts: ["الكل", "المبيعات", "المصروفات"] },
                { label: "📅 التاريخ", opts: ["اليوم", "أمس", "هذا الأسبوع"] },
                { label: "🔄 الحالة", opts: ["الكل", "معلق", "موافق عليه", "مرفوض"] },
              ].map(f => (
                <div key={f.label}>
                  <label className="text-xs font-semibold text-gray-500 block mb-1">{f.label}</label>
                  <select className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-600">{f.opts.map(o => <option key={o}>{o}</option>)}</select>
                </div>
              ))}
              <input type="text" placeholder="🔍 بحث..." className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-600" />
              <Btn variant="primary" className="w-full justify-center">تطبيق الفلاتر</Btn>
            </div>
          </Card>
        </div>
      </div>

      <Card title="قائمة العمليات المعلقة" actions={
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">13 عملية تنتظر مراجعتك</span>
          <Btn size="sm" variant="success">✓ موافقة جماعية</Btn>
        </div>
      }>
        {OPERATIONS.slice(0, 5).map(op => (
          <OperationRow key={op.id} op={op}
            onView={() => { setDetailId(op.id); navigate("acc-sales-detail"); }}
            onReject={() => { setDetailId(op.id); setModal("reject"); }}
            onApprove={() => {}}
            onClarify={() => {}}
          />
        ))}
        <div className="px-5 py-3 flex items-center justify-between">
          <span className="text-xs text-gray-400">عرض 5 من 13</span>
          <button onClick={() => navigate("acc-sales")} className="text-xs text-purple-600 hover:underline flex items-center gap-1">عرض الكل <ChevronRight size={12} /></button>
        </div>
      </Card>
    </div>
  );
}

function AccSalesList({ navigate, setModal, setDetailId }: PageProps) {
  const salesOps = OPERATIONS.filter(o => o.module === "مبيعات");
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">موديول المبيعات</h2>
          <p className="text-gray-400 text-sm mt-0.5">مطابقة تقارير المبيعات مع قنوات التحصيل الست</p>
        </div>
        <div className="flex gap-2">
          <Btn size="sm"><Filter size={13} /> فلترة</Btn>
          <Btn size="sm" variant="primary"><RefreshCw size={13} /> تحديث</Btn>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <KpiCard label="إجمالي اليوم" value="85,670 ر.س" sub="مجموع المبيعات" icon={<TrendingUp size={18} className="text-emerald-600" />} borderColor="border-l-emerald-500" />
        <KpiCard label="عمليات جديدة" value="42" sub="من 50 فرع" icon={<BarChart3 size={18} className="text-purple-600" />} borderColor="border-l-purple-500" />
        <KpiCard label="معلقة" value="14" sub="بانتظار مراجعتك" icon={<Clock size={18} className="text-amber-600" />} borderColor="border-l-amber-500" />
        <KpiCard label="فروق مكتشفة" value="3" sub="يحتاج إجراء" icon={<AlertTriangle size={18} className="text-red-600" />} borderColor="border-l-red-500" />
      </div>

      <Card title="عمليات المبيعات" actions={<Btn size="sm" variant="success">✓ موافقة جماعية</Btn>}>
        {salesOps.map(op => (
          <OperationRow key={op.id} op={op}
            onView={() => { setDetailId(op.id); navigate("acc-sales-detail"); }}
            onReject={() => { setDetailId(op.id); setModal("reject"); }}
            onApprove={() => {}} onClarify={() => {}}
          />
        ))}
        {OPERATIONS.map(op => (
          <OperationRow key={op.id + "_ex"} op={{ ...op, module: "مبيعات" }}
            onView={() => { setDetailId(op.id); navigate("acc-sales-detail"); }}
            onReject={() => { setDetailId(op.id); setModal("reject"); }}
            onApprove={() => {}} onClarify={() => {}}
          />
        ))}
      </Card>
    </div>
  );
}

function AccSalesDetail({ navigate, setModal, setDetailId, detailId }: PageProps) {
  const [approved, setApproved] = useState(false);
  const channels = [
    { name: "نقدي", icon: "💵", entered: 4200, expected: 4200 },
    { name: "بنكي (بنك الرياض)", icon: "🏦", entered: 8500, expected: 8500 },
    { name: "هنقرستيشن", icon: "🟠", entered: 2800, expected: 2800 },
    { name: "جاهز", icon: "🟡", entered: 1200, expected: 1350 },
    { name: "تو يو (ToYou)", icon: "🔵", entered: 980, expected: 980 },
    { name: "نينجا (Ninja)", icon: "⚫", entered: 660, expected: 660 },
  ];
  const totalEntered = channels.reduce((s, c) => s + c.entered, 0);
  const totalExpected = channels.reduce((s, c) => s + c.expected, 0);
  const totalDiff = totalEntered - totalExpected;
  const opId = detailId || "OPS-2401";

  return (
    <div className="space-y-4">
      <Breadcrumb items={[
        { label: "لوحة التحكم", onClick: () => navigate("acc-dashboard") },
        { label: "المبيعات", onClick: () => navigate("acc-sales") },
        { label: opId }
      ]} />

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">💰</span>
              <div>
                <h2 className="font-bold text-gray-800 text-xl">تقرير المبيعات اليومي</h2>
                <p className="text-gray-500 text-sm mt-0.5">فرع الرياض - العليا · 14 أكتوبر 2025 · نهاية الشفت</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <Badge className="bg-blue-50 text-blue-700">{opId}</Badge>
              {!approved && <Badge className="bg-amber-50 text-amber-700">⏳ ينتظر موافقتك</Badge>}
              {approved && <Badge className="bg-emerald-50 text-emerald-700">✓ تمت الموافقة</Badge>}
              <Badge className="bg-gray-50 text-gray-500">مدير الفرع: أحمد الشمري</Badge>
              <Badge className="bg-gray-50 text-gray-500">📱 أُرسل قبل ساعة</Badge>
            </div>
          </div>
          <div className={`rounded-xl px-5 py-3 text-center ${approved ? "bg-emerald-50" : "bg-purple-50"}`}>
            {approved ? (
              <>
                <CheckCircle2 size={28} className="text-emerald-500 mx-auto" />
                <p className="text-emerald-700 font-bold mt-1 text-sm">تمت الموافقة</p>
                <p className="text-emerald-500 text-xs">بانتظار رئيس الحسابات</p>
              </>
            ) : (
              <>
                <p className="text-gray-500 text-xs">إجمالي المبيعات</p>
                <p className="font-bold text-purple-700 text-2xl font-mono mt-0.5">{totalEntered.toLocaleString()}<span className="text-sm mr-1">ر.س</span></p>
                {totalDiff !== 0 && <p className="text-red-500 text-xs mt-0.5 font-medium">⚠ فرق: {Math.abs(totalDiff)} ر.س</p>}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 space-y-4">
          <Card title="جدول المقارنة والتسوية" actions={<span className="text-xs text-gray-400">6 قنوات تحصيل</span>}>
            <table className="w-full" dir="rtl">
              <thead className="bg-gray-50">
                <tr className="text-xs text-gray-500 font-semibold">
                  <th className="px-4 py-3 text-right">قناة التحصيل</th>
                  <th className="px-4 py-3 text-center">المبلغ المُدخل</th>
                  <th className="px-4 py-3 text-center">المبلغ المتوقع</th>
                  <th className="px-4 py-3 text-center">الفرق</th>
                  <th className="px-4 py-3 text-center">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {channels.map(ch => {
                  const diff = ch.entered - ch.expected;
                  return (
                    <tr key={ch.name} className={`hover:bg-gray-50 ${diff !== 0 ? "bg-red-50/50" : ""}`}>
                      <td className="px-4 py-3 font-medium text-gray-800 text-sm">{ch.icon} {ch.name}</td>
                      <td className="px-4 py-3 text-center font-mono font-semibold text-gray-800 text-sm">{ch.entered.toLocaleString()} ر.س</td>
                      <td className="px-4 py-3 text-center font-mono text-gray-600 text-sm">{ch.expected.toLocaleString()} ر.س</td>
                      <td className="px-4 py-3 text-center">{diff === 0 ? <span className="text-emerald-600 font-mono text-sm">—</span> : <span className="text-red-600 font-bold font-mono text-sm">{diff} ر.س</span>}</td>
                      <td className="px-4 py-3 text-center">{diff === 0 ? <Badge className="bg-emerald-50 text-emerald-700">✓ متطابق</Badge> : <Badge className="bg-red-50 text-red-700">⚠ فرق</Badge>}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-gray-50 border-t-2 border-gray-200">
                <tr className="font-bold">
                  <td className="px-4 py-3 text-gray-700">المجموع الكلي</td>
                  <td className="px-4 py-3 text-center font-mono text-purple-700">{totalEntered.toLocaleString()} ر.س</td>
                  <td className="px-4 py-3 text-center font-mono text-gray-600">{totalExpected.toLocaleString()} ر.س</td>
                  <td className="px-4 py-3 text-center font-mono text-red-600">{totalDiff !== 0 ? `${totalDiff} ر.س` : "—"}</td>
                  <td className="px-4 py-3 text-center">{totalDiff === 0 ? <Badge className="bg-emerald-50 text-emerald-700">✓ مطابق</Badge> : <Badge className="bg-red-50 text-red-700">⚠ فرق {Math.abs(totalDiff)} ر.س</Badge>}</td>
                </tr>
              </tfoot>
            </table>
            {totalDiff !== 0 && (
              <div className="mx-4 mb-4 mt-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle size={15} className="text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-amber-800 font-semibold text-sm">يوجد فرق في قناة جاهز</p>
                    <p className="text-amber-700 text-xs mt-0.5">الفرق: 150 ر.س — يُخصم من حساب المسؤول: محمد العبدلي (مدير الشفت)</p>
                    <p className="text-amber-600 text-xs mt-1">يجب إدخال سبب الفرق أو مراجعة مع مدير الفرع قبل الموافقة.</p>
                  </div>
                </div>
              </div>
            )}
          </Card>

          <Card title="سجل النشاط">
            <div className="p-4 space-y-3">
              {[
                { action: "تم إرسال التقرير", by: "أحمد الشمري (مدير الفرع)", time: "9:15 ص", icon: "📱", color: "bg-blue-50 text-blue-600" },
                { action: "تم الاستلام", by: "النظام", time: "9:15 ص", icon: "✅", color: "bg-gray-50 text-gray-500" },
                { action: "قيد المراجعة", by: "أحمد محمد (محاسب)", time: "10:22 ص", icon: "👁", color: "bg-purple-50 text-purple-600" },
              ].map((log, i) => (
                <div key={i} className="flex gap-3">
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0 ${log.color}`}>{log.icon}</span>
                  <div><p className="text-xs font-medium text-gray-700">{log.action}</p><p className="text-[10px] text-gray-400">{log.by} · {log.time}</p></div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          {!approved && (
            <Card title="الإجراءات">
              <div className="p-4 space-y-2.5">
                <button onClick={() => setApproved(true)} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 transition-colors">
                  <CheckCircle2 size={15} /> موافقة — إرسال لرئيس الحسابات
                </button>
                <button onClick={() => { setDetailId(opId); setModal("reject"); }} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-50 text-red-700 font-semibold text-sm hover:bg-red-100 border border-red-200">
                  <XCircle size={15} /> رفض — إعادة لمدير الفرع
                </button>
                <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-50 text-blue-700 font-semibold text-sm hover:bg-blue-100 border border-blue-200">
                  <MessageSquare size={15} /> طلب توضيح
                </button>
              </div>
            </Card>
          )}

          <Card title="المرفقات (3)">
            <div className="p-4 space-y-2">
              {[
                { name: "تقرير POS الرئيسي.pdf", type: "PDF", size: "245 KB" },
                { name: "كشف بنك الرياض.pdf", type: "PDF", size: "182 KB" },
                { name: "تقرير هنقرستيشن.xlsx", type: "Excel", size: "98 KB" },
              ].map((att, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-1.5 py-0.5 rounded font-bold ${att.type === "PDF" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>{att.type}</span>
                    <div><p className="text-xs font-medium text-gray-700">{att.name}</p><p className="text-[10px] text-gray-400">{att.size}</p></div>
                  </div>
                  <div className="flex gap-1">
                    <button className="p-1.5 rounded hover:bg-gray-200"><Eye size={11} className="text-gray-500" /></button>
                    <button className="p-1.5 rounded hover:bg-gray-200"><Download size={11} className="text-gray-500" /></button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card title="ملاحظات المحاسب">
            <div className="p-4">
              <textarea className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 resize-none mb-2" rows={3} placeholder="أضف ملاحظة..." />
              <Btn variant="ghost" className="w-full justify-center text-xs">حفظ الملاحظة</Btn>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function AccExpenses({ navigate, setModal, setDetailId }: PageProps) {
  const expenses = [
    { id: "EXP-0445", vendor: "مصبغة النور", category: "خدمات تنظيف", amount: "1,200", invoice: "INV-2241", match: "exact" as const, attachments: 2, status: "pending" as const, branch: "فرع الرياض - العليا", timeAgo: "قبل ساعة" },
    { id: "EXP-0444", vendor: "شركة المياه الوطنية", category: "فواتير مياه", amount: "850", invoice: "INV-2240", match: "review" as const, attachments: 1, status: "pending" as const, branch: "فرع جدة - الحمراء", timeAgo: "قبل 3 ساعات" },
    { id: "EXP-0443", vendor: "شركة الكهرباء", category: "فواتير كهرباء", amount: "3,400", invoice: "INV-2239", match: "diff" as const, attachments: 1, status: "pending" as const, branch: "فرع مكة - المعابدة", timeAgo: "قبل 5 ساعات" },
    { id: "EXP-0442", vendor: "شركة الصيانة المتكاملة", category: "صيانة دورية", amount: "2,100", invoice: "INV-2238", match: "exact" as const, attachments: 3, status: "approved" as const, branch: "فرع الدمام", timeAgo: "أمس" },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">موديول المصروفات</h2>
          <p className="text-gray-400 text-sm mt-0.5">التحقق من الفواتير ومطابقتها مع طلبات الشراء</p>
        </div>
        <Btn size="sm" variant="primary"><RefreshCw size={13} /> تحديث</Btn>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <KpiCard label="مصروفات اليوم" value="22,450 ر.س" sub="إجمالي المصروفات" icon={<Wallet size={18} className="text-red-600" />} borderColor="border-l-red-500" />
        <KpiCard label="فواتير معلقة" value="22" sub="للمراجعة" icon={<Clock size={18} className="text-amber-600" />} borderColor="border-l-amber-500" />
        <KpiCard label="فواتير مطابقة" value="45" sub="تمت الموافقة عليها" icon={<CheckCircle2 size={18} className="text-emerald-600" />} borderColor="border-l-emerald-500" />
        <KpiCard label="فروق مكتشفة" value="5" sub="تحتاج مراجعة" icon={<AlertTriangle size={18} className="text-red-600" />} borderColor="border-l-red-500" />
      </div>

      <Card title="فواتير المصروفات" actions={<Btn size="sm" variant="success">✓ موافقة جماعية</Btn>}>
        <table className="w-full" dir="rtl">
          <thead className="bg-gray-50">
            <tr className="text-xs text-gray-500 font-semibold">
              <th className="px-4 py-3 text-right">رقم الفاتورة</th>
              <th className="px-4 py-3 text-right">المورد</th>
              <th className="px-4 py-3 text-right">الفئة</th>
              <th className="px-4 py-3 text-right">الفرع</th>
              <th className="px-4 py-3 text-center">المبلغ</th>
              <th className="px-4 py-3 text-center">الحالة</th>
              <th className="px-4 py-3 text-center">إجراء</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {expenses.map(exp => {
              const match = MATCH_CONFIG[exp.match];
              const status = STATUS_CONFIG[exp.status];
              return (
                <tr key={exp.id} className={`hover:bg-gray-50 ${exp.match === "diff" ? "border-r-4 border-r-red-400" : ""}`}>
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs text-purple-600 font-semibold">{exp.id}</span>
                    <p className="text-[10px] text-gray-400">{exp.timeAgo}</p>
                  </td>
                  <td className="px-4 py-3 font-medium text-sm text-gray-800">{exp.vendor}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{exp.category}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{exp.branch}</td>
                  <td className="px-4 py-3 text-center font-mono font-bold text-gray-800">{exp.amount} ر.س</td>
                  <td className="px-4 py-3 text-center">
                    <Badge className={`${match.cls} border`}>{match.label}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => { setDetailId(exp.id); navigate("acc-sales-detail"); }} className="p-1.5 rounded hover:bg-gray-100"><Eye size={13} className="text-gray-500" /></button>
                      {exp.status === "pending" && (
                        <>
                          <button className="p-1.5 rounded hover:bg-emerald-50"><ThumbsUp size={13} className="text-emerald-600" /></button>
                          <button onClick={() => { setDetailId(exp.id); setModal("reject"); }} className="p-1.5 rounded hover:bg-red-50"><ThumbsDown size={13} className="text-red-500" /></button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function AccPurchases({ navigate, setModal, setDetailId }: PageProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const purchases = [
    { id: "PUR-1105", supplier: "شركة الدواجن الوطنية", branch: "فرع الرياض - العليا", items: 4, invoiceAmt: "4,800", receivedAmt: "4,650", match: "diff" as const, status: "pending" as const, timeAgo: "قبل ساعة" },
    { id: "PUR-1104", supplier: "مطاحن الملك", branch: "فرع جدة - الحمراء", items: 2, invoiceAmt: "2,100", receivedAmt: "2,100", match: "exact" as const, status: "approved" as const, timeAgo: "قبل 3 ساعات" },
    { id: "PUR-1103", supplier: "مزرعة الخير", branch: "فرع مكة - المعابدة", items: 6, invoiceAmt: "8,200", receivedAmt: "7,900", match: "review" as const, status: "pending" as const, timeAgo: "قبل 5 ساعات" },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">موديول المشتريات</h2>
          <p className="text-gray-400 text-sm mt-0.5">مطابقة الكميات المستلمة مع الفواتير الواردة من الموردين</p>
        </div>
        <Btn size="sm" variant="primary"><RefreshCw size={13} /> تحديث</Btn>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <KpiCard label="إجمالي المشتريات" value="31,200 ر.س" sub="هذا الأسبوع" icon={<ShoppingCart size={18} className="text-blue-600" />} borderColor="border-l-blue-500" />
        <KpiCard label="طلبات معلقة" value="8" sub="للمراجعة" icon={<Clock size={18} className="text-amber-600" />} borderColor="border-l-amber-500" />
        <KpiCard label="فروق في الكمية" value="3" sub="تحتاج إجراء" icon={<AlertTriangle size={18} className="text-red-600" />} borderColor="border-l-red-500" />
        <KpiCard label="موردون نشطون" value="12" sub="هذا الشهر" icon={<Truck size={18} className="text-purple-600" />} borderColor="border-l-purple-500" />
      </div>

      <Card title="طلبات الشراء">
        <div className="divide-y divide-gray-100">
          {purchases.map(pur => {
            const match = MATCH_CONFIG[pur.match];
            const diffAmt = parseInt(pur.invoiceAmt.replace(",","")) - parseInt(pur.receivedAmt.replace(",",""));
            return (
              <div key={pur.id} className={`${pur.match === "diff" ? "border-r-4 border-r-red-400" : ""}`}>
                <div className="px-5 py-4 flex items-center gap-4 hover:bg-gray-50/70">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-gray-800 text-sm">{pur.supplier}</span>
                      <span className="text-gray-300">·</span>
                      <span className="text-xs font-mono text-purple-600">{pur.id}</span>
                      <span className="text-gray-300">·</span>
                      <span className="text-xs text-gray-400">{pur.branch}</span>
                      <span className="text-gray-300">·</span>
                      <span className="text-xs text-gray-400">⏰ {pur.timeAgo}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <Badge className={`${match.cls} border`}>{match.label}</Badge>
                      {diffAmt > 0 && <span className="text-xs text-red-600 font-medium">⚠ فرق: {diffAmt} ر.س</span>}
                      <span className="text-xs text-gray-500">{pur.items} أصناف</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">الفاتورة / المستلم</p>
                    <p className="font-mono font-bold text-gray-800 text-sm">{pur.invoiceAmt} / {pur.receivedAmt}<span className="text-xs text-gray-400"> ر.س</span></p>
                  </div>
                  <div className="flex gap-1.5">
                    <Btn size="sm" onClick={() => setExpandedId(expandedId === pur.id ? null : pur.id)}>
                      {expandedId === pur.id ? <ChevronUp size={13} /> : <ChevronDown size={13} />} تفاصيل
                    </Btn>
                    {pur.status === "pending" && <Btn size="sm" variant="success"><ThumbsUp size={13} /></Btn>}
                    {pur.status === "pending" && <Btn size="sm" variant="danger" onClick={() => { setDetailId(pur.id); setModal("reject"); }}><ThumbsDown size={13} /></Btn>}
                  </div>
                </div>
                {expandedId === pur.id && (
                  <div className="px-5 pb-4 bg-gray-50/50">
                    <table className="w-full border border-gray-200 rounded-xl overflow-hidden text-xs">
                      <thead className="bg-gray-100">
                        <tr><th className="px-3 py-2 text-right">الصنف</th><th className="px-3 py-2 text-center">الوحدة</th><th className="px-3 py-2 text-center">الكمية المطلوبة</th><th className="px-3 py-2 text-center">الكمية المستلمة</th><th className="px-3 py-2 text-center">سعر الوحدة</th><th className="px-3 py-2 text-center">الحالة</th></tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {[
                          { item: "دجاج طازج", unit: "كجم", ordered: 50, received: 48, price: "24" },
                          { item: "حليب طازج", unit: "لتر", ordered: 100, received: 100, price: "4.5" },
                          { item: "خضار متنوعة", unit: "كجم", ordered: 30, received: 27, price: "8" },
                          { item: "بطاطس", unit: "كجم", ordered: 80, received: 80, price: "3.5" },
                        ].map((item, i) => {
                          const diff = item.ordered - item.received;
                          return (
                            <tr key={i} className={`${diff > 0 ? "bg-red-50/60" : "bg-white"}`}>
                              <td className="px-3 py-2 font-medium">{item.item}</td>
                              <td className="px-3 py-2 text-center">{item.unit}</td>
                              <td className="px-3 py-2 text-center">{item.ordered}</td>
                              <td className={`px-3 py-2 text-center font-semibold ${diff > 0 ? "text-red-600" : ""}`}>{item.received}</td>
                              <td className="px-3 py-2 text-center">{item.price} ر.س</td>
                              <td className="px-3 py-2 text-center">{diff === 0 ? <Badge className="bg-emerald-50 text-emerald-700">مطابق</Badge> : <Badge className="bg-red-50 text-red-700">فرق {diff}</Badge>}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

function AccInventory({ navigate, setModal, setDetailId }: PageProps) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">موديول المخزون</h2>
          <p className="text-gray-400 text-sm mt-0.5">متابعة الجرد اليومي والهدر</p>
        </div>
        <div className="flex gap-2">
          <Btn size="sm" onClick={() => navigate("acc-inventory-items")} variant="primary">
            <Package size={13} /> تحديد أصناف الجرد
          </Btn>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <KpiCard label="عمليات الجرد اليوم" value="18" sub="من 50 فرع" icon={<Package size={18} className="text-amber-600" />} borderColor="border-l-amber-500" />
        <KpiCard label="معلقة للمراجعة" value="5" sub="تنتظرك" icon={<Clock size={18} className="text-amber-600" />} borderColor="border-l-amber-500" />
        <KpiCard label="هدر مسجل" value="1,240 ر.س" sub="هذا الأسبوع" icon={<AlertTriangle size={18} className="text-red-600" />} borderColor="border-l-red-500" />
        <KpiCard label="تطابق الجرد" value="89%" sub="هذا الشهر" icon={<CheckCircle2 size={18} className="text-emerald-600" />} borderColor="border-l-emerald-500" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <Card title="تقارير الجرد اليومي">
            {[
              { branch: "فرع الرياض - العليا", items: 10, match: "exact" as const, waste: "120 ر.س", submitted: "8:30 ص" },
              { branch: "فرع جدة - الحمراء", items: 10, match: "review" as const, waste: "380 ر.س", submitted: "9:00 ص" },
              { branch: "فرع مكة - المعابدة", items: 8, match: "diff" as const, waste: "50 ر.س", submitted: "9:45 ص" },
            ].map((inv, i) => {
              const match = MATCH_CONFIG[inv.match];
              return (
                <div key={i} className="px-5 py-4 flex items-center gap-4 border-b border-gray-100 last:border-0 hover:bg-gray-50">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 text-sm">{inv.branch}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={`${match.cls} border`}>{match.label}</Badge>
                      <span className="text-xs text-gray-400">{inv.items} أصناف · هدر: {inv.waste}</span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">أُرسل {inv.submitted}</span>
                  <div className="flex gap-1.5">
                    <Btn size="sm"><Eye size={12} /> عرض</Btn>
                    <Btn size="sm" variant="success"><ThumbsUp size={12} /></Btn>
                    <Btn size="sm" variant="danger"><ThumbsDown size={12} /></Btn>
                  </div>
                </div>
              );
            })}
          </Card>
        </div>
        <div>
          <Card title="الأصناف المحددة للجرد" actions={
            <button onClick={() => navigate("acc-inventory-items")} className="text-xs text-purple-600 hover:underline flex items-center gap-1">تعديل <ChevronRight size={11} /></button>
          }>
            <div className="p-4 space-y-2">
              {["دجاج طازج", "حليب طازج", "خس", "طماطم", "بطاطس", "زيت قلي", "كاتشب", "ماء معدني", "عصير برتقال", "خبز"].map((item, i) => (
                <div key={i} className="flex items-center gap-2 py-1.5 border-b border-gray-50 last:border-0">
                  <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
                  <span className="text-sm text-gray-700">{item}</span>
                  <span className="text-[10px] text-gray-400 mr-auto">كجم</span>
                </div>
              ))}
              <button onClick={() => navigate("acc-inventory-items")} className="w-full mt-2 text-xs text-purple-600 border border-purple-200 rounded-lg py-2 hover:bg-purple-50">
                + تعديل الأصناف المحددة
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function AccInventoryItems({ navigate }: PageProps) {
  const [selected, setSelected] = useState<string[]>(["دجاج طازج", "حليب طازج", "خس", "طماطم", "بطاطس", "زيت قلي", "كاتشب", "ماء معدني", "عصير برتقال", "خبز"]);
  const [filter, setFilter] = useState("الكل");
  const [saved, setSaved] = useState(false);

  const items = [
    { name: "دجاج طازج", cat: "بروتين", unit: "كجم" }, { name: "خبز برجر", cat: "مخبوزات", unit: "قطعة" },
    { name: "جبنة شيدر", cat: "ألبان", unit: "كجم" }, { name: "حليب طازج", cat: "ألبان", unit: "لتر" },
    { name: "طماطم", cat: "خضروات", unit: "كجم" }, { name: "خس", cat: "خضروات", unit: "كجم" },
    { name: "بطاطس", cat: "خضروات", unit: "كجم" }, { name: "بصل", cat: "خضروات", unit: "كجم" },
    { name: "صوص خاص", cat: "صوصات", unit: "كجم" }, { name: "زيت قلي", cat: "زيوت", unit: "لتر" },
    { name: "مايونيز", cat: "صوصات", unit: "كجم" }, { name: "كاتشب", cat: "صوصات", unit: "كجم" },
    { name: "ماء معدني", cat: "مشروبات", unit: "لتر" }, { name: "مشروبات غازية", cat: "مشروبات", unit: "علبة" },
    { name: "عصير برتقال", cat: "مشروبات", unit: "لتر" },
  ];
  const cats = ["الكل", "بروتين", "ألبان", "خضروات", "صوصات", "زيوت", "مشروبات", "مخبوزات"];
  const filtered = filter === "الكل" ? items : items.filter(i => i.cat === filter);

  const toggle = (name: string) => setSelected(prev => prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]);

  return (
    <div className="space-y-5">
      <Breadcrumb items={[
        { label: "لوحة التحكم", onClick: () => navigate("acc-dashboard") },
        { label: "المخزون", onClick: () => navigate("acc-inventory") },
        { label: "تحديد أصناف الجرد اليومي" }
      ]} />

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">تحديد أصناف الجرد اليومي</h2>
          <p className="text-gray-400 text-sm mt-0.5">حدد الأصناف التي يجب على مدير الفرع جردها يومياً — يتم التزامن فوراً مع تطبيق الموبايل</p>
        </div>
        <div className="flex gap-2">
          <Btn size="sm" variant="primary" onClick={() => setSaved(true)}>
            <RefreshCw size={13} /> حفظ وتحديث التطبيق فوراً
          </Btn>
        </div>
      </div>

      {saved && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0" />
          <div>
            <p className="text-emerald-800 font-semibold text-sm">تم الحفظ والإرسال بنجاح!</p>
            <p className="text-emerald-600 text-xs mt-0.5">تم إرسال القائمة إلى مدير الفرع على تطبيق الموبايل مع إشعار فوري.</p>
          </div>
          <button onClick={() => setSaved(false)} className="mr-auto text-emerald-400 hover:text-emerald-600"><X size={16} /></button>
        </div>
      )}

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center gap-3">
        <Bell size={16} className="text-amber-600 flex-shrink-0" />
        <p className="text-amber-700 text-sm font-medium">التزامن مع الموبايل: أي تغيير يُحدَّث فوراً في تطبيق مدير الفرع مع إشعار تلقائي.</p>
      </div>

      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 space-y-4">
          {/* Category filter */}
          <div className="flex gap-2 flex-wrap">
            {cats.map(cat => (
              <button key={cat} onClick={() => setFilter(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${filter === cat ? "bg-purple-600 text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`}>
                {cat}
              </button>
            ))}
          </div>

          <Card title={`الأصناف المتاحة — ${filtered.length} صنف`} actions={
            <div className="flex gap-2">
              <button onClick={() => setSelected(items.map(i => i.name))} className="text-xs text-purple-600 hover:underline">تحديد الكل</button>
              <button onClick={() => setSelected([])} className="text-xs text-red-500 hover:underline">إلغاء الكل</button>
            </div>
          }>
            <div className="p-4 grid grid-cols-2 gap-2.5">
              {filtered.map(item => {
                const isSelected = selected.includes(item.name);
                return (
                  <button key={item.name} onClick={() => toggle(item.name)}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border-2 transition-all text-right cursor-pointer ${isSelected ? "border-purple-300 bg-purple-50/60" : "border-gray-100 bg-white hover:border-gray-200"}`}>
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 ${isSelected ? "bg-purple-600" : "bg-gray-200"}`}>
                      {isSelected && <span className="text-white text-[10px]">✓</span>}
                    </div>
                    <div className="text-right flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800">{item.name}</p>
                      <p className="text-[10px] text-gray-400">{item.cat} · {item.unit}</p>
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="px-4 pb-4 text-xs text-gray-400 text-center">{items.length} صنف متاح</div>
          </Card>
        </div>

        <div>
          <Card title="الأصناف المحددة للجرد" actions={<Badge className="bg-purple-100 text-purple-700">{selected.length} صنف</Badge>}>
            <div className="p-4">
              {selected.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Package size={32} className="mx-auto mb-2 opacity-40" />
                  <p className="text-sm">لم يتم اختيار أي صنف بعد</p>
                </div>
              ) : (
                <div className="space-y-1.5 mb-4">
                  {selected.map((name, i) => (
                    <div key={name} className="flex items-center gap-2 py-1.5">
                      <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
                      <span className="text-sm text-gray-700 flex-1">{name}</span>
                      <button onClick={() => toggle(name)} className="text-gray-300 hover:text-red-400"><X size={13} /></button>
                    </div>
                  ))}
                </div>
              )}
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-xs text-amber-700 mb-3">
                ⚠ عند الضغط على «حفظ وتحديث التطبيق»، سيُرسل هذه القائمة إلى مدير الفرع عبر إشعار في التطبيق.
              </div>
              <Btn variant="primary" className="w-full justify-center" onClick={() => setSaved(true)}>
                <RefreshCw size={13} /> تحديث التطبيق فوراً
              </Btn>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function AccShifts({ navigate, setModal }: PageProps) {
  const shifts = [
    { name: "خالد الشمري", role: "مشرف الشفت", branch: "فرع الرياض - العليا", start: "8:00 ص", duration: "3:22 ساعة", orders: 87, sales: "12,500", cash: "4,200", status: "active" as const },
    { name: "محمد العتيبي", role: "كاشير رئيسي", branch: "فرع الرياض - العليا", start: "8:00 ص", duration: "3:22 ساعة", orders: 87, sales: "12,500", cash: null, status: "active" as const },
    { name: "سعد الدوسري", role: "مشرف الشفت", branch: "فرع مكة - المعابدة", start: "6:00 ص", duration: "5:22 ساعة", orders: 45, sales: "9,200", cash: "3,800", status: "late" as const },
    { name: "فهد القحطاني", role: "كاشير", branch: "فرع جدة - الحمراء", start: "7:00 ص", duration: "4:22 ساعة", orders: 63, sales: "9,200", cash: "3,800", status: "active" as const },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">إدارة الشفتات النشطة</h2>
          <p className="text-gray-400 text-sm mt-0.5">متابعة الشفتات النشطة في جميع الفروع المخصصة في الوقت الفعلي</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            مباشر — آخر تحديث: الآن
          </span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <KpiCard label="شفتات نشطة الآن" value="5" sub="" icon={<span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>} borderColor="border-l-emerald-500" />
        <KpiCard label="شفتات متأخرة" value="1" sub="تحتاج متابعة" icon={<AlertTriangle size={18} className="text-amber-600" />} borderColor="border-l-amber-500" />
        <KpiCard label="إجمالي مبيعات الشفتات" value="54K ر.س" sub="" icon={<TrendingUp size={18} className="text-purple-600" />} borderColor="border-l-purple-500" />
        <KpiCard label="إجمالي الطلبات النشطة" value="368" sub="" icon={<ShoppingCart size={18} className="text-blue-600" />} borderColor="border-l-blue-500" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {shifts.map((sh, i) => (
          <div key={i} className={`bg-white rounded-xl border shadow-sm p-4 ${sh.status === "late" ? "border-amber-300 bg-amber-50/30" : "border-gray-100"}`}>
            {sh.status === "late" && (
              <div className="flex items-center gap-2 text-amber-700 text-xs font-semibold mb-3 bg-amber-100 rounded-lg px-3 py-2">
                <AlertTriangle size={13} /> انتهى وقت الشفت — لم يُغلق الصندوق بعد
              </div>
            )}
            <div className="flex items-center gap-3 mb-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-cyan-400 flex items-center justify-center text-white font-bold text-sm">
                  {sh.name[0]}
                </div>
                <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${sh.status === "late" ? "bg-amber-500" : "bg-emerald-500"}`}></span>
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-800 text-sm">{sh.name}</p>
                <p className="text-xs text-gray-500">{sh.role} · {sh.branch}</p>
              </div>
              <Badge className={sh.status === "late" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}>
                {sh.status === "late" ? "تأخير" : "نشط"}
              </Badge>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="bg-gray-50 rounded-lg p-2 text-center">
                <p className="text-[10px] text-gray-400">بداية الشفت</p>
                <p className="text-sm font-bold text-gray-800">{sh.start}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-2 text-center">
                <p className="text-[10px] text-gray-400">مدة الشفت</p>
                <p className="text-sm font-bold text-gray-800">{sh.duration}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-2 text-center">
                <p className="text-[10px] text-gray-400">الطلبات</p>
                <p className="text-sm font-bold text-gray-800">{sh.orders}</p>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm mb-3">
              <span className="text-gray-500 text-xs">مبيعات الشفت</span>
              <span className="font-bold text-purple-700">{sh.sales} ر.س</span>
            </div>
            {sh.cash && (
              <div className="flex items-center justify-between text-sm mb-3">
                <span className="text-gray-500 text-xs">الصندوق النقدي</span>
                <span className="font-bold text-gray-700">{sh.cash} ر.س</span>
              </div>
            )}
            <div className="flex gap-2">
              <button onClick={() => setModal("contact-employee")} className="flex-1 flex items-center justify-center gap-1.5 text-xs py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">
                <Phone size={12} /> تواصل مع الموظف
              </button>
              <button className="flex-1 flex items-center justify-center gap-1.5 text-xs py-2 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100">
                <Eye size={12} /> عرض التفاصيل
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AccEmployees({ navigate, setModal }: PageProps) {
  const [selectedEmp, setSelectedEmp] = useState<number | null>(0);
  const employees = [
    { name: "أحمد الشمري", role: "مشرف الشفت", branch: "فرع الرياض - العليا", balance: "+1,250", type: "credit" as const },
    { name: "محمد العتيبي", role: "كاشير رئيسي", branch: "فرع الرياض - العليا", balance: "-350", type: "debit" as const },
    { name: "سعد الدوسري", role: "مشرف الشفت", branch: "فرع مكة - المعابدة", balance: "+800", type: "credit" as const },
    { name: "فهد القحطاني", role: "كاشير", branch: "فرع جدة - الحمراء", balance: "0", type: "neutral" as const },
  ];

  const movements = [
    { date: "14 أكتوبر", desc: "عمولة مبيعات الشفت الصباحي", type: "credit", amount: "+500" },
    { date: "14 أكتوبر", desc: "خصم - نقص في الصندوق", type: "debit", amount: "-150" },
    { date: "13 أكتوبر", desc: "عمولة مبيعات الشفت المسائي", type: "credit", amount: "+500" },
    { date: "12 أكتوبر", desc: "سلفة - تقدمت بطلب", type: "debit", amount: "-500" },
    { date: "11 أكتوبر", desc: "عمولة مبيعات الشفت الصباحي", type: "credit", amount: "+500" },
    { date: "10 أكتوبر", desc: "حافز أداء - أكثر مبيعات", type: "credit", amount: "+400" },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-800">كشف حساب الموظفين</h2>
        <p className="text-gray-400 text-sm mt-0.5">الحركات المالية والأرصدة لكل موظف في الفروع المخصصة</p>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <Card title="قائمة الموظفين">
          <div className="divide-y divide-gray-100">
            {employees.map((emp, i) => (
              <button key={i} onClick={() => setSelectedEmp(i)}
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-right ${selectedEmp === i ? "bg-purple-50/50" : ""}`}>
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-400 to-cyan-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {emp.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-800">{emp.name}</p>
                  <p className="text-xs text-gray-400">{emp.role} · {emp.branch}</p>
                </div>
                <span className={`font-mono font-bold text-sm ${emp.type === "credit" ? "text-emerald-600" : emp.type === "debit" ? "text-red-600" : "text-gray-500"}`}>
                  {emp.balance} ر.س
                </span>
              </button>
            ))}
          </div>
        </Card>

        {selectedEmp !== null && (
          <div className="space-y-4">
            <Card title={`كشف حساب: ${employees[selectedEmp].name}`} actions={
              <div className="flex gap-2">
                <Btn size="sm"><Download size={12} /> PDF</Btn>
                <button onClick={() => setModal("contact-employee")} className="text-xs px-2 py-1 rounded border border-gray-200 text-gray-600 hover:bg-gray-50 flex items-center gap-1"><Phone size={11} /> تواصل</button>
              </div>
            }>
              <div className="p-4">
                <div className="bg-gray-50 rounded-xl p-3 mb-4 grid grid-cols-3 gap-3 text-center">
                  <div><p className="text-[10px] text-gray-400">الرصيد الحالي</p><p className={`font-bold text-base ${employees[selectedEmp].type === "credit" ? "text-emerald-600" : employees[selectedEmp].type === "debit" ? "text-red-600" : "text-gray-700"}`}>{employees[selectedEmp].balance} ر.س</p></div>
                  <div><p className="text-[10px] text-gray-400">إجمالي الدائن</p><p className="font-bold text-emerald-600">+2,400 ر.س</p></div>
                  <div><p className="text-[10px] text-gray-400">إجمالي المدين</p><p className="font-bold text-red-600">-1,150 ر.س</p></div>
                </div>
                <div className="space-y-2">
                  {movements.map((m, i) => (
                    <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0 ${m.type === "credit" ? "bg-emerald-50" : "bg-red-50"}`}>
                        {m.type === "credit" ? "⬆" : "⬇"}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-700">{m.desc}</p>
                        <p className="text-[10px] text-gray-400">{m.date}</p>
                      </div>
                      <span className={`font-mono font-bold text-sm ${m.type === "credit" ? "text-emerald-600" : "text-red-600"}`}>{m.amount} ر.س</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

function AccCash({ navigate }: PageProps) {
  const branches = [
    { branch: "فرع الرياض - العليا", custodian: "أحمد الشمري", amount: "5,000", used: "3,200", remaining: "1,800", lastUpdate: "اليوم 9:00 ص" },
    { branch: "فرع جدة - الحمراء", custodian: "سعد القحطاني", amount: "3,000", used: "2,800", remaining: "200", lastUpdate: "اليوم 8:30 ص" },
    { branch: "فرع مكة - المعابدة", custodian: "فهد العتيبي", amount: "4,000", used: "1,500", remaining: "2,500", lastUpdate: "أمس" },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-800">إدارة العهد النقدية</h2>
        <p className="text-gray-400 text-sm mt-0.5">متابعة العهد النقدية لكل فرع وتتبع الصرفيات</p>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <KpiCard label="إجمالي العهد" value="12,000 ر.س" sub="موزعة على 3 فروع" icon={<ArrowLeftRight size={18} className="text-orange-600" />} borderColor="border-l-orange-500" />
        <KpiCard label="المصروف" value="7,500 ر.س" sub="هذا الشهر" icon={<Wallet size={18} className="text-red-600" />} borderColor="border-l-red-500" />
        <KpiCard label="المتبقي" value="4,500 ر.س" sub="في الصناديق" icon={<CheckCircle2 size={18} className="text-emerald-600" />} borderColor="border-l-emerald-500" />
      </div>
      <Card title="كشف العهود النقدية">
        <table className="w-full" dir="rtl">
          <thead className="bg-gray-50">
            <tr className="text-xs text-gray-500 font-semibold">
              <th className="px-4 py-3 text-right">الفرع</th>
              <th className="px-4 py-3 text-right">المسؤول</th>
              <th className="px-4 py-3 text-center">إجمالي العهدة</th>
              <th className="px-4 py-3 text-center">المصروف</th>
              <th className="px-4 py-3 text-center">المتبقي</th>
              <th className="px-4 py-3 text-center">آخر تحديث</th>
              <th className="px-4 py-3 text-center">إجراء</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {branches.map((b, i) => {
              const pct = Math.round((parseInt(b.used.replace(",","")) / parseInt(b.amount.replace(",",""))) * 100);
              const isLow = parseInt(b.remaining.replace(",","")) < 500;
              return (
                <tr key={i} className={`hover:bg-gray-50 ${isLow ? "bg-red-50/30" : ""}`}>
                  <td className="px-4 py-3 font-semibold text-sm text-gray-800">{b.branch}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{b.custodian}</td>
                  <td className="px-4 py-3 text-center font-mono font-semibold">{b.amount} ر.س</td>
                  <td className="px-4 py-3 text-center">
                    <div>
                      <span className="font-mono text-sm text-red-600">{b.used} ر.س</span>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1"><div className="bg-red-400 h-1.5 rounded-full" style={{ width: `${pct}%` }}></div></div>
                    </div>
                  </td>
                  <td className={`px-4 py-3 text-center font-mono font-bold ${isLow ? "text-red-600" : "text-emerald-600"}`}>{b.remaining} ر.س</td>
                  <td className="px-4 py-3 text-center text-xs text-gray-400">{b.lastUpdate}</td>
                  <td className="px-4 py-3 text-center"><Btn size="sm"><Eye size={12} /> عرض</Btn></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function AccAssets({ navigate }: PageProps) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-800">الأصول الثابتة</h2>
        <p className="text-gray-400 text-sm mt-0.5">قائمة الأصول الثابتة وبيانات الاستهلاك — للعرض فقط</p>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <KpiCard label="إجمالي الأصول" value="1.24M ر.س" sub="القيمة الدفترية" icon={<Building2 size={18} className="text-purple-600" />} borderColor="border-l-purple-500" />
        <KpiCard label="الاستهلاك الشهري" value="18,500 ر.س" sub="" icon={<TrendingUp size={18} className="text-amber-600" />} borderColor="border-l-amber-500" />
        <KpiCard label="عدد الأصول" value="148" sub="في 50 فرع" icon={<BarChart3 size={18} className="text-blue-600" />} borderColor="border-l-blue-500" />
      </div>
      <Card title="قائمة الأصول الثابتة">
        <table className="w-full" dir="rtl">
          <thead className="bg-gray-50">
            <tr className="text-xs text-gray-500 font-semibold">
              <th className="px-4 py-3 text-right">الأصل</th>
              <th className="px-4 py-3 text-right">الفئة</th>
              <th className="px-4 py-3 text-right">الفرع</th>
              <th className="px-4 py-3 text-center">التكلفة</th>
              <th className="px-4 py-3 text-center">القيمة الدفترية</th>
              <th className="px-4 py-3 text-center">الاستهلاك الشهري</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {[
              { asset: "ثلاجة عرض كبيرة", cat: "معدات", branch: "فرع الرياض - العليا", cost: "28,000", book: "21,000", monthly: "466" },
              { asset: "نظام POS متكامل", cat: "تقنية", branch: "فرع جدة - الحمراء", cost: "15,000", book: "9,000", monthly: "250" },
              { asset: "شاشات عرض المنيو", cat: "تقنية", branch: "فرع مكة - المعابدة", cost: "8,500", book: "7,083", monthly: "142" },
              { asset: "فرن صناعي", cat: "معدات", branch: "فرع الدمام", cost: "45,000", book: "37,500", monthly: "750" },
            ].map((a, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-sm text-gray-800">{a.asset}</td>
                <td className="px-4 py-3 text-xs"><Badge className="bg-blue-50 text-blue-700">{a.cat}</Badge></td>
                <td className="px-4 py-3 text-xs text-gray-500">{a.branch}</td>
                <td className="px-4 py-3 text-center font-mono text-sm">{a.cost} ر.س</td>
                <td className="px-4 py-3 text-center font-mono text-sm font-semibold text-purple-700">{a.book} ر.س</td>
                <td className="px-4 py-3 text-center font-mono text-sm text-amber-600">{a.monthly} ر.س</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function AccReports({ navigate }: PageProps) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-800">التقارير</h2>
        <p className="text-gray-400 text-sm mt-0.5">تقارير الأداء والملخصات المالية</p>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {["تقرير المبيعات الشهري","تقرير المصروفات","تقرير المشتريات","كشف الحسابات","تقرير المخزون","تقرير الأداء العام"].map((rep, i) => (
          <button key={i} className="bg-white rounded-xl border border-gray-100 p-5 text-right hover:border-purple-200 hover:bg-purple-50/30 transition-all shadow-sm">
            <div className="text-3xl mb-3">📊</div>
            <p className="font-semibold text-gray-800 text-sm">{rep}</p>
            <p className="text-xs text-gray-400 mt-1">أكتوبر 2025</p>
            <div className="flex items-center gap-2 mt-3">
              <Btn size="sm"><Eye size={11} /> عرض</Btn>
              <Btn size="sm"><Download size={11} /> تحميل</Btn>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// HEAD ACCOUNTANT PAGES
// ══════════════════════════════════════════════════════════════

function HeadDashboard({ navigate, setModal, setDetailId }: PageProps) {
  type GroupData = { id: string; name: string; module: string; total: string; ops: typeof OPERATIONS; expanded: boolean };
  const [groups, setGroups] = useState<GroupData[]>([
    { id: "g1", name: "أحمد محمد الشهري", module: "المبيعات", total: "72,240", ops: OPERATIONS.slice(0, 3), expanded: true },
    { id: "g2", name: "أحمد محمد الشهري", module: "المصروفات", total: "4,650", ops: OPERATIONS.slice(0, 2), expanded: false },
    { id: "g3", name: "سارة العمري", module: "المشتريات", total: "5,850", ops: OPERATIONS.slice(1, 3), expanded: false },
    { id: "g4", name: "محمد الحربي", module: "المخزون", total: "8,500", ops: OPERATIONS.slice(0, 1), expanded: false },
  ]);
  const [tab, setTab] = useState<"approval" | "performance" | "erp">("approval");

  const toggleGroup = (id: string) => setGroups(g => g.map(gr => gr.id === id ? { ...gr, expanded: !gr.expanded } : gr));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">لوحة رئيس الحسابات 👑</h2>
          <p className="text-gray-400 text-sm mt-0.5">الإشراف على 4 محاسبين · 100 فرع · الاعتماد النهائي وترحيل ERP</p>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4">
        <KpiCard label="عمليات وافق عليها المحاسبون" value="78" sub="تنتظر اعتمادي النهائي" icon={<Clock size={18} className="text-amber-600" />} borderColor="border-l-amber-500" />
        <KpiCard label="اعتمدتها اليوم" value="45" sub="تم الترحيل لـ ERP" icon={<CheckCircle2 size={18} className="text-emerald-600" />} borderColor="border-l-emerald-500" />
        <KpiCard label="المحاسبون الأربعة" value="4/4" sub="نشطون الآن" icon={<Users size={18} className="text-blue-600" />} borderColor="border-l-blue-500" />
        <KpiCard label="عمليات مرفوضة (للمراجعة)" value="3" sub="يجب مراجعتها" icon={<XCircle size={18} className="text-red-600" />} borderColor="border-l-red-500" />
        <KpiCard label="معدل الأداء العام" value="87%" sub="هذا الشهر" icon={<TrendingUp size={18} className="text-purple-600" />} borderColor="border-l-purple-500" />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {[
          { id: "approval" as const, label: "✅ الاعتماد النهائي" },
          { id: "performance" as const, label: "👥 أداء المحاسبين" },
          { id: "erp" as const, label: "🔗 الترحيل لـ ERP" },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors -mb-px ${tab === t.id ? "border-purple-600 text-purple-700" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "approval" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">العمليات مجمعة حسب المحاسب والموديول · يمكنك اعتماد كل مجموعة دفعةً واحدة</p>
            <Btn variant="success" onClick={() => {}}>✅ اعتماد الكل</Btn>
          </div>
          {groups.map(group => (
            <div key={group.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className={`flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-gray-50 ${group.expanded ? "border-b border-gray-100" : ""}`} onClick={() => toggleGroup(group.id)}>
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-400 to-cyan-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {group.name[0]}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-800 text-sm">{group.name}</span>
                    <Badge className="bg-blue-50 text-blue-700">{group.module}</Badge>
                    {group.ops.some(o => o.match === "diff") && <Badge className="bg-red-50 text-red-700">⚠ يوجد فروق</Badge>}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{group.ops.length} عمليات موافق عليها من المحاسب</p>
                </div>
                <span className="font-mono font-bold text-purple-700 ml-4">{group.total} ر.س</span>
                <div className="flex items-center gap-2">
                  <Btn size="sm" variant="success" onClick={e => { e.stopPropagation(); }}><CheckCircle2 size={13} /> اعتماد الكل</Btn>
                  <Btn size="sm" variant="danger" onClick={e => { e.stopPropagation(); setModal("reject"); }}><XCircle size={13} /> إرجاع للمراجعة</Btn>
                  {group.expanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                </div>
              </div>
              {group.expanded && (
                <div>
                  {group.ops.map(op => (
                    <div key={op.id} className="flex items-center gap-3 px-5 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                      <span className="font-mono text-xs text-purple-600 font-semibold w-20 flex-shrink-0">{op.id}</span>
                      <span className="text-sm text-gray-700 flex-1">{op.branch}</span>
                      <Badge className={`${MATCH_CONFIG[op.match].cls} border`}>{MATCH_CONFIG[op.match].label}</Badge>
                      <span className="text-xs text-gray-400">⏰ {op.timeAgo}</span>
                      <span className="font-mono font-semibold text-gray-800">{op.amount} ر.س</span>
                      <div className="flex gap-1">
                        <button onClick={() => { setDetailId(op.id); navigate("head-detail"); }} className="p-1.5 rounded hover:bg-gray-100"><Eye size={13} className="text-gray-500" /></button>
                        <button className="p-1.5 rounded hover:bg-emerald-50"><ThumbsUp size={13} className="text-emerald-600" /></button>
                        <button onClick={() => { setDetailId(op.id); setModal("reject"); }} className="p-1.5 rounded hover:bg-red-50"><ThumbsDown size={13} className="text-red-500" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === "performance" && <HeadAccountants navigate={navigate} setModal={setModal} setDetailId={setDetailId} detailId={null} />}
      {tab === "erp" && <HeadERP navigate={navigate} setModal={setModal} setDetailId={setDetailId} detailId={null} />}
    </div>
  );
}

function HeadPending({ navigate, setModal, setDetailId }: PageProps) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">العمليات بانتظار الاعتماد</h2>
          <p className="text-gray-400 text-sm mt-0.5">125 عملية وافق عليها المحاسبون — تنتظر اعتمادك النهائي</p>
        </div>
        <Btn variant="success" size="sm">✅ اعتماد الكل</Btn>
      </div>
      <Card title="قائمة العمليات المعلقة">
        {OPERATIONS.map(op => (
          <OperationRow key={op.id} op={op}
            onView={() => { setDetailId(op.id); navigate("head-sales"); }}
            onReject={() => { setDetailId(op.id); setModal("reject"); }}
            onApprove={() => {}} onClarify={() => {}}
          />
        ))}
      </Card>
    </div>
  );
}

function HeadApproved({ navigate }: PageProps) {
  const approved = OPERATIONS.filter(o => o.status === "approved");
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-800">العمليات المعتمدة نهائياً</h2>
        <p className="text-gray-400 text-sm mt-0.5">تم اعتمادها وترحيلها للـ ERP</p>
      </div>
      <Card title="العمليات المعتمدة">
        {approved.map(op => (
          <div key={op.id} className="px-5 py-4 flex items-center gap-4 border-b border-gray-100 last:border-0 hover:bg-gray-50">
            <Badge className="bg-purple-50 text-purple-700">{op.module}</Badge>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-gray-800">{op.branch}</span>
                <span className="text-xs font-mono text-gray-400">{op.id}</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Badge className="bg-emerald-50 text-emerald-700">✓ معتمد نهائياً</Badge>
                <Badge className="bg-blue-50 text-blue-700">✓ مُرحَّل لـ ERP</Badge>
              </div>
            </div>
            <span className="font-mono font-bold text-gray-800">{op.amount} ر.س</span>
            <span className="text-xs text-gray-400">{op.timeAgo}</span>
          </div>
        ))}
      </Card>
    </div>
  );
}

function HeadRejected({ setModal, setDetailId }: PageProps) {
  const rejected = OPERATIONS.filter(o => o.status === "rejected");
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-800">العمليات المرفوضة</h2>
        <p className="text-gray-400 text-sm mt-0.5">العمليات التي تم رفضها وإعادتها للمحاسب أو مدير الفرع</p>
      </div>
      <Card title="العمليات المرفوضة">
        {rejected.map(op => (
          <div key={op.id} className="px-5 py-4 flex items-center gap-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 border-r-4 border-r-red-400">
            <Badge className="bg-purple-50 text-purple-700">{op.module}</Badge>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-gray-800">{op.branch}</span>
                <span className="text-xs font-mono text-gray-400">{op.id}</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Badge className="bg-red-50 text-red-700">✕ مرفوض</Badge>
                <span className="text-xs text-red-500">سبب: بيانات غير مكتملة</span>
              </div>
            </div>
            <span className="font-mono font-bold text-gray-800">{op.amount} ر.س</span>
            <Btn size="sm">إعادة للمراجعة</Btn>
          </div>
        ))}
      </Card>
    </div>
  );
}

function HeadModulePage({ module, navigate, setModal, setDetailId }: PageProps & { module: string }) {
  const moduleMap: Record<string, string> = { sales: "المبيعات", expenses: "المصروفات", purchases: "المشتريات", inventory: "المخزون", shifts: "الشفتات", employees: "كشف حساب الموظفين", cash: "العهد النقدية" };
  const label = moduleMap[module] || module;
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-800">{label}</h2>
        <p className="text-gray-400 text-sm mt-0.5">العمليات المعتمدة من المحاسبين — تنتظر الاعتماد النهائي</p>
      </div>
      <Card title={`عمليات ${label}`} actions={<Btn size="sm" variant="success">✅ اعتماد الكل</Btn>}>
        {OPERATIONS.map(op => (
          <OperationRow key={op.id} op={{ ...op, module: label }}
            onView={() => { setDetailId(op.id); navigate("head-pending"); }}
            onReject={() => { setDetailId(op.id); setModal("reject"); }}
            onApprove={() => {}} onClarify={() => {}}
          />
        ))}
      </Card>
    </div>
  );
}

function HeadAccountants({ navigate }: PageProps) {
  const accountants = [
    { name: "أحمد محمد الشهري", branches: 20, approved: 38, pending: 5, rate: 88, rating: 4.8 },
    { name: "سارة العمري", branches: 20, approved: 31, pending: 2, rate: 94, rating: 4.9 },
    { name: "محمد الحربي", branches: 20, approved: 18, pending: 8, rate: 69, rating: 3.8 },
    { name: "فاطمة السالم", branches: 20, approved: 42, pending: 1, rate: 98, rating: 5.0 },
  ];
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-800">أداء المحاسبين</h3>
        <Btn size="sm"><Download size={12} /> تصدير التقرير</Btn>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {accountants.map((acc, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-cyan-400 flex items-center justify-center text-white font-bold">
                {acc.name[0]}
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-800 text-sm">{acc.name}</p>
                <p className="text-xs text-gray-400">{acc.branches} فرع مخصص</p>
              </div>
              <div className="flex items-center gap-0.5">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} size={12} fill={s <= Math.round(acc.rating) ? "#F59E0B" : "none"} className={s <= Math.round(acc.rating) ? "text-amber-400" : "text-gray-200"} />
                ))}
                <span className="text-xs text-gray-500 mr-1">{acc.rating}</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center mb-3">
              <div className="bg-gray-50 rounded-lg p-2">
                <p className="text-[10px] text-gray-400">معتمدة</p>
                <p className="font-bold text-emerald-700 text-base">{acc.approved}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-2">
                <p className="text-[10px] text-gray-400">معلقة</p>
                <p className={`font-bold text-base ${acc.pending > 5 ? "text-red-600" : "text-amber-600"}`}>{acc.pending}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-2">
                <p className="text-[10px] text-gray-400">معدل الإنجاز</p>
                <p className={`font-bold text-base ${acc.rate >= 90 ? "text-emerald-600" : acc.rate >= 70 ? "text-amber-600" : "text-red-600"}`}>{acc.rate}%</p>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>معدل الإنجاز</span><span>{acc.rate}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className={`h-2 rounded-full transition-all ${acc.rate >= 90 ? "bg-emerald-500" : acc.rate >= 70 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${acc.rate}%` }}></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HeadERP({ navigate }: PageProps) {
  const [step, setStep] = useState<0 | 1 | 2>(0);
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">التصدير لـ ERP</h2>
          <p className="text-gray-400 text-sm mt-0.5">ترحيل العمليات المعتمدة نهائياً إلى نظام ERP المحاسبي</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center gap-4 mb-6">
          {[
            { n: 1, label: "اختيار الفترة", icon: "📅" },
            { n: 2, label: "معاينة البيانات", icon: "👁" },
            { n: 3, label: "تأكيد الإرسال", icon: "✅" },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-2 flex-1">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${step >= s.n - 1 ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-400"}`}>
                {step >= s.n ? "✓" : s.icon}
              </div>
              <span className={`text-sm font-medium ${step >= s.n - 1 ? "text-gray-800" : "text-gray-400"}`}>{s.label}</span>
              {i < 2 && <div className={`flex-1 h-0.5 mx-2 ${step >= s.n ? "bg-purple-300" : "bg-gray-200"}`}></div>}
            </div>
          ))}
        </div>

        {step === 0 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-xs font-semibold text-gray-600 block mb-1.5">نوع الترحيل</label>
                <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
                  <option>ترحيل يومي</option><option>ترحيل أسبوعي</option><option>ترحيل شهري</option>
                </select>
              </div>
              <div><label className="text-xs font-semibold text-gray-600 block mb-1.5">الفترة</label>
                <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
                  <option>14 أكتوبر 2025</option><option>13 أكتوبر 2025</option>
                </select>
              </div>
            </div>
            <div className="bg-blue-50 rounded-xl p-4">
              <p className="text-blue-800 font-semibold text-sm mb-2">ملخص البيانات الجاهزة للترحيل</p>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div><p className="text-2xl font-bold text-blue-700">45</p><p className="text-xs text-blue-600">عملية معتمدة</p></div>
                <div><p className="text-2xl font-bold text-blue-700">124,500</p><p className="text-xs text-blue-600">ر.س إجمالي</p></div>
                <div><p className="text-2xl font-bold text-blue-700">25</p><p className="text-xs text-blue-600">فرع مشارك</p></div>
              </div>
            </div>
            <Btn variant="primary" onClick={() => setStep(1)} className="justify-center">معاينة البيانات →</Btn>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <table className="w-full" dir="rtl">
              <thead className="bg-gray-50">
                <tr className="text-xs text-gray-500 font-semibold">
                  <th className="px-4 py-3 text-right">رقم العملية</th>
                  <th className="px-4 py-3 text-right">الموديول</th>
                  <th className="px-4 py-3 text-right">الفرع</th>
                  <th className="px-4 py-3 text-center">المبلغ</th>
                  <th className="px-4 py-3 text-center">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {OPERATIONS.filter(o => o.status === "approved").map(op => (
                  <tr key={op.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs text-purple-600">{op.id}</td>
                    <td className="px-4 py-3 text-sm">{op.module}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{op.branch}</td>
                    <td className="px-4 py-3 text-center font-mono font-bold">{op.amount} ر.س</td>
                    <td className="px-4 py-3 text-center"><Badge className="bg-emerald-50 text-emerald-700">جاهز</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex gap-3">
              <Btn onClick={() => setStep(0)}>← رجوع</Btn>
              <Btn variant="primary" onClick={() => setStep(2)} className="justify-center">تأكيد وإرسال للـ ERP →</Btn>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="text-center py-8 space-y-4">
            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
              <CheckCircle2 size={40} className="text-emerald-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">تم الترحيل بنجاح!</h3>
              <p className="text-gray-500 text-sm">تم إرسال 45 عملية بإجمالي 124,500 ر.س إلى نظام ERP المحاسبي</p>
              <p className="text-gray-400 text-xs mt-1">رقم دفعة الترحيل: ERP-BATCH-20251014-001</p>
            </div>
            <Btn onClick={() => setStep(0)} className="mx-auto">ترحيل جديد</Btn>
          </div>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// ADMIN PAGES
// ══════════════════════════════════════════════════════════════

function AdminOverview({ navigate, setModal }: PageProps) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">لوحة الأدمن الرئيسية 🧠</h2>
          <p className="text-gray-400 text-sm mt-0.5">إدارة شاملة للنظام — المستخدمون، المطاعم، الاشتراكات، الصلاحيات</p>
        </div>
        <Btn variant="primary" onClick={() => setModal("add-user")}><Plus size={14} /> إضافة مستخدم</Btn>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <KpiCard label="مطاعم نشطة" value="25" sub="+2 هذا الشهر" icon={<span className="text-xl">🏪</span>} borderColor="border-l-purple-500" />
        <KpiCard label="فروع نشطة" value="100" sub="+5 هذا الشهر" icon={<Home size={18} className="text-blue-600" />} borderColor="border-l-blue-500" />
        <KpiCard label="مستخدمون نشطون" value="2,450" sub="+12 هذا الشهر" icon={<Users size={18} className="text-emerald-600" />} borderColor="border-l-emerald-500" />
        <KpiCard label="وقت التشغيل" value="99.9%" sub="آخر 30 يوم" icon={<span className="text-xl">⚡</span>} borderColor="border-l-amber-500" />
      </div>

      <div className="grid grid-cols-2 gap-5">
        <Card title="توزيع المستخدمين" actions={
          <button onClick={() => navigate("admin-users")} className="text-xs text-purple-600 hover:underline flex items-center gap-1">إدارة <ChevronRight size={11} /></button>
        }>
          <div className="p-4 grid grid-cols-2 gap-3">
            {[
              { label: "محاسبون", count: 20, icon: "🧮", color: "bg-blue-50 text-blue-700" },
              { label: "رؤساء حسابات", count: 4, icon: "👑", color: "bg-amber-50 text-amber-700" },
              { label: "مدراء فروع", count: 75, icon: "🏪", color: "bg-emerald-50 text-emerald-700" },
              { label: "أدمن", count: 1, icon: "🧠", color: "bg-red-50 text-red-700" },
            ].map((u, i) => (
              <div key={i} className={`rounded-xl p-4 text-center ${u.color}`}>
                <div className="text-2xl mb-2">{u.icon}</div>
                <p className="font-bold text-2xl">{u.count}</p>
                <p className="text-xs mt-0.5">{u.label}</p>
              </div>
            ))}
          </div>
          <div className="px-4 pb-4 flex gap-2">
            <Btn size="sm" onClick={() => setModal("add-user")}><Plus size={12} /> إضافة مستخدم</Btn>
            <button onClick={() => navigate("admin-users")} className="text-xs text-purple-600 hover:underline flex items-center gap-1">عرض الكل <ChevronRight size={11} /></button>
          </div>
        </Card>

        <Card title="تنبيهات الاشتراكات" actions={
          <button onClick={() => navigate("admin-subscriptions")} className="text-xs text-purple-600 hover:underline flex items-center gap-1">إدارة <ChevronRight size={11} /></button>
        }>
          <div className="p-4 space-y-3">
            {[
              { name: "مطعم هرفي", days: 32, status: "warning" as const },
              { name: "مطعم ماكدونالدز السعودية", days: 7, status: "danger" as const },
              { name: "مطعم بروستد الوطني", days: -5, status: "expired" as const },
            ].map((sub, i) => (
              <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border ${sub.status === "expired" ? "border-red-200 bg-red-50/50" : sub.status === "danger" ? "border-amber-200 bg-amber-50/50" : "border-gray-200"}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0 ${sub.status === "expired" ? "bg-red-100" : "bg-amber-100"}`}>
                  {sub.status === "expired" ? "✕" : "⚠"}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-gray-800">{sub.name}</p>
                  <p className={`text-xs ${sub.status === "expired" ? "text-red-600" : "text-amber-600"}`}>
                    {sub.status === "expired" ? `منتهي منذ ${Math.abs(sub.days)} أيام` : `ينتهي خلال ${sub.days} يوم`}
                  </p>
                </div>
                <Btn size="sm" variant={sub.status === "expired" ? "danger" : "amber"}>
                  {sub.status === "expired" ? "تفعيل" : "تجديد"}
                </Btn>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card title="إجراءات سريعة">
        <div className="p-4 grid grid-cols-5 gap-3">
          {[
            { icon: "👤", label: "إضافة محاسب", action: () => setModal("add-user") },
            { icon: "🏪", label: "إضافة مطعم", action: () => navigate("admin-restaurants") },
            { icon: "📊", label: "توزيع المحاسبين", action: () => navigate("admin-users") },
            { icon: "💳", label: "إدارة الاشتراكات", action: () => navigate("admin-subscriptions") },
            { icon: "📋", label: "سجل النشاطات", action: () => navigate("admin-audit") },
          ].map((a, i) => (
            <button key={i} onClick={a.action}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50/30 transition-all cursor-pointer">
              <span className="text-2xl">{a.icon}</span>
              <span className="text-xs font-medium text-gray-600 text-center">{a.label}</span>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}

function AdminUsers({ navigate, setModal }: PageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const users = [
    { name: "أحمد محمد الشهري", email: "ahmed@asab.sa", role: "محاسب", restaurant: "مطعم الريم", branches: 20, status: "active" },
    { name: "سارة العمري", email: "sara@asab.sa", role: "محاسب", restaurant: "مطعم هرفي", branches: 20, status: "active" },
    { name: "خالد العمري", email: "khaled@asab.sa", role: "رئيس حسابات", restaurant: "جميع المطاعم", branches: 100, status: "active" },
    { name: "أحمد الشمري", email: "shammari@asab.sa", role: "مدير فرع", restaurant: "مطعم الريم", branches: 1, status: "active" },
    { name: "محمد الحربي", email: "harbi@asab.sa", role: "محاسب", restaurant: "مطعم ماكدونالدز", branches: 20, status: "inactive" },
    { name: "فاطمة السالم", email: "fatima@asab.sa", role: "محاسب", restaurant: "مطعم بروستد", branches: 20, status: "active" },
  ];
  const roleColors: Record<string, string> = {
    "محاسب": "bg-blue-50 text-blue-700",
    "رئيس حسابات": "bg-amber-50 text-amber-700",
    "مدير فرع": "bg-emerald-50 text-emerald-700",
    "أدمن": "bg-red-50 text-red-700",
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">إدارة المستخدمين</h2>
          <p className="text-gray-400 text-sm mt-0.5">100 مستخدم نشط في النظام</p>
        </div>
        <Btn variant="primary" onClick={() => setModal("add-user")}><Plus size={14} /> إضافة مستخدم</Btn>
      </div>

      <Card title="قائمة المستخدمين" actions={
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-1.5">
            <Search size={13} className="text-gray-400" />
            <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="بحث..." className="text-sm outline-none text-gray-600 w-36" />
          </div>
          <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600">
            <option>جميع الأدوار</option><option>محاسب</option><option>رئيس حسابات</option><option>مدير فرع</option>
          </select>
        </div>
      }>
        <table className="w-full" dir="rtl">
          <thead className="bg-gray-50">
            <tr className="text-xs text-gray-500 font-semibold">
              <th className="px-4 py-3 text-right">المستخدم</th>
              <th className="px-4 py-3 text-right">الدور</th>
              <th className="px-4 py-3 text-right">المطعم</th>
              <th className="px-4 py-3 text-center">الفروع</th>
              <th className="px-4 py-3 text-center">الحالة</th>
              <th className="px-4 py-3 text-center">إجراء</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.filter(u => !searchTerm || u.name.includes(searchTerm)).map((u, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-cyan-400 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">{u.name[0]}</div>
                    <div><p className="font-semibold text-sm text-gray-800">{u.name}</p><p className="text-xs text-gray-400">{u.email}</p></div>
                  </div>
                </td>
                <td className="px-4 py-3"><Badge className={roleColors[u.role] || "bg-gray-50 text-gray-700"}>{u.role}</Badge></td>
                <td className="px-4 py-3 text-sm text-gray-600">{u.restaurant}</td>
                <td className="px-4 py-3 text-center text-sm font-semibold text-gray-700">{u.branches}</td>
                <td className="px-4 py-3 text-center">
                  <Badge className={u.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-gray-50 text-gray-500"}>{u.status === "active" ? "نشط" : "غير نشط"}</Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-1">
                    <button className="p-1.5 rounded hover:bg-gray-100"><Edit2 size={13} className="text-gray-500" /></button>
                    <button className="p-1.5 rounded hover:bg-red-50"><Trash2 size={13} className="text-red-400" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function AdminRestaurants({ navigate }: PageProps) {
  const restaurants = [
    { name: "مطعم الريم", owner: "فيصل الريم", branches: 12, accountants: 4, status: "active", since: "يناير 2024" },
    { name: "مطعم هرفي", owner: "طلال الحسين", branches: 18, accountants: 6, status: "active", since: "مارس 2024" },
    { name: "ماكدونالدز السعودية", owner: "شركة المطعم العالمي", branches: 35, accountants: 8, status: "active", since: "يونيو 2024" },
    { name: "مطعم بروستد الوطني", owner: "محمد السعيد", branches: 8, accountants: 3, status: "suspended", since: "أغسطس 2024" },
    { name: "كافيه الرياض", owner: "سعد الدوسري", branches: 5, accountants: 2, status: "active", since: "سبتمبر 2024" },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">المطاعم والفروع</h2>
          <p className="text-gray-400 text-sm mt-0.5">25 مطعم نشط · 100 فرع إجمالاً</p>
        </div>
        <Btn variant="primary"><Plus size={14} /> إضافة مطعم</Btn>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {restaurants.map((r, i) => (
          <div key={i} className={`bg-white rounded-xl border shadow-sm p-4 ${r.status === "suspended" ? "border-red-200 bg-red-50/20" : "border-gray-100"}`}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-cyan-400 flex items-center justify-center text-white font-bold text-sm">
                {r.name[0]}
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-800 text-sm">{r.name}</p>
                <p className="text-xs text-gray-400">عميل منذ {r.since}</p>
              </div>
              <Badge className={r.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}>
                {r.status === "active" ? "نشط" : "معلق"}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-3 text-center">
              <div className="bg-gray-50 rounded-lg p-2"><p className="text-[10px] text-gray-400">الفروع</p><p className="font-bold text-gray-800">{r.branches}</p></div>
              <div className="bg-gray-50 rounded-lg p-2"><p className="text-[10px] text-gray-400">المحاسبون</p><p className="font-bold text-gray-800">{r.accountants}</p></div>
            </div>
            <div className="flex gap-2">
              <Btn size="sm" className="flex-1 justify-center"><Eye size={11} /> عرض</Btn>
              <Btn size="sm" variant="ghost" className="flex-1 justify-center"><Edit2 size={11} /> تعديل</Btn>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminSubscriptions({ navigate }: PageProps) {
  const subs = [
    { name: "مطعم الريم", plan: "بلاتيني", expires: "15 يناير 2026", branches: 12, status: "active" as const, daysLeft: 93 },
    { name: "مطعم هرفي", plan: "ذهبي", expires: "15 نوفمبر 2025", branches: 18, status: "warning" as const, daysLeft: 32 },
    { name: "ماكدونالدز السعودية", plan: "بلاتيني", expires: "21 أكتوبر 2025", branches: 35, status: "danger" as const, daysLeft: 7 },
    { name: "مطعم بروستد الوطني", plan: "فضي", expires: "9 أكتوبر 2025", branches: 8, status: "expired" as const, daysLeft: -5 },
  ];
  const statusConfig = {
    active: { cls: "bg-emerald-50 text-emerald-700 border-emerald-200", label: "نشط" },
    warning: { cls: "bg-amber-50 text-amber-700 border-amber-200", label: "قريب الانتهاء" },
    danger: { cls: "bg-red-50 text-red-700 border-red-200", label: "ينتهي قريباً جداً" },
    expired: { cls: "bg-red-50 text-red-700 border-red-200", label: "منتهي" },
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-800">الاشتراكات</h2>
        <p className="text-gray-400 text-sm mt-0.5">متابعة اشتراكات المطاعم وتواريخ التجديد</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {subs.map((sub, i) => {
          const sc = statusConfig[sub.status];
          return (
            <div key={i} className={`bg-white rounded-xl border-2 shadow-sm p-4 ${sc.cls}`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-bold text-gray-800">{sub.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">باقة {sub.plan} · {sub.branches} فرع</p>
                </div>
                <Badge className={sc.cls}>{sc.label}</Badge>
              </div>
              <div className="flex items-center justify-between text-sm mb-3">
                <span className="text-gray-500 text-xs">تاريخ الانتهاء</span>
                <span className={`font-semibold text-sm ${sub.status === "expired" || sub.status === "danger" ? "text-red-600" : "text-gray-800"}`}>{sub.expires}</span>
              </div>
              {sub.status !== "expired" && (
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-gray-400 mb-1"><span>المتبقي</span><span>{sub.daysLeft} يوم</span></div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className={`h-2 rounded-full ${sub.status === "active" ? "bg-emerald-500" : sub.status === "warning" ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${Math.min(100, (sub.daysLeft / 365) * 100)}%` }}></div>
                  </div>
                </div>
              )}
              <div className="flex gap-2">
                {sub.status === "expired" ? (
                  <Btn variant="danger" className="flex-1 justify-center">تفعيل الاشتراك</Btn>
                ) : (
                  <Btn variant="amber" className="flex-1 justify-center">تجديد الاشتراك</Btn>
                )}
                <Btn variant="ghost" className="flex-1 justify-center">تغيير الباقة</Btn>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AdminReports({ navigate }: PageProps) {
  const [step, setStep] = useState(0);
  const [uploaded, setUploaded] = useState(false);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-800">مدير التقارير</h2>
        <p className="text-gray-400 text-sm mt-0.5">استيراد تقارير ERP ومراجعتها وإرسالها لأصحاب المطاعم</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center gap-0 mb-6">
          {[
            { n: 1, label: "1. تصدير من ERP", icon: "🔗" },
            { n: 2, label: "2. رفع Excel", icon: "📊" },
            { n: 3, label: "3. مراجعة التقرير", icon: "👁" },
            { n: 4, label: "4. إرسال لأصحاب المطاعم", icon: "📤" },
          ].map((s, i) => (
            <div key={i} className="flex items-center flex-1">
              <button onClick={() => setStep(s.n - 1)} className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${step === s.n - 1 ? "bg-purple-600 text-white" : step > s.n - 1 ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-400"}`}>
                <span>{step >= s.n ? "✓" : s.icon}</span>
                <span className="text-xs font-semibold whitespace-nowrap">{s.label}</span>
              </button>
              {i < 3 && <div className={`flex-1 h-0.5 mx-1 ${step > i ? "bg-emerald-300" : "bg-gray-200"}`}></div>}
            </div>
          ))}
        </div>

        {step === 0 && (
          <div className="text-center py-6 space-y-4">
            <div className="text-5xl">🔗</div>
            <h3 className="font-bold text-gray-800">تصدير من نظام ERP</h3>
            <p className="text-gray-500 text-sm">يجب أولاً تصدير تقرير P&L من نظام ERP المحاسبي بصيغة Excel</p>
            <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-700 text-right max-w-sm mx-auto">
              <p className="font-semibold mb-1">الخطوات في نظام ERP:</p>
              <ol className="list-decimal list-inside space-y-1 text-xs">
                <li>افتح نظام ERP → التقارير</li>
                <li>اختر تقرير الأرباح والخسائر</li>
                <li>حدد الفترة الزمنية</li>
                <li>اضغط تصدير Excel</li>
              </ol>
            </div>
            <Btn variant="primary" onClick={() => setStep(1)} className="mx-auto">انتقل لرفع الملف →</Btn>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <h3 className="font-bold text-gray-800">رفع ملف Excel من نظام ERP</h3>
            {!uploaded ? (
              <div onClick={() => setUploaded(true)} className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center cursor-pointer hover:border-purple-400 hover:bg-purple-50/30 transition-all">
                <div className="text-5xl mb-3">📊</div>
                <p className="font-semibold text-gray-700 mb-1">اسحب وأفلت ملف Excel هنا</p>
                <p className="text-xs text-gray-400 mb-4">أو اضغط للاختيار · صيغ مقبولة: xlsx, xls, csv</p>
                <Btn variant="primary" className="mx-auto"><Upload size={14} /> اختيار الملف</Btn>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0" />
                  <div><p className="font-semibold text-sm text-emerald-800">تم رفع الملف بنجاح</p><p className="text-xs text-emerald-600">تقرير_اكتوبر_2025.xlsx · تم التحقق ✓</p></div>
                  <button onClick={() => setUploaded(false)} className="mr-auto text-emerald-400 hover:text-emerald-600"><X size={14} /></button>
                </div>
                <Btn variant="primary" onClick={() => setStep(2)} className="w-full justify-center">معاينة التقرير →</Btn>
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-800">معاينة تقرير الأرباح والخسائر</h3>
              <Badge className="bg-blue-50 text-blue-700">للعرض فقط — لا يمكن التعديل</Badge>
            </div>
            <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-purple-700 text-white px-5 py-3 text-center">
                <p className="font-bold">تقرير الأرباح والخسائر — أكتوبر 2025</p>
                <p className="text-purple-200 text-xs mt-0.5">مطعم هرفي · جميع الفروع</p>
              </div>
              <table className="w-full" dir="rtl">
                <tbody className="divide-y divide-gray-200">
                  {[
                    { label: "إجمالي الإيرادات", value: "842,500", isHeader: true, type: "income" },
                    { label: "   مبيعات المطعم", value: "820,000", type: "income" },
                    { label: "   إيرادات أخرى", value: "22,500", type: "income" },
                    { label: "إجمالي المصروفات", value: "(612,000)", isHeader: true, type: "expense" },
                    { label: "   تكلفة المواد الخام", value: "(320,000)", type: "expense" },
                    { label: "   رواتب الموظفين", value: "(180,000)", type: "expense" },
                    { label: "   إيجار وخدمات", value: "(72,000)", type: "expense" },
                    { label: "   مصروفات تشغيلية", value: "(40,000)", type: "expense" },
                    { label: "صافي الربح", value: "230,500", isHeader: true, type: "profit" },
                    { label: "هامش الربح", value: "27.4%", isHeader: true, type: "profit" },
                  ].map((row, i) => (
                    <tr key={i} className={row.isHeader ? "bg-gray-100" : "bg-white"}>
                      <td className={`px-5 py-2.5 text-sm ${row.isHeader ? "font-bold text-gray-800" : "text-gray-600"}`}>{row.label}</td>
                      <td className={`px-5 py-2.5 text-left font-mono text-sm ${row.type === "profit" ? "text-emerald-700 font-bold" : row.type === "expense" ? "text-red-600" : "text-gray-800"}`} dir="ltr">{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex gap-3">
              <Btn onClick={() => setStep(1)}>← رجوع</Btn>
              <Btn variant="primary" onClick={() => setStep(3)} className="flex-1 justify-center">إرسال لأصحاب المطاعم →</Btn>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h3 className="font-bold text-gray-800">إرسال التقارير لأصحاب المطاعم</h3>
            <div className="space-y-2">
              {["مطعم الريم — فيصل الريم", "مطعم هرفي — طلال الحسين", "ماكدونالدز السعودية — شركة المطعم العالمي"].map((r, i) => (
                <label key={i} className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm font-medium text-gray-700">{r}</span>
                  <span className="text-xs text-gray-400 mr-auto">البريد الإلكتروني + إشعار التطبيق</span>
                </label>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">صيغة الملف:</span>
              <label className="flex items-center gap-1.5 text-sm text-gray-600 cursor-pointer"><input type="radio" name="fmt" defaultChecked /> PDF</label>
              <label className="flex items-center gap-1.5 text-sm text-gray-600 cursor-pointer"><input type="radio" name="fmt" /> Excel</label>
            </div>
            <div className="flex gap-3">
              <Btn onClick={() => setStep(2)}>← رجوع</Btn>
              <button onClick={() => { setStep(0); setUploaded(false); }} className="flex-1 py-2.5 rounded-xl bg-purple-600 text-white font-semibold text-sm hover:bg-purple-700 transition-colors">
                📤 إرسال التقارير الآن
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function AdminAudit({ navigate }: PageProps) {
  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-gray-800">سجل النشاطات</h2>
      <Card title="آخر النشاطات">
        <div className="divide-y divide-gray-100">
          {[
            { action: "إضافة مستخدم جديد", user: "الأدمن - عبدالله الأحمد", time: "10:30 ص", icon: "👤", type: "info" },
            { action: "اعتماد نهائي لـ 45 عملية", user: "خالد العمري - رئيس الحسابات", time: "10:15 ص", icon: "✅", type: "success" },
            { action: "تجديد اشتراك مطعم هرفي", user: "الأدمن - عبدالله الأحمد", time: "9:45 ص", icon: "💳", type: "info" },
            { action: "رفض عملية OPS-2397", user: "أحمد محمد الشهري", time: "9:30 ص", icon: "❌", type: "danger" },
            { action: "تصدير بيانات ERP", user: "خالد العمري - رئيس الحسابات", time: "9:00 ص", icon: "🔗", type: "info" },
            { action: "تحديث أصناف الجرد اليومي", user: "أحمد محمد الشهري", time: "8:45 ص", icon: "📦", type: "info" },
          ].map((log, i) => (
            <div key={i} className="px-5 py-3.5 flex items-center gap-4 hover:bg-gray-50">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0 ${log.type === "success" ? "bg-emerald-50" : log.type === "danger" ? "bg-red-50" : "bg-gray-50"}`}>{log.icon}</div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">{log.action}</p>
                <p className="text-xs text-gray-400">{log.user}</p>
              </div>
              <span className="text-xs text-gray-400">{log.time}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function AdminPermissions({ navigate }: PageProps) {
  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-gray-800">الصلاحيات</h2>
      <Card title="مصفوفة الصلاحيات">
        <div className="overflow-x-auto">
          <table className="w-full text-xs" dir="rtl">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">الموديول / الصلاحية</th>
                {["محاسب", "رئيس حسابات", "مدير فرع", "مدير مشتريات", "مورد"].map(r => <th key={r} className="px-3 py-3 text-center font-semibold text-gray-600">{r}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                { module: "المبيعات - عرض", perms: [true, true, true, false, false] },
                { module: "المبيعات - مراجعة", perms: [true, true, false, false, false] },
                { module: "المبيعات - اعتماد", perms: [false, true, false, false, false] },
                { module: "المصروفات - إدخال", perms: [false, false, true, false, false] },
                { module: "المصروفات - اعتماد", perms: [true, true, false, false, false] },
                { module: "المشتريات - طلب", perms: [false, false, false, true, false] },
                { module: "المشتريات - اعتماد", perms: [true, true, false, false, false] },
                { module: "تصدير ERP", perms: [false, true, false, false, false] },
                { module: "إدارة المستخدمين", perms: [false, false, false, false, false] },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-700">{row.module}</td>
                  {row.perms.map((p, j) => (
                    <td key={j} className="px-3 py-3 text-center">{p ? <span className="text-emerald-500 text-base">✓</span> : <span className="text-gray-200 text-base">—</span>}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function AdminSettings({ navigate }: PageProps) {
  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-gray-800">إعدادات النظام</h2>
      <div className="grid grid-cols-2 gap-5">
        {[
          { title: "إعدادات الإشعارات", icon: "🔔", items: ["إشعارات الاعتماد", "تنبيهات الاشتراك", "تقارير الأداء اليومية"] },
          { title: "إعدادات النسخ الاحتياطي", icon: "💾", items: ["نسخ تلقائي يومي", "نسخ أسبوعي", "تشفير البيانات"] },
          { title: "إعدادات API", icon: "🔗", items: ["اتصال ERP", "اتصال بوابة الدفع", "واجهة تطبيق الموبايل"] },
          { title: "إعدادات الأمان", icon: "🔐", items: ["المصادقة الثنائية", "مدة الجلسة", "سياسة كلمة المرور"] },
        ].map((section, i) => (
          <Card key={i} title={`${section.icon} ${section.title}`}>
            <div className="p-4 space-y-3">
              {section.items.map((item, j) => (
                <div key={j} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <span className="text-sm text-gray-700">{item}</span>
                  <div className="flex items-center gap-2">
                    <div onClick={() => {}} className="w-10 h-5 rounded-full bg-purple-600 cursor-pointer relative"><div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5"></div></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// BRANCH MANAGER PAGES
// ══════════════════════════════════════════════════════════════

function BranchOverview({ navigate }: PageProps) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-800">نظرة عامة — فرع الرياض العليا</h2>
        <p className="text-gray-400 text-sm mt-0.5">الاثنين، 14 أكتوبر 2025</p>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <KpiCard label="مبيعات اليوم" value="18,340 ر.س" sub="" icon={<TrendingUp size={18} className="text-emerald-600" />} borderColor="border-l-emerald-500" />
        <KpiCard label="الطلبات" value="87" sub="هذا الشفت" icon={<ShoppingCart size={18} className="text-blue-600" />} borderColor="border-l-blue-500" />
        <KpiCard label="الموظفون" value="12" sub="نشطون الآن" icon={<Users size={18} className="text-purple-600" />} borderColor="border-l-purple-500" />
        <KpiCard label="التقارير المطلوبة" value="3" sub="تنتظر الرفع" icon={<AlertTriangle size={18} className="text-amber-600" />} borderColor="border-l-amber-500" />
      </div>
      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2">
          <Card title="التقارير المطلوب رفعها اليوم">
            {[
              { name: "جرد المخزون اليومي", deadline: "قبل 11 م", urgent: true, items: "10 أصناف" },
              { name: "تقرير المبيعات اليومي", deadline: "قبل 10 م", urgent: false, items: "POS + التطبيقات" },
              { name: "كشف حساب الصندوق", deadline: "بعد إغلاق الشفت", urgent: false, items: "" },
            ].map((t, i) => (
              <div key={i} className={`px-5 py-4 flex items-center gap-4 border-b border-gray-100 last:border-0 ${t.urgent ? "bg-red-50/30" : ""}`}>
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${t.urgent ? "bg-red-500 animate-pulse" : "bg-gray-300"}`}></div>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-gray-800">{t.name}</p>
                  {t.items && <p className="text-xs text-gray-400 mt-0.5">{t.items}</p>}
                </div>
                <span className="text-xs text-gray-500">{t.deadline}</span>
                <Btn size="sm" variant="primary"><Upload size={12} /> رفع</Btn>
              </div>
            ))}
          </Card>
        </div>
        <div>
          <Card title="الشفت الحالي">
            <div className="p-4 space-y-3">
              <div className="text-center py-2">
                <p className="text-3xl font-bold text-purple-700">08:00 — الآن</p>
                <p className="text-gray-400 text-xs mt-1">مدة: 3:22 ساعة</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 space-y-2">
                <div className="flex justify-between text-sm"><span className="text-gray-500">المشرف</span><span className="font-semibold">خالد الشمري</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">الطلبات</span><span className="font-semibold text-emerald-700">87 طلب</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">المبيعات</span><span className="font-semibold text-purple-700">12,500 ر.س</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">الصندوق</span><span className="font-semibold">4,200 ر.س</span></div>
              </div>
              <Btn variant="danger" className="w-full justify-center">إغلاق الشفت</Btn>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function BranchEmployees({ navigate }: PageProps) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">الموظفون</h2>
        <Btn variant="primary" size="sm"><Plus size={13} /> إضافة موظف</Btn>
      </div>
      <Card title="قائمة الموظفين — فرع الرياض العليا">
        <table className="w-full" dir="rtl">
          <thead className="bg-gray-50">
            <tr className="text-xs text-gray-500 font-semibold">
              <th className="px-4 py-3 text-right">الموظف</th>
              <th className="px-4 py-3 text-right">الدور</th>
              <th className="px-4 py-3 text-center">الراتب</th>
              <th className="px-4 py-3 text-center">الشفت الحالي</th>
              <th className="px-4 py-3 text-center">الحالة</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {[
              { name: "خالد الشمري", role: "مشرف الشفت", salary: "4,500", shift: "صباحي", active: true },
              { name: "محمد العتيبي", role: "كاشير رئيسي", salary: "3,200", shift: "صباحي", active: true },
              { name: "سعد الدوسري", role: "كاشير", salary: "2,800", shift: "مسائي", active: false },
              { name: "أحمد الغامدي", role: "عامل مطبخ", salary: "2,500", shift: "صباحي", active: true },
            ].map((emp, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-cyan-400 flex items-center justify-center text-white font-bold text-xs">{emp.name[0]}</div>
                    <span className="font-semibold text-sm text-gray-800">{emp.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{emp.role}</td>
                <td className="px-4 py-3 text-center font-mono text-sm font-semibold">{emp.salary} ر.س</td>
                <td className="px-4 py-3 text-center"><Badge className="bg-gray-50 text-gray-600">{emp.shift}</Badge></td>
                <td className="px-4 py-3 text-center"><Badge className={emp.active ? "bg-emerald-50 text-emerald-700" : "bg-gray-50 text-gray-500"}>{emp.active ? "نشط" : "إجازة"}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function BranchItems({ navigate }: PageProps) {
  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-gray-800">الأصناف</h2>
      <Card title="قائمة الأصناف — مخصصة من المحاسب">
        <div className="p-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4 flex items-center gap-2">
            <Bell size={14} className="text-blue-600 flex-shrink-0" />
            <p className="text-blue-700 text-xs">هذه القائمة تم تحديدها بواسطة المحاسب وتزامنت مع التطبيق تلقائياً.</p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {["دجاج طازج", "حليب طازج", "خس", "طماطم", "بطاطس", "زيت قلي", "كاتشب", "ماء معدني", "عصير برتقال", "خبز"].map((item, i) => (
              <div key={i} className="flex items-center gap-2 p-2.5 rounded-lg border border-gray-100 bg-gray-50">
                <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
                <span className="text-sm text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

function BranchSuppliers({ navigate }: PageProps) {
  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-gray-800">الموردون</h2>
      <Card title="قائمة الموردين المعتمدين">
        {[
          { name: "شركة الدواجن الوطنية", category: "دواجن ولحوم", contact: "محمد العلي", phone: "0501234567" },
          { name: "مطاحن الملك", category: "دقيق ومخبوزات", contact: "سعد الدوسري", phone: "0507654321" },
          { name: "مزرعة الخير", category: "خضار وفواكه", contact: "فهد الشمري", phone: "0509876543" },
        ].map((sup, i) => (
          <div key={i} className="px-5 py-4 flex items-center gap-4 border-b border-gray-100 last:border-0 hover:bg-gray-50">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white font-bold">{sup.name[0]}</div>
            <div className="flex-1">
              <p className="font-semibold text-sm text-gray-800">{sup.name}</p>
              <p className="text-xs text-gray-400">{sup.category} · {sup.contact}</p>
            </div>
            <a href={`tel:${sup.phone}`} className="flex items-center gap-1.5 text-xs text-emerald-600 hover:underline"><Phone size={12} /> {sup.phone}</a>
          </div>
        ))}
      </Card>
    </div>
  );
}

function BranchUpload({ navigate }: PageProps) {
  const [uploads, setUploads] = useState<Record<string, boolean>>({});
  const reports = [
    { id: "sales", name: "تقرير المبيعات اليومي", desc: "تقرير POS + التطبيقات", required: true },
    { id: "inventory", name: "جرد المخزون اليومي", desc: "10 أصناف محددة", required: true },
    { id: "cash", name: "كشف حساب الصندوق", desc: "نقدي + مدفوعات", required: true },
    { id: "waste", name: "تقرير الهدر والتالف", desc: "الأصناف التالفة اليوم", required: false },
  ];

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-gray-800">رفع البيانات اليومية</h2>
      <div className="grid grid-cols-2 gap-4">
        {reports.map(rep => (
          <div key={rep.id} className={`bg-white rounded-xl border shadow-sm p-4 ${uploads[rep.id] ? "border-emerald-200 bg-emerald-50/30" : "border-gray-100"}`}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-semibold text-sm text-gray-800">{rep.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{rep.desc}</p>
              </div>
              {rep.required && <Badge className="bg-red-50 text-red-700">مطلوب</Badge>}
            </div>
            {uploads[rep.id] ? (
              <div className="flex items-center gap-2 text-emerald-700 text-sm">
                <CheckCircle2 size={16} />
                <span className="font-medium">تم الرفع بنجاح</span>
              </div>
            ) : (
              <div onClick={() => setUploads(p => ({ ...p, [rep.id]: true }))} className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center cursor-pointer hover:border-purple-400 hover:bg-purple-50/20 transition-all">
                <Upload size={20} className="text-gray-300 mx-auto mb-1" />
                <p className="text-xs text-gray-400">اضغط لرفع الملف</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// PROCUREMENT PAGES
// ══════════════════════════════════════════════════════════════

function ProcOverview({ navigate }: PageProps) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-800">لوحة تحكم المشتريات</h2>
        <p className="text-gray-400 text-sm mt-0.5">تجميع الطلبات من الفروع والتنسيق مع الموردين</p>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <KpiCard label="طلبات جديدة" value="45" sub="من 40 فرع" icon={<ShoppingCart size={18} className="text-red-600" />} borderColor="border-l-red-500" />
        <KpiCard label="طلبات مجمعة" value="12" sub="جاهزة للإرسال" icon={<Package size={18} className="text-blue-600" />} borderColor="border-l-blue-500" />
        <KpiCard label="أُرسلت للموردين" value="8" sub="بانتظار التأكيد" icon={<Truck size={18} className="text-amber-600" />} borderColor="border-l-amber-500" />
        <KpiCard label="قيمة الطلبات" value="148K ر.س" sub="هذا الأسبوع" icon={<TrendingUp size={18} className="text-purple-600" />} borderColor="border-l-purple-500" />
      </div>
      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2">
          <Card title="الطلبات الجديدة من الفروع" actions={<Btn size="sm" variant="primary"><Package size={12} /> تجميع الطلبات</Btn>}>
            {[
              { branch: "فرع الرياض - العليا", items: 4, total: "4,800", urgency: "عادي" },
              { branch: "فرع جدة - الحمراء", items: 6, total: "8,200", urgency: "عاجل" },
              { branch: "فرع مكة - المعابدة", items: 3, total: "3,100", urgency: "عادي" },
            ].map((req, i) => (
              <div key={i} className={`px-5 py-4 flex items-center gap-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 ${req.urgency === "عاجل" ? "border-r-4 border-r-red-400" : ""}`}>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-gray-800">{req.branch}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-400">{req.items} أصناف</span>
                    <Badge className={req.urgency === "عاجل" ? "bg-red-50 text-red-700" : "bg-gray-50 text-gray-600"}>{req.urgency}</Badge>
                  </div>
                </div>
                <span className="font-mono font-bold text-gray-800">{req.total} ر.س</span>
                <div className="flex gap-1.5">
                  <Btn size="sm"><Eye size={12} /> تفاصيل</Btn>
                  <Btn size="sm" variant="primary"><CheckCircle2 size={12} /> اعتماد</Btn>
                </div>
              </div>
            ))}
          </Card>
        </div>
        <div>
          <Card title="حالة الموردين">
            <div className="divide-y divide-gray-100">
              {[
                { name: "الدواجن الوطنية", status: "نشط", pending: 3 },
                { name: "مطاحن الملك", status: "نشط", pending: 1 },
                { name: "مزرعة الخير", status: "تأخير", pending: 2 },
              ].map((sup, i) => (
                <div key={i} className="px-4 py-3 flex items-center gap-3">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{sup.name}</p>
                    <p className="text-xs text-gray-400">{sup.pending} طلبات معلقة</p>
                  </div>
                  <Badge className={sup.status === "نشط" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}>{sup.status}</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ProcNewOrders({ navigate }: PageProps) {
  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-gray-800">الطلبات الجديدة</h2>
      <Card title="طلبات بانتظار المعالجة" actions={<Btn size="sm" variant="primary"><Package size={12} /> تجميع الكل</Btn>}>
        {[
          { branch: "فرع الرياض - العليا", items: 4, total: "4,800", urgency: "عادي" as const, time: "قبل 30 دقيقة" },
          { branch: "فرع جدة - الحمراء", items: 6, total: "8,200", urgency: "عاجل" as const, time: "قبل ساعة" },
          { branch: "فرع مكة - المعابدة", items: 3, total: "3,100", urgency: "عادي" as const, time: "قبل ساعتين" },
          { branch: "فرع الدمام", items: 5, total: "5,600", urgency: "عاجل" as const, time: "قبل 3 ساعات" },
        ].map((req, i) => (
          <div key={i} className={`px-5 py-4 flex items-center gap-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 ${req.urgency === "عاجل" ? "border-r-4 border-r-red-400" : ""}`}>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-gray-800">{req.branch}</span>
                <Badge className={req.urgency === "عاجل" ? "bg-red-50 text-red-700" : "bg-gray-50 text-gray-600"}>{req.urgency}</Badge>
              </div>
              <p className="text-xs text-gray-400 mt-1">{req.items} أصناف · {req.time}</p>
            </div>
            <span className="font-mono font-bold text-gray-800">{req.total} ر.س</span>
            <div className="flex gap-1.5">
              <Btn size="sm"><Eye size={12} /> عرض</Btn>
              <Btn size="sm" variant="primary"><CheckCircle2 size={12} /> اعتماد</Btn>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}

function ProcGrouped({ navigate }: PageProps) {
  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-gray-800">الطلبات المجمعة</h2>
      <p className="text-gray-400 text-sm">طلبات مجمعة حسب المورد وجاهزة للإرسال</p>
      <Card title="الطلبات المجمعة">
        {[
          { supplier: "شركة الدواجن الوطنية", branches: 12, items: 3, total: "28,400" },
          { supplier: "مطاحن الملك", branches: 8, items: 2, total: "14,200" },
          { supplier: "مزرعة الخير", branches: 15, items: 6, total: "32,100" },
        ].map((group, i) => (
          <div key={i} className="px-5 py-4 flex items-center gap-4 border-b border-gray-100 last:border-0 hover:bg-gray-50">
            <div className="flex-1">
              <p className="font-semibold text-sm text-gray-800">{group.supplier}</p>
              <p className="text-xs text-gray-400 mt-1">{group.branches} فرع · {group.items} أصناف مجمعة</p>
            </div>
            <span className="font-mono font-bold text-gray-800">{group.total} ر.س</span>
            <div className="flex gap-1.5">
              <Btn size="sm"><Eye size={12} /> تفاصيل</Btn>
              <Btn size="sm" variant="primary"><Truck size={12} /> إرسال للمورد</Btn>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}

function ProcSent({ navigate }: PageProps) {
  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-gray-800">المرسلة للموردين</h2>
      <Card title="الطلبات المرسلة">
        {[
          { supplier: "شركة الدواجن الوطنية", sent: "قبل ساعة", status: "مؤكد", total: "28,400" },
          { supplier: "مطاحن الملك", sent: "أمس", status: "قيد التحضير", total: "14,200" },
          { supplier: "مزرعة الخير", sent: "قبل يومين", status: "في الطريق", total: "32,100" },
        ].map((order, i) => (
          <div key={i} className="px-5 py-4 flex items-center gap-4 border-b border-gray-100 last:border-0 hover:bg-gray-50">
            <div className="flex-1">
              <p className="font-semibold text-sm text-gray-800">{order.supplier}</p>
              <p className="text-xs text-gray-400 mt-1">أُرسل {order.sent}</p>
            </div>
            <Badge className={order.status === "مؤكد" ? "bg-emerald-50 text-emerald-700" : order.status === "في الطريق" ? "bg-blue-50 text-blue-700" : "bg-amber-50 text-amber-700"}>{order.status}</Badge>
            <span className="font-mono font-bold text-gray-800">{order.total} ر.س</span>
            <Btn size="sm"><Eye size={12} /> تتبع</Btn>
          </div>
        ))}
      </Card>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// SUPPLIER PAGES
// ══════════════════════════════════════════════════════════════

function SupOverview({ navigate }: PageProps) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-800">لوحة تحكم المورد</h2>
        <p className="text-gray-400 text-sm mt-0.5">شركة الدواجن الوطنية</p>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <KpiCard label="طلبات جديدة" value="3" sub="تنتظر ردك" icon={<ShoppingCart size={18} className="text-red-600" />} borderColor="border-l-red-500" />
        <KpiCard label="طلبات مقبولة" value="12" sub="هذا الأسبوع" icon={<CheckCircle2 size={18} className="text-emerald-600" />} borderColor="border-l-emerald-500" />
        <KpiCard label="إجمالي المبيعات" value="285K ر.س" sub="هذا الشهر" icon={<TrendingUp size={18} className="text-purple-600" />} borderColor="border-l-purple-500" />
        <KpiCard label="العملاء النشطون" value="18" sub="مطعم" icon={<Users size={18} className="text-blue-600" />} borderColor="border-l-blue-500" />
      </div>
      <Card title="الطلبات الجديدة" actions={<Badge className="bg-red-50 text-red-700">3 جديدة</Badge>}>
        {[
          { restaurant: "مطعم هرفي", items: "دجاج طازج — 200 كجم", deadline: "غداً 8 ص", total: "4,800" },
          { restaurant: "ماكدونالدز السعودية", items: "دجاج مجمد — 500 كجم", deadline: "بعد غد", total: "10,500" },
          { restaurant: "مطعم الريم", items: "قطع مشكلة — 150 كجم", deadline: "اليوم 6 م", total: "3,600" },
        ].map((order, i) => (
          <div key={i} className="px-5 py-4 flex items-center gap-4 border-b border-gray-100 last:border-0 hover:bg-gray-50">
            <div className="flex-1">
              <p className="font-semibold text-sm text-gray-800">{order.restaurant}</p>
              <p className="text-xs text-gray-400 mt-1">{order.items} · التسليم: {order.deadline}</p>
            </div>
            <span className="font-mono font-bold text-gray-800">{order.total} ر.س</span>
            <div className="flex gap-1.5">
              <Btn size="sm" variant="success"><CheckCircle2 size={12} /> قبول</Btn>
              <Btn size="sm" variant="danger"><XCircle size={12} /> رفض</Btn>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}

function SupNewOrders({ navigate }: PageProps) {
  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-gray-800">الطلبات الجديدة</h2>
      <div className="space-y-4">
        {[
          { id: "ORD-5501", restaurant: "مطعم هرفي", items: [{ name: "دجاج طازج", qty: 200, unit: "كجم", price: 24 }], deadline: "غداً 8 ص", total: "4,800" },
          { id: "ORD-5500", restaurant: "ماكدونالدز السعودية", items: [{ name: "دجاج مجمد", qty: 500, unit: "كجم", price: 21 }], deadline: "بعد غد", total: "10,500" },
        ].map((order, i) => (
          <Card key={i} title={`${order.restaurant} · ${order.id}`} actions={
            <div className="flex gap-2">
              <Btn size="sm" variant="success"><CheckCircle2 size={12} /> قبول الطلب</Btn>
              <Btn size="sm" variant="danger"><XCircle size={12} /> رفض</Btn>
            </div>
          }>
            <div className="p-4">
              <table className="w-full text-sm" dir="rtl">
                <thead className="bg-gray-50">
                  <tr className="text-xs text-gray-500">
                    <th className="px-3 py-2 text-right">الصنف</th>
                    <th className="px-3 py-2 text-center">الكمية</th>
                    <th className="px-3 py-2 text-center">سعر الوحدة</th>
                    <th className="px-3 py-2 text-center">الإجمالي</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, j) => (
                    <tr key={j} className="border-t border-gray-100">
                      <td className="px-3 py-2.5 font-medium">{item.name}</td>
                      <td className="px-3 py-2.5 text-center">{item.qty} {item.unit}</td>
                      <td className="px-3 py-2.5 text-center font-mono">{item.price} ر.س</td>
                      <td className="px-3 py-2.5 text-center font-mono font-bold text-purple-700">{(item.qty * item.price).toLocaleString()} ر.س</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                <span className="text-sm text-gray-500">موعد التسليم: <strong className="text-gray-800">{order.deadline}</strong></span>
                <span className="font-mono font-bold text-lg text-purple-700">{order.total} ر.س</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Temporary ChevronLeft
function ChevronLeft({ size = 24, className = "" }: { size?: number; className?: string }) {
  return <ChevronRight size={size} className={`rotate-180 ${className}`} />;
}

// ══════════════════════════════════════════════════════════════
// MAIN EXPORT
// ══════════════════════════════════════════════════════════════
export function ASABPrototype() {
  const [state, setState] = useState<AppState>({
    role: null,
    page: "",
    detailId: null,
    modal: null,
  });

  const login = (role: RoleId) => {
    setState({ role, page: ROLE_PROFILES[role].defaultPage, detailId: null, modal: null });
  };

  const logout = () => {
    setState({ role: null, page: "", detailId: null, modal: null });
  };

  const navigate = (page: PageId) => {
    setState(s => ({ ...s, page, modal: null }));
  };

  const setModal = (modal: string | null) => {
    setState(s => ({ ...s, modal }));
  };

  const setDetailId = (detailId: string | null) => {
    setState(s => ({ ...s, detailId }));
  };

  if (!state.role) {
    return <LoginScreen onLogin={login} />;
  }

  return (
    <AppShell
      state={state}
      navigate={navigate}
      logout={logout}
      setModal={setModal}
      setDetailId={setDetailId}
    />
  );
}

export default ASABPrototype;
