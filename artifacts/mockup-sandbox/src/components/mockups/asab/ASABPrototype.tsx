import "./_group.css";
import { useState, useMemo, ReactNode } from "react";
import {
  LayoutDashboard, TrendingUp, Wallet, ShoppingCart, Package, Building2, Clock,
  Users, ArrowLeftRight, BarChart3, Settings, Bell, LogOut, ChevronRight,
  ChevronDown, ChevronUp, CheckCircle2, XCircle, MessageSquare, Eye, Download,
  AlertTriangle, Paperclip, ThumbsUp, ThumbsDown, RefreshCw, Star,
  Upload, ChevronsRight, Phone, Search, Plus, Trash2, Edit2, X, FileText,
  Truck, Home, Shield, RotateCcw, Lock
} from "lucide-react";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
type RoleId = "admin" | "head" | "accountant" | "branch" | "procurement" | "supplier";
type PageId = string;
type OpStatus = "pending" | "approved" | "rejected" | "final-approved";
type MatchStatus = "exact" | "review" | "diff";
type ModuleKey = "sales" | "expenses" | "purchases" | "inventory" | "shifts" | "employees" | "cash";

interface Op {
  id: string;
  branch: string;
  moduleKey: ModuleKey;
  moduleLabel: string;
  amount: number;
  timeAgo: string;
  match: MatchStatus;
  attachments: number;
  status: OpStatus;
  diff?: string;
  rejectReason?: string;
  // Corrective operation traceability
  isCorrection?: boolean;
  correctiveRef?: string;     // ID of the original op this corrects
  // ERP posting is a distinct step AFTER final-approval
  erpPosted?: boolean;
  erpBatchId?: string;        // e.g. ERP-BATCH-20251014-001
  erpPostedAt?: string;
  // Audit lifecycle actors (set when status transitions occur)
  submittedBy?: string;
  reviewedBy?: string;
  approvedBy?: string;
  approvedAt?: string;
  finalApprovedBy?: string;
  finalApprovedAt?: string;
  rejectedBy?: string;
  rejectedAt?: string;
}

interface AppState {
  role: RoleId | null;
  page: PageId;
  detailId: string | null;
  modal: string | null;
}

interface PageProps {
  navigate: (p: PageId) => void;
  setModal: (id: string | null) => void;
  setDetailId: (id: string | null) => void;
  detailId: string | null;
  ops: Op[];
  approveOp: (id: string) => void;
  rejectOp: (id: string, reason: string) => void;
  finalApproveOp: (id: string) => void;
  bulkApprove: (ids: string[]) => void;
  addCorrectiveOp?: (refId: string) => void;
  markErpPosted?: (ids: string[], batchId: string) => void;
}

interface NavSection { section: string }
interface NavItem { id: string; label: string; icon: ReactNode; badge?: number; badgeColor?: "red" | "yellow" }
type NavEntry = NavSection | NavItem;
function isSection(e: NavEntry): e is NavSection { return "section" in e; }

// ─────────────────────────────────────────────
// INITIAL OPERATIONS DATASET  (18 ops)
// ─────────────────────────────────────────────
const INITIAL_OPS: Op[] = [
  { id:"OPS-2401", branch:"فرع الرياض - العليا",    moduleKey:"sales",     moduleLabel:"مبيعات",         amount:18340, timeAgo:"قبل ساعة",    match:"exact",  attachments:3, status:"pending" },
  { id:"OPS-2400", branch:"فرع جدة - الحمراء",      moduleKey:"expenses",  moduleLabel:"مصروفات",        amount:12500, timeAgo:"قبل 3 ساعات", match:"review", attachments:2, status:"pending" },
  { id:"OPS-2399", branch:"فرع مكة - المعابدة",     moduleKey:"purchases", moduleLabel:"مشتريات",        amount:8200,  timeAgo:"قبل 5 ساعات", match:"diff",   attachments:4, status:"pending", diff:"فرق في الكمية: 5 كجم" },
  { id:"OPS-2398", branch:"فرع الدمام - الكورنيش",  moduleKey:"sales",     moduleLabel:"مبيعات",         amount:45230, timeAgo:"قبل 6 ساعات", match:"exact",  attachments:3, status:"pending" },
  { id:"OPS-2397", branch:"فرع الرياض - النزهة",    moduleKey:"expenses",  moduleLabel:"مصروفات",        amount:3800,  timeAgo:"أمس",          match:"review", attachments:1, status:"pending" },
  { id:"OPS-2396", branch:"فرع الطائف - المحطة",    moduleKey:"inventory", moduleLabel:"مخزون",          amount:6100,  timeAgo:"أمس",          match:"exact",  attachments:2, status:"pending" },
  { id:"OPS-2395", branch:"فرع الرياض - النزهة",    moduleKey:"sales",     moduleLabel:"مبيعات",         amount:22100, timeAgo:"قبل يومين",    match:"exact",  attachments:3, status:"pending" },
  { id:"OPS-2394", branch:"فرع جدة - العزيزية",     moduleKey:"purchases", moduleLabel:"مشتريات",        amount:5600,  timeAgo:"قبل يومين",    match:"diff",   attachments:2, status:"pending", diff:"فرق في السعر: 120 ر.س" },
  { id:"OPS-2393", branch:"فرع مكة - العزيزية",     moduleKey:"shifts",    moduleLabel:"شفتات",          amount:2800,  timeAgo:"قبل 3 أيام",  match:"review", attachments:1, status:"pending" },
  { id:"OPS-2392", branch:"فرع الرياض - العليا",    moduleKey:"employees", moduleLabel:"كشف الحساب",     amount:9400,  timeAgo:"قبل 3 أيام",  match:"exact",  attachments:2, status:"pending" },
  { id:"OPS-2391", branch:"فرع الدمام - الدانة",    moduleKey:"cash",      moduleLabel:"عهدة نقدية",     amount:3000,  timeAgo:"قبل 4 أيام",  match:"exact",  attachments:1, status:"pending" },
  { id:"OPS-2390", branch:"فرع جدة - الحمراء",      moduleKey:"sales",     moduleLabel:"مبيعات",         amount:31800, timeAgo:"قبل 4 أيام",  match:"exact",  attachments:3, status:"approved" },
  { id:"OPS-2389", branch:"فرع الرياض - العليا",    moduleKey:"expenses",  moduleLabel:"مصروفات",        amount:1250,  timeAgo:"قبل 5 أيام",  match:"exact",  attachments:2, status:"approved" },
  { id:"OPS-2388", branch:"فرع مكة - المعابدة",     moduleKey:"inventory", moduleLabel:"مخزون",          amount:8500,  timeAgo:"قبل 5 أيام",  match:"review", attachments:2, status:"approved" },
  { id:"OPS-2387", branch:"فرع الدمام - الكورنيش",  moduleKey:"purchases", moduleLabel:"مشتريات",        amount:4800,  timeAgo:"قبل أسبوع",   match:"exact",  attachments:2, status:"approved" },
  { id:"OPS-2386", branch:"فرع الرياض - النزهة",    moduleKey:"sales",     moduleLabel:"مبيعات",         amount:19200, timeAgo:"قبل أسبوع",   match:"exact",  attachments:3, status:"final-approved" },
  { id:"OPS-2385", branch:"فرع جدة - العزيزية",     moduleKey:"expenses",  moduleLabel:"مصروفات",        amount:2100,  timeAgo:"قبل أسبوع",   match:"exact",  attachments:1, status:"final-approved" },
  { id:"OPS-2384", branch:"فرع الطائف - المحطة",    moduleKey:"expenses",  moduleLabel:"مصروفات",        amount:3400,  timeAgo:"قبل أسبوع",   match:"diff",   attachments:1, status:"rejected", rejectReason:"فاتورة مفقودة" },
];

// ─────────────────────────────────────────────
// NAV CONFIG (badges computed dynamically — see Sidebar)
// ─────────────────────────────────────────────
const NAV_CONFIG: Record<RoleId, NavEntry[]> = {
  accountant: [
    { section:"الرئيسية" },
    { id:"acc-dashboard",  label:"لوحة التحكم",          icon:<LayoutDashboard size={16}/> },
    { section:"الموديولات" },
    { id:"acc-sales",      label:"المبيعات",              icon:<TrendingUp size={16}/>,      badge:0 },
    { id:"acc-expenses",   label:"المصروفات",             icon:<Wallet size={16}/>,          badge:0 },
    { id:"acc-purchases",  label:"المشتريات",             icon:<ShoppingCart size={16}/>,    badge:0 },
    { id:"acc-inventory",  label:"المخزون",               icon:<Package size={16}/>,         badge:0 },
    { id:"acc-assets",     label:"الأصول الثابتة",        icon:<Building2 size={16}/> },
    { id:"acc-shifts",     label:"إدارة الشفتات",         icon:<Clock size={16}/>,           badge:0 },
    { id:"acc-employees",  label:"كشف حساب الموظفين",    icon:<Users size={16}/>,           badge:0 },
    { id:"acc-cash",       label:"إدارة العهد النقدية",   icon:<ArrowLeftRight size={16}/>,  badge:0 },
    { section:"التقارير" },
    { id:"acc-reports",    label:"التقارير",              icon:<BarChart3 size={16}/> },
  ],
  head: [
    { section:"الرئيسية" },
    { id:"head-dashboard", label:"لوحة التحكم",           icon:<LayoutDashboard size={16}/> },
    { section:"المراجعة والاعتماد" },
    { id:"head-pending",   label:"بانتظار الاعتماد",       icon:<Clock size={16}/>,           badge:0 },
    { id:"head-approved",  label:"المعتمدة نهائياً",       icon:<CheckCircle2 size={16}/> },
    { id:"head-rejected",  label:"المرفوضة",               icon:<XCircle size={16}/> },
    { section:"الموديولات" },
    { id:"head-sales",     label:"المبيعات",               icon:<TrendingUp size={16}/> },
    { id:"head-expenses",  label:"المصروفات",              icon:<Wallet size={16}/> },
    { id:"head-purchases", label:"المشتريات",              icon:<ShoppingCart size={16}/> },
    { id:"head-inventory", label:"المخزون",                icon:<Package size={16}/> },
    { id:"head-shifts",    label:"الشفتات",                icon:<Clock size={16}/> },
    { id:"head-employees", label:"كشف حساب الموظفين",     icon:<Users size={16}/> },
    { id:"head-cash",      label:"العهد النقدية",          icon:<ArrowLeftRight size={16}/> },
    { section:"الإدارة" },
    { id:"head-accountants", label:"أداء المحاسبين",       icon:<Users size={16}/> },
    { id:"head-erp",       label:"التصدير لـ ERP",         icon:<ChevronsRight size={16}/> },
    { id:"head-reports",   label:"التقارير",               icon:<BarChart3 size={16}/> },
  ],
  admin: [
    { section:"الرئيسية" },
    { id:"admin-overview",       label:"نظرة عامة",        icon:<LayoutDashboard size={16}/> },
    { section:"الإدارة" },
    { id:"admin-users",          label:"المستخدمون",        icon:<Users size={16}/>,           badge:3 },
    { id:"admin-restaurants",    label:"المطاعم والفروع",   icon:<Home size={16}/> },
    { id:"admin-subscriptions",  label:"الاشتراكات",        icon:<Shield size={16}/>,          badge:2, badgeColor:"yellow" as const },
    { id:"admin-permissions",    label:"الصلاحيات",         icon:<Settings size={16}/> },
    { section:"التقارير" },
    { id:"admin-reports",        label:"مدير التقارير",     icon:<BarChart3 size={16}/> },
    { id:"admin-audit",          label:"سجل النشاطات",      icon:<FileText size={16}/> },
    { section:"النظام" },
    { id:"admin-settings",       label:"إعدادات النظام",    icon:<Settings size={16}/> },
  ],
  branch: [
    { section:"الرئيسية" },
    { id:"branch-overview",   label:"نظرة عامة",        icon:<LayoutDashboard size={16}/> },
    { section:"إدارة البيانات" },
    { id:"branch-employees",  label:"الموظفون",          icon:<Users size={16}/> },
    { id:"branch-items",      label:"الأصناف",           icon:<Package size={16}/> },
    { id:"branch-suppliers",  label:"الموردون",          icon:<Truck size={16}/> },
    { id:"branch-upload",     label:"رفع البيانات",      icon:<Upload size={16}/> },
    { section:"الإعدادات" },
    { id:"branch-settings",   label:"إعدادات الفرع",    icon:<Settings size={16}/> },
  ],
  procurement: [
    { section:"الرئيسية" },
    { id:"proc-overview",  label:"لوحة التحكم",      icon:<LayoutDashboard size={16}/> },
    { section:"الطلبات" },
    { id:"proc-new",       label:"الطلبات الجديدة",   icon:<ShoppingCart size={16}/>,  badge:45 },
    { id:"proc-grouped",   label:"الطلبات المجمعة",   icon:<Package size={16}/> },
    { id:"proc-sent",      label:"المرسلة للموردين",  icon:<Truck size={16}/> },
    { section:"الإدارة" },
    { id:"proc-items",     label:"الأصناف",           icon:<Package size={16}/> },
    { id:"proc-suppliers", label:"الموردون",          icon:<Truck size={16}/> },
    { id:"proc-reports",   label:"التقارير",          icon:<BarChart3 size={16}/> },
  ],
  supplier: [
    { section:"الرئيسية" },
    { id:"sup-overview",  label:"لوحة التحكم",        icon:<LayoutDashboard size={16}/> },
    { section:"الطلبات" },
    { id:"sup-new",       label:"الطلبات الجديدة",    icon:<ShoppingCart size={16}/>,   badge:3 },
    { id:"sup-accepted",  label:"المقبولة",            icon:<CheckCircle2 size={16}/> },
    { id:"sup-rejected",  label:"المرفوضة",            icon:<XCircle size={16}/> },
    { section:"الكتالوج" },
    { id:"sup-items",     label:"الأصناف والأسعار",   icon:<Package size={16}/> },
    { id:"sup-reports",   label:"تقارير المبيعات",    icon:<BarChart3 size={16}/> },
  ],
};

const ROLE_PROFILES: Record<RoleId, { name: string; avatar: string; label: string; defaultPage: PageId }> = {
  admin:       { name:"عبدالله الأحمد",    avatar:"عب", label:"أدمن النظام",                    defaultPage:"admin-overview" },
  head:        { name:"خالد العمري",        avatar:"خع", label:"رئيس الحسابات",                  defaultPage:"head-dashboard" },
  accountant:  { name:"أحمد محمد",          avatar:"أم", label:"محاسب — الفروع 1–50",            defaultPage:"acc-dashboard" },
  branch:      { name:"أحمد الشمري",        avatar:"أش", label:"مدير فرع الرياض - العليا",       defaultPage:"branch-overview" },
  procurement: { name:"سعيد أحمد",          avatar:"سأ", label:"مدير المشتريات",                 defaultPage:"proc-overview" },
  supplier:    { name:"محمد العلي",          avatar:"مع", label:"شركة الدواجن الوطنية",           defaultPage:"sup-overview" },
};

const MODULE_TO_NAV: Record<ModuleKey, string> = {
  sales:"acc-sales", expenses:"acc-expenses", purchases:"acc-purchases",
  inventory:"acc-inventory", shifts:"acc-shifts", employees:"acc-employees", cash:"acc-cash",
};

// ─────────────────────────────────────────────
// SHARED DISPLAY CONFIG
// ─────────────────────────────────────────────
const MATCH_CFG: Record<MatchStatus,{label:string; cls:string; dot:string}> = {
  exact:  { label:"متطابق",         cls:"bg-emerald-50 text-emerald-700 border-emerald-200", dot:"bg-emerald-500" },
  review: { label:"يحتاج مراجعة",  cls:"bg-amber-50 text-amber-700 border-amber-200",       dot:"bg-amber-500" },
  diff:   { label:"فرق في الكمية", cls:"bg-red-50 text-red-700 border-red-200",              dot:"bg-red-500" },
};
const STATUS_CFG: Record<OpStatus,{label:string; cls:string}> = {
  "pending":       { label:"معلق",             cls:"bg-amber-50 text-amber-700" },
  "approved":      { label:"موافق عليه",       cls:"bg-blue-50 text-blue-700" },
  "rejected":      { label:"مرفوض",            cls:"bg-red-50 text-red-700" },
  "final-approved":{ label:"معتمد نهائياً",    cls:"bg-emerald-50 text-emerald-700" },
};

const fmtAmt = (n: number) => n.toLocaleString("ar-SA");

// ─────────────────────────────────────────────
// MICRO-COMPONENTS
// ─────────────────────────────────────────────
function Badge({ children, className="" }:{ children:ReactNode; className?:string }) {
  return <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide ${className}`}>{children}</span>;
}

function Btn({ children, onClick, variant="ghost", size="md", className="" }:{
  children:ReactNode; onClick?:()=>void;
  variant?:"primary"|"success"|"danger"|"ghost"|"outline"|"amber";
  size?:"sm"|"md"; className?:string
}) {
  const base = "inline-flex items-center gap-1.5 font-semibold cursor-pointer border transition-all rounded-lg whitespace-nowrap";
  const sizes = { sm:"px-3 py-1.5 text-xs", md:"px-4 py-2 text-sm" };
  const variants = {
    primary: "bg-purple-600 text-white border-purple-600 hover:bg-purple-700 shadow-sm",
    success: "bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700 shadow-sm",
    danger:  "bg-red-50 text-red-700 border-red-200 hover:bg-red-100",
    amber:   "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
    ghost:   "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100",
    outline: "bg-white text-gray-700 border-gray-300 hover:bg-gray-50",
  };
  return <button onClick={onClick} className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}>{children}</button>;
}

function KpiCard({ label, value, sub, icon, accent="purple" }:{
  label:string; value:string; sub?:string; icon:ReactNode; accent?:string
}) {
  const accents: Record<string,string> = {
    purple:"border-t-purple-500 bg-purple-500",
    emerald:"border-t-emerald-500 bg-emerald-500",
    amber:"border-t-amber-500 bg-amber-500",
    blue:"border-t-blue-500 bg-blue-500",
    red:"border-t-red-500 bg-red-500",
    orange:"border-t-orange-500 bg-orange-500",
  };
  const borderCls = accents[accent]?.split(" ")[0] || "border-t-purple-500";
  const iconBg    = accents[accent]?.split(" ")[1] || "bg-purple-500";
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 border-t-2 ${borderCls} p-5 flex items-start gap-4`}>
      <div className={`w-10 h-10 rounded-xl ${iconBg} bg-opacity-10 flex items-center justify-center flex-shrink-0`}>{icon}</div>
      <div className="min-w-0">
        <p className="text-gray-500 text-xs font-medium uppercase tracking-wider leading-tight">{label}</p>
        <p className="text-gray-900 font-extrabold text-3xl mt-1 leading-none font-mono">{value}</p>
        {sub && <p className="text-gray-400 text-xs mt-1.5">{sub}</p>}
      </div>
    </div>
  );
}

function Card({ title, children, actions, className="" }:{ title?:string; children:ReactNode; actions?:ReactNode; className?:string }) {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden ${className}`}>
      {title && (
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 bg-gray-50/60">
          <h3 className="font-bold text-gray-900 text-sm tracking-tight">{title}</h3>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
}

function PageHeader({ title, subtitle, actions }:{ title:string; subtitle?:string; actions?:ReactNode }) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 leading-tight tracking-tight">{title}</h1>
        {subtitle && <p className="text-gray-400 text-sm mt-1 font-normal">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
    </div>
  );
}

function Breadcrumb({ items }:{ items:{ label:string; onClick?:()=>void }[] }) {
  return (
    <div className="flex items-center gap-1.5 text-sm mb-5 bg-white rounded-xl border border-gray-100 px-4 py-2.5 w-fit shadow-sm" dir="rtl">
      {items.map((item,i) => (
        <div key={i} className="flex items-center gap-1.5">
          {i > 0 && <ChevronRight size={13} className="text-gray-300 rotate-180"/>}
          {item.onClick
            ? <button onClick={item.onClick} className="text-purple-600 hover:text-purple-800 font-medium hover:underline">{item.label}</button>
            : <span className="font-semibold text-gray-700">{item.label}</span>
          }
        </div>
      ))}
    </div>
  );
}

function EmptyState({ icon, title, desc }:{ icon:string; title:string; desc:string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-3xl mb-4 shadow-sm">{icon}</div>
      <p className="font-bold text-gray-700 mb-1">{title}</p>
      {desc && <p className="text-gray-400 text-sm max-w-xs">{desc}</p>}
    </div>
  );
}

function LockBanner({ op }: { op?: Op }) {
  const isErpPosted = op?.erpPosted === true;
  return (
    <div className="rounded-xl overflow-hidden border-2 border-emerald-300 shadow-md" dir="rtl">
      {/* Authoritative header stripe */}
      <div className={`flex items-center justify-between px-5 py-3 ${isErpPosted ? "bg-gradient-to-l from-emerald-700 to-emerald-600" : "bg-gradient-to-l from-slate-700 to-slate-600"}`}>
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
            <Lock size={14} className="text-white"/>
          </div>
          <div>
            <p className="text-white font-extrabold text-sm leading-tight">
              {isErpPosted ? "سجل مُغلق ومُرحَّل لـ ERP" : "سجل مُغلق — معتمد نهائياً"}
            </p>
            <p className="text-white/70 text-xs mt-0.5">
              {isErpPosted
                ? `دفعة الترحيل: ${op?.erpBatchId || "—"} · ${op?.erpPostedAt || "—"}`
                : "معتمد نهائياً · في انتظار الترحيل لـ ERP"
              }
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={`text-xs font-bold border ${isErpPosted ? "bg-white/20 text-white border-white/30" : "bg-white/20 text-white border-white/30"}`}>
            <CheckCircle2 size={10}/>
            {isErpPosted ? "مُرحَّل لـ ERP" : "معتمد نهائياً"}
          </Badge>
        </div>
      </div>
      {/* Immutability notice */}
      <div className="bg-emerald-50 border-t border-emerald-200 px-5 py-2.5 flex items-center gap-2">
        <AlertTriangle size={12} className="text-emerald-600 flex-shrink-0"/>
        <p className="text-xs text-emerald-700 font-medium">
          هذا السجل وصل للحالة النهائية ولا يمكن تعديله أو عكسه. أي تصحيح يتطلب إنشاء عملية تعديل مستقلة مرتبطة بهذا السجل.
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// AUDIT TRAIL BUILDER  (derives lifecycle from op state)
// ─────────────────────────────────────────────
interface AuditEvent {
  icon: string;
  cls: string;
  action: string;
  by: string;
  time: string;
  isTerminal?: boolean;
}

function buildAuditTrail(op: Op): AuditEvent[] {
  const trail: AuditEvent[] = [];

  // Step 1: Creation (always present)
  trail.push({
    icon: "📋", cls: "bg-blue-50 text-blue-600",
    action: `أُنشئ السجل: ${op.id}${op.isCorrection ? ` (تعديل على ${op.correctiveRef})` : ""}`,
    by: op.submittedBy || "مدير الفرع",
    time: "08:00 ص"
  });

  // Step 2: Submission
  trail.push({
    icon: "📤", cls: "bg-blue-50 text-blue-600",
    action: "رُفع للمراجعة المحاسبية",
    by: op.submittedBy || "مدير الفرع",
    time: "08:15 ص"
  });

  // Step 3: Accountant review (if beyond pending)
  if (op.status !== "pending") {
    if (op.status === "rejected") {
      trail.push({
        icon: "✕", cls: "bg-red-50 text-red-600",
        action: `مرفوض — السبب: ${op.rejectReason || "لم يُذكر سبب"}`,
        by: op.rejectedBy || op.approvedBy || "المحاسب المختص",
        time: op.rejectedAt || "10:45 ص",
        isTerminal: true
      });
    } else {
      trail.push({
        icon: "✓", cls: "bg-emerald-50 text-emerald-600",
        action: "راجعه المحاسب ووافق عليه — أُرسل لرئيس الحسابات",
        by: op.approvedBy || "المحاسب المختص",
        time: op.approvedAt || "09:30 ص"
      });
    }
  }

  // Step 4: Head accountant final approval
  if (op.status === "final-approved") {
    trail.push({
      icon: "🔒", cls: "bg-emerald-100 text-emerald-700",
      action: "اعتمده رئيس الحسابات نهائياً — سجل مُغلق",
      by: op.finalApprovedBy || "رئيس الحسابات",
      time: op.finalApprovedAt || "16:42 م",
      isTerminal: !op.erpPosted
    });
  }

  // Step 5: ERP posting (if done)
  if (op.erpPosted) {
    trail.push({
      icon: "🔗", cls: "bg-indigo-50 text-indigo-600",
      action: `رُحِّل إلى نظام ERP — دفعة: ${op.erpBatchId || "—"}`,
      by: "النظام التلقائي / رئيس الحسابات",
      time: op.erpPostedAt || "17:00 م",
      isTerminal: true
    });
  }

  return trail;
}

// ─────────────────────────────────────────────
// LOGIN SCREEN
// ─────────────────────────────────────────────
function LoginScreen({ onLogin }:{ onLogin:(r:RoleId)=>void }) {
  const roles:[RoleId, string, string, string, string, string][] = [
    ["admin",       "🧠", "أدمن النظام",      "إدارة المستخدمين، الاشتراكات، وإعدادات النظام الكاملة",  "نظام",          "bg-red-500/20 text-red-200"],
    ["head",        "👑", "رئيس الحسابات",    "الاعتماد النهائي للعمليات والإشراف على أداء المحاسبين",   "اعتماد نهائي",  "bg-amber-500/20 text-amber-200"],
    ["accountant",  "🧮", "المحاسب",          "مراجعة وتدقيق العمليات اليومية من جميع الفروع المخصصة",  "مراجعة يومية", "bg-blue-500/20 text-blue-200"],
    ["branch",      "🏪", "مدير الفرع",       "رفع البيانات اليومية وإدارة موظفي وموردي الفرع",          "فرع",           "bg-emerald-500/20 text-emerald-200"],
    ["procurement", "🛒", "مدير المشتريات",   "تجميع طلبات الشراء والتنسيق مع الموردين",                "مشتريات",       "bg-purple-500/20 text-purple-200"],
    ["supplier",    "🏭", "المورد",            "استلام طلبات التوريد وإدارة الكتالوج والأسعار",           "مورد",          "bg-cyan-500/20 text-cyan-200"],
  ];
  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#0F1C35 0%,#1B3A6B 60%,#2A5298 100%)", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:36, padding:24 }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:14, marginBottom:8 }}>
          <div style={{ width:52, height:52, borderRadius:14, background:"linear-gradient(135deg,#7C3AED,#00D9FF)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span style={{ color:"#fff", fontWeight:900, fontSize:24 }}>ع</span>
          </div>
          <div style={{ color:"#fff", fontWeight:800, fontSize:34, letterSpacing:-1 }}>عصب <span style={{ color:"#E8A020" }}>ASAB</span></div>
        </div>
        <p style={{ color:"rgba(255,255,255,0.5)", fontSize:14 }}>نظام إدارة مالية المطاعم متعدد الفروع</p>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, maxWidth:860, width:"100%" }}>
        {roles.map(([id, icon, title, desc, badge, badgeCls]) => (
          <button key={id} onClick={() => onLogin(id)}
            style={{ background:"rgba(255,255,255,0.07)", border:"1.5px solid rgba(255,255,255,0.13)", borderRadius:14, padding:"22px 18px", cursor:"pointer", textAlign:"center", fontFamily:"inherit", transition:"background 0.2s, border-color 0.2s, transform 0.2s" }}
            onMouseEnter={e=>{ (e.currentTarget as HTMLButtonElement).style.cssText += "background:rgba(255,255,255,0.13);border-color:#E8A020;transform:translateY(-3px)"; }}
            onMouseLeave={e=>{ (e.currentTarget as HTMLButtonElement).style.cssText += "background:rgba(255,255,255,0.07);border-color:rgba(255,255,255,0.13);transform:translateY(0)"; }}
          >
            <div style={{ fontSize:36, marginBottom:10 }}>{icon}</div>
            <div style={{ color:"#fff", fontWeight:700, fontSize:14, marginBottom:6 }}>{title}</div>
            <div style={{ color:"rgba(255,255,255,0.45)", fontSize:11, lineHeight:1.6, marginBottom:10 }}>{desc}</div>
            <span style={{ display:"inline-block", padding:"3px 10px", borderRadius:20, fontSize:10, fontWeight:700 }} className={badgeCls}>{badge}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// REJECT MODAL  (captures reason, calls rejectOp)
// ─────────────────────────────────────────────
function RejectModal({ opId, onReject, onClose }:{ opId:string; onReject:(id:string,reason:string)=>void; onClose:()=>void }) {
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const canSubmit = reason !== "" && reason !== "اختر السبب...";
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-[480px] max-w-full" dir="rtl">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="font-bold text-gray-800 text-base">رفض العملية {opId}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={18}/></button>
        </div>
        <div className="p-5 space-y-4">
          <p className="text-gray-500 text-sm">ستُعاد العملية إلى مدير الفرع مع سبب الرفض.</p>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1.5">سبب الرفض <span className="text-red-500">*</span></label>
            <select value={reason} onChange={e=>setReason(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700">
              <option value="">اختر السبب...</option>
              <option>بيانات غير مكتملة</option>
              <option>فاتورة مفقودة أو غير واضحة</option>
              <option>تناقض في المبالغ</option>
              <option>فرق في الكميات</option>
              <option>مورد غير معتمد</option>
              <option>تاريخ غير صحيح</option>
              <option>أخرى</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1.5">ملاحظات إضافية</label>
            <textarea value={notes} onChange={e=>setNotes(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 resize-none" rows={3} placeholder="تفاصيل إضافية (اختياري)..."/>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => canSubmit && onReject(opId, notes ? `${reason}: ${notes}` : reason)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors ${canSubmit ? "bg-red-600 text-white hover:bg-red-700" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
              disabled={!canSubmit}>
              ✕ تأكيد الرفض وإعادة للفرع
            </button>
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm hover:bg-gray-50">إلغاء</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// ADD USER MODAL
// ─────────────────────────────────────────────
function AddUserModal({ onAdd, onClose }:{ onAdd:(user:{name:string;email:string;role:string;restaurant:string})=>void; onClose:()=>void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("محاسب");
  const [restaurant, setRestaurant] = useState("مطعم الريم");
  const canSubmit = name.trim() !== "" && email.trim() !== "";
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-[560px] max-w-full" dir="rtl">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="font-bold text-gray-800 text-base">إضافة مستخدم جديد</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={18}/></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs font-semibold text-gray-600 block mb-1">الاسم الكامل</label>
              <input value={name} onChange={e=>setName(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="أحمد محمد السعد"/></div>
            <div><label className="text-xs font-semibold text-gray-600 block mb-1">البريد الإلكتروني</label>
              <input value={email} onChange={e=>setEmail(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="ahmed@asab.sa"/></div>
            <div><label className="text-xs font-semibold text-gray-600 block mb-1">الدور</label>
              <select value={role} onChange={e=>setRole(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
                <option>محاسب</option><option>رئيس حسابات</option><option>مدير فرع</option><option>مدير مشتريات</option><option>مورد</option>
              </select></div>
            <div><label className="text-xs font-semibold text-gray-600 block mb-1">المطعم</label>
              <select value={restaurant} onChange={e=>setRestaurant(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
                <option>مطعم الريم</option><option>مطعم هرفي</option><option>ماكدونالدز السعودية</option><option>مطعم بروستد الوطني</option>
              </select></div>
          </div>
          <div><label className="text-xs font-semibold text-gray-600 block mb-1.5">الموديولات المخصصة</label>
            <div className="grid grid-cols-4 gap-2">
              {["المبيعات","المصروفات","المشتريات","المخزون","الشفتات","كشف الحساب","العهد النقدية","الأصول"].map(m=>(
                <label key={m} className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
                  <input type="checkbox" defaultChecked={["المبيعات","المصروفات"].includes(m)} className="rounded"/> {m}
                </label>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={()=>canSubmit&&onAdd({name,email,role,restaurant})}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors ${canSubmit?"bg-purple-600 text-white hover:bg-purple-700":"bg-gray-200 text-gray-400 cursor-not-allowed"}`}
              disabled={!canSubmit}>
              ✓ إضافة المستخدم
            </button>
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm hover:bg-gray-50">إلغاء</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// SIDEBAR
// ─────────────────────────────────────────────
function Sidebar({ role, ops, page, navigate, logout, collapsed, setCollapsed }:{
  role:RoleId; ops:Op[]; page:PageId;
  navigate:(p:PageId)=>void; logout:()=>void;
  collapsed:boolean; setCollapsed:(v:boolean)=>void;
}) {
  const profile = ROLE_PROFILES[role];
  const navEntries = NAV_CONFIG[role];

  // compute live badge per module nav item
  const pendingByModule = useMemo(()=>{
    const counts: Record<string,number> = {};
    ops.filter(o=>o.status==="pending").forEach(o=>{ counts[MODULE_TO_NAV[o.moduleKey]] = (counts[MODULE_TO_NAV[o.moduleKey]]||0)+1; });
    return counts;
  }, [ops]);
  const headPendingCount = useMemo(()=>ops.filter(o=>o.status==="approved").length, [ops]);
  const totalAccPending = useMemo(()=>ops.filter(o=>o.status==="pending").length, [ops]);

  const getBadge = (item: NavItem): number|undefined => {
    if (role==="accountant") {
      if (item.id==="acc-dashboard") return totalAccPending||undefined;
      return pendingByModule[item.id]||undefined;
    }
    if (role==="head" && item.id==="head-pending") return headPendingCount||undefined;
    return item.badge||undefined;
  };

  return (
    <aside className="flex flex-col flex-shrink-0 transition-all duration-200"
      style={{ width:collapsed?64:252, background:"linear-gradient(180deg,#0F1C35 0%,#1B3A6B 100%)", minHeight:"100vh" }}>
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-3 py-4 border-b border-white/10">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background:"linear-gradient(135deg,#7C3AED,#00D9FF)" }}>
          <span className="text-white font-black text-sm">ع</span>
        </div>
        {!collapsed && <div className="flex-1 min-w-0"><div className="text-white font-bold text-base">عصب</div><div className="text-white/40 text-[10px]">ASAB System</div></div>}
        <button onClick={()=>setCollapsed(!collapsed)} className="text-white/30 hover:text-white transition-colors ml-auto">
          <ChevronRight size={16} className={collapsed?"":"rotate-180"} />
        </button>
      </div>
      {/* Role */}
      {!collapsed && (
        <div className="px-3 py-2.5 border-b border-white/10">
          <div className="text-[11px] px-2 py-1 rounded-full inline-block font-semibold bg-white/10 text-white/80">{profile.label}</div>
        </div>
      )}
      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
        {navEntries.map((entry,i) => {
          if(isSection(entry)) return !collapsed
            ? <div key={i} className="text-white/30 text-[10px] font-bold uppercase tracking-widest px-3 pt-4 pb-1">{entry.section}</div>
            : <div key={i} className="my-2 border-t border-white/10"/>;
          const active = page===entry.id || (entry.id==="acc-sales" && page==="acc-sales-detail") || (entry.id==="acc-inventory" && page==="acc-inventory-items");
          const badge = getBadge(entry);
          return (
            <button key={entry.id} onClick={()=>navigate(entry.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-colors text-right ${active?"bg-white/15 text-white":"text-white/55 hover:bg-white/8 hover:text-white/90"}`}>
              <span className={`flex-shrink-0 ${active?"text-[#00D9FF]":""}`}>{entry.icon}</span>
              {!collapsed && (<>
                <span className="text-[13px] font-medium flex-1 text-right leading-tight">{entry.label}</span>
                {badge ? <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center ${(entry as NavItem).badgeColor==="yellow"?"bg-amber-500 text-white":"bg-red-500 text-white"}`}>{badge}</span> : null}
              </>)}
            </button>
          );
        })}
      </nav>
      {/* User */}
      <div className="p-3 border-t border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-cyan-400 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">{profile.avatar}</div>
          {!collapsed && (<>
            <div className="flex-1 min-w-0">
              <div className="text-white text-sm font-medium truncate">{profile.name}</div>
              <div className="text-white/40 text-[10px] truncate">{profile.label}</div>
            </div>
            <button onClick={logout} className="text-white/30 hover:text-red-300 transition-colors"><LogOut size={14}/></button>
          </>)}
        </div>
      </div>
    </aside>
  );
}

// ─────────────────────────────────────────────
// APP SHELL
// ─────────────────────────────────────────────
function AppShell({ state, ops, approveOp, rejectOp, finalApproveOp, bulkApprove, addCorrectiveOp, markErpPosted, navigate, logout, setModal, setDetailId }:{
  state:AppState; ops:Op[];
  approveOp:(id:string)=>void; rejectOp:(id:string,r:string)=>void;
  finalApproveOp:(id:string)=>void; bulkApprove:(ids:string[])=>void;
  addCorrectiveOp?:(refId:string)=>void; markErpPosted?:(ids:string[],batchId:string)=>void;
  navigate:(p:PageId)=>void; logout:()=>void;
  setModal:(id:string|null)=>void; setDetailId:(id:string|null)=>void;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [adminUsers, setAdminUsers] = useState([
    { name:"أحمد محمد الشهري", email:"ahmed@asab.sa",  role:"محاسب",          restaurant:"مطعم الريم",          branches:20, status:"active" },
    { name:"سارة العمري",       email:"sara@asab.sa",   role:"محاسب",          restaurant:"مطعم هرفي",           branches:20, status:"active" },
    { name:"خالد العمري",       email:"khaled@asab.sa", role:"رئيس حسابات",    restaurant:"جميع المطاعم",         branches:100, status:"active" },
    { name:"أحمد الشمري",       email:"shammari@asab.sa",role:"مدير فرع",      restaurant:"مطعم الريم",          branches:1,  status:"active" },
    { name:"محمد الحربي",       email:"harbi@asab.sa",  role:"محاسب",          restaurant:"ماكدونالدز السعودية", branches:20, status:"inactive" },
    { name:"فاطمة السالم",      email:"fatima@asab.sa", role:"محاسب",          restaurant:"مطعم بروستد الوطني", branches:20, status:"active" },
  ]);

  const role = state.role!;
  const profile = ROLE_PROFILES[role];

  const pageLabel = useMemo(()=>{
    const nav = NAV_CONFIG[role];
    for(const e of nav) if(!isSection(e) && e.id===state.page) return e.label;
    if(state.page==="acc-sales-detail") return "تفاصيل عملية المبيعات";
    if(state.page==="acc-inventory-items") return "تحديد أصناف الجرد اليومي";
    return "";
  }, [role, state.page]);

  const pageProps: PageProps = { navigate, setModal, setDetailId, detailId:state.detailId, ops, approveOp, rejectOp, finalApproveOp, bulkApprove, addCorrectiveOp, markErpPosted };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F0F4FA]" dir="rtl">
      <Sidebar role={role} ops={ops} page={state.page} navigate={navigate} logout={logout}
        collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed}/>

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-100 px-5 py-3 flex items-center gap-4 flex-shrink-0 shadow-sm z-10">
          <div className="flex-1 min-w-0">
            <h1 className="text-gray-800 font-bold text-base leading-tight">{pageLabel}</h1>
            <p className="text-gray-400 text-xs">{profile.label}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-xs text-gray-400 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg hidden sm:block">الاثنين، 14 أكتوبر 2025</div>
            <select className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 bg-gray-50">
              <option>هذا الشهر</option><option>هذا الأسبوع</option><option>اليوم</option>
            </select>
            <button className="relative w-9 h-9 flex items-center justify-center rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-500 transition-colors">
              <Bell size={16}/>
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button onClick={logout} className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 flex items-center gap-1"><LogOut size={13}/> خروج</button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-5">
          <PageRouter state={state} pageProps={pageProps} adminUsers={adminUsers} setAdminUsers={setAdminUsers}/>
        </main>
      </div>

      {/* Reject Modal */}
      {state.modal==="reject" && state.detailId && (
        <RejectModal opId={state.detailId}
          onReject={(id,reason)=>{ rejectOp(id,reason); setModal(null); }}
          onClose={()=>setModal(null)}/>
      )}

      {/* Add User Modal */}
      {state.modal==="add-user" && (
        <AddUserModal
          onAdd={u=>{ setAdminUsers(prev=>[...prev,{...u,branches:u.role==="مدير فرع"?1:20,status:"active"}]); setModal(null); }}
          onClose={()=>setModal(null)}/>
      )}

      {/* Contact Modal */}
      {state.modal==="contact" && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-[380px]" dir="rtl">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="font-bold text-gray-800">التواصل مع الموظف</h3>
              <button onClick={()=>setModal(null)} className="text-gray-400 hover:text-gray-600"><X size={18}/></button>
            </div>
            <div className="p-5">
              <div className="text-center mb-5">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-400 to-cyan-400 flex items-center justify-center mx-auto mb-2"><span className="text-white font-bold text-lg">خش</span></div>
                <p className="font-bold text-gray-800">خالد الشمري</p><p className="text-gray-500 text-sm">مشرف الشفت — فرع الرياض العليا</p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer">
                  <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center"><Phone size={18} className="text-emerald-600"/></div>
                  <div><p className="font-semibold text-sm">اتصال هاتفي</p><p className="text-xs text-gray-400">+966 51 234 5678</p></div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background:"#25D366"}}><span className="text-white text-lg">📱</span></div>
                  <div><p className="font-semibold text-sm">واتساب</p><p className="text-xs text-gray-400">فتح المحادثة في واتساب</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// OPERATION ROW  (reflects live status)
// ─────────────────────────────────────────────
function OpRow({ op, onView, onApprove, onReject }: {
  op:Op; onView:()=>void; onApprove:()=>void; onReject:()=>void;
}) {
  const match = MATCH_CFG[op.match];
  const statusCfg = STATUS_CFG[op.status];
  const isPending = op.status==="pending";
  const isLocked = op.status==="final-approved";
  const isRejected = op.status==="rejected";
  return (
    <div className={`px-5 py-4 flex items-start gap-4 hover:bg-gray-50/60 transition-colors border-b border-gray-100 last:border-0
      ${op.match==="diff"?"border-r-4 border-r-red-400":op.match==="review"?"border-r-4 border-r-amber-400":""}
      ${isLocked?"bg-slate-50/60":isRejected?"opacity-55":""}`}>
      <span className="mt-0.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-50 text-purple-700 border border-purple-100 flex-shrink-0">{op.moduleLabel}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-gray-800 text-sm">{op.branch}</span>
          <span className="text-gray-200">·</span>
          <span className="text-xs text-gray-400 font-mono tracking-tight">{op.id}</span>
          <span className="text-gray-200">·</span>
          <span className="text-xs text-gray-400">⏰ {op.timeAgo}</span>
        </div>
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <Badge className={`${match.cls} border`}>
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${match.dot}`}></span>
            {match.label}
          </Badge>
          {op.diff && <span className="text-xs text-red-600 font-semibold bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">⚠ {op.diff}</span>}
          <span className="flex items-center gap-1 text-xs text-gray-400"><Paperclip size={10}/> {op.attachments}</span>
          <Badge className={`${statusCfg.cls} border ${isLocked?"border-slate-200":""}`}>
            {isLocked && <Lock size={10}/>}
            {statusCfg.label}
          </Badge>
          {isRejected && op.rejectReason && <span className="text-xs text-red-500 font-medium">سبب: {op.rejectReason}</span>}
        </div>
      </div>
      <div className="font-extrabold text-gray-800 font-mono text-sm flex-shrink-0 tabular-nums">{fmtAmt(op.amount)} ر.س</div>
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <Btn size="sm" onClick={onView}><Eye size={12}/> عرض</Btn>
        {isPending && <>
          <Btn size="sm" variant="success" onClick={onApprove}><ThumbsUp size={12}/></Btn>
          <Btn size="sm" variant="danger"  onClick={onReject}><ThumbsDown size={12}/></Btn>
        </>}
        {isLocked && (
          <span className="flex items-center gap-1 text-xs text-slate-400 bg-slate-100 border border-slate-200 px-2 py-1.5 rounded-lg">
            <Lock size={11}/> مُغلق
          </span>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// FILTER BAR  (shared by all ops list pages)
// ─────────────────────────────────────────────
interface Filters { branch:string; status:string; match:string; search:string; }

function FilterBar({ filters, onChange, branches }:{ filters:Filters; onChange:(f:Filters)=>void; branches:string[] }) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg px-3 py-1.5">
        <Search size={13} className="text-gray-400"/>
        <input value={filters.search} onChange={e=>onChange({...filters,search:e.target.value})} placeholder="بحث..." className="text-xs outline-none text-gray-600 w-28"/>
      </div>
      <select value={filters.branch} onChange={e=>onChange({...filters,branch:e.target.value})} className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 bg-white">
        <option value="">الكل — الفروع</option>
        {branches.map(b=><option key={b}>{b}</option>)}
      </select>
      <select value={filters.status} onChange={e=>onChange({...filters,status:e.target.value})} className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 bg-white">
        <option value="">كل الحالات</option>
        <option value="pending">معلق</option>
        <option value="approved">موافق عليه</option>
        <option value="rejected">مرفوض</option>
        <option value="final-approved">معتمد نهائياً</option>
      </select>
      <select value={filters.match} onChange={e=>onChange({...filters,match:e.target.value})} className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 bg-white">
        <option value="">كل المطابقات</option>
        <option value="exact">متطابق</option>
        <option value="review">يحتاج مراجعة</option>
        <option value="diff">فرق</option>
      </select>
      {(filters.branch||filters.status||filters.match||filters.search) &&
        <button onClick={()=>onChange({branch:"",status:"",match:"",search:""})} className="text-xs text-purple-600 hover:underline flex items-center gap-1"><RotateCcw size={11}/> مسح الفلاتر</button>
      }
    </div>
  );
}

function applyFilters(ops:Op[], f:Filters, moduleKey?:ModuleKey): Op[] {
  return ops.filter(op=>{
    if(moduleKey && op.moduleKey!==moduleKey) return false;
    if(f.branch && op.branch!==f.branch) return false;
    if(f.status && op.status!==f.status) return false;
    if(f.match && op.match!==f.match) return false;
    if(f.search && !op.branch.includes(f.search) && !op.id.includes(f.search) && !op.moduleLabel.includes(f.search)) return false;
    return true;
  });
}

const BRANCHES = [...new Set(INITIAL_OPS.map(o=>o.branch))];

// ─────────────────────────────────────────────
// PAGE ROUTER
// ─────────────────────────────────────────────
function PageRouter({ state, pageProps, adminUsers, setAdminUsers }:{
  state:AppState; pageProps:PageProps;
  adminUsers:{name:string;email:string;role:string;restaurant:string;branches:number;status:string}[];
  setAdminUsers:(v:any)=>void;
}) {
  const { role, page } = state;
  const p = pageProps;

  if(role==="accountant") {
    if(page==="acc-dashboard")       return <AccDashboard {...p}/>;
    if(page==="acc-sales")           return <AccModulePage moduleKey="sales" title="المبيعات" {...p}/>;
    if(page==="acc-sales-detail")    return <AccSalesDetail {...p}/>;
    if(page==="acc-expenses")        return <AccModulePage moduleKey="expenses" title="المصروفات" {...p}/>;
    if(page==="acc-purchases")       return <AccPurchases {...p}/>;
    if(page==="acc-inventory")       return <AccInventory {...p}/>;
    if(page==="acc-inventory-items") return <AccInventoryItems {...p}/>;
    if(page==="acc-shifts")          return <AccShifts {...p}/>;
    if(page==="acc-employees")       return <AccEmployees {...p}/>;
    if(page==="acc-cash")            return <AccCash {...p}/>;
    if(page==="acc-assets")          return <AccAssets {...p}/>;
    if(page==="acc-reports")         return <ReportsPage {...p}/>;
  }
  if(role==="head") {
    if(page==="head-dashboard")    return <HeadDashboard {...p}/>;
    if(page==="head-pending")      return <HeadPending {...p}/>;
    if(page==="head-approved")     return <HeadApproved {...p}/>;
    if(page==="head-rejected")     return <HeadRejected {...p}/>;
    if(page==="head-accountants")  return <HeadAccountants {...p}/>;
    if(page==="head-erp")          return <HeadERP {...p}/>;
    if(page==="head-reports")      return <ReportsPage {...p}/>;
    const mk = page.replace("head-","") as ModuleKey;
    return <HeadModulePage moduleKey={mk} {...p}/>;
  }
  if(role==="admin") {
    if(page==="admin-overview")      return <AdminOverview {...p}/>;
    if(page==="admin-users")         return <AdminUsers {...p} users={adminUsers} setUsers={setAdminUsers}/>;
    if(page==="admin-restaurants")   return <AdminRestaurants {...p}/>;
    if(page==="admin-subscriptions") return <AdminSubscriptions {...p}/>;
    if(page==="admin-reports")       return <AdminReports {...p}/>;
    if(page==="admin-audit")         return <AdminAudit {...p}/>;
    if(page==="admin-permissions")   return <AdminPermissions {...p}/>;
    if(page==="admin-settings")      return <AdminSettings {...p}/>;
  }
  if(role==="branch") {
    if(page==="branch-overview")   return <BranchOverview {...p}/>;
    if(page==="branch-employees")  return <BranchEmployees {...p}/>;
    if(page==="branch-items")      return <BranchItems {...p}/>;
    if(page==="branch-suppliers")  return <BranchSuppliers {...p}/>;
    if(page==="branch-upload")     return <BranchUpload {...p}/>;
  }
  if(role==="procurement") {
    if(page==="proc-overview") return <ProcOverview {...p}/>;
    if(page==="proc-new")      return <ProcNewOrders {...p}/>;
    if(page==="proc-grouped")  return <ProcGrouped {...p}/>;
    if(page==="proc-sent")     return <ProcSent {...p}/>;
    if(page==="proc-reports")  return <ReportsPage {...p}/>;
    return <SimplePage title={page} icon="🛒" desc=""/>;
  }
  if(role==="supplier") {
    if(page==="sup-overview") return <SupOverview {...p}/>;
    if(page==="sup-new")      return <SupNewOrders {...p}/>;
    return <SimplePage title={page} icon="🏭" desc=""/>;
  }
  return <SimplePage title="قيد التطوير" icon="🚧" desc="هذه الصفحة قيد التطوير"/>;
}

function SimplePage({ title, icon, desc }:{ title:string; icon:string; desc:string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
      <div className="text-6xl mb-4">{icon}</div>
      <h2 className="text-xl font-bold text-gray-700 mb-2">{title}</h2>
      {desc && <p className="text-gray-400 text-sm">{desc}</p>}
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// ACCOUNTANT PAGES
// ════════════════════════════════════════════════════════════

function AccDashboard({ navigate, setModal, setDetailId, ops, approveOp, rejectOp, bulkApprove }:PageProps) {
  const [filters, setFilters] = useState<Filters>({branch:"",status:"pending",match:"",search:""});

  const pending = ops.filter(o=>o.status==="pending");
  const approved = ops.filter(o=>o.status==="approved");
  const rejected = ops.filter(o=>o.status==="rejected");
  const approvalRate = ops.length>0 ? Math.round((approved.length+ops.filter(o=>o.status==="final-approved").length)/ops.length*100) : 0;

  const pendingByModule: Record<ModuleKey,number> = {} as any;
  pending.forEach(o=>{ pendingByModule[o.moduleKey]=(pendingByModule[o.moduleKey]||0)+1; });

  const modules = [
    { id:"acc-sales",     label:"المبيعات",         icon:"💰", color:"bg-emerald-500", key:"sales" as ModuleKey },
    { id:"acc-expenses",  label:"المصروفات",         icon:"💸", color:"bg-red-500",     key:"expenses" as ModuleKey },
    { id:"acc-purchases", label:"المشتريات",         icon:"🛒", color:"bg-blue-500",    key:"purchases" as ModuleKey },
    { id:"acc-inventory", label:"المخزون",           icon:"📦", color:"bg-amber-500",   key:"inventory" as ModuleKey },
    { id:"acc-assets",    label:"الأصول الثابتة",   icon:"🏢", color:"bg-purple-500",  key:null },
    { id:"acc-shifts",    label:"إدارة الشفتات",    icon:"⏰", color:"bg-cyan-500",    key:"shifts" as ModuleKey },
    { id:"acc-employees", label:"كشف الموظفين",     icon:"👥", color:"bg-indigo-500",  key:"employees" as ModuleKey },
    { id:"acc-cash",      label:"العهد النقدية",     icon:"💼", color:"bg-orange-500",  key:"cash" as ModuleKey },
  ];

  const displayed = applyFilters(ops, filters);
  const pendingIds = pending.map(o=>o.id);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-800 font-bold text-xl">ملخص اليوم — الاثنين 14 أكتوبر 2025</h2>
          <p className="text-gray-400 text-sm mt-0.5">الفروع المخصصة: 1–50 | الموديولات: التسعة</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <KpiCard label="عمليات جديدة اليوم" value={String(pending.length)} sub="من الفروع المخصصة" icon={<BarChart3 size={20} className="text-purple-600"/>} accent="purple"/>
        <KpiCard label="وافقت عليها" value={String(approved.length)} sub="تم إرسالها لرئيس الحسابات" icon={<CheckCircle2 size={20} className="text-emerald-600"/>} accent="emerald"/>
        <KpiCard label="معلقة - تنتظرني" value={String(pending.length)} sub="يجب المراجعة" icon={<Clock size={20} className="text-amber-600"/>} accent="amber"/>
        <KpiCard label="معدل الموافقة" value={`${approvalRate}%`} sub="هذا الشهر" icon={<TrendingUp size={20} className="text-blue-600"/>} accent="blue"/>
      </div>

      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2">
          <Card title="الموديولات التسعة" actions={<span className="text-xs text-gray-400">المعلق / الإجمالي</span>}>
            <div className="p-4 grid grid-cols-4 gap-3">
              {modules.map(m=>{
                const mod_pending = m.key ? (pendingByModule[m.key]||0) : 0;
                const mod_total = m.key ? ops.filter(o=>o.moduleKey===m.key).length : 0;
                return (
                  <button key={m.id} onClick={()=>navigate(m.id)}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-gray-100 hover:border-purple-300 hover:bg-purple-50/40 transition-all relative cursor-pointer">
                    {mod_pending>0 && <span className="absolute top-1.5 left-1.5 w-2 h-2 rounded-full bg-red-500"></span>}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg text-white ${m.color}`}>{m.icon}</div>
                    <span className="text-xs font-medium text-gray-700 text-center leading-tight">{m.label}</span>
                    <div className="flex items-center gap-1">
                      {mod_pending>0 && <span className="bg-red-100 text-red-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">{mod_pending}</span>}
                      {mod_total>0 && <><span className="text-gray-300 text-[10px]">/</span><span className="text-gray-500 text-[10px]">{mod_total}</span></>}
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>
        </div>
        <div>
          <Card title="فلاتر البحث">
            <div className="p-4 space-y-3">
              {[
                { label:"🏪 الفرع", key:"branch" as const, opts:["الكل", ...BRANCHES] },
                { label:"🔄 الحالة", key:"status" as const, opts:["الكل","pending","approved","rejected","final-approved"] },
              ].map(f=>(
                <div key={f.key}>
                  <label className="text-xs font-semibold text-gray-500 block mb-1">{f.label}</label>
                  <select value={filters[f.key]} onChange={e=>setFilters(p=>({...p,[f.key]:e.target.value==="الكل"?"":e.target.value}))}
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-600">
                    {f.opts.map(o=><option key={o} value={o==="الكل"?"":o}>{STATUS_CFG[o as OpStatus]?.label||o}</option>)}
                  </select>
                </div>
              ))}
              <div className="flex items-center gap-2 mt-1">
                <Search size={13} className="text-gray-400 flex-shrink-0"/>
                <input value={filters.search} onChange={e=>setFilters(p=>({...p,search:e.target.value}))} placeholder="بحث..." className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-600"/>
              </div>
              {(filters.branch||filters.status!=="pending"||filters.match||filters.search) &&
                <button onClick={()=>setFilters({branch:"",status:"pending",match:"",search:""})} className="text-xs text-purple-600 hover:underline flex items-center gap-1"><RotateCcw size={11}/> مسح الفلاتر</button>
              }
            </div>
          </Card>
        </div>
      </div>

      <Card title="قائمة العمليات" actions={
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">{displayed.length} عملية</span>
          {pendingIds.length>0 && <Btn size="sm" variant="success" onClick={()=>bulkApprove(pendingIds)}>✓ موافقة جماعية ({pendingIds.length})</Btn>}
        </div>
      }>
        {displayed.length===0
          ? <EmptyState icon="✅" title="لا توجد عمليات" desc="تم معالجة جميع العمليات أو لا تطابق الفلاتر المحددة"/>
          : displayed.slice(0,8).map(op=>(
              <OpRow key={op.id} op={op}
                onView={()=>{ setDetailId(op.id); navigate("acc-sales-detail"); }}
                onApprove={()=>approveOp(op.id)}
                onReject={()=>{ setDetailId(op.id); setModal("reject"); }}/>
            ))
        }
        {displayed.length>8 && (
          <div className="px-5 py-3 text-center">
            <button onClick={()=>navigate("acc-sales")} className="text-xs text-purple-600 hover:underline">عرض كل {displayed.length} عملية</button>
          </div>
        )}
      </Card>
    </div>
  );
}

function AccModulePage({ moduleKey, title, navigate, setModal, setDetailId, ops, approveOp, rejectOp, bulkApprove }:PageProps&{moduleKey:ModuleKey;title:string}) {
  const [filters, setFilters] = useState<Filters>({branch:"",status:"",match:"",search:""});
  const filtered = applyFilters(ops, filters, moduleKey);
  const pending = ops.filter(o=>o.moduleKey===moduleKey&&o.status==="pending");
  const totalAmt = filtered.reduce((s,o)=>s+o.amount,0);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h2 className="text-xl font-bold text-gray-800">موديول {title}</h2>
          <p className="text-gray-400 text-sm mt-0.5">{pending.length} عملية معلقة بانتظار مراجعتك</p>
        </div>
        <div className="flex gap-2">
          {pending.length>0 && <Btn variant="success" size="sm" onClick={()=>bulkApprove(pending.map(o=>o.id))}>✓ موافقة على الكل ({pending.length})</Btn>}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <KpiCard label={`إجمالي ${title}`} value={`${(totalAmt/1000).toFixed(1)}K ر.س`} sub="المعروضة" icon={<TrendingUp size={18} className="text-purple-600"/>} accent="purple"/>
        <KpiCard label="معلقة" value={String(pending.length)} sub="بانتظار مراجعتك" icon={<Clock size={18} className="text-amber-600"/>} accent="amber"/>
        <KpiCard label="موافق عليها" value={String(ops.filter(o=>o.moduleKey===moduleKey&&o.status==="approved").length)} sub="" icon={<CheckCircle2 size={18} className="text-emerald-600"/>} accent="emerald"/>
        <KpiCard label="فروق مكتشفة" value={String(ops.filter(o=>o.moduleKey===moduleKey&&o.match==="diff").length)} sub="" icon={<AlertTriangle size={18} className="text-red-600"/>} accent="red"/>
      </div>

      <FilterBar filters={filters} onChange={setFilters} branches={BRANCHES}/>

      <Card title={`عمليات ${title}`}>
        {filtered.length===0
          ? <EmptyState icon="✅" title="لا توجد عمليات" desc="لا توجد عمليات تطابق الفلاتر المحددة"/>
          : filtered.map(op=>(
              <OpRow key={op.id} op={op}
                onView={()=>{ setDetailId(op.id); navigate("acc-sales-detail"); }}
                onApprove={()=>approveOp(op.id)}
                onReject={()=>{ setDetailId(op.id); setModal("reject"); }}/>
            ))
        }
      </Card>
    </div>
  );
}

function AccSalesDetail({ navigate, setModal, setDetailId, detailId, ops, approveOp, addCorrectiveOp }:PageProps) {
  const op = ops.find(o=>o.id===detailId) || ops[0];
  const channels = [
    { name:"نقدي",                  icon:"💵", entered:4200,  expected:4200  },
    { name:"بنكي (بنك الرياض)",     icon:"🏦", entered:8500,  expected:8500  },
    { name:"هنقرستيشن",             icon:"🟠", entered:2800,  expected:2800  },
    { name:"جاهز",                  icon:"🟡", entered:1200,  expected:1350  },
    { name:"تو يو (ToYou)",          icon:"🔵", entered:980,   expected:980   },
    { name:"نينجا (Ninja)",          icon:"⚫", entered:660,   expected:660   },
  ];
  const totalEntered = channels.reduce((s,c)=>s+c.entered,0);
  const totalExpected = channels.reduce((s,c)=>s+c.expected,0);
  const totalDiff = totalEntered-totalExpected;

  const isLocked = op?.status === "final-approved";

  return (
    <div className="space-y-4">
      <Breadcrumb items={[
        { label:"لوحة التحكم", onClick:()=>navigate("acc-dashboard") },
        { label:"المبيعات", onClick:()=>navigate("acc-sales") },
        { label:op?.id||"" }
      ]}/>

      {isLocked && <LockBanner op={op}/>}
      {op?.isCorrection && op.correctiveRef && (
        <div className="flex items-center gap-3 px-5 py-3 bg-amber-50 border border-amber-200 rounded-xl" dir="rtl">
          <ArrowLeftRight size={14} className="text-amber-600 flex-shrink-0"/>
          <p className="text-sm text-amber-800">
            <span className="font-bold">عملية تعديل — </span>
            ترتبط بالسجل الأصلي:
            <span className="font-mono font-bold text-amber-900 mr-1">{op.correctiveRef}</span>
          </p>
        </div>
      )}

      <div className={`bg-white rounded-xl border shadow-sm overflow-hidden ${isLocked?"border-slate-200":"border-gray-100"}`}>
        {isLocked && <div className="h-1 bg-gradient-to-l from-emerald-400 to-emerald-600 w-full"/>}
        <div className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">💰</span>
              <div>
                <h2 className="font-bold text-gray-900 text-xl">تقرير المبيعات اليومي</h2>
                <p className="text-gray-500 text-sm mt-0.5">{op?.branch} · 14 أكتوبر 2025 · نهاية الشفت</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <Badge className="bg-blue-50 text-blue-700 border border-blue-200 font-mono">{op?.id}</Badge>
              <Badge className={`${STATUS_CFG[op?.status||"pending"].cls} border`}>
                {isLocked && <Lock size={10}/>}
                {STATUS_CFG[op?.status||"pending"].label}
              </Badge>
              <Badge className="bg-gray-50 text-gray-500 border border-gray-200">مدير الفرع: أحمد الشمري</Badge>
              <Badge className="bg-gray-50 text-gray-500 border border-gray-200">📱 أُرسل قبل ساعة</Badge>
            </div>
          </div>
          <div className={`rounded-xl px-5 py-3 text-center ${isLocked?"bg-emerald-50 border border-emerald-200":op?.status==="approved"?"bg-blue-50":"bg-purple-50"}`}>
            {isLocked ? (
              <><Lock size={22} className="text-emerald-600 mx-auto"/>
              <p className="text-emerald-700 font-bold mt-1 text-sm">معتمد نهائياً</p>
              <p className="text-emerald-500 text-xs">مُرحَّل لـ ERP · مُغلق</p></>
            ) : op?.status==="approved" ? (
              <><CheckCircle2 size={28} className="text-blue-500 mx-auto"/>
              <p className="text-blue-700 font-bold mt-1 text-sm">موافق عليه</p>
              <p className="text-blue-500 text-xs">بانتظار رئيس الحسابات</p></>
            ) : (
              <><p className="text-gray-500 text-xs">إجمالي المبيعات</p>
              <p className="font-bold text-purple-700 text-2xl font-mono mt-0.5">{fmtAmt(totalEntered)}<span className="text-sm mr-1">ر.س</span></p>
              {totalDiff!==0 && <p className="text-red-500 text-xs mt-0.5 font-medium">⚠ فرق: {Math.abs(totalDiff)} ر.س</p>}</>
            )}
          </div>
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
                  <th className="px-4 py-3 text-center">المُدخل</th>
                  <th className="px-4 py-3 text-center">المتوقع</th>
                  <th className="px-4 py-3 text-center">الفرق</th>
                  <th className="px-4 py-3 text-center">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {channels.map(ch=>{
                  const diff=ch.entered-ch.expected;
                  return (
                    <tr key={ch.name} className={`hover:bg-gray-50 ${diff!==0?"bg-red-50/50":""}`}>
                      <td className="px-4 py-3 font-medium text-gray-800 text-sm">{ch.icon} {ch.name}</td>
                      <td className="px-4 py-3 text-center font-mono font-semibold text-gray-800 text-sm">{ch.entered.toLocaleString()} ر.س</td>
                      <td className="px-4 py-3 text-center font-mono text-gray-600 text-sm">{ch.expected.toLocaleString()} ر.س</td>
                      <td className="px-4 py-3 text-center">{diff===0?<span className="text-emerald-600 font-mono text-sm">—</span>:<span className="text-red-600 font-bold font-mono text-sm">{diff} ر.س</span>}</td>
                      <td className="px-4 py-3 text-center">{diff===0?<Badge className="bg-emerald-50 text-emerald-700">✓ متطابق</Badge>:<Badge className="bg-red-50 text-red-700">⚠ فرق</Badge>}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-gray-50 border-t-2 border-gray-200">
                <tr className="font-bold">
                  <td className="px-4 py-3 text-gray-700">المجموع</td>
                  <td className="px-4 py-3 text-center font-mono text-purple-700">{fmtAmt(totalEntered)} ر.س</td>
                  <td className="px-4 py-3 text-center font-mono text-gray-600">{fmtAmt(totalExpected)} ر.س</td>
                  <td className="px-4 py-3 text-center font-mono text-red-600">{totalDiff!==0?`${totalDiff} ر.س`:"—"}</td>
                  <td className="px-4 py-3 text-center">{totalDiff===0?<Badge className="bg-emerald-50 text-emerald-700">✓ مطابق</Badge>:<Badge className="bg-red-50 text-red-700">⚠ فرق {Math.abs(totalDiff)} ر.س</Badge>}</td>
                </tr>
              </tfoot>
            </table>
            {totalDiff!==0 && (
              <div className="mx-4 mb-4 mt-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle size={15} className="text-amber-600 mt-0.5 flex-shrink-0"/>
                  <div>
                    <p className="text-amber-800 font-semibold text-sm">يوجد فرق في قناة جاهز</p>
                    <p className="text-amber-700 text-xs mt-0.5">الفرق: 150 ر.س — يُخصم من حساب المسؤول: محمد العبدلي (مدير الشفت)</p>
                  </div>
                </div>
              </div>
            )}
          </Card>
          <Card title="سجل دورة حياة السجل" actions={<span className="text-xs text-gray-400 font-mono">{op?.id}</span>}>
            <div className="p-4 space-y-0">
              {op && buildAuditTrail(op).map((event, i, arr)=>(
                <div key={i} className="flex gap-3 relative">
                  {/* Vertical connector line */}
                  {i < arr.length - 1 && (
                    <div className="absolute right-[13px] top-7 bottom-0 w-0.5 bg-gray-100 z-0"/>
                  )}
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0 z-10 border ${event.isTerminal ? "border-2 border-emerald-300" : "border-gray-100"} ${event.cls}`}>
                    {event.icon}
                  </span>
                  <div className={`flex-1 pb-4 ${i === arr.length - 1 ? "" : ""}`}>
                    <p className={`text-xs font-semibold leading-tight ${event.isTerminal ? "text-gray-900" : "text-gray-700"}`}>{event.action}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{event.by} · {event.time}</p>
                    {event.isTerminal && (
                      <Badge className={`mt-1.5 text-[10px] ${op?.erpPosted ? "bg-indigo-50 text-indigo-700 border border-indigo-200" : "bg-emerald-50 text-emerald-700 border border-emerald-200"}`}>
                        <Lock size={8}/> حالة نهائية
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          {isLocked ? (
            <Card title="حالة السجل الموثَّق">
              <div className="p-4 space-y-3">
                {/* Two distinct states: final-approved vs erp-posted */}
                <div className="grid grid-cols-2 gap-2">
                  <div className={`rounded-xl p-3 text-center border-2 ${isLocked ? "border-emerald-300 bg-emerald-50" : "border-gray-100 bg-gray-50"}`}>
                    <CheckCircle2 size={20} className="text-emerald-600 mx-auto mb-1"/>
                    <p className="text-xs font-bold text-emerald-700">اعتماد نهائي</p>
                    <p className="text-[10px] text-emerald-500 mt-0.5">{op?.finalApprovedAt || "16:42 م"}</p>
                  </div>
                  <div className={`rounded-xl p-3 text-center border-2 ${op?.erpPosted ? "border-indigo-300 bg-indigo-50" : "border-dashed border-gray-200 bg-gray-50"}`}>
                    <ChevronsRight size={20} className={`mx-auto mb-1 ${op?.erpPosted ? "text-indigo-600" : "text-gray-300"}`}/>
                    <p className={`text-xs font-bold ${op?.erpPosted ? "text-indigo-700" : "text-gray-400"}`}>
                      {op?.erpPosted ? "مُرحَّل لـ ERP" : "لم يُرحَّل بعد"}
                    </p>
                    <p className={`text-[10px] mt-0.5 ${op?.erpPosted ? "text-indigo-500" : "text-gray-300"}`}>
                      {op?.erpPosted ? (op?.erpBatchId || "ERP-BATCH") : "في انتظار دفعة الترحيل"}
                    </p>
                  </div>
                </div>
                <div className="border border-gray-100 rounded-xl divide-y divide-gray-50 text-xs">
                  {[
                    { label: "مُنشئ السجل", value: op?.submittedBy || "مدير الفرع" },
                    { label: "راجعه واعتمده", value: op?.approvedBy || "المحاسب المختص" },
                    { label: "الاعتماد النهائي", value: op?.finalApprovedBy || "رئيس الحسابات" },
                    { label: "الترحيل لـ ERP", value: op?.erpPosted ? `✓ ${op.erpBatchId || "تم الترحيل"}` : "⏳ لم يُرحَّل بعد" },
                  ].map((row,i)=>(
                    <div key={i} className="flex justify-between px-3 py-2.5">
                      <span className="text-gray-400">{row.label}</span>
                      <span className={`font-semibold ${row.value.startsWith("✓") ? "text-emerald-600" : row.value.startsWith("⏳") ? "text-amber-500" : "text-gray-700"}`}>{row.value}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={()=>{
                    if(op && addCorrectiveOp) {
                      addCorrectiveOp(op.id);
                      navigate("acc-sales");
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-50 text-amber-700 font-semibold text-sm hover:bg-amber-100 border border-amber-200">
                  <FileText size={14}/> إنشاء عملية تعديل مرتبطة
                </button>
              </div>
            </Card>
          ) : op?.status==="pending" ? (
            <Card title="الإجراءات">
              <div className="p-4 space-y-2.5">
                <button onClick={()=>{ approveOp(op.id); }} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 shadow-sm">
                  <CheckCircle2 size={15}/> موافقة — إرسال لرئيس الحسابات
                </button>
                <button onClick={()=>{ setDetailId(op.id); setModal("reject"); }} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-50 text-red-700 font-semibold text-sm hover:bg-red-100 border border-red-200">
                  <XCircle size={15}/> رفض — إعادة لمدير الفرع
                </button>
                <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-50 text-blue-700 font-semibold text-sm hover:bg-blue-100 border border-blue-200">
                  <MessageSquare size={15}/> طلب توضيح
                </button>
              </div>
            </Card>
          ) : op?.status==="approved" ? (
            <Card title="حالة السجل">
              <div className="p-4">
                <div className="flex flex-col items-center gap-2 py-3 text-center">
                  <CheckCircle2 size={32} className="text-blue-500"/>
                  <p className="font-bold text-blue-700 text-sm">تمت الموافقة</p>
                  <p className="text-gray-400 text-xs">بانتظار الاعتماد النهائي من رئيس الحسابات</p>
                </div>
              </div>
            </Card>
          ) : null}
          <Card title="المرفقات (3)">
            <div className="p-4 space-y-2">
              {[{name:"تقرير POS.pdf",type:"PDF",size:"245 KB"},{name:"كشف بنك الرياض.pdf",type:"PDF",size:"182 KB"},{name:"تقرير هنقرستيشن.xlsx",type:"Excel",size:"98 KB"}].map((att,i)=>(
                <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-1.5 py-0.5 rounded font-bold ${att.type==="PDF"?"bg-red-100 text-red-700":"bg-green-100 text-green-700"}`}>{att.type}</span>
                    <div><p className="text-xs font-medium text-gray-700">{att.name}</p><p className="text-[10px] text-gray-400">{att.size}</p></div>
                  </div>
                  <div className="flex gap-1">
                    <button className="p-1.5 rounded hover:bg-gray-200"><Eye size={11} className="text-gray-500"/></button>
                    <button className="p-1.5 rounded hover:bg-gray-200"><Download size={11} className="text-gray-500"/></button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          {!isLocked && (
            <Card title="ملاحظات المحاسب">
              <div className="p-4">
                <textarea className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 resize-none mb-2" rows={3} placeholder="أضف ملاحظة..."/>
                <Btn variant="ghost" className="w-full justify-center text-xs">حفظ الملاحظة</Btn>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function AccPurchases({ navigate, setModal, setDetailId, ops, approveOp, rejectOp, bulkApprove }:PageProps) {
  const [filters, setFilters] = useState<Filters>({branch:"",status:"",match:"",search:""});
  const [expandedId, setExpandedId] = useState<string|null>(null);
  const filtered = applyFilters(ops, filters, "purchases");
  const pending = ops.filter(o=>o.moduleKey==="purchases"&&o.status==="pending");

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h2 className="text-xl font-bold text-gray-800">موديول المشتريات</h2>
          <p className="text-gray-400 text-sm mt-0.5">مطابقة الكميات المستلمة مع الفواتير الواردة</p></div>
        {pending.length>0 && <Btn variant="success" size="sm" onClick={()=>bulkApprove(pending.map(o=>o.id))}>✓ موافقة جماعية ({pending.length})</Btn>}
      </div>

      <div className="grid grid-cols-4 gap-4">
        <KpiCard label="إجمالي المشتريات" value={`${(ops.filter(o=>o.moduleKey==="purchases").reduce((s,o)=>s+o.amount,0)/1000).toFixed(1)}K ر.س`} sub="" icon={<ShoppingCart size={18} className="text-blue-600"/>} accent="blue"/>
        <KpiCard label="معلقة" value={String(pending.length)} sub="" icon={<Clock size={18} className="text-amber-600"/>} accent="amber"/>
        <KpiCard label="فروق في الكمية" value={String(ops.filter(o=>o.moduleKey==="purchases"&&o.match==="diff").length)} sub="" icon={<AlertTriangle size={18} className="text-red-600"/>} accent="red"/>
        <KpiCard label="موردون نشطون" value="12" sub="هذا الشهر" icon={<Truck size={18} className="text-purple-600"/>} accent="purple"/>
      </div>

      <FilterBar filters={filters} onChange={setFilters} branches={BRANCHES}/>

      <Card title="طلبات الشراء">
        {filtered.length===0
          ? <EmptyState icon="✅" title="لا توجد عمليات" desc="لا توجد عمليات تطابق الفلاتر"/>
          : filtered.map(op=>(
            <div key={op.id} className={`${op.match==="diff"?"border-r-4 border-r-red-400":""}`}>
              <div className="px-5 py-4 flex items-center gap-4 hover:bg-gray-50/70 border-b border-gray-100">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-gray-800 text-sm">{op.branch}</span>
                    <span className="text-gray-300">·</span>
                    <span className="text-xs font-mono text-purple-600">{op.id}</span>
                    <span className="text-gray-300">·</span>
                    <span className="text-xs text-gray-400">⏰ {op.timeAgo}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Badge className={`${MATCH_CFG[op.match].cls} border`}>{MATCH_CFG[op.match].label}</Badge>
                    {op.diff && <span className="text-xs text-red-600 font-medium">⚠ {op.diff}</span>}
                    <Badge className={STATUS_CFG[op.status].cls}>{STATUS_CFG[op.status].label}</Badge>
                  </div>
                </div>
                <div className="font-bold text-gray-800 font-mono text-sm">{fmtAmt(op.amount)} ر.س</div>
                <div className="flex gap-1.5">
                  <Btn size="sm" onClick={()=>setExpandedId(expandedId===op.id?null:op.id)}>
                    {expandedId===op.id?<ChevronUp size={13}/>:<ChevronDown size={13}/>} تفاصيل
                  </Btn>
                  {op.status==="pending" && <>
                    <Btn size="sm" variant="success" onClick={()=>approveOp(op.id)}><ThumbsUp size={13}/></Btn>
                    <Btn size="sm" variant="danger" onClick={()=>{ setDetailId(op.id); setModal("reject"); }}><ThumbsDown size={13}/></Btn>
                  </>}
                </div>
              </div>
              {expandedId===op.id && (
                <div className="px-5 pb-4 bg-gray-50/50">
                  <table className="w-full border border-gray-200 rounded-xl overflow-hidden text-xs mt-3" dir="rtl">
                    <thead className="bg-gray-100"><tr><th className="px-3 py-2 text-right">الصنف</th><th className="px-3 py-2 text-center">الكمية المطلوبة</th><th className="px-3 py-2 text-center">الكمية المستلمة</th><th className="px-3 py-2 text-center">الحالة</th></tr></thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {[{item:"دجاج طازج",ordered:50,received:48},{item:"حليب طازج",ordered:100,received:100},{item:"خضار متنوعة",ordered:30,received:op.match==="diff"?27:30},{item:"بطاطس",ordered:80,received:80}].map((row,i)=>{
                        const diff=row.ordered-row.received;
                        return (<tr key={i} className={diff>0?"bg-red-50/60":""}>
                          <td className="px-3 py-2 font-medium">{row.item}</td>
                          <td className="px-3 py-2 text-center">{row.ordered} كجم</td>
                          <td className={`px-3 py-2 text-center font-semibold ${diff>0?"text-red-600":""}`}>{row.received} كجم</td>
                          <td className="px-3 py-2 text-center">{diff===0?<Badge className="bg-emerald-50 text-emerald-700">مطابق</Badge>:<Badge className="bg-red-50 text-red-700">فرق {diff}</Badge>}</td>
                        </tr>);
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))
        }
      </Card>
    </div>
  );
}

function AccInventory({ navigate, ops, approveOp, rejectOp, setModal, setDetailId, bulkApprove }:PageProps) {
  const [filters, setFilters] = useState<Filters>({branch:"",status:"",match:"",search:""});
  const filtered = applyFilters(ops, filters, "inventory");

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h2 className="text-xl font-bold text-gray-800">موديول المخزون</h2>
          <p className="text-gray-400 text-sm mt-0.5">متابعة الجرد اليومي والهدر</p></div>
        <Btn variant="primary" size="sm" onClick={()=>navigate("acc-inventory-items")}><Package size={13}/> تحديد أصناف الجرد</Btn>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <KpiCard label="عمليات الجرد" value={String(ops.filter(o=>o.moduleKey==="inventory").length)} sub="" icon={<Package size={18} className="text-amber-600"/>} accent="amber"/>
        <KpiCard label="معلقة" value={String(ops.filter(o=>o.moduleKey==="inventory"&&o.status==="pending").length)} sub="" icon={<Clock size={18} className="text-amber-600"/>} accent="amber"/>
        <KpiCard label="هدر مسجل" value="1,240 ر.س" sub="هذا الأسبوع" icon={<AlertTriangle size={18} className="text-red-600"/>} accent="red"/>
        <KpiCard label="تطابق الجرد" value="89%" sub="هذا الشهر" icon={<CheckCircle2 size={18} className="text-emerald-600"/>} accent="emerald"/>
      </div>
      <FilterBar filters={filters} onChange={setFilters} branches={BRANCHES}/>
      <Card title="تقارير الجرد اليومي">
        {filtered.length===0
          ? <EmptyState icon="✅" title="لا توجد عمليات" desc=""/>
          : filtered.map(op=>(
            <div key={op.id} className="px-5 py-4 flex items-center gap-4 border-b border-gray-100 last:border-0 hover:bg-gray-50">
              <div className="flex-1">
                <p className="font-semibold text-gray-800 text-sm">{op.branch}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={`${MATCH_CFG[op.match].cls} border`}>{MATCH_CFG[op.match].label}</Badge>
                  <Badge className={STATUS_CFG[op.status].cls}>{STATUS_CFG[op.status].label}</Badge>
                  <span className="text-xs text-gray-400">هدر: 120 ر.س</span>
                </div>
              </div>
              <span className="font-mono font-bold text-gray-800 text-sm">{fmtAmt(op.amount)} ر.س</span>
              <span className="text-xs text-gray-400">أُرسل {op.timeAgo}</span>
              <div className="flex gap-1.5">
                <Btn size="sm"><Eye size={12}/> عرض</Btn>
                {op.status==="pending" && <>
                  <Btn size="sm" variant="success" onClick={()=>approveOp(op.id)}><ThumbsUp size={12}/></Btn>
                  <Btn size="sm" variant="danger" onClick={()=>{ setDetailId(op.id); setModal("reject"); }}><ThumbsDown size={12}/></Btn>
                </>}
              </div>
            </div>
          ))
        }
      </Card>
    </div>
  );
}

function AccInventoryItems({ navigate }:PageProps) {
  const allItems = [
    {name:"دجاج طازج",cat:"بروتين",unit:"كجم"},{name:"خبز برجر",cat:"مخبوزات",unit:"قطعة"},
    {name:"جبنة شيدر",cat:"ألبان",unit:"كجم"},{name:"حليب طازج",cat:"ألبان",unit:"لتر"},
    {name:"طماطم",cat:"خضروات",unit:"كجم"},{name:"خس",cat:"خضروات",unit:"كجم"},
    {name:"بطاطس",cat:"خضروات",unit:"كجم"},{name:"بصل",cat:"خضروات",unit:"كجم"},
    {name:"صوص خاص",cat:"صوصات",unit:"كجم"},{name:"زيت قلي",cat:"زيوت",unit:"لتر"},
    {name:"مايونيز",cat:"صوصات",unit:"كجم"},{name:"كاتشب",cat:"صوصات",unit:"كجم"},
    {name:"ماء معدني",cat:"مشروبات",unit:"لتر"},{name:"مشروبات غازية",cat:"مشروبات",unit:"علبة"},
    {name:"عصير برتقال",cat:"مشروبات",unit:"لتر"},
  ];
  const [selected,setSelected] = useState<string[]>(["دجاج طازج","حليب طازج","خس","طماطم","بطاطس","زيت قلي","كاتشب","ماء معدني","عصير برتقال","خبز برجر"]);
  const [catFilter,setCatFilter] = useState("الكل");
  const [saved,setSaved] = useState(false);
  const [saving,setSaving] = useState(false);
  const cats = ["الكل",...new Set(allItems.map(i=>i.cat))];
  const shown = catFilter==="الكل"?allItems:allItems.filter(i=>i.cat===catFilter);
  const toggle = (n:string) => { setSaved(false); setSelected(p=>p.includes(n)?p.filter(x=>x!==n):[...p,n]); };
  const save = () => { setSaving(true); setTimeout(()=>{ setSaving(false); setSaved(true); },800); };

  return (
    <div className="space-y-5">
      <Breadcrumb items={[{label:"لوحة التحكم",onClick:()=>navigate("acc-dashboard")},{label:"المخزون",onClick:()=>navigate("acc-inventory")},{label:"تحديد الأصناف"}]}/>
      <div className="flex items-center justify-between">
        <div><h2 className="text-xl font-bold text-gray-800">تحديد أصناف الجرد اليومي</h2>
          <p className="text-gray-400 text-sm mt-0.5">حدد الأصناف التي يجب على مدير الفرع جردها يومياً — يتزامن فوراً مع تطبيق الموبايل</p></div>
        <Btn variant="primary" onClick={save} className={saving?"opacity-70 cursor-not-allowed":""}>
          {saving?<RefreshCw size={13} className="animate-spin"/>:<RefreshCw size={13}/>}
          {saving?"جاري الحفظ...":"حفظ وتحديث التطبيق فوراً"}
        </Btn>
      </div>
      {saved && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center gap-3">
          <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0"/>
          <div><p className="text-emerald-800 font-semibold text-sm">تم الحفظ والإرسال بنجاح!</p>
            <p className="text-emerald-600 text-xs">تم إرسال {selected.length} أصناف إلى تطبيق مدير الفرع مع إشعار فوري.</p></div>
          <button onClick={()=>setSaved(false)} className="mr-auto text-emerald-400 hover:text-emerald-600"><X size={14}/></button>
        </div>
      )}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center gap-2">
        <Bell size={14} className="text-amber-600 flex-shrink-0"/>
        <p className="text-amber-700 text-sm">أي تغيير يُحدَّث فوراً في تطبيق مدير الفرع مع إشعار تلقائي.</p>
      </div>
      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 space-y-4">
          <div className="flex gap-2 flex-wrap">
            {cats.map(c=>(
              <button key={c} onClick={()=>setCatFilter(c)} className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${catFilter===c?"bg-purple-600 text-white":"bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`}>{c}</button>
            ))}
          </div>
          <Card title={`الأصناف — ${shown.length}`} actions={
            <div className="flex gap-3">
              <button onClick={()=>{ setSaved(false); setSelected(allItems.map(i=>i.name)); }} className="text-xs text-purple-600 hover:underline">تحديد الكل</button>
              <button onClick={()=>{ setSaved(false); setSelected([]); }} className="text-xs text-red-500 hover:underline">إلغاء الكل</button>
            </div>
          }>
            <div className="p-4 grid grid-cols-2 gap-2.5">
              {shown.map(item=>{
                const isSelected=selected.includes(item.name);
                return (
                  <button key={item.name} onClick={()=>toggle(item.name)}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border-2 transition-all text-right ${isSelected?"border-purple-300 bg-purple-50/60":"border-gray-100 bg-white hover:border-gray-200"}`}>
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 ${isSelected?"bg-purple-600":"bg-gray-200"}`}>
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
          </Card>
        </div>
        <div>
          <Card title="الأصناف المحددة" actions={<Badge className="bg-purple-100 text-purple-700">{selected.length} صنف</Badge>}>
            <div className="p-4">
              {selected.length===0
                ? <EmptyState icon="📦" title="لم يتم اختيار أصناف" desc=""/>
                : <div className="space-y-1.5 mb-4">
                    {selected.map((n,i)=>(
                      <div key={n} className="flex items-center gap-2 py-1">
                        <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-bold flex items-center justify-center flex-shrink-0">{i+1}</span>
                        <span className="text-sm text-gray-700 flex-1">{n}</span>
                        <button onClick={()=>toggle(n)} className="text-gray-300 hover:text-red-400"><X size={12}/></button>
                      </div>
                    ))}
                  </div>
              }
              <Btn variant="primary" className="w-full justify-center mt-2" onClick={save}>
                <RefreshCw size={13}/> تحديث التطبيق
              </Btn>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function AccShifts({ navigate, setModal }:PageProps) {
  const shifts = [
    { name:"خالد الشمري", role:"مشرف الشفت", branch:"فرع الرياض - العليا", start:"8:00 ص", duration:"3:22 ساعة", orders:87, sales:12500, cash:4200, status:"active" as const },
    { name:"محمد العتيبي", role:"كاشير رئيسي", branch:"فرع الرياض - العليا", start:"8:00 ص", duration:"3:22 ساعة", orders:87, sales:12500, cash:null, status:"active" as const },
    { name:"سعد الدوسري", role:"مشرف الشفت", branch:"فرع مكة - المعابدة", start:"6:00 ص", duration:"5:22 ساعة", orders:45, sales:9200, cash:3800, status:"late" as const },
    { name:"فهد القحطاني", role:"كاشير", branch:"فرع جدة - الحمراء", start:"7:00 ص", duration:"4:22 ساعة", orders:63, sales:9200, cash:null, status:"active" as const },
  ];
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h2 className="text-xl font-bold text-gray-800">الشفتات النشطة — مباشر</h2>
          <p className="text-gray-400 text-sm mt-0.5">الوقت الفعلي لجميع الفروع المخصصة</p></div>
        <span className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>مباشر — آخر تحديث: الآن
        </span>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <KpiCard label="شفتات نشطة" value="4" sub="" icon={<span className="w-2 h-2 rounded-full bg-emerald-500"></span>} accent="emerald"/>
        <KpiCard label="شفت متأخر" value="1" sub="يحتاج متابعة" icon={<AlertTriangle size={18} className="text-amber-600"/>} accent="amber"/>
        <KpiCard label="مبيعات الشفتات" value="43.4K ر.س" sub="" icon={<TrendingUp size={18} className="text-purple-600"/>} accent="purple"/>
        <KpiCard label="إجمالي الطلبات" value="282" sub="" icon={<ShoppingCart size={18} className="text-blue-600"/>} accent="blue"/>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {shifts.map((sh,i)=>(
          <div key={i} className={`bg-white rounded-xl border shadow-sm p-4 ${sh.status==="late"?"border-amber-300 bg-amber-50/20":"border-gray-100"}`}>
            {sh.status==="late" && <div className="flex items-center gap-2 text-amber-700 text-xs font-semibold mb-3 bg-amber-100 rounded-lg px-3 py-2"><AlertTriangle size={13}/> انتهى وقت الشفت — لم يُغلق الصندوق بعد</div>}
            <div className="flex items-center gap-3 mb-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-cyan-400 flex items-center justify-center text-white font-bold text-sm">{sh.name[0]}</div>
                <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${sh.status==="late"?"bg-amber-500":"bg-emerald-500"}`}></span>
              </div>
              <div className="flex-1"><p className="font-bold text-gray-800 text-sm">{sh.name}</p><p className="text-xs text-gray-500">{sh.role} · {sh.branch}</p></div>
              <Badge className={sh.status==="late"?"bg-amber-100 text-amber-700":"bg-emerald-100 text-emerald-700"}>{sh.status==="late"?"تأخير":"نشط"}</Badge>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-3 text-center">
              {[{label:"بداية الشفت",val:sh.start},{label:"المدة",val:sh.duration},{label:"الطلبات",val:String(sh.orders)}].map((s,j)=>(
                <div key={j} className="bg-gray-50 rounded-lg p-2"><p className="text-[10px] text-gray-400">{s.label}</p><p className="text-sm font-bold text-gray-800">{s.val}</p></div>
              ))}
            </div>
            <div className="flex items-center justify-between text-sm mb-3">
              <span className="text-gray-500 text-xs">مبيعات الشفت</span>
              <span className="font-bold text-purple-700">{fmtAmt(sh.sales)} ر.س</span>
            </div>
            <div className="flex gap-2">
              <button onClick={()=>setModal("contact")} className="flex-1 flex items-center justify-center gap-1.5 text-xs py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"><Phone size={12}/> تواصل</button>
              <button className="flex-1 flex items-center justify-center gap-1.5 text-xs py-2 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100"><Eye size={12}/> التفاصيل</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AccEmployees({ navigate, setModal }:PageProps) {
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const employees = [
    { name:"أحمد الشمري", role:"مشرف الشفت", branch:"الرياض - العليا", balance:1250, movements:[
      { date:"14 أكتوبر", desc:"عمولة الشفت الصباحي", type:"credit", amt:500 },
      { date:"14 أكتوبر", desc:"خصم — نقص في الصندوق", type:"debit", amt:150 },
      { date:"13 أكتوبر", desc:"عمولة الشفت المسائي", type:"credit", amt:500 },
      { date:"12 أكتوبر", desc:"سلفة بطلب", type:"debit", amt:500 },
      { date:"11 أكتوبر", desc:"عمولة الشفت الصباحي", type:"credit", amt:500 },
      { date:"10 أكتوبر", desc:"حافز أداء — أفضل مبيعات", type:"credit", amt:400 },
    ]},
    { name:"محمد العتيبي", role:"كاشير رئيسي", branch:"الرياض - العليا", balance:-350, movements:[
      { date:"14 أكتوبر", desc:"خصم — فرق في الصندوق", type:"debit", amt:350 },
      { date:"13 أكتوبر", desc:"عمولة الشفت المسائي", type:"credit", amt:450 },
    ]},
    { name:"سعد الدوسري", role:"مشرف الشفت", branch:"مكة - المعابدة", balance:800, movements:[
      { date:"14 أكتوبر", desc:"عمولة الشفت الصباحي", type:"credit", amt:800 },
    ]},
  ];
  const emp = employees[selectedIdx];
  const totalCredit = emp.movements.filter(m=>m.type==="credit").reduce((s,m)=>s+m.amt,0);
  const totalDebit = emp.movements.filter(m=>m.type==="debit").reduce((s,m)=>s+m.amt,0);

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-gray-800">كشف حساب الموظفين</h2>
      <div className="grid grid-cols-2 gap-5">
        <Card title="قائمة الموظفين">
          <div className="divide-y divide-gray-100">
            {employees.map((e,i)=>(
              <button key={i} onClick={()=>setSelectedIdx(i)} className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-right ${selectedIdx===i?"bg-purple-50/50":""}`}>
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-400 to-cyan-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">{e.name[0]}</div>
                <div className="flex-1 min-w-0"><p className="font-semibold text-sm text-gray-800">{e.name}</p><p className="text-xs text-gray-400">{e.role} · {e.branch}</p></div>
                <span className={`font-mono font-bold text-sm ${e.balance>=0?"text-emerald-600":"text-red-600"}`}>{e.balance>=0?"+":""}{e.balance} ر.س</span>
              </button>
            ))}
          </div>
        </Card>
        <div className="space-y-4">
          <Card title={`كشف حساب: ${emp.name}`} actions={
            <div className="flex gap-2">
              <Btn size="sm"><Download size={12}/> PDF</Btn>
              <button onClick={()=>setModal("contact")} className="text-xs px-2 py-1 rounded border border-gray-200 text-gray-600 hover:bg-gray-50 flex items-center gap-1"><Phone size={11}/> تواصل</button>
            </div>
          }>
            <div className="p-4">
              <div className="bg-gray-50 rounded-xl p-3 mb-4 grid grid-cols-3 gap-3 text-center">
                <div><p className="text-[10px] text-gray-400">الرصيد</p><p className={`font-bold text-base ${emp.balance>=0?"text-emerald-600":"text-red-600"}`}>{emp.balance>=0?"+":""}{emp.balance} ر.س</p></div>
                <div><p className="text-[10px] text-gray-400">إجمالي الدائن</p><p className="font-bold text-emerald-600">+{fmtAmt(totalCredit)} ر.س</p></div>
                <div><p className="text-[10px] text-gray-400">إجمالي المدين</p><p className="font-bold text-red-600">-{fmtAmt(totalDebit)} ر.س</p></div>
              </div>
              <div className="space-y-2">
                {emp.movements.map((m,i)=>(
                  <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0 ${m.type==="credit"?"bg-emerald-50":"bg-red-50"}`}>{m.type==="credit"?"⬆":"⬇"}</div>
                    <div className="flex-1"><p className="text-xs font-medium text-gray-700">{m.desc}</p><p className="text-[10px] text-gray-400">{m.date}</p></div>
                    <span className={`font-mono font-bold text-sm ${m.type==="credit"?"text-emerald-600":"text-red-600"}`}>{m.type==="credit"?"+":"-"}{fmtAmt(m.amt)} ر.س</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function AccCash({}: PageProps) {
  const branches = [
    { branch:"فرع الرياض - العليا", custodian:"أحمد الشمري", amount:5000, used:3200 },
    { branch:"فرع جدة - الحمراء", custodian:"سعد القحطاني", amount:3000, used:2800 },
    { branch:"فرع مكة - المعابدة", custodian:"فهد العتيبي", amount:4000, used:1500 },
  ];
  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-gray-800">إدارة العهد النقدية</h2>
      <div className="grid grid-cols-3 gap-4">
        <KpiCard label="إجمالي العهد" value={`${fmtAmt(branches.reduce((s,b)=>s+b.amount,0))} ر.س`} sub="" icon={<ArrowLeftRight size={18} className="text-orange-600"/>} accent="orange"/>
        <KpiCard label="المصروف" value={`${fmtAmt(branches.reduce((s,b)=>s+b.used,0))} ر.س`} sub="" icon={<Wallet size={18} className="text-red-600"/>} accent="red"/>
        <KpiCard label="المتبقي" value={`${fmtAmt(branches.reduce((s,b)=>s+b.amount-b.used,0))} ر.س`} sub="" icon={<CheckCircle2 size={18} className="text-emerald-600"/>} accent="emerald"/>
      </div>
      <Card title="كشف العهود النقدية">
        <table className="w-full" dir="rtl">
          <thead className="bg-gray-50"><tr className="text-xs text-gray-500 font-semibold">
            <th className="px-4 py-3 text-right">الفرع</th><th className="px-4 py-3 text-right">المسؤول</th>
            <th className="px-4 py-3 text-center">إجمالي العهدة</th><th className="px-4 py-3 text-center">المصروف</th>
            <th className="px-4 py-3 text-center">المتبقي</th><th className="px-4 py-3 text-center">إجراء</th>
          </tr></thead>
          <tbody className="divide-y divide-gray-100">
            {branches.map((b,i)=>{
              const rem=b.amount-b.used;
              const pct=Math.round(b.used/b.amount*100);
              return (
                <tr key={i} className={`hover:bg-gray-50 ${rem<500?"bg-red-50/30":""}`}>
                  <td className="px-4 py-3 font-semibold text-sm text-gray-800">{b.branch}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{b.custodian}</td>
                  <td className="px-4 py-3 text-center font-mono font-semibold">{fmtAmt(b.amount)} ر.س</td>
                  <td className="px-4 py-3 text-center">
                    <span className="font-mono text-sm text-red-600">{fmtAmt(b.used)} ر.س</span>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1"><div className="bg-red-400 h-1.5 rounded-full" style={{width:`${pct}%`}}></div></div>
                  </td>
                  <td className={`px-4 py-3 text-center font-mono font-bold ${rem<500?"text-red-600":"text-emerald-600"}`}>{fmtAmt(rem)} ر.س</td>
                  <td className="px-4 py-3 text-center"><Btn size="sm"><Eye size={12}/> عرض</Btn></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function AccAssets({}: PageProps) {
  const assets = [
    { name:"ثلاجة عرض كبيرة", cat:"معدات", branch:"الرياض - العليا", cost:28000, book:21000 },
    { name:"نظام POS متكامل", cat:"تقنية", branch:"جدة - الحمراء", cost:15000, book:9000 },
    { name:"شاشات عرض المنيو", cat:"تقنية", branch:"مكة - المعابدة", cost:8500, book:7083 },
    { name:"فرن صناعي", cat:"معدات", branch:"الدمام", cost:45000, book:37500 },
  ];
  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-gray-800">الأصول الثابتة</h2>
      <div className="grid grid-cols-3 gap-4">
        <KpiCard label="إجمالي الأصول (الدفترية)" value={`${(assets.reduce((s,a)=>s+a.book,0)/1000).toFixed(0)}K ر.س`} sub="" icon={<Building2 size={18} className="text-purple-600"/>} accent="purple"/>
        <KpiCard label="الاستهلاك الشهري" value="18,500 ر.س" sub="" icon={<TrendingUp size={18} className="text-amber-600"/>} accent="amber"/>
        <KpiCard label="عدد الأصول" value={String(assets.length*4)} sub="تقديري في 50 فرع" icon={<BarChart3 size={18} className="text-blue-600"/>} accent="blue"/>
      </div>
      <Card title="قائمة الأصول — عرض فقط">
        <table className="w-full" dir="rtl">
          <thead className="bg-gray-50"><tr className="text-xs text-gray-500 font-semibold">
            <th className="px-4 py-3 text-right">الأصل</th><th className="px-4 py-3 text-right">الفئة</th><th className="px-4 py-3 text-right">الفرع</th>
            <th className="px-4 py-3 text-center">التكلفة</th><th className="px-4 py-3 text-center">القيمة الدفترية</th>
          </tr></thead>
          <tbody className="divide-y divide-gray-100">
            {assets.map((a,i)=>(
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-sm text-gray-800">{a.name}</td>
                <td className="px-4 py-3 text-xs"><Badge className="bg-blue-50 text-blue-700">{a.cat}</Badge></td>
                <td className="px-4 py-3 text-xs text-gray-500">{a.branch}</td>
                <td className="px-4 py-3 text-center font-mono text-sm">{fmtAmt(a.cost)} ر.س</td>
                <td className="px-4 py-3 text-center font-mono text-sm font-semibold text-purple-700">{fmtAmt(a.book)} ر.س</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function ReportsPage({}: PageProps) {
  const reports = ["تقرير المبيعات الشهري","تقرير المصروفات","تقرير المشتريات","كشف الحسابات","تقرير المخزون","تقرير الأداء العام"];
  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-gray-800">التقارير</h2>
      <div className="grid grid-cols-3 gap-4">
        {reports.map((r,i)=>(
          <button key={i} className="bg-white rounded-xl border border-gray-100 p-5 text-right hover:border-purple-200 hover:bg-purple-50/30 transition-all shadow-sm">
            <div className="text-3xl mb-3">📊</div>
            <p className="font-semibold text-gray-800 text-sm">{r}</p>
            <p className="text-xs text-gray-400 mt-1">أكتوبر 2025</p>
            <div className="flex items-center gap-2 mt-3">
              <Btn size="sm"><Eye size={11}/> عرض</Btn>
              <Btn size="sm"><Download size={11}/> تحميل</Btn>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// HEAD ACCOUNTANT PAGES
// ════════════════════════════════════════════════════════════
function HeadDashboard({ navigate, setModal, setDetailId, ops, finalApproveOp, rejectOp, bulkApprove, markErpPosted }:PageProps) {
  const [tab, setTab] = useState<"approval"|"performance"|"erp">("approval");
  const awaitingHead = ops.filter(o=>o.status==="approved");
  const finalApproved = ops.filter(o=>o.status==="final-approved");
  const rejected = ops.filter(o=>o.status==="rejected");

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-800">لوحة رئيس الحسابات 👑</h2>
        <p className="text-gray-400 text-sm mt-0.5">الإشراف على 4 محاسبين · 100 فرع · الاعتماد النهائي وترحيل ERP</p>
      </div>
      <div className="grid grid-cols-5 gap-4">
        <KpiCard label="بانتظار اعتمادي" value={String(awaitingHead.length)} sub="وافق عليها المحاسبون" icon={<Clock size={18} className="text-amber-600"/>} accent="amber"/>
        <KpiCard label="اعتمدتها اليوم" value={String(finalApproved.length)} sub="تم الترحيل لـ ERP" icon={<CheckCircle2 size={18} className="text-emerald-600"/>} accent="emerald"/>
        <KpiCard label="المحاسبون النشطون" value="4/4" sub="" icon={<Users size={18} className="text-blue-600"/>} accent="blue"/>
        <KpiCard label="مرفوضة" value={String(rejected.length)} sub="تم الإعادة" icon={<XCircle size={18} className="text-red-600"/>} accent="red"/>
        <KpiCard label="معدل الأداء" value="87%" sub="هذا الشهر" icon={<TrendingUp size={18} className="text-purple-600"/>} accent="purple"/>
      </div>
      <div className="flex gap-2 border-b border-gray-200">
        {[{id:"approval" as const,label:"✅ الاعتماد النهائي"},{id:"performance" as const,label:"👥 أداء المحاسبين"},{id:"erp" as const,label:"🔗 الترحيل لـ ERP"}].map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors -mb-px ${tab===t.id?"border-purple-600 text-purple-700":"border-transparent text-gray-500 hover:text-gray-700"}`}>{t.label}</button>
        ))}
      </div>
      {tab==="approval" && <HeadApprovalTab ops={ops} finalApproveOp={finalApproveOp} rejectOp={rejectOp} setModal={setModal} setDetailId={setDetailId} bulkApprove={bulkApprove}/>}
      {tab==="performance" && <HeadAccountants navigate={navigate} setModal={setModal} setDetailId={setDetailId} detailId={null} ops={ops} approveOp={()=>{}} rejectOp={()=>{}} finalApproveOp={()=>{}} bulkApprove={()=>{}}/>}
      {tab==="erp" && <HeadERP navigate={navigate} setModal={setModal} setDetailId={setDetailId} detailId={null} ops={ops} approveOp={()=>{}} rejectOp={()=>{}} finalApproveOp={()=>{}} bulkApprove={()=>{}} markErpPosted={markErpPosted}/>}
    </div>
  );
}

function HeadApprovalTab({ ops, finalApproveOp, rejectOp, setModal, setDetailId, bulkApprove }:{
  ops:Op[]; finalApproveOp:(id:string)=>void; rejectOp:(id:string,r:string)=>void;
  setModal:(id:string|null)=>void; setDetailId:(id:string|null)=>void;
  bulkApprove:(ids:string[])=>void;
}) {
  const awaitingHead = ops.filter(o=>o.status==="approved");
  const [expanded, setExpanded] = useState<string|null>("g0");

  // group by accountant (simulated: group 1 = first 3, group 2 = rest)
  const groups = [
    { key:"g0", accountant:"أحمد محمد الشهري", module:"المبيعات والمصروفات", ops:awaitingHead.slice(0,Math.ceil(awaitingHead.length/2)) },
    { key:"g1", accountant:"سارة العمري", module:"المشتريات والمخزون",    ops:awaitingHead.slice(Math.ceil(awaitingHead.length/2)) },
  ].filter(g=>g.ops.length>0);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">العمليات مجمعة حسب المحاسب · اعتماد دفعة واحدة أو فردي</p>
        {awaitingHead.length>0 && <Btn variant="success" onClick={()=>bulkApprove(awaitingHead.map(o=>o.id))}>✅ اعتماد الكل ({awaitingHead.length})</Btn>}
      </div>
      {awaitingHead.length===0 && <EmptyState icon="✅" title="تم اعتماد جميع العمليات" desc="لا توجد عمليات بانتظار اعتمادك النهائي"/>}
      {groups.map(g=>(
        <div key={g.key} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-gray-50 border-b border-gray-100" onClick={()=>setExpanded(expanded===g.key?null:g.key)}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-400 to-cyan-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">{g.accountant[0]}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-800 text-sm">{g.accountant}</span>
                <Badge className="bg-blue-50 text-blue-700">{g.module}</Badge>
                {g.ops.some(o=>o.match==="diff") && <Badge className="bg-red-50 text-red-700">⚠ يوجد فروق</Badge>}
              </div>
              <p className="text-xs text-gray-400 mt-0.5">{g.ops.length} عمليات موافق عليها</p>
            </div>
            <span className="font-mono font-bold text-purple-700">{fmtAmt(g.ops.reduce((s,o)=>s+o.amount,0))} ر.س</span>
            <div className="flex items-center gap-2">
              <Btn size="sm" variant="success" onClick={e=>{ e.stopPropagation(); bulkApprove(g.ops.map(o=>o.id)); }}><CheckCircle2 size={13}/> اعتماد الكل</Btn>
              {expanded===g.key?<ChevronUp size={16} className="text-gray-400"/>:<ChevronDown size={16} className="text-gray-400"/>}
            </div>
          </div>
          {expanded===g.key && (
            <div>
              {g.ops.map(op=>(
                <div key={op.id} className="flex items-center gap-3 px-5 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                  <span className="font-mono text-xs text-purple-600 font-semibold w-24 flex-shrink-0">{op.id}</span>
                  <span className="text-sm text-gray-700 flex-1">{op.branch}</span>
                  <Badge className={`${MATCH_CFG[op.match].cls} border`}>{MATCH_CFG[op.match].label}</Badge>
                  <Badge className={STATUS_CFG[op.status].cls}>{STATUS_CFG[op.status].label}</Badge>
                  <span className="font-mono font-semibold text-gray-800">{fmtAmt(op.amount)} ر.س</span>
                  <div className="flex gap-1">
                    <button onClick={()=>finalApproveOp(op.id)} className="p-1.5 rounded hover:bg-emerald-50"><CheckCircle2 size={13} className="text-emerald-600"/></button>
                    <button onClick={()=>{ setDetailId(op.id); setModal("reject"); }} className="p-1.5 rounded hover:bg-red-50"><XCircle size={13} className="text-red-500"/></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function HeadPending({ navigate, setModal, setDetailId, ops, finalApproveOp, rejectOp, bulkApprove }:PageProps) {
  const [filters, setFilters] = useState<Filters>({branch:"",status:"approved",match:"",search:""});
  const filtered = applyFilters(ops, filters).filter(o=>o.status==="approved");
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h2 className="text-xl font-bold text-gray-800">بانتظار الاعتماد النهائي</h2>
          <p className="text-gray-400 text-sm mt-0.5">{filtered.length} عملية وافق عليها المحاسبون</p></div>
        {filtered.length>0 && <Btn variant="success" onClick={()=>bulkApprove(filtered.map(o=>o.id))}>✅ اعتماد الكل</Btn>}
      </div>
      <FilterBar filters={filters} onChange={setFilters} branches={BRANCHES}/>
      <Card title="العمليات المعلقة">
        {filtered.length===0
          ? <EmptyState icon="✅" title="لا توجد عمليات" desc="تم اعتماد الكل أو لا تطابق الفلاتر"/>
          : filtered.map(op=>(
            <div key={op.id} className="px-5 py-4 flex items-center gap-4 border-b border-gray-100 last:border-0 hover:bg-gray-50">
              <Badge className="bg-purple-50 text-purple-700 flex-shrink-0">{op.moduleLabel}</Badge>
              <div className="flex-1">
                <div className="flex items-center gap-2"><span className="font-semibold text-sm text-gray-800">{op.branch}</span><span className="text-xs font-mono text-gray-400">{op.id}</span></div>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={`${MATCH_CFG[op.match].cls} border`}>{MATCH_CFG[op.match].label}</Badge>
                  <span className="text-xs text-gray-400">⏰ {op.timeAgo}</span>
                </div>
              </div>
              <span className="font-mono font-bold text-gray-800">{fmtAmt(op.amount)} ر.س</span>
              <div className="flex gap-1.5">
                <Btn size="sm" variant="success" onClick={()=>finalApproveOp(op.id)}><CheckCircle2 size={12}/> اعتماد</Btn>
                <Btn size="sm" variant="danger" onClick={()=>{ setDetailId(op.id); setModal("reject"); }}><XCircle size={12}/> رفض</Btn>
              </div>
            </div>
          ))
        }
      </Card>
    </div>
  );
}

function HeadApproved({ ops }:PageProps) {
  const approved = ops.filter(o=>o.status==="final-approved");
  const erpPostedCount = approved.filter(o=>o.erpPosted).length;
  const pendingErp = approved.filter(o=>!o.erpPosted).length;
  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">المعتمدة نهائياً</h2>
          <p className="text-gray-400 text-sm mt-0.5">{approved.length} سجل · {erpPostedCount} مُرحَّل لـ ERP · {pendingErp} في الانتظار</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle2 size={24} className="text-emerald-600 flex-shrink-0"/>
          <div><p className="font-extrabold text-emerald-700 text-2xl font-mono">{approved.length}</p><p className="text-emerald-600 text-xs">معتمد نهائياً</p></div>
        </div>
        <div className={`border rounded-xl p-4 flex items-center gap-3 ${erpPostedCount > 0 ? "bg-indigo-50 border-indigo-200" : "bg-amber-50 border-amber-200"}`}>
          <ChevronsRight size={24} className={erpPostedCount > 0 ? "text-indigo-600 flex-shrink-0" : "text-amber-500 flex-shrink-0"}/>
          <div>
            <p className={`font-extrabold text-2xl font-mono ${erpPostedCount > 0 ? "text-indigo-700" : "text-amber-600"}`}>{erpPostedCount}</p>
            <p className={`text-xs ${erpPostedCount > 0 ? "text-indigo-600" : "text-amber-500"}`}>مُرحَّل لـ ERP {pendingErp > 0 ? `· ${pendingErp} انتظار` : "· اكتمل"}</p>
          </div>
        </div>
      </div>
      <Card title={`${approved.length} عملية معتمدة نهائياً`}>
        {approved.length===0
          ? <EmptyState icon="📋" title="لا توجد عمليات معتمدة" desc="بعد اعتماد العمليات تظهر هنا"/>
          : approved.map(op=>(
            <div key={op.id} className={`px-5 py-4 flex items-center gap-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 ${op.erpPosted ? "bg-indigo-50/30" : ""}`}>
              <Badge className="bg-purple-50 text-purple-700 border border-purple-100 text-xs font-bold">{op.moduleLabel}</Badge>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-gray-800">{op.branch}</span>
                  <span className="text-xs font-mono text-gray-400">{op.id}</span>
                  {op.isCorrection && <Badge className="bg-amber-50 text-amber-700 border border-amber-200 text-xs">تعديل على {op.correctiveRef}</Badge>}
                </div>
                <div className="flex items-center gap-2 mt-1.5">
                  <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs"><Lock size={9}/> معتمد نهائياً</Badge>
                  {op.erpPosted
                    ? <Badge className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs"><ChevronsRight size={9}/> مُرحَّل لـ ERP · {op.erpBatchId || "—"}</Badge>
                    : <Badge className="bg-amber-50 text-amber-600 border border-amber-200 text-xs">⏳ في انتظار الترحيل لـ ERP</Badge>
                  }
                </div>
              </div>
              <span className="font-mono font-extrabold text-gray-800 tabular-nums">{fmtAmt(op.amount)} ر.س</span>
            </div>
          ))
        }
      </Card>
    </div>
  );
}

function HeadRejected({ ops }:PageProps) {
  const rejected = ops.filter(o=>o.status==="rejected");
  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-gray-800">المرفوضة</h2>
      <Card title={`${rejected.length} عملية مرفوضة`}>
        {rejected.length===0
          ? <EmptyState icon="📋" title="لا توجد عمليات مرفوضة" desc=""/>
          : rejected.map(op=>(
            <div key={op.id} className="px-5 py-4 flex items-center gap-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 border-r-4 border-r-red-400">
              <Badge className="bg-purple-50 text-purple-700">{op.moduleLabel}</Badge>
              <div className="flex-1">
                <div className="flex items-center gap-2"><span className="font-semibold text-sm text-gray-800">{op.branch}</span><span className="text-xs font-mono text-gray-400">{op.id}</span></div>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className="bg-red-50 text-red-700">✕ مرفوض</Badge>
                  {op.rejectReason && <span className="text-xs text-red-500">{op.rejectReason}</span>}
                </div>
              </div>
              <span className="font-mono font-bold text-gray-800">{fmtAmt(op.amount)} ر.س</span>
            </div>
          ))
        }
      </Card>
    </div>
  );
}

function HeadModulePage({ moduleKey, navigate, setModal, setDetailId, ops, finalApproveOp, rejectOp, bulkApprove }:PageProps&{moduleKey:string}) {
  const [filters, setFilters] = useState<Filters>({branch:"",status:"",match:"",search:""});
  const mk = moduleKey as ModuleKey;
  const filtered = applyFilters(ops, filters, mk).filter(o=>o.status==="approved");
  const labels: Record<string,string> = {sales:"المبيعات",expenses:"المصروفات",purchases:"المشتريات",inventory:"المخزون",shifts:"الشفتات",employees:"كشف الحساب",cash:"العهد النقدية"};
  const label = labels[moduleKey]||moduleKey;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h2 className="text-xl font-bold text-gray-800">{label}</h2>
          <p className="text-gray-400 text-sm mt-0.5">العمليات الموافق عليها من المحاسبين — تنتظر اعتمادك النهائي</p></div>
        {filtered.length>0 && <Btn variant="success" onClick={()=>bulkApprove(filtered.map(o=>o.id))}>✅ اعتماد الكل</Btn>}
      </div>
      <FilterBar filters={filters} onChange={setFilters} branches={BRANCHES}/>
      <Card title={`عمليات ${label}`}>
        {filtered.length===0
          ? <EmptyState icon="✅" title="لا توجد عمليات" desc="لا توجد عمليات بانتظار الاعتماد في هذا الموديول"/>
          : filtered.map(op=>(
            <div key={op.id} className="px-5 py-4 flex items-center gap-4 border-b border-gray-100 last:border-0 hover:bg-gray-50">
              <div className="flex-1">
                <div className="flex items-center gap-2"><span className="font-semibold text-sm text-gray-800">{op.branch}</span><span className="text-xs font-mono text-gray-400">{op.id}</span></div>
                <div className="flex items-center gap-2 mt-1"><Badge className={`${MATCH_CFG[op.match].cls} border`}>{MATCH_CFG[op.match].label}</Badge><span className="text-xs text-gray-400">⏰ {op.timeAgo}</span></div>
              </div>
              <span className="font-mono font-bold">{fmtAmt(op.amount)} ر.س</span>
              <div className="flex gap-1.5">
                <Btn size="sm" variant="success" onClick={()=>finalApproveOp(op.id)}><CheckCircle2 size={12}/> اعتماد</Btn>
                <Btn size="sm" variant="danger" onClick={()=>{ setDetailId(op.id); setModal("reject"); }}><XCircle size={12}/></Btn>
              </div>
            </div>
          ))
        }
      </Card>
    </div>
  );
}

function HeadAccountants({}: PageProps) {
  const accountants = [
    { name:"أحمد محمد الشهري", branches:20, approved:38, pending:5, rate:88, rating:4.8 },
    { name:"سارة العمري",      branches:20, approved:31, pending:2, rate:94, rating:4.9 },
    { name:"محمد الحربي",      branches:20, approved:18, pending:8, rate:69, rating:3.8 },
    { name:"فاطمة السالم",     branches:20, approved:42, pending:1, rate:98, rating:5.0 },
  ];
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-800">أداء المحاسبين</h3>
        <Btn size="sm"><Download size={12}/> تصدير التقرير</Btn>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {accountants.map((acc,i)=>(
          <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-cyan-400 flex items-center justify-center text-white font-bold">{acc.name[0]}</div>
              <div className="flex-1"><p className="font-bold text-gray-800 text-sm">{acc.name}</p><p className="text-xs text-gray-400">{acc.branches} فرع مخصص</p></div>
              <div className="flex items-center gap-0.5">
                {[1,2,3,4,5].map(s=><Star key={s} size={12} fill={s<=Math.round(acc.rating)?"#F59E0B":"none"} className={s<=Math.round(acc.rating)?"text-amber-400":"text-gray-200"}/>)}
                <span className="text-xs text-gray-500 mr-1">{acc.rating}</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center mb-3">
              <div className="bg-gray-50 rounded-lg p-2"><p className="text-[10px] text-gray-400">معتمدة</p><p className="font-bold text-emerald-700 text-base">{acc.approved}</p></div>
              <div className="bg-gray-50 rounded-lg p-2"><p className="text-[10px] text-gray-400">معلقة</p><p className={`font-bold text-base ${acc.pending>5?"text-red-600":"text-amber-600"}`}>{acc.pending}</p></div>
              <div className="bg-gray-50 rounded-lg p-2"><p className="text-[10px] text-gray-400">معدل الإنجاز</p><p className={`font-bold text-base ${acc.rate>=90?"text-emerald-600":acc.rate>=70?"text-amber-600":"text-red-600"}`}>{acc.rate}%</p></div>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div className={`h-2 rounded-full ${acc.rate>=90?"bg-emerald-500":acc.rate>=70?"bg-amber-500":"bg-red-500"}`} style={{width:`${acc.rate}%`}}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HeadERP({ ops, markErpPosted }:PageProps) {
  const [step, setStep] = useState<0|1|2>(0);
  // Only show ops that are final-approved but NOT yet ERP-posted
  const pendingErp = ops.filter(o=>o.status==="final-approved" && !o.erpPosted);
  const finalApproved = ops.filter(o=>o.status==="final-approved");
  const toPost = pendingErp;
  const totalAmt = toPost.reduce((s,o)=>s+o.amount,0);
  const batchId = `ERP-BATCH-20251014-${String(Date.now()).slice(-3)}`;
  return (
    <div className="space-y-5">
      <div><h2 className="text-xl font-bold text-gray-800">التصدير لـ ERP</h2>
        <p className="text-gray-400 text-sm mt-0.5">ترحيل العمليات المعتمدة نهائياً إلى نظام ERP المحاسبي</p></div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center gap-0 mb-6">
          {[{n:1,label:"1. اختيار الفترة",icon:"📅"},{n:2,label:"2. معاينة البيانات",icon:"👁"},{n:3,label:"3. تأكيد الإرسال",icon:"✅"}].map((s,i)=>(
            <div key={i} className="flex items-center flex-1">
              <button onClick={()=>setStep((s.n-1) as 0|1|2)} className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${step===s.n-1?"bg-purple-600 text-white":step>s.n-1?"bg-emerald-100 text-emerald-700":"bg-gray-100 text-gray-400"}`}>
                <span>{step>=s.n?"✓":s.icon}</span>
                <span className="text-xs font-semibold whitespace-nowrap">{s.label}</span>
              </button>
              {i<2 && <div className={`flex-1 h-0.5 mx-1 ${step>i?"bg-emerald-300":"bg-gray-200"}`}></div>}
            </div>
          ))}
        </div>
        {step===0 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-xs font-semibold text-gray-600 block mb-1.5">نوع الترحيل</label>
                <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"><option>ترحيل يومي</option><option>ترحيل أسبوعي</option><option>ترحيل شهري</option></select></div>
              <div><label className="text-xs font-semibold text-gray-600 block mb-1.5">الفترة</label>
                <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"><option>14 أكتوبر 2025</option><option>13 أكتوبر 2025</option></select></div>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 grid grid-cols-3 gap-3 text-center border border-blue-100">
              <div><p className="text-2xl font-bold text-blue-700 font-mono">{toPost.length}</p><p className="text-xs text-blue-600">تنتظر الترحيل</p></div>
              <div><p className="text-2xl font-bold text-blue-700 font-mono">{(totalAmt/1000).toFixed(1)}K</p><p className="text-xs text-blue-600">ر.س إجمالي</p></div>
              <div><p className="text-2xl font-bold text-blue-700 font-mono">{new Set(toPost.map(o=>o.branch)).size}</p><p className="text-xs text-blue-600">فرع مشارك</p></div>
            </div>
            {finalApproved.length !== toPost.length && (
              <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-2.5 text-xs text-indigo-700 font-medium" dir="rtl">
                ✓ {finalApproved.length - toPost.length} عملية سبق ترحيلها في دفعات سابقة
              </div>
            )}
            <Btn variant="primary" onClick={()=>setStep(1)} className="justify-center">معاينة البيانات →</Btn>
          </div>
        )}
        {step===1 && (
          <div className="space-y-4">
            <table className="w-full" dir="rtl">
              <thead className="bg-gray-50"><tr className="text-xs text-gray-500 font-semibold">
                <th className="px-4 py-3 text-right">رقم العملية</th><th className="px-4 py-3 text-right">الموديول</th>
                <th className="px-4 py-3 text-right">الفرع</th><th className="px-4 py-3 text-center">المبلغ</th>
              </tr></thead>
              <tbody className="divide-y divide-gray-100">
                {toPost.length===0
                  ? <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400 text-sm">لا توجد عمليات معتمدة نهائياً تنتظر الترحيل</td></tr>
                  : toPost.map(op=>(
                    <tr key={op.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-xs text-purple-700 font-bold">{op.id}</td>
                      <td className="px-4 py-3 text-sm">{op.moduleLabel}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{op.branch}</td>
                      <td className="px-4 py-3 text-center font-mono font-bold tabular-nums">{fmtAmt(op.amount)} ر.س</td>
                      <td className="px-4 py-3 text-center"><Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs"><Lock size={9}/> معتمد</Badge></td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
            <div className="flex gap-3">
              <Btn onClick={()=>setStep(0)}>← رجوع</Btn>
              <Btn variant="primary"
                onClick={()=>{
                  if(toPost.length > 0 && markErpPosted) {
                    markErpPosted(toPost.map(o=>o.id), batchId);
                  }
                  setStep(2);
                }}
                className="flex-1 justify-center">
                تأكيد وإرسال للـ ERP →
              </Btn>
            </div>
          </div>
        )}
        {step===2 && (
          <div className="text-center py-8 space-y-4">
            <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center mx-auto border-2 border-indigo-200">
              <ChevronsRight size={36} className="text-indigo-600"/>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">تم الترحيل بنجاح!</h3>
              <p className="text-gray-500 text-sm">تم إرسال {toPost.length} عملية بإجمالي {fmtAmt(totalAmt)} ر.س إلى نظام ERP</p>
              <p className="text-gray-400 text-xs mt-1 font-mono">رقم دفعة الترحيل: {batchId}</p>
              <div className="mt-3 inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-2">
                <Lock size={13} className="text-indigo-600"/>
                <span className="text-sm text-indigo-700 font-semibold">السجلات مُرحَّلة ومُغلقة نهائياً</span>
              </div>
            </div>
            <Btn onClick={()=>setStep(0)} className="mx-auto">ترحيل دفعة جديدة</Btn>
          </div>
        )}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// ADMIN PAGES
// ════════════════════════════════════════════════════════════
function AdminOverview({ navigate, setModal }:PageProps) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h2 className="text-xl font-bold text-gray-800">لوحة الأدمن 🧠</h2><p className="text-gray-400 text-sm mt-0.5">إدارة شاملة — المستخدمون، المطاعم، الاشتراكات</p></div>
        <Btn variant="primary" onClick={()=>setModal("add-user")}><Plus size={14}/> إضافة مستخدم</Btn>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <KpiCard label="مطاعم نشطة" value="25" sub="+2 هذا الشهر" icon={<span className="text-xl">🏪</span>} accent="purple"/>
        <KpiCard label="فروع نشطة" value="100" sub="+5 هذا الشهر" icon={<Home size={18} className="text-blue-600"/>} accent="blue"/>
        <KpiCard label="مستخدمون نشطون" value="2,450" sub="" icon={<Users size={18} className="text-emerald-600"/>} accent="emerald"/>
        <KpiCard label="وقت التشغيل" value="99.9%" sub="آخر 30 يوم" icon={<span className="text-xl">⚡</span>} accent="amber"/>
      </div>
      <div className="grid grid-cols-2 gap-5">
        <Card title="إجراءات سريعة">
          <div className="p-4 grid grid-cols-3 gap-3">
            {[{icon:"👤",label:"إضافة محاسب",a:()=>setModal("add-user")},{icon:"🏪",label:"إضافة مطعم",a:()=>navigate("admin-restaurants")},{icon:"📊",label:"توزيع المحاسبين",a:()=>navigate("admin-users")},{icon:"💳",label:"الاشتراكات",a:()=>navigate("admin-subscriptions")},{icon:"📋",label:"سجل النشاطات",a:()=>navigate("admin-audit")},{icon:"🔐",label:"الصلاحيات",a:()=>navigate("admin-permissions")}].map((a,i)=>(
              <button key={i} onClick={a.a} className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50/30 transition-all">
                <span className="text-2xl">{a.icon}</span>
                <span className="text-xs font-medium text-gray-600 text-center">{a.label}</span>
              </button>
            ))}
          </div>
        </Card>
        <Card title="تنبيهات الاشتراكات" actions={<button onClick={()=>navigate("admin-subscriptions")} className="text-xs text-purple-600 hover:underline">إدارة</button>}>
          <div className="p-4 space-y-3">
            {[{name:"مطعم هرفي",days:32,cls:"border-gray-200"},{name:"ماكدونالدز السعودية",days:7,cls:"border-amber-200 bg-amber-50/50"},{name:"مطعم بروستد الوطني",days:-5,cls:"border-red-200 bg-red-50/50"}].map((s,i)=>(
              <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border ${s.cls}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0 ${s.days<0?"bg-red-100":"bg-amber-100"}`}>{s.days<0?"✕":"⚠"}</div>
                <div className="flex-1"><p className="font-semibold text-sm text-gray-800">{s.name}</p>
                  <p className={`text-xs ${s.days<0?"text-red-600":"text-amber-600"}`}>{s.days<0?`منتهي منذ ${Math.abs(s.days)} أيام`:`ينتهي خلال ${s.days} يوم`}</p></div>
                <Btn size="sm" variant={s.days<0?"danger":"amber"}>{s.days<0?"تفعيل":"تجديد"}</Btn>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function AdminUsers({ navigate, setModal, ops, approveOp, rejectOp, finalApproveOp, bulkApprove, users, setUsers }:PageProps&{
  users:{name:string;email:string;role:string;restaurant:string;branches:number;status:string}[];
  setUsers:(v:any)=>void;
}) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const roleCls: Record<string,string> = {"محاسب":"bg-blue-50 text-blue-700","رئيس حسابات":"bg-amber-50 text-amber-700","مدير فرع":"bg-emerald-50 text-emerald-700","أدمن":"bg-red-50 text-red-700"};
  const shown = users.filter(u=>{
    if(search && !u.name.includes(search) && !u.email.includes(search)) return false;
    if(roleFilter && u.role!==roleFilter) return false;
    return true;
  });
  const deleteUser = (email:string) => setUsers((prev:any[])=>prev.filter(u=>u.email!==email));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h2 className="text-xl font-bold text-gray-800">إدارة المستخدمين</h2><p className="text-gray-400 text-sm mt-0.5">{users.length} مستخدم</p></div>
        <Btn variant="primary" onClick={()=>setModal("add-user")}><Plus size={14}/> إضافة مستخدم</Btn>
      </div>
      <Card title="المستخدمون" actions={
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-3 py-1.5 bg-white">
            <Search size={13} className="text-gray-400"/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="بحث..." className="text-xs outline-none text-gray-600 w-28"/>
          </div>
          <select value={roleFilter} onChange={e=>setRoleFilter(e.target.value)} className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 bg-white">
            <option value="">جميع الأدوار</option><option>محاسب</option><option>رئيس حسابات</option><option>مدير فرع</option>
          </select>
        </div>
      }>
        {shown.length===0
          ? <EmptyState icon="👤" title="لا توجد نتائج" desc="جرب البحث بكلمة مختلفة"/>
          : <table className="w-full" dir="rtl">
              <thead className="bg-gray-50"><tr className="text-xs text-gray-500 font-semibold">
                <th className="px-4 py-3 text-right">المستخدم</th><th className="px-4 py-3 text-right">الدور</th>
                <th className="px-4 py-3 text-right">المطعم</th><th className="px-4 py-3 text-center">الفروع</th>
                <th className="px-4 py-3 text-center">الحالة</th><th className="px-4 py-3 text-center">إجراء</th>
              </tr></thead>
              <tbody className="divide-y divide-gray-100">
                {shown.map((u,i)=>(
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-cyan-400 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">{u.name[0]}</div>
                        <div><p className="font-semibold text-sm text-gray-800">{u.name}</p><p className="text-xs text-gray-400">{u.email}</p></div>
                      </div>
                    </td>
                    <td className="px-4 py-3"><Badge className={roleCls[u.role]||"bg-gray-50 text-gray-700"}>{u.role}</Badge></td>
                    <td className="px-4 py-3 text-sm text-gray-600">{u.restaurant}</td>
                    <td className="px-4 py-3 text-center text-sm font-semibold text-gray-700">{u.branches}</td>
                    <td className="px-4 py-3 text-center"><Badge className={u.status==="active"?"bg-emerald-50 text-emerald-700":"bg-gray-50 text-gray-500"}>{u.status==="active"?"نشط":"غير نشط"}</Badge></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button className="p-1.5 rounded hover:bg-gray-100"><Edit2 size={13} className="text-gray-500"/></button>
                        <button onClick={()=>deleteUser(u.email)} className="p-1.5 rounded hover:bg-red-50"><Trash2 size={13} className="text-red-400"/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
        }
      </Card>
    </div>
  );
}

function AdminRestaurants({}: PageProps) {
  const restaurants = [
    { name:"مطعم الريم",              owner:"فيصل الريم",               branches:12, accountants:4, status:"active"  },
    { name:"مطعم هرفي",               owner:"طلال الحسين",              branches:18, accountants:6, status:"active"  },
    { name:"ماكدونالدز السعودية",     owner:"شركة المطعم العالمي",      branches:35, accountants:8, status:"active"  },
    { name:"مطعم بروستد الوطني",      owner:"محمد السعيد",              branches:8,  accountants:3, status:"suspended"},
    { name:"كافيه الرياض",            owner:"سعد الدوسري",              branches:5,  accountants:2, status:"active"  },
  ];
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h2 className="text-xl font-bold text-gray-800">المطاعم والفروع</h2><p className="text-gray-400 text-sm mt-0.5">25 مطعم · 100 فرع</p></div>
        <Btn variant="primary"><Plus size={14}/> إضافة مطعم</Btn>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {restaurants.map((r,i)=>(
          <div key={i} className={`bg-white rounded-xl border shadow-sm p-4 ${r.status==="suspended"?"border-red-200 bg-red-50/20":"border-gray-100"}`}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-cyan-400 flex items-center justify-center text-white font-bold text-sm">{r.name[0]}</div>
              <div className="flex-1"><p className="font-bold text-gray-800 text-sm">{r.name}</p><p className="text-xs text-gray-400">{r.owner}</p></div>
              <Badge className={r.status==="active"?"bg-emerald-50 text-emerald-700":"bg-red-50 text-red-700"}>{r.status==="active"?"نشط":"معلق"}</Badge>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-3 text-center">
              <div className="bg-gray-50 rounded-lg p-2"><p className="text-[10px] text-gray-400">الفروع</p><p className="font-bold text-gray-800">{r.branches}</p></div>
              <div className="bg-gray-50 rounded-lg p-2"><p className="text-[10px] text-gray-400">المحاسبون</p><p className="font-bold text-gray-800">{r.accountants}</p></div>
            </div>
            <div className="flex gap-2">
              <Btn size="sm" className="flex-1 justify-center"><Eye size={11}/> عرض</Btn>
              <Btn size="sm" variant="ghost" className="flex-1 justify-center"><Edit2 size={11}/> تعديل</Btn>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminSubscriptions({}: PageProps) {
  const [subs, setSubs] = useState([
    { name:"مطعم الريم",              plan:"بلاتيني", expires:"15 يناير 2026",   branches:12, status:"active"   as const, daysLeft:93  },
    { name:"مطعم هرفي",               plan:"ذهبي",    expires:"15 نوفمبر 2025",  branches:18, status:"warning"  as const, daysLeft:32  },
    { name:"ماكدونالدز السعودية",     plan:"بلاتيني", expires:"21 أكتوبر 2025",  branches:35, status:"danger"   as const, daysLeft:7   },
    { name:"مطعم بروستد الوطني",      plan:"فضي",    expires:"9 أكتوبر 2025",   branches:8,  status:"expired"  as const, daysLeft:-5  },
  ]);
  const statusCls = { active:"bg-emerald-50 text-emerald-700 border-emerald-200",warning:"bg-amber-50 text-amber-700 border-amber-200",danger:"bg-red-50 text-red-700 border-red-200",expired:"bg-red-50 text-red-700 border-red-200" };
  const statusLabel = { active:"نشط",warning:"قريب الانتهاء",danger:"ينتهي قريباً",expired:"منتهي" };
  const renew = (i:number) => setSubs(p=>p.map((s,j)=>j===i?{...s,status:"active" as const,daysLeft:365,expires:"14 أكتوبر 2026"}:s));

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-gray-800">الاشتراكات</h2>
      <div className="grid grid-cols-2 gap-4">
        {subs.map((sub,i)=>(
          <div key={i} className={`bg-white rounded-xl border-2 shadow-sm p-4 ${statusCls[sub.status]}`}>
            <div className="flex items-start justify-between mb-3">
              <div><p className="font-bold text-gray-800">{sub.name}</p><p className="text-xs text-gray-400 mt-0.5">باقة {sub.plan} · {sub.branches} فرع</p></div>
              <Badge className={statusCls[sub.status]}>{statusLabel[sub.status]}</Badge>
            </div>
            <div className="flex items-center justify-between text-sm mb-3">
              <span className="text-gray-500 text-xs">تاريخ الانتهاء</span>
              <span className={`font-semibold text-sm ${sub.status==="expired"||sub.status==="danger"?"text-red-600":"text-gray-800"}`}>{sub.expires}</span>
            </div>
            {sub.status!=="expired" && <div className="mb-3">
              <div className="flex justify-between text-xs text-gray-400 mb-1"><span>المتبقي</span><span>{sub.daysLeft} يوم</span></div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className={`h-2 rounded-full ${sub.status==="active"?"bg-emerald-500":sub.status==="warning"?"bg-amber-500":"bg-red-500"}`} style={{width:`${Math.max(0,Math.min(100,(sub.daysLeft/365)*100))}%`}}></div>
              </div>
            </div>}
            <div className="flex gap-2">
              <button onClick={()=>renew(i)} className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors ${sub.status==="expired"?"bg-red-600 text-white hover:bg-red-700":"bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200"}`}>
                {sub.status==="expired"?"تفعيل الاشتراك":"تجديد الاشتراك"}
              </button>
              <Btn variant="ghost" className="flex-1 justify-center">تغيير الباقة</Btn>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminReports({}: PageProps) {
  const [step, setStep] = useState(0);
  const [uploaded, setUploaded] = useState(false);
  return (
    <div className="space-y-5">
      <div><h2 className="text-xl font-bold text-gray-800">مدير التقارير</h2><p className="text-gray-400 text-sm mt-0.5">استيراد تقارير ERP ومراجعتها وإرسالها لأصحاب المطاعم</p></div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center gap-0 mb-6">
          {[{n:1,label:"1. تصدير من ERP",icon:"🔗"},{n:2,label:"2. رفع Excel",icon:"📊"},{n:3,label:"3. مراجعة",icon:"👁"},{n:4,label:"4. الإرسال",icon:"📤"}].map((s,i)=>(
            <div key={i} className="flex items-center flex-1">
              <button onClick={()=>setStep(s.n-1)} className={`flex items-center gap-1.5 px-2.5 py-2 rounded-xl transition-all ${step===s.n-1?"bg-purple-600 text-white":step>s.n-1?"bg-emerald-100 text-emerald-700":"bg-gray-100 text-gray-400"}`}>
                <span>{step>=s.n?"✓":s.icon}</span><span className="text-xs font-semibold whitespace-nowrap">{s.label}</span>
              </button>
              {i<3 && <div className={`flex-1 h-0.5 mx-1 ${step>i?"bg-emerald-300":"bg-gray-200"}`}></div>}
            </div>
          ))}
        </div>
        {step===0 && <div className="text-center py-6 space-y-4">
          <div className="text-5xl">🔗</div>
          <h3 className="font-bold text-gray-800">تصدير من نظام ERP</h3>
          <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-700 text-right max-w-sm mx-auto">
            <p className="font-semibold mb-1">الخطوات في نظام ERP:</p>
            <ol className="list-decimal list-inside space-y-1 text-xs"><li>افتح نظام ERP → التقارير</li><li>اختر تقرير الأرباح والخسائر</li><li>حدد الفترة الزمنية</li><li>اضغط تصدير Excel</li></ol>
          </div>
          <Btn variant="primary" onClick={()=>setStep(1)} className="mx-auto">انتقل لرفع الملف →</Btn>
        </div>}
        {step===1 && <div className="space-y-4">
          {!uploaded
            ? <div onClick={()=>setUploaded(true)} className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center cursor-pointer hover:border-purple-400 hover:bg-purple-50/20 transition-all">
                <div className="text-5xl mb-3">📊</div>
                <p className="font-semibold text-gray-700 mb-1">اسحب وأفلت ملف Excel هنا</p>
                <p className="text-xs text-gray-400 mb-4">أو اضغط للاختيار · xlsx, xls, csv</p>
                <Btn variant="primary" className="mx-auto"><Upload size={14}/> اختيار الملف</Btn>
              </div>
            : <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0"/>
                  <div><p className="font-semibold text-sm text-emerald-800">تم رفع الملف بنجاح</p><p className="text-xs text-emerald-600">تقرير_اكتوبر_2025.xlsx ✓</p></div>
                  <button onClick={()=>setUploaded(false)} className="mr-auto text-emerald-400 hover:text-emerald-600"><X size={14}/></button>
                </div>
                <Btn variant="primary" onClick={()=>setStep(2)} className="w-full justify-center">معاينة التقرير →</Btn>
              </div>
          }
        </div>}
        {step===2 && <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-800">معاينة تقرير الأرباح والخسائر</h3>
            <Badge className="bg-blue-50 text-blue-700">للعرض فقط</Badge>
          </div>
          <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
            <div className="bg-purple-700 text-white px-5 py-3 text-center"><p className="font-bold">تقرير الأرباح والخسائر — أكتوبر 2025</p><p className="text-purple-200 text-xs mt-0.5">مطعم هرفي · جميع الفروع</p></div>
            <table className="w-full" dir="rtl"><tbody className="divide-y divide-gray-200">
              {[{label:"إجمالي الإيرادات",value:"842,500",type:"income",header:true},{label:"   مبيعات المطعم",value:"820,000",type:"income"},{label:"   إيرادات أخرى",value:"22,500",type:"income"},
                {label:"إجمالي المصروفات",value:"(612,000)",type:"expense",header:true},{label:"   تكلفة المواد الخام",value:"(320,000)",type:"expense"},{label:"   رواتب الموظفين",value:"(180,000)",type:"expense"},
                {label:"صافي الربح",value:"230,500",type:"profit",header:true},{label:"هامش الربح",value:"27.4%",type:"profit",header:true}
              ].map((row,i)=>(
                <tr key={i} className={row.header?"bg-gray-100":"bg-white"}>
                  <td className={`px-5 py-2.5 text-sm ${row.header?"font-bold text-gray-800":"text-gray-600"}`}>{row.label}</td>
                  <td className={`px-5 py-2.5 text-left font-mono text-sm ${row.type==="profit"?"text-emerald-700 font-bold":row.type==="expense"?"text-red-600":"text-gray-800"}`} dir="ltr">{row.value}</td>
                </tr>
              ))}
            </tbody></table>
          </div>
          <div className="flex gap-3"><Btn onClick={()=>setStep(1)}>← رجوع</Btn><Btn variant="primary" onClick={()=>setStep(3)} className="flex-1 justify-center">إرسال لأصحاب المطاعم →</Btn></div>
        </div>}
        {step===3 && <div className="space-y-4">
          <h3 className="font-bold text-gray-800">إرسال التقارير</h3>
          <div className="space-y-2">
            {["مطعم هرفي — طلال الحسين","ماكدونالدز السعودية — شركة المطعم العالمي","مطعم الريم — فيصل الريم"].map((r,i)=>(
              <label key={i} className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50">
                <input type="checkbox" defaultChecked className="rounded"/>
                <span className="text-sm font-medium text-gray-700">{r}</span>
                <span className="text-xs text-gray-400 mr-auto">البريد الإلكتروني + إشعار</span>
              </label>
            ))}
          </div>
          <div className="flex gap-3">
            <Btn onClick={()=>setStep(2)}>← رجوع</Btn>
            <button onClick={()=>{ setStep(0); setUploaded(false); }} className="flex-1 py-2.5 rounded-xl bg-purple-600 text-white font-semibold text-sm hover:bg-purple-700">📤 إرسال التقارير الآن</button>
          </div>
        </div>}
      </div>
    </div>
  );
}

function AdminAudit({}: PageProps) {
  const logs = [
    {action:"إضافة مستخدم جديد",user:"الأدمن",time:"10:30 ص",icon:"👤",cls:"bg-gray-50"},
    {action:"اعتماد نهائي لـ 45 عملية",user:"خالد العمري — رئيس الحسابات",time:"10:15 ص",icon:"✅",cls:"bg-emerald-50"},
    {action:"تجديد اشتراك مطعم هرفي",user:"الأدمن",time:"9:45 ص",icon:"💳",cls:"bg-gray-50"},
    {action:"رفض عملية EXP-0441",user:"أحمد محمد الشهري",time:"9:30 ص",icon:"❌",cls:"bg-red-50"},
    {action:"تصدير بيانات ERP",user:"خالد العمري",time:"9:00 ص",icon:"🔗",cls:"bg-gray-50"},
    {action:"تحديث أصناف الجرد اليومي",user:"أحمد محمد الشهري",time:"8:45 ص",icon:"📦",cls:"bg-gray-50"},
  ];
  return (
    <div className="space-y-5"><h2 className="text-xl font-bold text-gray-800">سجل النشاطات</h2>
      <Card title="آخر النشاطات">
        <div className="divide-y divide-gray-100">
          {logs.map((log,i)=>(
            <div key={i} className="px-5 py-3.5 flex items-center gap-4 hover:bg-gray-50">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0 ${log.cls}`}>{log.icon}</div>
              <div className="flex-1"><p className="text-sm font-medium text-gray-800">{log.action}</p><p className="text-xs text-gray-400">{log.user}</p></div>
              <span className="text-xs text-gray-400">{log.time}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function AdminPermissions({}: PageProps) {
  return (
    <div className="space-y-5"><h2 className="text-xl font-bold text-gray-800">الصلاحيات</h2>
      <Card title="مصفوفة الصلاحيات">
        <div className="overflow-x-auto"><table className="w-full text-xs" dir="rtl">
          <thead className="bg-gray-50"><tr>
            <th className="px-4 py-3 text-right font-semibold text-gray-600">الموديول / الصلاحية</th>
            {["محاسب","رئيس حسابات","مدير فرع","مدير مشتريات","مورد"].map(r=><th key={r} className="px-3 py-3 text-center font-semibold text-gray-600">{r}</th>)}
          </tr></thead>
          <tbody className="divide-y divide-gray-100">
            {[{m:"المبيعات — عرض",p:[true,true,true,false,false]},{m:"المبيعات — مراجعة",p:[true,true,false,false,false]},{m:"المبيعات — اعتماد",p:[false,true,false,false,false]},{m:"المصروفات — إدخال",p:[false,false,true,false,false]},{m:"المصروفات — اعتماد",p:[true,true,false,false,false]},{m:"المشتريات — طلب",p:[false,false,false,true,false]},{m:"المشتريات — اعتماد",p:[true,true,false,false,false]},{m:"تصدير ERP",p:[false,true,false,false,false]},{m:"إدارة المستخدمين",p:[false,false,false,false,false]}].map((row,i)=>(
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-4 py-2.5 font-medium text-gray-700">{row.m}</td>
                {row.p.map((p,j)=><td key={j} className="px-3 py-2.5 text-center">{p?<span className="text-emerald-500 text-base">✓</span>:<span className="text-gray-200">—</span>}</td>)}
              </tr>
            ))}
          </tbody>
        </table></div>
      </Card>
    </div>
  );
}

function AdminSettings({}: PageProps) {
  return (
    <div className="space-y-5"><h2 className="text-xl font-bold text-gray-800">إعدادات النظام</h2>
      <div className="grid grid-cols-2 gap-5">
        {[{title:"إعدادات الإشعارات",icon:"🔔",items:["إشعارات الاعتماد","تنبيهات الاشتراك","تقارير الأداء اليومية"]},{title:"إعدادات النسخ الاحتياطي",icon:"💾",items:["نسخ تلقائي يومي","نسخ أسبوعي","تشفير البيانات"]},{title:"إعدادات API",icon:"🔗",items:["اتصال ERP","اتصال بوابة الدفع","واجهة تطبيق الموبايل"]},{title:"إعدادات الأمان",icon:"🔐",items:["المصادقة الثنائية","مدة الجلسة","سياسة كلمة المرور"]}].map((s,i)=>(
          <Card key={i} title={`${s.icon} ${s.title}`}>
            <div className="p-4 space-y-3">
              {s.items.map((item,j)=>(
                <div key={j} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <span className="text-sm text-gray-700">{item}</span>
                  <div className="w-10 h-5 rounded-full bg-purple-600 cursor-pointer relative flex-shrink-0"><div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5"></div></div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// BRANCH MANAGER PAGES
// ════════════════════════════════════════════════════════════
function BranchOverview({ navigate }: PageProps) {
  return (
    <div className="space-y-5">
      <div><h2 className="text-xl font-bold text-gray-800">نظرة عامة — فرع الرياض العليا</h2><p className="text-gray-400 text-sm mt-0.5">الاثنين، 14 أكتوبر 2025</p></div>
      <div className="grid grid-cols-4 gap-4">
        <KpiCard label="مبيعات اليوم" value="18,340 ر.س" icon={<TrendingUp size={18} className="text-emerald-600"/>} accent="emerald"/>
        <KpiCard label="الطلبات" value="87" sub="هذا الشفت" icon={<ShoppingCart size={18} className="text-blue-600"/>} accent="blue"/>
        <KpiCard label="الموظفون" value="12" sub="نشطون الآن" icon={<Users size={18} className="text-purple-600"/>} accent="purple"/>
        <KpiCard label="التقارير المطلوبة" value="3" sub="تنتظر الرفع" icon={<AlertTriangle size={18} className="text-amber-600"/>} accent="amber"/>
      </div>
      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2">
          <Card title="التقارير المطلوب رفعها اليوم">
            {[{name:"جرد المخزون اليومي",deadline:"قبل 11 م",urgent:true},{name:"تقرير المبيعات اليومي",deadline:"قبل 10 م",urgent:false},{name:"كشف حساب الصندوق",deadline:"بعد إغلاق الشفت",urgent:false}].map((t,i)=>(
              <div key={i} className={`px-5 py-4 flex items-center gap-4 border-b border-gray-100 last:border-0 ${t.urgent?"bg-red-50/30":""}`}>
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${t.urgent?"bg-red-500":"bg-gray-300"}`}></div>
                <div className="flex-1"><p className="font-semibold text-sm text-gray-800">{t.name}</p></div>
                <span className="text-xs text-gray-500">{t.deadline}</span>
                <Btn size="sm" variant="primary" onClick={()=>navigate("branch-upload")}><Upload size={12}/> رفع</Btn>
              </div>
            ))}
          </Card>
        </div>
        <Card title="الشفت الحالي">
          <div className="p-4 space-y-3">
            <div className="text-center py-2"><p className="text-3xl font-bold text-purple-700">08:00 — الآن</p><p className="text-gray-400 text-xs mt-1">مدة: 3:22 ساعة</p></div>
            <div className="bg-gray-50 rounded-xl p-3 space-y-2">
              {[{l:"المشرف",v:"خالد الشمري"},{l:"الطلبات",v:"87 طلب"},{l:"المبيعات",v:"12,500 ر.س"},{l:"الصندوق",v:"4,200 ر.س"}].map((r,i)=>(
                <div key={i} className="flex justify-between text-sm"><span className="text-gray-500">{r.l}</span><span className="font-semibold">{r.v}</span></div>
              ))}
            </div>
            <Btn variant="danger" className="w-full justify-center">إغلاق الشفت</Btn>
          </div>
        </Card>
      </div>
    </div>
  );
}

function BranchEmployees({}: PageProps) {
  const emps = [{name:"خالد الشمري",role:"مشرف الشفت",salary:4500,shift:"صباحي",active:true},{name:"محمد العتيبي",role:"كاشير رئيسي",salary:3200,shift:"صباحي",active:true},{name:"سعد الدوسري",role:"كاشير",salary:2800,shift:"مسائي",active:false},{name:"أحمد الغامدي",role:"عامل مطبخ",salary:2500,shift:"صباحي",active:true}];
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between"><h2 className="text-xl font-bold text-gray-800">الموظفون</h2><Btn variant="primary" size="sm"><Plus size={13}/> إضافة موظف</Btn></div>
      <Card title="فرع الرياض العليا">
        <table className="w-full" dir="rtl">
          <thead className="bg-gray-50"><tr className="text-xs text-gray-500 font-semibold"><th className="px-4 py-3 text-right">الموظف</th><th className="px-4 py-3 text-right">الدور</th><th className="px-4 py-3 text-center">الراتب</th><th className="px-4 py-3 text-center">الشفت</th><th className="px-4 py-3 text-center">الحالة</th></tr></thead>
          <tbody className="divide-y divide-gray-100">
            {emps.map((e,i)=>(
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-4 py-3"><div className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-cyan-400 flex items-center justify-center text-white font-bold text-xs">{e.name[0]}</div><span className="font-semibold text-sm text-gray-800">{e.name}</span></div></td>
                <td className="px-4 py-3 text-sm text-gray-600">{e.role}</td>
                <td className="px-4 py-3 text-center font-mono text-sm font-semibold">{e.salary.toLocaleString()} ر.س</td>
                <td className="px-4 py-3 text-center"><Badge className="bg-gray-50 text-gray-600">{e.shift}</Badge></td>
                <td className="px-4 py-3 text-center"><Badge className={e.active?"bg-emerald-50 text-emerald-700":"bg-gray-50 text-gray-500"}>{e.active?"نشط":"إجازة"}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function BranchItems({}: PageProps) {
  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-gray-800">الأصناف المحددة للجرد</h2>
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-center gap-2">
        <Bell size={14} className="text-blue-600 flex-shrink-0"/>
        <p className="text-blue-700 text-xs">هذه القائمة تم تحديدها بواسطة المحاسب وتزامنت تلقائياً.</p>
      </div>
      <Card title="الأصناف — 10 أصناف">
        <div className="p-4 grid grid-cols-3 gap-2">
          {["دجاج طازج","حليب طازج","خس","طماطم","بطاطس","زيت قلي","كاتشب","ماء معدني","عصير برتقال","خبز برجر"].map((item,i)=>(
            <div key={i} className="flex items-center gap-2 p-2.5 rounded-lg border border-gray-100 bg-gray-50">
              <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-bold flex items-center justify-center flex-shrink-0">{i+1}</span>
              <span className="text-sm text-gray-700">{item}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function BranchSuppliers({}: PageProps) {
  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-gray-800">الموردون</h2>
      <Card title="الموردون المعتمدون">
        {[{name:"شركة الدواجن الوطنية",cat:"دواجن ولحوم",contact:"محمد العلي",phone:"0501234567"},{name:"مطاحن الملك",cat:"دقيق ومخبوزات",contact:"سعد الدوسري",phone:"0507654321"},{name:"مزرعة الخير",cat:"خضار وفواكه",contact:"فهد الشمري",phone:"0509876543"}].map((s,i)=>(
          <div key={i} className="px-5 py-4 flex items-center gap-4 border-b border-gray-100 last:border-0 hover:bg-gray-50">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white font-bold">{s.name[0]}</div>
            <div className="flex-1"><p className="font-semibold text-sm text-gray-800">{s.name}</p><p className="text-xs text-gray-400">{s.cat} · {s.contact}</p></div>
            <span className="text-xs text-emerald-600 flex items-center gap-1"><Phone size={11}/> {s.phone}</span>
          </div>
        ))}
      </Card>
    </div>
  );
}

function BranchUpload({}: PageProps) {
  const [uploads, setUploads] = useState<Record<string,boolean>>({});
  const reports = [{id:"sales",name:"تقرير المبيعات اليومي",desc:"POS + التطبيقات",required:true},{id:"inventory",name:"جرد المخزون اليومي",desc:"10 أصناف محددة",required:true},{id:"cash",name:"كشف حساب الصندوق",desc:"نقدي + مدفوعات",required:true},{id:"waste",name:"تقرير الهدر والتالف",desc:"الأصناف التالفة",required:false}];
  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-gray-800">رفع البيانات اليومية</h2>
      <div className="grid grid-cols-2 gap-4">
        {reports.map(rep=>(
          <div key={rep.id} className={`bg-white rounded-xl border shadow-sm p-4 ${uploads[rep.id]?"border-emerald-200 bg-emerald-50/30":"border-gray-100"}`}>
            <div className="flex items-start justify-between mb-3">
              <div><p className="font-semibold text-sm text-gray-800">{rep.name}</p><p className="text-xs text-gray-400 mt-0.5">{rep.desc}</p></div>
              {rep.required && <Badge className="bg-red-50 text-red-700">مطلوب</Badge>}
            </div>
            {uploads[rep.id]
              ? <div className="flex items-center gap-2 text-emerald-700 text-sm"><CheckCircle2 size={16}/><span className="font-medium">تم الرفع بنجاح</span></div>
              : <div onClick={()=>setUploads(p=>({...p,[rep.id]:true}))} className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center cursor-pointer hover:border-purple-400 hover:bg-purple-50/20 transition-all">
                  <Upload size={20} className="text-gray-300 mx-auto mb-1"/><p className="text-xs text-gray-400">اضغط لرفع الملف</p>
                </div>
            }
          </div>
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// PROCUREMENT PAGES
// ════════════════════════════════════════════════════════════
function ProcOverview({ navigate }:PageProps) {
  return (
    <div className="space-y-5">
      <div><h2 className="text-xl font-bold text-gray-800">لوحة تحكم المشتريات</h2><p className="text-gray-400 text-sm mt-0.5">تجميع الطلبات والتنسيق مع الموردين</p></div>
      <div className="grid grid-cols-4 gap-4">
        <KpiCard label="طلبات جديدة" value="45" sub="من 40 فرع" icon={<ShoppingCart size={18} className="text-red-600"/>} accent="red"/>
        <KpiCard label="طلبات مجمعة" value="12" sub="جاهزة للإرسال" icon={<Package size={18} className="text-blue-600"/>} accent="blue"/>
        <KpiCard label="أُرسلت للموردين" value="8" sub="" icon={<Truck size={18} className="text-amber-600"/>} accent="amber"/>
        <KpiCard label="قيمة الطلبات" value="148K ر.س" sub="هذا الأسبوع" icon={<TrendingUp size={18} className="text-purple-600"/>} accent="purple"/>
      </div>
      <Card title="الطلبات الجديدة من الفروع" actions={<Btn size="sm" variant="primary" onClick={()=>navigate("proc-new")}><Package size={12}/> تجميع الطلبات</Btn>}>
        {[{branch:"فرع الرياض - العليا",items:4,total:4800,urgency:"عادي"},{branch:"فرع جدة - الحمراء",items:6,total:8200,urgency:"عاجل"},{branch:"فرع مكة - المعابدة",items:3,total:3100,urgency:"عادي"}].map((r,i)=>(
          <div key={i} className={`px-5 py-4 flex items-center gap-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 ${r.urgency==="عاجل"?"border-r-4 border-r-red-400":""}`}>
            <div className="flex-1"><p className="font-semibold text-sm text-gray-800">{r.branch}</p><div className="flex items-center gap-2 mt-1"><span className="text-xs text-gray-400">{r.items} أصناف</span><Badge className={r.urgency==="عاجل"?"bg-red-50 text-red-700":"bg-gray-50 text-gray-600"}>{r.urgency}</Badge></div></div>
            <span className="font-mono font-bold text-gray-800">{fmtAmt(r.total)} ر.س</span>
            <div className="flex gap-1.5"><Btn size="sm"><Eye size={12}/> تفاصيل</Btn><Btn size="sm" variant="primary"><CheckCircle2 size={12}/> اعتماد</Btn></div>
          </div>
        ))}
      </Card>
    </div>
  );
}

function ProcNewOrders({}: PageProps) {
  const [orders, setOrders] = useState([
    { branch:"فرع الرياض - العليا", items:4, total:4800, urgency:"عادي", status:"pending" as const, time:"قبل 30 دقيقة" },
    { branch:"فرع جدة - الحمراء",   items:6, total:8200, urgency:"عاجل", status:"pending" as const, time:"قبل ساعة" },
    { branch:"فرع مكة - المعابدة",  items:3, total:3100, urgency:"عادي", status:"pending" as const, time:"قبل ساعتين" },
    { branch:"فرع الدمام",           items:5, total:5600, urgency:"عاجل", status:"pending" as const, time:"قبل 3 ساعات" },
  ]);
  const approve = (i:number) => setOrders(p=>p.map((o,j)=>j===i?{...o,status:"approved" as const}:o));
  const pending = orders.filter(o=>o.status==="pending");

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">الطلبات الجديدة</h2>
        {pending.length>0 && <Btn variant="primary" size="sm" onClick={()=>setOrders(p=>p.map(o=>({...o,status:"approved" as const})))}><Package size={12}/> اعتماد الكل ({pending.length})</Btn>}
      </div>
      <Card title={`${orders.length} طلب`}>
        {orders.map((r,i)=>(
          <div key={i} className={`px-5 py-4 flex items-center gap-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 ${r.urgency==="عاجل"&&r.status==="pending"?"border-r-4 border-r-red-400":""}`}>
            <div className="flex-1">
              <div className="flex items-center gap-2"><span className="font-semibold text-sm text-gray-800">{r.branch}</span><Badge className={r.urgency==="عاجل"?"bg-red-50 text-red-700":"bg-gray-50 text-gray-600"}>{r.urgency}</Badge></div>
              <p className="text-xs text-gray-400 mt-1">{r.items} أصناف · {r.time}</p>
            </div>
            <span className="font-mono font-bold text-gray-800">{fmtAmt(r.total)} ر.س</span>
            {r.status==="pending"
              ? <Btn size="sm" variant="success" onClick={()=>approve(i)}><CheckCircle2 size={12}/> اعتماد</Btn>
              : <Badge className="bg-emerald-50 text-emerald-700">✓ تم الاعتماد</Badge>
            }
          </div>
        ))}
      </Card>
    </div>
  );
}

function ProcGrouped({}: PageProps) {
  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-gray-800">الطلبات المجمعة</h2>
      <Card title="مجمعة حسب المورد">
        {[{supplier:"شركة الدواجن الوطنية",branches:12,items:3,total:28400},{supplier:"مطاحن الملك",branches:8,items:2,total:14200},{supplier:"مزرعة الخير",branches:15,items:6,total:32100}].map((g,i)=>(
          <div key={i} className="px-5 py-4 flex items-center gap-4 border-b border-gray-100 last:border-0 hover:bg-gray-50">
            <div className="flex-1"><p className="font-semibold text-sm text-gray-800">{g.supplier}</p><p className="text-xs text-gray-400 mt-1">{g.branches} فرع · {g.items} أصناف</p></div>
            <span className="font-mono font-bold text-gray-800">{fmtAmt(g.total)} ر.س</span>
            <div className="flex gap-1.5"><Btn size="sm"><Eye size={12}/> تفاصيل</Btn><Btn size="sm" variant="primary"><Truck size={12}/> إرسال للمورد</Btn></div>
          </div>
        ))}
      </Card>
    </div>
  );
}

function ProcSent({}: PageProps) {
  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-gray-800">المرسلة للموردين</h2>
      <Card title="الطلبات المرسلة">
        {[{supplier:"شركة الدواجن الوطنية",sent:"قبل ساعة",status:"مؤكد",total:28400},{supplier:"مطاحن الملك",sent:"أمس",status:"قيد التحضير",total:14200},{supplier:"مزرعة الخير",sent:"قبل يومين",status:"في الطريق",total:32100}].map((o,i)=>(
          <div key={i} className="px-5 py-4 flex items-center gap-4 border-b border-gray-100 last:border-0 hover:bg-gray-50">
            <div className="flex-1"><p className="font-semibold text-sm text-gray-800">{o.supplier}</p><p className="text-xs text-gray-400 mt-1">أُرسل {o.sent}</p></div>
            <Badge className={o.status==="مؤكد"?"bg-emerald-50 text-emerald-700":o.status==="في الطريق"?"bg-blue-50 text-blue-700":"bg-amber-50 text-amber-700"}>{o.status}</Badge>
            <span className="font-mono font-bold text-gray-800">{fmtAmt(o.total)} ر.س</span>
            <Btn size="sm"><Eye size={12}/> تتبع</Btn>
          </div>
        ))}
      </Card>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// SUPPLIER PAGES
// ════════════════════════════════════════════════════════════
function SupOverview({ navigate }:PageProps) {
  return (
    <div className="space-y-5">
      <div><h2 className="text-xl font-bold text-gray-800">لوحة تحكم المورد</h2><p className="text-gray-400 text-sm mt-0.5">شركة الدواجن الوطنية</p></div>
      <div className="grid grid-cols-4 gap-4">
        <KpiCard label="طلبات جديدة" value="3" sub="تنتظر ردك" icon={<ShoppingCart size={18} className="text-red-600"/>} accent="red"/>
        <KpiCard label="طلبات مقبولة" value="12" sub="هذا الأسبوع" icon={<CheckCircle2 size={18} className="text-emerald-600"/>} accent="emerald"/>
        <KpiCard label="إجمالي المبيعات" value="285K ر.س" sub="هذا الشهر" icon={<TrendingUp size={18} className="text-purple-600"/>} accent="purple"/>
        <KpiCard label="العملاء النشطون" value="18" sub="مطعم" icon={<Users size={18} className="text-blue-600"/>} accent="blue"/>
      </div>
      <Card title="الطلبات الجديدة — 3" actions={<Badge className="bg-red-50 text-red-700">3 جديدة</Badge>}>
        {[{rest:"مطعم هرفي",items:"دجاج طازج — 200 كجم",deadline:"غداً 8 ص",total:4800},{rest:"ماكدونالدز السعودية",items:"دجاج مجمد — 500 كجم",deadline:"بعد غد",total:10500},{rest:"مطعم الريم",items:"قطع مشكلة — 150 كجم",deadline:"اليوم 6 م",total:3600}].map((o,i)=>(
          <div key={i} className="px-5 py-4 flex items-center gap-4 border-b border-gray-100 last:border-0 hover:bg-gray-50">
            <div className="flex-1"><p className="font-semibold text-sm text-gray-800">{o.rest}</p><p className="text-xs text-gray-400 mt-1">{o.items} · التسليم: {o.deadline}</p></div>
            <span className="font-mono font-bold text-gray-800">{fmtAmt(o.total)} ر.س</span>
            <div className="flex gap-1.5">
              <Btn size="sm" variant="success"><CheckCircle2 size={12}/> قبول</Btn>
              <Btn size="sm" variant="danger"><XCircle size={12}/> رفض</Btn>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}

function SupNewOrders({}: PageProps) {
  const [orders, setOrders] = useState([
    { id:"ORD-5501", rest:"مطعم هرفي", items:[{name:"دجاج طازج",qty:200,unit:"كجم",price:24}], deadline:"غداً 8 ص", status:"pending" as const },
    { id:"ORD-5500", rest:"ماكدونالدز السعودية", items:[{name:"دجاج مجمد",qty:500,unit:"كجم",price:21}], deadline:"بعد غد", status:"pending" as const },
    { id:"ORD-5499", rest:"مطعم الريم", items:[{name:"قطع مشكلة",qty:150,unit:"كجم",price:24}], deadline:"اليوم 6 م", status:"pending" as const },
  ]);
  const accept = (id:string) => setOrders(p=>p.map(o=>o.id===id?{...o,status:"accepted" as const}:o));
  const reject = (id:string) => setOrders(p=>p.map(o=>o.id===id?{...o,status:"rejected" as const}:o));

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-gray-800">الطلبات الجديدة</h2>
      <div className="space-y-4">
        {orders.map(order=>(
          <Card key={order.id} title={`${order.rest} · ${order.id}`} actions={
            order.status==="pending" ? (
              <div className="flex gap-2">
                <Btn size="sm" variant="success" onClick={()=>accept(order.id)}><CheckCircle2 size={12}/> قبول الطلب</Btn>
                <Btn size="sm" variant="danger" onClick={()=>reject(order.id)}><XCircle size={12}/> رفض</Btn>
              </div>
            ) : order.status==="accepted"
              ? <Badge className="bg-emerald-50 text-emerald-700">✓ تم القبول</Badge>
              : <Badge className="bg-red-50 text-red-700">✕ مرفوض</Badge>
          }>
            <div className="p-4">
              <table className="w-full text-sm" dir="rtl">
                <thead className="bg-gray-50"><tr className="text-xs text-gray-500"><th className="px-3 py-2 text-right">الصنف</th><th className="px-3 py-2 text-center">الكمية</th><th className="px-3 py-2 text-center">سعر الوحدة</th><th className="px-3 py-2 text-center">الإجمالي</th></tr></thead>
                <tbody>
                  {order.items.map((item,j)=>(
                    <tr key={j} className="border-t border-gray-100">
                      <td className="px-3 py-2.5 font-medium">{item.name}</td>
                      <td className="px-3 py-2.5 text-center">{item.qty} {item.unit}</td>
                      <td className="px-3 py-2.5 text-center font-mono">{item.price} ر.س</td>
                      <td className="px-3 py-2.5 text-center font-mono font-bold text-purple-700">{fmtAmt(item.qty*item.price)} ر.س</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                <span className="text-sm text-gray-500">موعد التسليم: <strong className="text-gray-800">{order.deadline}</strong></span>
                <span className="font-mono font-bold text-lg text-purple-700">{fmtAmt(order.items.reduce((s,i)=>s+i.qty*i.price,0))} ر.س</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// MAIN EXPORT
// ════════════════════════════════════════════════════════════
export function ASABPrototype() {
  const [appState, setAppState] = useState<AppState>({ role:null, page:"", detailId:null, modal:null });
  const [ops, setOps] = useState<Op[]>(INITIAL_OPS);

  const login = (role:RoleId) => setAppState({ role, page:ROLE_PROFILES[role].defaultPage, detailId:null, modal:null });
  const logout = () => setAppState({ role:null, page:"", detailId:null, modal:null });
  const navigate = (page:PageId) => setAppState(s=>({...s, page, modal:null}));
  const setModal = (modal:string|null) => setAppState(s=>({...s, modal}));
  const setDetailId = (detailId:string|null) => setAppState(s=>({...s, detailId}));

  // ─── FINANCIAL STATE MACHINE ─────────────────────────────
  // pending  → approved           (accountant, records actor + time)
  // approved → final-approved     (head accountant, records actor + time)
  // final-approved = IMMUTABLE    (state guard: no further transitions)
  // rejected = IMMUTABLE          (correction requires a NEW linked operation)
  // ERP-posted is a SEPARATE dimension (erpPosted flag, not a status)
  // ─────────────────────────────────────────────────────────
  const now = () => new Date().toLocaleTimeString("ar-SA", { hour:"2-digit", minute:"2-digit" });

  const approveOp = (id:string) => setOps(p=>p.map(o=>
    o.id===id && o.status==="pending"
      ? { ...o, status:"approved" as OpStatus,
          approvedBy: appState.role==="head" ? "رئيس الحسابات" : "المحاسب المختص",
          approvedAt: now() }
      : o
  ));
  const rejectOp = (id:string, reason:string) => setOps(p=>p.map(o=>
    o.id===id && (o.status==="pending" || o.status==="approved")
      ? { ...o, status:"rejected" as OpStatus, rejectReason:reason,
          rejectedBy: appState.role==="head" ? "رئيس الحسابات" : "المحاسب المختص",
          rejectedAt: now() }
      : o
  ));
  const finalApproveOp = (id:string) => setOps(p=>p.map(o=>
    o.id===id && o.status==="approved"
      ? { ...o, status:"final-approved" as OpStatus,
          finalApprovedBy: "رئيس الحسابات",
          finalApprovedAt: now() }
      : o
  ));
  const bulkApprove = (ids:string[]) => {
    const set = new Set(ids);
    const t = now();
    setOps(p=>p.map(o=>{
      if(!set.has(o.id)) return o;
      if(o.status==="pending")  return {...o, status:"approved" as OpStatus, approvedBy:"المحاسب المختص", approvedAt:t};
      if(o.status==="approved") return {...o, status:"final-approved" as OpStatus, finalApprovedBy:"رئيس الحسابات", finalApprovedAt:t};
      return o; // final-approved and rejected are immutable — skip silently
    }));
  };

  // Corrective operation: creates a new linked pending op referencing the original
  const addCorrectiveOp = (refId:string) => {
    const original = ops.find(o=>o.id===refId);
    if(!original) return;
    const newId = `COR-${refId.replace("OPS-","").replace("COR-","")}`;
    const corrective: Op = {
      ...original,
      id: newId,
      status: "pending",
      isCorrection: true,
      correctiveRef: refId,
      timeAgo: "للتو",
      submittedBy: "تعديل بواسطة رئيس الحسابات",
      approvedBy: undefined, approvedAt: undefined,
      finalApprovedBy: undefined, finalApprovedAt: undefined,
      rejectedBy: undefined, rejectedAt: undefined,
      erpPosted: undefined, erpBatchId: undefined, erpPostedAt: undefined,
      rejectReason: undefined,
    };
    setOps(p=>[corrective, ...p]);
  };

  // ERP posting: marks ops as posted with batch ID — separate from final-approval
  const markErpPosted = (ids:string[], batchId:string) => {
    const set = new Set(ids);
    const postedAt = now();
    setOps(p=>p.map(o=>
      set.has(o.id) && o.status==="final-approved" && !o.erpPosted
        ? { ...o, erpPosted:true, erpBatchId:batchId, erpPostedAt:postedAt }
        : o
    ));
  };

  if(!appState.role) return <LoginScreen onLogin={login}/>;

  return (
    <AppShell
      state={appState} ops={ops}
      approveOp={approveOp} rejectOp={rejectOp} finalApproveOp={finalApproveOp} bulkApprove={bulkApprove}
      addCorrectiveOp={addCorrectiveOp} markErpPosted={markErpPosted}
      navigate={navigate} logout={logout} setModal={setModal} setDetailId={setDetailId}
    />
  );
}

export default ASABPrototype;
