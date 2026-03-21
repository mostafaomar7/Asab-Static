import "./_group.css";
import { useState, ReactNode } from "react";
import {
  LayoutDashboard, Building2, Users, Settings, Bell, LogOut, ChevronRight,
  CheckCircle2, XCircle, TrendingUp, Plus, X, Edit2, FileText,
  Shield, Search, CreditCard, Package, Wallet, ShoppingCart, Clock,
  BarChart3, AlertTriangle, Star, RefreshCw, ArrowLeftRight,
  Smartphone, Send, Check, Download, Zap, Lock, ChevronDown
} from "lucide-react";

// ═══════════════════════════════════════════════════
// DESIGN TOKENS (identical to ASAB system)
// ═══════════════════════════════════════════════════
const SIDEBAR_GRAD = "linear-gradient(180deg,#0F1C35 0%,#1B3A6B 100%)";
const ACCENT       = "#7C3AED";
const CYAN         = "#00D9FF";
const BG_CONTENT   = "#F0F4FA";

// ═══════════════════════════════════════════════════
// SHARED PRIMITIVES
// ═══════════════════════════════════════════════════
function Btn({ children, onClick, variant="ghost", size="md", disabled=false }:{
  children:ReactNode; onClick?:()=>void; variant?:"primary"|"success"|"danger"|"ghost"|"outline"|"amber"; size?:"sm"|"md"; disabled?:boolean;
}) {
  const base  = "inline-flex items-center gap-1.5 font-semibold cursor-pointer border transition-all rounded-lg whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed";
  const sizes = { sm:"px-3 py-1.5 text-xs", md:"px-4 py-2 text-sm" };
  const variants = {
    primary:"bg-purple-600 text-white border-purple-600 hover:bg-purple-700 shadow-sm",
    success:"bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700 shadow-sm",
    danger:"bg-red-50 text-red-700 border-red-200 hover:bg-red-100",
    amber:"bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
    ghost:"bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100",
    outline:"bg-white text-gray-700 border-gray-300 hover:bg-gray-50",
  };
  return <button disabled={disabled} onClick={onClick} className={`${base} ${sizes[size]} ${variants[variant]}`}>{children}</button>;
}

function Badge({ children, className="" }:{ children:ReactNode; className?:string }) {
  return <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${className}`}>{children}</span>;
}

function KpiCard({ label, value, sub, icon, accent="purple" }:{
  label:string; value:string; sub?:string; icon:ReactNode; accent?:string;
}) {
  const accentMap:Record<string,string> = {
    purple:"bg-purple-50 text-purple-600 border-purple-100",
    emerald:"bg-emerald-50 text-emerald-600 border-emerald-100",
    amber:"bg-amber-50 text-amber-600 border-amber-100",
    red:"bg-red-50 text-red-600 border-red-100",
    blue:"bg-blue-50 text-blue-600 border-blue-100",
    cyan:"bg-cyan-50 text-cyan-600 border-cyan-100",
  };
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
      <div className="flex items-start justify-between mb-2">
        <p className="text-xs font-semibold text-gray-500">{label}</p>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${accentMap[accent]||accentMap.purple}`}>{icon}</div>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {sub && <p className="text-[11px] text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

function fmtAmt(n:number){ return n.toLocaleString("ar-SA"); }

// ═══════════════════════════════════════════════════
// COMPANY DATA
// ═══════════════════════════════════════════════════
const COMPANY = {
  name:       "مجموعة التاج للمطاعم",
  shortName:  "التاج",
  logo:       "👑",
  plan:       "Professional",
  branches:   12,
  maxBranches:20,
  users:      31,
  maxUsers:   50,
  validUntil: "15 يناير 2026",
  daysLeft:   87,
  monthly:    400,
  annual:     4800,
  billingCycle:"سنوي",
  accountManager:"نورة الزهراني",
  amPhone:    "+966 50 123 4567",
};

type CRole = "company-admin"|"head"|"accountant"|"branch"|"procurement";

// ═══════════════════════════════════════════════════
// NAV CONFIG
// ═══════════════════════════════════════════════════
type NavEntry2 = { section:string } | { id:string; label:string; icon:ReactNode; badge?:number };
function isSection2(e:NavEntry2): e is { section:string } { return "section" in e; }

const NAV:Record<CRole, NavEntry2[]> = {
  "company-admin":[
    { section:"لوحة التحكم" },
    { id:"ca-dashboard",    label:"الرئيسية",             icon:<LayoutDashboard size={16}/> },
    { id:"ca-subscription", label:"الاشتراك والخطة",      icon:<CreditCard size={16}/>      },
    { id:"ca-users",        label:"إدارة المستخدمين",     icon:<Users size={16}/>           },
    { id:"ca-branches",     label:"الفروع والمطاعم",      icon:<Building2 size={16}/>       },
    { id:"ca-modules",      label:"الوحدات النشطة",       icon:<Package size={16}/>         },
    { section:"المالية" },
    { id:"ca-billing",      label:"الفواتير والمدفوعات",  icon:<Wallet size={16}/>          },
    { id:"ca-reports",      label:"التقارير",              icon:<BarChart3 size={16}/>       },
    { section:"الإعدادات" },
    { id:"ca-settings",     label:"إعدادات الشركة",       icon:<Settings size={16}/>        },
    { id:"ca-support",      label:"الدعم الفني",          icon:<Bell size={16}/>            },
  ],
  head:[
    { section:"الرئيسية" },
    { id:"head-dashboard",  label:"لوحة التحكم",          icon:<LayoutDashboard size={16}/> },
    { id:"head-pending",    label:"انتظار الاعتماد",      icon:<Clock size={16}/>, badge:7  },
    { id:"head-approved",   label:"المعتمدة نهائياً",     icon:<CheckCircle2 size={16}/>   },
    { id:"head-reports",    label:"التقارير",              icon:<BarChart3 size={16}/>       },
    { id:"head-accountants",label:"فريق المحاسبين",       icon:<Users size={16}/>           },
  ],
  accountant:[
    { section:"الرئيسية" },
    { id:"acc-dashboard",   label:"لوحة التحكم",          icon:<LayoutDashboard size={16}/> },
    { id:"acc-sales",       label:"المبيعات",              icon:<TrendingUp size={16}/>      },
    { id:"acc-expenses",    label:"المصروفات",             icon:<Wallet size={16}/>          },
    { id:"acc-purchases",   label:"المشتريات",             icon:<ShoppingCart size={16}/>    },
    { id:"acc-inventory",   label:"المخزون",               icon:<Package size={16}/>         },
    { id:"acc-assets",      label:"الأصول الثابتة",       icon:<Building2 size={16}/>       },
    { id:"acc-shifts",      label:"الشفتات",               icon:<Clock size={16}/>           },
    { id:"acc-reminders",   label:"التذكيرات",             icon:<Bell size={16}/>, badge:3   },
    { id:"acc-reports",     label:"التقارير",              icon:<BarChart3 size={16}/>       },
  ],
  branch:[
    { section:"الرئيسية" },
    { id:"br-dashboard",    label:"لوحة التحكم",          icon:<LayoutDashboard size={16}/> },
    { id:"br-daily",        label:"الرفع اليومي",         icon:<TrendingUp size={16}/>      },
    { id:"br-purchases",    label:"طلبات الشراء",         icon:<ShoppingCart size={16}/>    },
    { id:"br-inventory",    label:"الجرد",                 icon:<Package size={16}/>         },
    { id:"br-staff",        label:"الموظفون",              icon:<Users size={16}/>           },
  ],
  procurement:[
    { section:"الرئيسية" },
    { id:"pr-dashboard",    label:"لوحة التحكم",          icon:<LayoutDashboard size={16}/> },
    { id:"pr-orders",       label:"أوامر الشراء",         icon:<ShoppingCart size={16}/>    },
    { id:"pr-suppliers",    label:"الموردون",              icon:<Truck size={16}/>           },
    { id:"pr-reports",      label:"التقارير",              icon:<BarChart3 size={16}/>       },
  ],
};

function Truck({ size=16 }:{ size?:number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
    </svg>
  );
}

// ═══════════════════════════════════════════════════
// ROLE LABELS
// ═══════════════════════════════════════════════════
const ROLE_META:Record<CRole,{ label:string; icon:string; color:string; desc:string }> = {
  "company-admin":{ label:"أدمن الشركة",      icon:"🏢", color:"bg-purple-600", desc:"إدارة الاشتراك والمستخدمين والإعدادات" },
  head:           { label:"رئيس الحسابات",     icon:"👑", color:"bg-blue-600",   desc:"الإشراف على فريق المحاسبين والاعتماد النهائي" },
  accountant:     { label:"محاسب",             icon:"📊", color:"bg-cyan-600",   desc:"مراجعة وتوثيق العمليات المالية اليومية" },
  branch:         { label:"مدير فرع",          icon:"🏪", color:"bg-emerald-600",desc:"رفع البيانات اليومية لفرع واحد" },
  procurement:    { label:"مدير المشتريات",    icon:"🛒", color:"bg-amber-600",  desc:"إدارة أوامر الشراء والموردين" },
};

// ═══════════════════════════════════════════════════
// LOGIN SCREEN
// ═══════════════════════════════════════════════════
function CompanyLoginScreen({ onSelect }:{ onSelect:(r:CRole)=>void }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6" dir="rtl"
      style={{ background:"linear-gradient(135deg,#0F1C35 0%,#1B3A6B 60%,#2D1B69 100%)" }}>
      <div className="w-full max-w-2xl">
        {/* Logo + Title */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-4"
            style={{ background:"linear-gradient(135deg,#7C3AED,#00D9FF)" }}>
            <span className="text-3xl">👑</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">بوابة الشركات</h1>
          <p className="text-blue-300 mt-2 text-sm">مدعوم بنظام <span className="text-cyan-400 font-bold">عصب</span> — مخصص لمجموعات المطاعم</p>
          <div className="mt-3 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20">
            <span className="text-white/70 text-xs">مجموعة التاج للمطاعم</span>
            <span className="text-cyan-400 text-xs font-bold">● متصل</span>
          </div>
        </div>

        {/* Role cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {(Object.entries(ROLE_META) as [CRole, typeof ROLE_META[CRole]][]).map(([id, meta])=>(
            <button key={id} onClick={()=>onSelect(id)}
              className="relative bg-white/8 backdrop-blur-sm rounded-2xl p-5 text-right border border-white/15 hover:border-white/40 hover:bg-white/15 transition-all group">
              {id==="company-admin" && (
                <div className="absolute top-3 left-3">
                  <Badge className="bg-purple-500/30 text-purple-300 border border-purple-400/40 text-[10px]">مميز</Badge>
                </div>
              )}
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-3 ${meta.color} shadow-lg`}>{meta.icon}</div>
              <p className="font-bold text-white text-base">{meta.label}</p>
              <p className="text-white/50 text-xs mt-1 leading-relaxed">{meta.desc}</p>
              <ChevronRight size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-hover:text-white/70 transition-colors"/>
            </button>
          ))}
        </div>
        <p className="text-center text-white/30 text-xs">نظام عصب للإدارة المالية · النسخة 2.1.0</p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// APP SHELL
// ═══════════════════════════════════════════════════
function CompanyShell({ role, page, navigate, onLogout, children }:{
  role:CRole; page:string; navigate:(p:string)=>void; onLogout:()=>void; children:ReactNode;
}) {
  const meta = ROLE_META[role];
  const nav  = NAV[role];
  return (
    <div className="flex h-screen overflow-hidden" dir="rtl">
      {/* Sidebar */}
      <div className="w-60 flex-shrink-0 flex flex-col" style={{ background:SIDEBAR_GRAD }}>
        {/* Company brand */}
        <div className="px-4 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
              style={{ background:"linear-gradient(135deg,#7C3AED,#00D9FF)" }}>{COMPANY.logo}</div>
            <div className="min-w-0">
              <p className="text-white font-bold text-sm leading-tight truncate">{COMPANY.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-xs text-cyan-400 font-semibold">{COMPANY.plan}</span>
                <span className="w-1 h-1 rounded-full bg-emerald-400"/>
                <span className="text-[10px] text-white/50">{COMPANY.daysLeft} يوم</span>
              </div>
            </div>
          </div>
        </div>

        {/* Role badge */}
        <div className="px-4 py-3 border-b border-white/10">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10">
            <span className="text-base">{meta.icon}</span>
            <div>
              <p className="text-white text-xs font-bold">{meta.label}</p>
              <p className="text-white/40 text-[10px]">مجموعة التاج</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-3 overflow-y-auto">
          {nav.map((entry,i)=>{
            if(isSection2(entry)) return (
              <p key={i} className="text-[10px] font-bold text-white/30 uppercase tracking-widest px-2 mt-4 mb-1 first:mt-0">{entry.section}</p>
            );
            const item = entry as { id:string; label:string; icon:ReactNode; badge?:number };
            const active = page===item.id;
            return (
              <button key={item.id} onClick={()=>navigate(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all mb-0.5 ${active?"bg-white/15 text-white":"text-white/60 hover:bg-white/8 hover:text-white/90"}`}>
                <span className={active?"text-cyan-400":""}>{item.icon}</span>
                <span className="flex-1 text-right">{item.label}</span>
                {item.badge && <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{item.badge}</span>}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-white/10">
          <button onClick={onLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-white/50 hover:text-white/80 hover:bg-white/8 transition-all text-sm">
            <LogOut size={14}/> تسجيل الخروج
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden" style={{ background:BG_CONTENT }}>
        {/* Top bar */}
        <div className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="font-bold text-gray-800">{COMPANY.name}</span>
            <ChevronRight size={12} className="text-gray-300"/>
            <span>{nav.find(e=>"id" in e && e.id===page) ? (nav.find(e=>"id" in e && e.id===page) as any).label : ""}</span>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-100">● {COMPANY.plan}</Badge>
            <Badge className="bg-purple-50 text-purple-700 border border-purple-100">{meta.icon} {meta.label}</Badge>
            <button className="relative text-gray-400 hover:text-gray-600">
              <Bell size={16}/><span className="absolute -top-1 -left-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">2</span>
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// COMPANY ADMIN PAGES
// ═══════════════════════════════════════════════════

// ── Company Admin Dashboard ────────────────────────
function CADashboard({ navigate }:{ navigate:(p:string)=>void }) {
  const modules = [
    { name:"المبيعات",   active:true  },
    { name:"المصروفات",  active:true  },
    { name:"المشتريات",  active:true  },
    { name:"المخزون",    active:true  },
    { name:"الأصول",     active:true  },
    { name:"الشفتات",    active:true  },
    { name:"الهدر",      active:false },
  ];
  return (
    <div className="space-y-5" dir="rtl">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">مرحباً، {COMPANY.name} 🏢</h2>
          <p className="text-gray-400 text-sm mt-0.5">لوحة التحكم الرئيسية · خطة {COMPANY.plan} · تنتهي {COMPANY.validUntil}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={()=>navigate("ca-subscription")}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-purple-600 text-white text-sm font-bold hover:bg-purple-700 transition-all shadow-sm">
            <CreditCard size={14}/> إدارة الاشتراك
          </button>
        </div>
      </div>

      {/* Subscription alert */}
      <div className="bg-gradient-to-l from-purple-600 to-blue-700 rounded-2xl p-5 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold text-lg">خطة {COMPANY.plan} — نشطة ✅</p>
            <p className="text-white/70 text-sm mt-0.5">تنتهي في {COMPANY.validUntil} · متبقي <span className="text-cyan-300 font-bold">{COMPANY.daysLeft}</span> يوم</p>
            <div className="flex items-center gap-4 mt-3">
              <div>
                <p className="text-white/50 text-xs">الفروع</p>
                <p className="font-bold">{COMPANY.branches}/{COMPANY.maxBranches}</p>
              </div>
              <div className="w-px h-8 bg-white/20"/>
              <div>
                <p className="text-white/50 text-xs">المستخدمون</p>
                <p className="font-bold">{COMPANY.users}/{COMPANY.maxUsers}</p>
              </div>
              <div className="w-px h-8 bg-white/20"/>
              <div>
                <p className="text-white/50 text-xs">الوحدات</p>
                <p className="font-bold">{modules.filter(m=>m.active).length}/{modules.length}</p>
              </div>
            </div>
          </div>
          <div className="text-left">
            <div className="text-3xl font-black text-white">{fmtAmt(COMPANY.annual)} <span className="text-base font-normal text-white/60">ر.س/سنة</span></div>
            <button onClick={()=>navigate("ca-subscription")}
              className="mt-2 px-4 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all border border-white/30">
              ترقية الخطة ↑
            </button>
          </div>
        </div>
        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-white/60 mb-1">
            <span>استخدام الفروع</span><span>{COMPANY.branches}/{COMPANY.maxBranches}</span>
          </div>
          <div className="w-full h-2 bg-white/20 rounded-full">
            <div className="h-2 bg-cyan-400 rounded-full transition-all" style={{ width:`${(COMPANY.branches/COMPANY.maxBranches)*100}%` }}/>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        <KpiCard label="إجمالي الفروع النشطة" value={String(COMPANY.branches)} sub="من أصل 20 مسموح" icon={<Building2 size={18} className="text-blue-600"/>} accent="blue"/>
        <KpiCard label="المستخدمون" value={String(COMPANY.users)} sub="محاسبين ومديري فروع" icon={<Users size={18} className="text-purple-600"/>} accent="purple"/>
        <KpiCard label="الوحدات المفعّلة" value={`${modules.filter(m=>m.active).length}/${modules.length}`} sub="وحدات نشطة" icon={<Package size={18} className="text-emerald-600"/>} accent="emerald"/>
        <KpiCard label="تكلفة هذا الشهر" value={`${fmtAmt(COMPANY.monthly)}`} sub="ر.س — الدورة السنوية" icon={<CreditCard size={18} className="text-amber-600"/>} accent="amber"/>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-bold text-gray-800 text-sm mb-3">🚀 إجراءات سريعة</h3>
          <div className="space-y-2">
            {[
              { label:"إضافة مستخدم جديد", page:"ca-users",        icon:<Plus size={13} className="text-purple-600"/> },
              { label:"إدارة الاشتراك",    page:"ca-subscription", icon:<CreditCard size={13} className="text-blue-600"/> },
              { label:"إضافة فرع جديد",   page:"ca-branches",     icon:<Building2 size={13} className="text-emerald-600"/> },
              { label:"تفعيل وحدة جديدة", page:"ca-modules",      icon:<Zap size={13} className="text-amber-600"/> },
            ].map(a=>(
              <button key={a.page} onClick={()=>navigate(a.page)}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg border border-gray-100 hover:bg-gray-50 hover:border-purple-200 transition-all text-sm text-gray-700 text-right">
                {a.icon}{a.label}<ChevronRight size={12} className="mr-auto text-gray-300"/>
              </button>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-bold text-gray-800 text-sm mb-3">📊 الوحدات النشطة</h3>
          <div className="space-y-2">
            {modules.map((m,i)=>(
              <div key={i} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                <span className="text-sm text-gray-700">{m.name}</span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${m.active?"bg-emerald-50 text-emerald-700":"bg-gray-100 text-gray-400"}`}>
                  {m.active?"✅ نشط":"⊘ غير مفعّل"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Account manager */}
      <div className="bg-gradient-to-l from-blue-50 to-purple-50 border border-blue-100 rounded-xl p-4 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">ن</div>
        <div>
          <p className="font-bold text-gray-800 text-sm">مديرة حساب عصب</p>
          <p className="text-gray-500 text-xs">{COMPANY.accountManager} · {COMPANY.amPhone}</p>
        </div>
        <div className="mr-auto flex gap-2">
          <button className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs text-gray-600 hover:bg-gray-50">
            <Smartphone size={11}/> واتساب
          </button>
          <button className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-50 border border-purple-200 text-xs text-purple-700 hover:bg-purple-100">
            <Send size={11}/> إرسال رسالة
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Subscription Management ────────────────────────
function CASubscription() {
  const [billing, setBilling] = useState<"monthly"|"annual">("annual");
  const [confirmUpgrade, setConfirmUpgrade] = useState(false);
  const [upgradeTarget, setUpgradeTarget] = useState<string|null>(null);

  const plans = [
    {
      id:"basic", name:"Basic", price_m:199, price_a:1990, maxBranches:5, maxUsers:15, maxModules:4,
      features:["حتى 5 فروع","15 مستخدماً","4 وحدات مالية","تقارير أساسية","دعم بالبريد الإلكتروني"],
      highlight:false, current:false,
    },
    {
      id:"professional", name:"Professional", price_m:400, price_a:4800, maxBranches:20, maxUsers:50, maxModules:7,
      features:["حتى 20 فرعاً","50 مستخدماً","كل الوحدات المالية","تقارير متقدمة","دعم أولوية + مدير حساب","استيراد Excel للأصول","ERP Export"],
      highlight:true, current:true,
    },
    {
      id:"enterprise", name:"Enterprise", price_m:null, price_a:null, maxBranches:999, maxUsers:999, maxModules:9,
      features:["فروع غير محدودة","مستخدمون غير محدودون","كل الوحدات","SLA 99.9%","مدير حساب مخصص","تدريب وتهيئة","تكامل ERP مخصص","API مفتوح"],
      highlight:false, current:false,
    },
  ];

  const usageItems = [
    { label:"الفروع النشطة", used:COMPANY.branches, max:COMPANY.maxBranches, color:"bg-blue-500" },
    { label:"المستخدمون",   used:COMPANY.users,    max:COMPANY.maxUsers,    color:"bg-purple-500" },
    { label:"التخزين (GB)", used:2.4,              max:10,                  color:"bg-emerald-500" },
  ];

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">الاشتراك والخطة</h2>
          <p className="text-gray-400 text-sm mt-0.5">إدارة خطة اشتراك الشركة · الترقية · المقارنة</p>
        </div>
        <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
          {(["annual","monthly"] as const).map(b=>(
            <button key={b} onClick={()=>setBilling(b)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${billing===b?"bg-white text-gray-800 shadow-sm":"text-gray-500"}`}>
              {b==="annual"?"سنوي (وفّر 17%)":"شهري"}
            </button>
          ))}
        </div>
      </div>

      {/* Current plan status */}
      <div className="bg-white rounded-2xl border border-purple-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 bg-gradient-to-l from-purple-600 to-blue-700 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-xl">{COMPANY.plan}</span>
              <Badge className="bg-white/20 text-white border-0 text-[10px]">الخطة الحالية</Badge>
            </div>
            <p className="text-white/70 text-xs mt-0.5">تنتهي في {COMPANY.validUntil} · الدورة: {COMPANY.billingCycle}</p>
          </div>
          <div className="text-left">
            <p className="text-2xl font-black">{fmtAmt(billing==="annual"?COMPANY.annual:COMPANY.monthly)} <span className="text-sm font-normal text-white/60">ر.س/{billing==="annual"?"سنة":"شهر"}</span></p>
            <p className="text-white/50 text-xs mt-0.5">{COMPANY.daysLeft} يوم متبقٍ</p>
          </div>
        </div>
        {/* Usage bars */}
        <div className="p-5 grid grid-cols-3 gap-4">
          {usageItems.map((u,i)=>(
            <div key={i}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-gray-600">{u.label}</span>
                <span className="text-xs font-bold text-gray-800">{u.used}/{u.max}</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full">
                <div className={`h-2 rounded-full ${u.color}`} style={{ width:`${Math.min((u.used/u.max)*100,100)}%` }}/>
              </div>
              <p className="text-[10px] text-gray-400 mt-1">{Math.round((u.used/u.max)*100)}% مستخدم</p>
            </div>
          ))}
        </div>
        <div className="px-5 pb-4 flex gap-2">
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 text-gray-600 border border-gray-200 text-xs font-semibold hover:bg-gray-100">
            <RefreshCw size={11}/> تجديد الاشتراك
          </button>
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 text-gray-600 border border-gray-200 text-xs font-semibold hover:bg-gray-100">
            <Download size={11}/> تحميل الفاتورة
          </button>
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 text-gray-600 border border-gray-200 text-xs font-semibold hover:bg-gray-100">
            <ArrowLeftRight size={11}/> تغيير دورة الفوترة
          </button>
        </div>
      </div>

      {/* Plan comparison */}
      <div>
        <h3 className="font-bold text-gray-800 text-sm mb-3">مقارنة الخطط</h3>
        <div className="grid grid-cols-3 gap-4">
          {plans.map(plan=>(
            <div key={plan.id} className={`bg-white rounded-2xl border-2 shadow-sm overflow-hidden transition-all ${plan.highlight?"border-purple-400 shadow-purple-100":"border-gray-100"}`}>
              {plan.highlight && (
                <div className="px-4 py-1.5 text-center text-xs font-bold bg-purple-600 text-white">⭐ خطتك الحالية</div>
              )}
              <div className="p-5">
                <p className="font-black text-gray-900 text-lg">{plan.name}</p>
                <div className="mt-2 mb-4">
                  {plan.price_m===null ? (
                    <p className="text-2xl font-black text-gray-800">حسب الطلب</p>
                  ) : (
                    <>
                      <span className="text-2xl font-black text-gray-800">{fmtAmt(billing==="annual"?plan.price_a!:plan.price_m)}</span>
                      <span className="text-gray-400 text-sm"> ر.س/{billing==="annual"?"سنة":"شهر"}</span>
                    </>
                  )}
                  {billing==="annual" && plan.price_a && <p className="text-[10px] text-emerald-600 mt-0.5">{fmtAmt(Math.round(plan.price_a/12))} ر.س/شهر فعلياً</p>}
                </div>
                <ul className="space-y-1.5 mb-5">
                  {plan.features.map((f,i)=>(
                    <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                      <Check size={11} className="text-emerald-500 mt-0.5 flex-shrink-0"/>{f}
                    </li>
                  ))}
                </ul>
                {plan.current ? (
                  <div className="w-full py-2 rounded-lg bg-purple-100 text-purple-700 text-xs font-bold text-center">خطتك الحالية ✓</div>
                ) : plan.price_m===null ? (
                  <button className="w-full py-2 rounded-lg border-2 border-purple-300 text-purple-700 text-xs font-bold hover:bg-purple-50 transition-all">
                    تواصل مع المبيعات
                  </button>
                ) : (
                  <button onClick={()=>{ setUpgradeTarget(plan.name); setConfirmUpgrade(true); }}
                    className={`w-full py-2 rounded-lg text-xs font-bold transition-all ${plan.id==="enterprise"?"border-2 border-purple-300 text-purple-700 hover:bg-purple-50":"bg-purple-600 text-white hover:bg-purple-700"}`}>
                    {plan.price_a! > COMPANY.annual ? "ترقية ↑" : "تخفيض ↓"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upgrade confirm modal */}
      {confirmUpgrade && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={()=>setConfirmUpgrade(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center" onClick={e=>e.stopPropagation()} dir="rtl">
            <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
              <CreditCard size={24} className="text-purple-600"/>
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-1">تأكيد الترقية</h3>
            <p className="text-gray-500 text-sm mb-4">الانتقال إلى خطة <span className="font-bold text-purple-700">{upgradeTarget}</span>؟ سيتم تعديل الفاتورة فوراً.</p>
            <div className="flex gap-2">
              <button onClick={()=>{ setConfirmUpgrade(false); alert(`✅ تم طلب الترقية إلى ${upgradeTarget} — سيتواصل معك فريق عصب`); }} className="flex-1 py-2 rounded-lg bg-purple-600 text-white text-sm font-bold hover:bg-purple-700">تأكيد</button>
              <button onClick={()=>setConfirmUpgrade(false)} className="flex-1 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm hover:bg-gray-50">إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── User Management ────────────────────────────────
function CAUsers() {
  type CUser = { id:string; name:string; role:string; branch:string; email:string; status:"active"|"inactive"; lastLogin:string; permissions:string[] };
  const [users, setUsers] = useState<CUser[]>([
    { id:"U001", name:"أحمد محمد العمري",   role:"رئيس الحسابات",   branch:"—",                        email:"ahmed@altaj.com",  status:"active",   lastLogin:"اليوم",    permissions:["الكل"] },
    { id:"U002", name:"سارة خالد الشهري",   role:"محاسب",           branch:"فرع الرياض — العليا",      email:"sara@altaj.com",   status:"active",   lastLogin:"أمس",      permissions:["مبيعات","مصروفات","مشتريات"] },
    { id:"U003", name:"محمد علي الحربي",    role:"محاسب",           branch:"فرع جدة — الحمراء",        email:"m.ali@altaj.com",  status:"active",   lastLogin:"أمس",      permissions:["مبيعات","مصروفات"] },
    { id:"U004", name:"فاطمة عبدالله",      role:"مدير فرع",        branch:"فرع الرياض — العليا",      email:"f.abd@altaj.com",  status:"active",   lastLogin:"اليوم",    permissions:["رفع بيانات"] },
    { id:"U005", name:"خالد سالم العتيبي",  role:"مدير فرع",        branch:"فرع جدة — الحمراء",        email:"k.sal@altaj.com",  status:"active",   lastLogin:"قبل 3 أيام",permissions:["رفع بيانات"] },
    { id:"U006", name:"نورة عبدالرحمن",     role:"مدير مشتريات",   branch:"—",                        email:"noura@altaj.com",  status:"active",   lastLogin:"اليوم",    permissions:["مشتريات","موردون"] },
    { id:"U007", name:"عبدالله الدوسري",    role:"مدير فرع",        branch:"فرع مكة — المعابدة",       email:"a.dos@altaj.com",  status:"inactive", lastLogin:"قبل أسبوع",permissions:["رفع بيانات"] },
  ]);
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("الكل");
  const [newUser, setNewUser] = useState({ name:"", role:"محاسب", branch:"", email:"" });

  const roles = ["الكل","رئيس الحسابات","محاسب","مدير فرع","مدير مشتريات"];
  const displayed = users.filter(u=>
    (roleFilter==="الكل"||u.role===roleFilter) &&
    (!search||u.name.includes(search)||u.email.includes(search))
  );

  const toggleStatus = (id:string) => setUsers(p=>p.map(u=>u.id===id?{...u,status:u.status==="active"?"inactive":"active"}:u));
  const addUser = () => {
    setUsers(p=>[...p,{ id:`U${String(p.length+1).padStart(3,"0")}`, ...newUser, status:"active", lastLogin:"لم يسجل بعد", permissions:["محدود"] }]);
    setShowAdd(false);
    setNewUser({ name:"", role:"محاسب", branch:"", email:"" });
  };

  const ROLE_BADGE:Record<string,string> = {
    "رئيس الحسابات":"bg-blue-50 text-blue-700 border border-blue-100",
    "محاسب":"bg-purple-50 text-purple-700 border border-purple-100",
    "مدير فرع":"bg-emerald-50 text-emerald-700 border border-emerald-100",
    "مدير مشتريات":"bg-amber-50 text-amber-700 border border-amber-100",
  };

  return (
    <div className="space-y-5" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">إدارة المستخدمين</h2>
          <p className="text-gray-400 text-sm mt-0.5">{users.filter(u=>u.status==="active").length} مستخدم نشط · {users.length} إجمالاً · {COMPANY.maxUsers - users.length} مقعد متاح</p>
        </div>
        <Btn variant="primary" onClick={()=>setShowAdd(true)}><Plus size={13}/> إضافة مستخدم</Btn>
      </div>

      {/* Usage bar */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-gray-600">استخدام المقاعد</span>
          <span className="text-xs font-bold text-gray-800">{users.length}/{COMPANY.maxUsers}</span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full">
          <div className="h-2 bg-purple-500 rounded-full" style={{ width:`${(users.length/COMPANY.maxUsers)*100}%` }}/>
        </div>
        <p className="text-[10px] text-gray-400 mt-1">{COMPANY.maxUsers - users.length} مقعد متاح ضمن الخطة الحالية ({COMPANY.plan})</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2">
            <Search size={13} className="text-gray-400 flex-shrink-0"/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="بحث بالاسم أو البريد..." className="flex-1 text-sm outline-none"/>
          </div>
          <div>
            <select value={roleFilter} onChange={e=>setRoleFilter(e.target.value)} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2">
              {roles.map(r=><option key={r}>{r}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px]">{users.filter(u=>u.status==="active").length} نشط</Badge>
            <Badge className="bg-gray-100 text-gray-500 text-[10px]">{users.filter(u=>u.status==="inactive").length} غير نشط</Badge>
          </div>
        </div>
      </div>

      {/* Users table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50/60">
          <h3 className="font-bold text-gray-900 text-sm">قائمة المستخدمين — {displayed.length} مستخدم</h3>
        </div>
        {displayed.map(u=>(
          <div key={u.id} className="px-5 py-4 flex items-center gap-4 border-b border-gray-50 last:border-0 hover:bg-gray-50/60">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {u.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-gray-800 text-sm">{u.name}</span>
                <Badge className={`${ROLE_BADGE[u.role]||"bg-gray-50 text-gray-600"} text-[10px]`}>{u.role}</Badge>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${u.status==="active"?"bg-emerald-50 text-emerald-700":"bg-gray-100 text-gray-400"}`}>
                  {u.status==="active"?"● نشط":"○ غير نشط"}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-0.5">
                <p className="text-xs text-gray-400" dir="ltr">{u.email}</p>
                {u.branch!=="—" && <span className="text-[10px] text-gray-500">{u.branch}</span>}
                <span className="text-[10px] text-gray-400">آخر دخول: {u.lastLogin}</span>
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={()=>toggleStatus(u.id)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-all ${u.status==="active"?"bg-gray-50 border-gray-200 text-gray-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200":"bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"}`}>
                {u.status==="active"?"تعليق":"تفعيل"}
              </button>
              <button className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                <Edit2 size={13}/>
              </button>
              <button className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500">
                <XCircle size={13}/>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add user modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={()=>setShowAdd(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" onClick={e=>e.stopPropagation()} dir="rtl">
            <div className="px-5 py-4 bg-gradient-to-l from-purple-700 to-purple-600 text-white flex items-center justify-between">
              <div><h3 className="font-bold">إضافة مستخدم جديد</h3><p className="text-purple-200 text-xs mt-0.5">سيتلقى دعوة على بريده الإلكتروني</p></div>
              <button onClick={()=>setShowAdd(false)} className="text-purple-200 hover:text-white"><X size={18}/></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">الاسم الكامل *</label>
                <input value={newUser.name} onChange={e=>setNewUser(p=>({...p,name:e.target.value}))} placeholder="اسم الموظف" className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:border-purple-400 outline-none"/>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">الدور *</label>
                <select value={newUser.role} onChange={e=>setNewUser(p=>({...p,role:e.target.value}))} className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:border-purple-400 outline-none">
                  {["رئيس الحسابات","محاسب","مدير فرع","مدير مشتريات"].map(r=><option key={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">البريد الإلكتروني *</label>
                <input value={newUser.email} onChange={e=>setNewUser(p=>({...p,email:e.target.value}))} placeholder="email@company.com" className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:border-purple-400 outline-none" dir="ltr"/>
              </div>
              {newUser.role==="مدير فرع"&&(
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">الفرع</label>
                  <select value={newUser.branch} onChange={e=>setNewUser(p=>({...p,branch:e.target.value}))} className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:border-purple-400 outline-none">
                    <option value="">اختر الفرع...</option>
                    {["فرع الرياض — العليا","فرع جدة — الحمراء","فرع مكة — المعابدة"].map(b=><option key={b}>{b}</option>)}
                  </select>
                </div>
              )}
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-start gap-2">
                <Smartphone size={13} className="text-blue-600 mt-0.5 flex-shrink-0"/>
                <p className="text-xs text-blue-700">سيتلقى المستخدم رابط الدعوة على البريد الإلكتروني وسيمكنه الوصول فور التسجيل.</p>
              </div>
              <div className="flex gap-2 justify-end">
                <Btn onClick={()=>setShowAdd(false)}>إلغاء</Btn>
                <Btn variant="primary" disabled={!newUser.name||!newUser.email} onClick={addUser}><Send size={13}/> إرسال الدعوة</Btn>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Branches & Restaurants ─────────────────────────
function CABranches() {
  const branches = [
    { id:"BR01", name:"فرع الرياض — العليا",     restaurant:"برغر التاج", city:"الرياض",  manager:"فاطمة عبدالله",    status:"active",   salesM:128000 },
    { id:"BR02", name:"فرع جدة — الحمراء",        restaurant:"برغر التاج", city:"جدة",     manager:"خالد العتيبي",      status:"active",   salesM:94000  },
    { id:"BR03", name:"فرع مكة — المعابدة",        restaurant:"بيتزا التاج",city:"مكة",     manager:"عبدالله الدوسري",   status:"inactive", salesM:0      },
    { id:"BR04", name:"فرع الدمام — الكورنيش",     restaurant:"بيتزا التاج",city:"الدمام",  manager:"سعد الغامدي",       status:"active",   salesM:76000  },
    { id:"BR05", name:"فرع الطائف — المحطة",       restaurant:"مطعم التاج", city:"الطائف",  manager:"محمد الزهراني",     status:"active",   salesM:52000  },
    { id:"BR06", name:"فرع المدينة — العزيزية",    restaurant:"برغر التاج", city:"المدينة", manager:"نواف السلمي",       status:"active",   salesM:61000  },
  ];
  return (
    <div className="space-y-5" dir="rtl">
      <div className="flex items-center justify-between">
        <div><h2 className="text-xl font-bold text-gray-800">الفروع والمطاعم</h2>
          <p className="text-gray-400 text-sm mt-0.5">{branches.filter(b=>b.status==="active").length} فرع نشط · {branches.length}/{COMPANY.maxBranches} من حد الخطة</p>
        </div>
        <Btn variant="primary"><Plus size={13}/> إضافة فرع</Btn>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <KpiCard label="الفروع النشطة" value={String(branches.filter(b=>b.status==="active").length)} sub={`من أصل ${COMPANY.maxBranches}`} icon={<Building2 size={18} className="text-blue-600"/>} accent="blue"/>
        <KpiCard label="المدن" value={String(new Set(branches.map(b=>b.city)).size)} sub="مدينة مغطاة" icon={<TrendingUp size={18} className="text-emerald-600"/>} accent="emerald"/>
        <KpiCard label="المطاعم" value={String(new Set(branches.map(b=>b.restaurant)).size)} sub="علامات تجارية" icon={<Star size={18} className="text-amber-600"/>} accent="amber"/>
        <KpiCard label="المبيعات الشهرية" value={`${fmtAmt(branches.reduce((s,b)=>s+b.salesM,0)/1000)}K`} sub="ر.س إجمالي" icon={<Wallet size={18} className="text-purple-600"/>} accent="purple"/>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50/60 flex items-center justify-between">
          <h3 className="font-bold text-gray-900 text-sm">قائمة الفروع</h3>
          <span className="text-xs text-gray-400">{branches.length} فرع</span>
        </div>
        {branches.map(b=>(
          <div key={b.id} className="px-5 py-4 flex items-center gap-4 border-b border-gray-50 last:border-0 hover:bg-gray-50/60">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">{b.city[0]}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-800 text-sm">{b.name}</span>
                <Badge className="bg-purple-50 text-purple-700 border border-purple-100 text-[10px]">{b.restaurant}</Badge>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${b.status==="active"?"bg-emerald-50 text-emerald-700":"bg-gray-100 text-gray-400"}`}>{b.status==="active"?"● نشط":"○ موقوف"}</span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">مدير الفرع: {b.manager} · {b.city}</p>
            </div>
            <div className="text-left">
              <p className="font-mono font-bold text-gray-800 text-sm">{fmtAmt(b.salesM)} ر.س</p>
              <p className="text-[10px] text-gray-400">مبيعات هذا الشهر</p>
            </div>
            <div className="flex gap-1.5">
              <button className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"><Edit2 size={13}/></button>
              <button className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500"><XCircle size={13}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Active Modules ─────────────────────────────────
function CAModules() {
  type Mod = { id:string; name:string; desc:string; icon:string; active:boolean; includedInPlan:boolean };
  const [modules, setModules] = useState<Mod[]>([
    { id:"sales",     name:"المبيعات",          desc:"تتبع ومراجعة المبيعات اليومية لجميع الفروع",           icon:"💰", active:true,  includedInPlan:true  },
    { id:"expenses",  name:"المصروفات",         desc:"إدارة المصروفات والفواتير بموافقات متعددة المستويات",   icon:"💸", active:true,  includedInPlan:true  },
    { id:"purchases", name:"المشتريات",         desc:"أوامر الشراء والموردين ومطابقة الفواتير",               icon:"🛒", active:true,  includedInPlan:true  },
    { id:"inventory", name:"المخزون",           desc:"الجرد اليومي والشهري ومتابعة مستويات المخزون",         icon:"📦", active:true,  includedInPlan:true  },
    { id:"assets",    name:"الأصول الثابتة",    desc:"تسجيل الأصول واستهلاكها وسجل العهدة والنقل",           icon:"🏢", active:true,  includedInPlan:true  },
    { id:"shifts",    name:"الشفتات",           desc:"جداول العمل وإغلاق الشفت ومصادقة الكاشير",             icon:"🕐", active:true,  includedInPlan:true  },
    { id:"waste",     name:"الهدر والتالف",     desc:"تتبع هدر الخامات والتالف والمسؤولية",                  icon:"🗑", active:false, includedInPlan:true  },
    { id:"employees", name:"كشف الحساب",        desc:"رواتب وسلف وتسويات الموظفين",                          icon:"👥", active:false, includedInPlan:false },
    { id:"cash",      name:"العهدة النقدية",    desc:"إدارة الخزينة والعهدة النقدية اليومية",                icon:"💵", active:false, includedInPlan:false },
  ]);
  const toggle = (id:string) => {
    const mod = modules.find(m=>m.id===id);
    if(!mod?.includedInPlan) { alert("هذه الوحدة غير مضمّنة في خطتك الحالية. قم بترقية الخطة لتفعيلها."); return; }
    setModules(p=>p.map(m=>m.id===id?{...m,active:!m.active}:m));
  };
  return (
    <div className="space-y-5" dir="rtl">
      <div>
        <h2 className="text-xl font-bold text-gray-800">الوحدات النشطة</h2>
        <p className="text-gray-400 text-sm mt-0.5">تفعيل/تعطيل الوحدات المالية المتاحة ضمن خطتك</p>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <KpiCard label="مفعّلة" value={String(modules.filter(m=>m.active).length)} sub="وحدات نشطة" icon={<CheckCircle2 size={18} className="text-emerald-600"/>} accent="emerald"/>
        <KpiCard label="معطّلة" value={String(modules.filter(m=>!m.active&&m.includedInPlan).length)} sub="متاحة في خطتك" icon={<XCircle size={18} className="text-amber-600"/>} accent="amber"/>
        <KpiCard label="تحتاج ترقية" value={String(modules.filter(m=>!m.includedInPlan).length)} sub="غير مضمّنة في الخطة" icon={<Lock size={18} className="text-gray-500"/>} accent="blue"/>
        <KpiCard label="الخطة" value={COMPANY.plan} sub="Professional" icon={<Star size={18} className="text-purple-600"/>} accent="purple"/>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50/60">
          <h3 className="font-bold text-gray-900 text-sm">كل الوحدات</h3>
        </div>
        {modules.map(m=>(
          <div key={m.id} className={`px-5 py-4 flex items-center gap-4 border-b border-gray-50 last:border-0 ${!m.includedInPlan?"bg-gray-50/60":""}`}>
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-xl flex-shrink-0">{m.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-800 text-sm">{m.name}</span>
                {!m.includedInPlan && <Badge className="bg-amber-50 text-amber-700 border border-amber-100 text-[10px]"><Lock size={9}/> يحتاج ترقية</Badge>}
              </div>
              <p className="text-xs text-gray-400 mt-0.5">{m.desc}</p>
            </div>
            <button onClick={()=>toggle(m.id)}
              className={`w-12 h-6 rounded-full transition-all flex-shrink-0 relative ${m.active?"bg-purple-500":m.includedInPlan?"bg-gray-300":"bg-gray-200 cursor-not-allowed"}`}>
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${m.active?"right-0.5":"left-0.5"}`}/>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Billing & Payments ─────────────────────────────
function CABilling() {
  const invoices = [
    { id:"INV-2025-012", date:"01 يناير 2025",  amount:4800,  status:"paid",    method:"بطاقة ائتمان **** 4521" },
    { id:"INV-2024-012", date:"01 يناير 2024",  amount:3600,  status:"paid",    method:"بطاقة ائتمان **** 4521" },
    { id:"INV-2023-012", date:"01 يناير 2023",  amount:2400,  status:"paid",    method:"تحويل بنكي" },
  ];
  return (
    <div className="space-y-5" dir="rtl">
      <div>
        <h2 className="text-xl font-bold text-gray-800">الفواتير والمدفوعات</h2>
        <p className="text-gray-400 text-sm mt-0.5">سجل الفواتير · طريقة الدفع · الدورة التالية</p>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <KpiCard label="إجمالي المدفوع" value={`${fmtAmt(invoices.reduce((s,i)=>s+i.amount,0))}`} sub="ر.س منذ البداية" icon={<Wallet size={18} className="text-emerald-600"/>} accent="emerald"/>
        <KpiCard label="الفاتورة التالية" value="15 يناير 2026" sub={`${fmtAmt(COMPANY.annual)} ر.س`} icon={<CreditCard size={18} className="text-blue-600"/>} accent="blue"/>
        <KpiCard label="طريقة الدفع" value="بطاقة ائتمان" sub="**** **** **** 4521" icon={<Shield size={18} className="text-purple-600"/>} accent="purple"/>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/60">
          <h3 className="font-bold text-gray-900 text-sm">سجل الفواتير</h3>
          <button className="inline-flex items-center gap-1 text-xs text-emerald-700 font-semibold hover:underline"><Download size={11}/> تصدير الكل</button>
        </div>
        {invoices.map(inv=>(
          <div key={inv.id} className="px-5 py-4 flex items-center gap-4 border-b border-gray-50 last:border-0">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0"><FileText size={16} className="text-emerald-600"/></div>
            <div className="flex-1">
              <p className="font-semibold text-gray-800 text-sm" dir="ltr">{inv.id}</p>
              <p className="text-xs text-gray-400 mt-0.5">{inv.date} · {inv.method}</p>
            </div>
            <span className="font-mono font-bold text-gray-800">{fmtAmt(inv.amount)} ر.س</span>
            <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px]">✓ مدفوع</Badge>
            <button className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"><Download size={13}/></button>
          </div>
        ))}
      </div>
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
        <CreditCard size={16} className="text-blue-600 flex-shrink-0 mt-0.5"/>
        <div>
          <p className="font-bold text-blue-900 text-sm">تجديد تلقائي مفعّل</p>
          <p className="text-xs text-blue-600 mt-0.5">سيتم خصم {fmtAmt(COMPANY.annual)} ر.س تلقائياً في {COMPANY.validUntil} · لإلغاء التجديد التلقائي تواصل مع فريق عصب قبل 30 يوماً.</p>
        </div>
      </div>
    </div>
  );
}

// ── Company Settings ───────────────────────────────
function CASettings() {
  const [companyName, setCompanyName] = useState(COMPANY.name);
  const [saved, setSaved] = useState(false);
  const save = () => { setSaved(true); setTimeout(()=>setSaved(false),2000); };
  return (
    <div className="space-y-5" dir="rtl">
      <div><h2 className="text-xl font-bold text-gray-800">إعدادات الشركة</h2>
        <p className="text-gray-400 text-sm mt-0.5">بيانات الشركة والإعدادات العامة</p>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h3 className="font-bold text-gray-800 text-sm border-b border-gray-100 pb-3">بيانات الشركة</h3>
        <div className="grid grid-cols-2 gap-4">
          {[["اسم الشركة",companyName,setCompanyName],["المدينة الرئيسية","الرياض",()=>{}],["رقم السجل التجاري","1010XXXXXX",()=>{}],["البريد الإلكتروني","info@altaj.com",()=>{}]].map(([label,val,fn]:any,i)=>(
            <div key={i}>
              <label className="text-xs font-semibold text-gray-600 block mb-1">{label}</label>
              <input value={val} onChange={e=>fn(e.target.value)} className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:border-purple-400 outline-none"/>
            </div>
          ))}
        </div>
        <div className="flex justify-end">
          <button onClick={save} className={`inline-flex items-center gap-1.5 px-5 py-2 rounded-lg font-bold text-sm transition-all ${saved?"bg-emerald-500 text-white":"bg-purple-600 text-white hover:bg-purple-700"}`}>
            {saved?<><Check size={14}/> تم الحفظ</>:<><CheckCircle2 size={14}/> حفظ التغييرات</>}
          </button>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-bold text-gray-800 text-sm border-b border-gray-100 pb-3 mb-4">الإشعارات</h3>
        {[["إشعارات البريد الإلكتروني عند انتهاء الاشتراك",true],["تقرير أسبوعي بملخص الأداء",true],["إشعار عند إضافة مستخدم جديد",false],["تحذير عند الاقتراب من حد الفروع",true]].map(([label,val],i)=>(
          <div key={i} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
            <span className="text-sm text-gray-700">{label as string}</span>
            <div className={`w-10 h-5 rounded-full transition-all relative cursor-pointer ${val?"bg-purple-500":"bg-gray-300"}`}>
              <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${val?"right-0.5":"left-0.5"}`}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Support ────────────────────────────────────────
function CASupport() {
  return (
    <div className="space-y-5" dir="rtl">
      <div><h2 className="text-xl font-bold text-gray-800">الدعم الفني</h2>
        <p className="text-gray-400 text-sm mt-0.5">تواصل مع فريق عصب لأي استفسار أو مشكلة</p>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon:"💬", title:"الدردشة الفورية",    desc:"متاح 9 ص — 9 م", badge:"متاح الآن", color:"emerald" },
          { icon:"📞", title:"الاتصال الهاتفي",    desc:"800 123 4567",     badge:"أيام العمل", color:"blue" },
          { icon:"📧", title:"البريد الإلكتروني",  desc:"support@asab.sa", badge:"رد خلال 24 س",color:"purple" },
        ].map((ch,i)=>(
          <button key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 text-right hover:border-purple-200 hover:shadow-md transition-all">
            <div className="text-3xl mb-3">{ch.icon}</div>
            <p className="font-bold text-gray-800 text-sm">{ch.title}</p>
            <p className="text-xs text-gray-400 mt-1">{ch.desc}</p>
            <Badge className={`mt-2 bg-${ch.color}-50 text-${ch.color}-700 border border-${ch.color}-100 text-[10px]`}>{ch.badge}</Badge>
          </button>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h3 className="font-bold text-gray-800 text-sm mb-3">إرسال طلب دعم</h3>
        <div className="space-y-3">
          <select className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 outline-none">
            <option>نوع المشكلة — اختر...</option>
            <option>مشكلة في الاشتراك</option>
            <option>مشكلة تقنية</option>
            <option>استفسار عن الخطط</option>
            <option>إضافة فرع أو مستخدم</option>
          </select>
          <textarea rows={4} placeholder="اشرح المشكلة بالتفصيل..." className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 outline-none resize-none focus:border-purple-400"/>
          <Btn variant="primary"><Send size={13}/> إرسال الطلب</Btn>
        </div>
      </div>
    </div>
  );
}

// ── Same-as-ASAB role pages ────────────────────────
function SameAsASABPage({ role, page }:{ role:CRole; page:string }) {
  const meta = ROLE_META[role];
  const pageLabel = (NAV[role].find(e=>"id" in e && (e as any).id===page) as any)?.label || page;
  return (
    <div className="space-y-5" dir="rtl">
      <div>
        <h2 className="text-xl font-bold text-gray-800">{pageLabel}</h2>
        <p className="text-gray-400 text-sm mt-0.5">مجموعة التاج للمطاعم · {meta.label}</p>
      </div>
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex items-center gap-5">
        <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-2xl flex-shrink-0">{meta.icon}</div>
        <div>
          <p className="font-bold text-blue-900 text-base">هذه الوحدة متطابقة مع نظام عصب الرئيسي</p>
          <p className="text-blue-600 text-sm mt-1 leading-relaxed">صلاحيات ووظائف <span className="font-bold">{meta.label}</span> في بوابة الشركات مطابقة تماماً للنظام الرئيسي. جميع الوحدات والأدوات متاحة بنفس المستوى الاحترافي.</p>
          <div className="flex items-center gap-3 mt-3">
            <Badge className="bg-blue-100 text-blue-800 text-xs">✓ المبيعات</Badge>
            <Badge className="bg-blue-100 text-blue-800 text-xs">✓ المصروفات</Badge>
            <Badge className="bg-blue-100 text-blue-800 text-xs">✓ المشتريات</Badge>
            <Badge className="bg-blue-100 text-blue-800 text-xs">✓ المخزون</Badge>
            <Badge className="bg-blue-100 text-blue-800 text-xs">✓ الأصول</Badge>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <KpiCard label="الفروع المخصصة" value={role==="accountant"?"4":role==="branch"?"1":"12"} sub="فروع ضمن نطاق الصلاحية" icon={<Building2 size={18} className="text-blue-600"/>} accent="blue"/>
        <KpiCard label="العمليات المعلقة" value="7" sub="تنتظر إجراءً" icon={<Clock size={18} className="text-amber-600"/>} accent="amber"/>
        <KpiCard label="المكتملة هذا الشهر" value="143" sub="عملية مؤكدة" icon={<CheckCircle2 size={18} className="text-emerald-600"/>} accent="emerald"/>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 text-center">
        <p className="text-gray-500 text-sm">في النسخة الكاملة، تُعرض هنا نفس صفحات نظام عصب الرئيسي بالكامل مع بيانات الشركة.</p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// PAGE ROUTER
// ═══════════════════════════════════════════════════
function CompanyPageRouter({ role, page, navigate }:{ role:CRole; page:string; navigate:(p:string)=>void }) {
  if(role==="company-admin") {
    if(page==="ca-dashboard")    return <CADashboard navigate={navigate}/>;
    if(page==="ca-subscription") return <CASubscription/>;
    if(page==="ca-users")        return <CAUsers/>;
    if(page==="ca-branches")     return <CABranches/>;
    if(page==="ca-modules")      return <CAModules/>;
    if(page==="ca-billing")      return <CABilling/>;
    if(page==="ca-settings")     return <CASettings/>;
    if(page==="ca-support")      return <CASupport/>;
    return <CADashboard navigate={navigate}/>;
  }
  return <SameAsASABPage role={role} page={page}/>;
}

// ═══════════════════════════════════════════════════
// DEFAULT PAGES PER ROLE
// ═══════════════════════════════════════════════════
const DEFAULT_PAGE:Record<CRole,string> = {
  "company-admin":"ca-dashboard",
  head:"head-dashboard",
  accountant:"acc-dashboard",
  branch:"br-dashboard",
  procurement:"pr-dashboard",
};

// ═══════════════════════════════════════════════════
// ROOT COMPONENT
// ═══════════════════════════════════════════════════
export default function CompanyDashboard() {
  const [role, setRole]   = useState<CRole|null>(null);
  const [page, setPage]   = useState<string>("");

  const selectRole = (r:CRole) => { setRole(r); setPage(DEFAULT_PAGE[r]); };
  const navigate   = (p:string) => setPage(p);
  const logout     = () => { setRole(null); setPage(""); };

  if(!role) return <CompanyLoginScreen onSelect={selectRole}/>;

  return (
    <CompanyShell role={role} page={page} navigate={navigate} onLogout={logout}>
      <CompanyPageRouter role={role} page={page} navigate={navigate}/>
    </CompanyShell>
  );
}
