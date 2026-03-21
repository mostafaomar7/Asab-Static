import "./_group.css";
import { useState, ReactNode } from "react";
import {
  LayoutDashboard, Building2, Users, Settings, Bell, LogOut, ChevronRight,
  CheckCircle2, XCircle, TrendingUp, Plus, X, Edit2, FileText,
  Shield, Search, CreditCard, Package, Wallet, ShoppingCart, Clock,
  BarChart3, AlertTriangle, Star, RefreshCw, ArrowLeftRight,
  Smartphone, Send, Check, Download, Zap, Lock, ChevronDown, ChevronUp,
  Eye, Paperclip, ThumbsUp, ThumbsDown, Upload, Clipboard, Truck as TruckIcon,
  Filter, Home
} from "lucide-react";

// ═══════════════════════════════════════════════════
// DESIGN TOKENS
// ═══════════════════════════════════════════════════
const SIDEBAR_GRAD = "linear-gradient(180deg,#0F1C35 0%,#1B3A6B 100%)";
const BG_CONTENT   = "#F0F4FA";

// ═══════════════════════════════════════════════════
// PRIMITIVES
// ═══════════════════════════════════════════════════
function Btn({ children, onClick, variant="ghost", size="md", disabled=false }:{
  children:ReactNode; onClick?:()=>void; variant?:"primary"|"success"|"danger"|"ghost"|"outline"|"amber"|"cyan"; size?:"sm"|"md"; disabled?:boolean;
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
    cyan:"bg-cyan-50 text-cyan-700 border-cyan-200 hover:bg-cyan-100",
  };
  return <button disabled={disabled} onClick={onClick} className={`${base} ${sizes[size]} ${variants[variant]}`}>{children}</button>;
}

function Badge({ children, className="" }:{ children:ReactNode; className?:string }) {
  return <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${className}`}>{children}</span>;
}

function KpiCard({ label, value, sub, icon, accent="purple", delta }:{
  label:string; value:string; sub?:string; icon:ReactNode; accent?:string; delta?:string;
}) {
  const am:Record<string,string> = {
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
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${am[accent]||am.purple}`}>{icon}</div>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {sub && <p className="text-[11px] text-gray-400 mt-1">{sub}</p>}
      {delta && <p className={`text-[10px] font-bold mt-1 ${delta.startsWith("+")?"text-emerald-600":"text-red-500"}`}>{delta} مقارنة بالأسبوع الماضي</p>}
    </div>
  );
}

const fmt = (n:number) => n.toLocaleString("ar-SA");

// ═══════════════════════════════════════════════════
// COMPANY & HIERARCHY DATA
// ═══════════════════════════════════════════════════
const COMPANY = { name:"مجموعة التاج للمطاعم", logo:"👑", plan:"Professional", city:"الرياض" };

const BRANDS = [
  { id:"B1", name:"برغر التاج",        color:"#E53E3E", abbr:"بر", restaurants:[
    { id:"R1", name:"برغر التاج — الرياض",  branches:[
      { id:"BR1", name:"فرع العليا",    city:"الرياض", mgr:"فاطمة السالم",   salesM:128000, expM:41000, target:130000 },
      { id:"BR2", name:"فرع النزهة",    city:"الرياض", mgr:"سامي الغامدي",   salesM:94000,  expM:31000, target:100000 },
    ]},
    { id:"R2", name:"برغر التاج — جدة",    branches:[
      { id:"BR3", name:"فرع الحمراء",   city:"جدة",    mgr:"خالد العتيبي",   salesM:112000, expM:36000, target:120000 },
      { id:"BR4", name:"فرع العزيزية",  city:"جدة",    mgr:"نورة البقمي",    salesM:78000,  expM:27000, target:85000  },
    ]},
  ]},
  { id:"B2", name:"بيتزا التاج",       color:"#2B6CB0", abbr:"بز", restaurants:[
    { id:"R3", name:"بيتزا التاج — الرياض", branches:[
      { id:"BR5", name:"فرع الملقا",    city:"الرياض", mgr:"أحمد الحربي",    salesM:96000,  expM:32000, target:100000 },
    ]},
    { id:"R4", name:"بيتزا التاج — الدمام", branches:[
      { id:"BR6", name:"فرع الكورنيش", city:"الدمام",  mgr:"عبدالله الدوسري",salesM:71000,  expM:24000, target:75000  },
      { id:"BR7", name:"فرع الدانة",   city:"الدمام",  mgr:"سعد الرشيد",    salesM:63000,  expM:22000, target:70000  },
    ]},
  ]},
  { id:"B3", name:"مطعم التاج الراقي",  color:"#805AD5", abbr:"تج", restaurants:[
    { id:"R5", name:"مطعم التاج — الرياض",  branches:[
      { id:"BR8",  name:"فرع الورود",   city:"الرياض", mgr:"منى الزهراني",   salesM:145000, expM:52000, target:150000 },
      { id:"BR9",  name:"فرع الملك فهد",city:"الرياض", mgr:"وليد السبيعي",  salesM:118000, expM:44000, target:120000 },
    ]},
    { id:"R6", name:"مطعم التاج — مكة",    branches:[
      { id:"BR10", name:"فرع العزيزية", city:"مكة",    mgr:"حمد القحطاني",   salesM:89000,  expM:33000, target:90000  },
      { id:"BR11", name:"فرع المعابدة", city:"مكة",    mgr:"ريم السهلي",     salesM:74000,  expM:28000, target:80000  },
    ]},
    { id:"R7", name:"مطعم التاج — الطائف", branches:[
      { id:"BR12", name:"فرع المحطة",   city:"الطائف", mgr:"سلطان العمري",   salesM:52000,  expM:19000, target:60000  },
    ]},
  ]},
];

const ALL_BRANCHES = BRANDS.flatMap(b=>b.restaurants.flatMap(r=>r.branches.map(br=>({...br, brandId:b.id, brandName:b.name, restaurantName:r.name, brandColor:b.color}))));

type OpStatus = "pending"|"approved"|"rejected"|"final-approved";
type ModKey = "sales"|"expenses"|"purchases"|"inventory"|"assets"|"shifts";

type Op = {
  id:string; branch:string; brandName:string; module:ModKey; moduleLabel:string;
  amount:number; timeAgo:string; status:OpStatus; attachments:number;
  match:"exact"|"review"|"diff"; diff?:string; submittedBy:string;
};

const MOD_LABELS:Record<ModKey,string> = { sales:"مبيعات", expenses:"مصروفات", purchases:"مشتريات", inventory:"مخزون", assets:"أصول ثابتة", shifts:"شفتات" };

const INITIAL_OPS:Op[] = [
  { id:"O-2401", branch:"فرع العليا",    brandName:"برغر التاج",       module:"sales",     moduleLabel:"مبيعات",    amount:18340, timeAgo:"قبل ساعة",    status:"pending",       attachments:3, match:"exact",  submittedBy:"فاطمة السالم" },
  { id:"O-2400", branch:"فرع الحمراء",  brandName:"برغر التاج",       module:"expenses",  moduleLabel:"مصروفات",   amount:12500, timeAgo:"قبل 3 ساعات", status:"pending",       attachments:2, match:"review", submittedBy:"خالد العتيبي" },
  { id:"O-2399", branch:"فرع الملقا",   brandName:"بيتزا التاج",      module:"purchases", moduleLabel:"مشتريات",   amount:8200,  timeAgo:"قبل 5 ساعات", status:"pending",       attachments:4, match:"diff",   submittedBy:"أحمد الحربي", diff:"فرق في الكمية 5كجم" },
  { id:"O-2398", branch:"فرع الكورنيش",  brandName:"بيتزا التاج",     module:"sales",     moduleLabel:"مبيعات",    amount:45230, timeAgo:"قبل 6 ساعات", status:"pending",       attachments:3, match:"exact",  submittedBy:"عبدالله الدوسري" },
  { id:"O-2397", branch:"فرع الورود",   brandName:"مطعم التاج الراقي", module:"expenses",  moduleLabel:"مصروفات",   amount:3800,  timeAgo:"أمس",          status:"pending",       attachments:1, match:"review", submittedBy:"منى الزهراني" },
  { id:"O-2396", branch:"فرع النزهة",   brandName:"برغر التاج",       module:"inventory", moduleLabel:"مخزون",     amount:6100,  timeAgo:"أمس",          status:"pending",       attachments:2, match:"exact",  submittedBy:"سامي الغامدي" },
  { id:"O-2395", branch:"فرع الملك فهد",brandName:"مطعم التاج الراقي", module:"sales",     moduleLabel:"مبيعات",    amount:22100, timeAgo:"قبل يومين",    status:"approved",      attachments:3, match:"exact",  submittedBy:"وليد السبيعي" },
  { id:"O-2394", branch:"فرع العزيزية", brandName:"برغر التاج",       module:"purchases", moduleLabel:"مشتريات",   amount:5600,  timeAgo:"قبل يومين",    status:"approved",      attachments:2, match:"diff",   submittedBy:"نورة البقمي", diff:"فرق السعر 120 ر.س" },
  { id:"O-2393", branch:"فرع الدانة",   brandName:"بيتزا التاج",      module:"shifts",    moduleLabel:"شفتات",     amount:2800,  timeAgo:"قبل 3 أيام",  status:"final-approved", attachments:1, match:"review", submittedBy:"سعد الرشيد" },
  { id:"O-2392", branch:"فرع المعابدة", brandName:"مطعم التاج الراقي", module:"sales",     moduleLabel:"مبيعات",    amount:31800, timeAgo:"قبل 4 أيام",  status:"final-approved", attachments:3, match:"exact",  submittedBy:"ريم السهلي" },
  { id:"O-2391", branch:"فرع المحطة",   brandName:"مطعم التاج الراقي", module:"expenses",  moduleLabel:"مصروفات",   amount:1250,  timeAgo:"قبل 5 أيام",  status:"rejected",      attachments:2, match:"diff",   submittedBy:"سلطان العمري", diff:"فاتورة مفقودة" },
];

type CRole = "company-admin"|"head"|"accountant"|"branch"|"procurement";

// ═══════════════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════════════
type NavEntry = { section:string }|{ id:string; label:string; icon:ReactNode; badge?:number };
const isSection = (e:NavEntry): e is {section:string} => "section" in e;

const NAV:Record<CRole, NavEntry[]> = {
  "company-admin":[
    { section:"لوحة التحكم" },
    { id:"ca-dashboard",    label:"الرئيسية",           icon:<LayoutDashboard size={16}/> },
    { id:"ca-subscription", label:"الاشتراك والخطة",    icon:<CreditCard size={16}/>      },
    { id:"ca-users",        label:"إدارة المستخدمين",   icon:<Users size={16}/>           },
    { id:"ca-branches",     label:"العلامات والفروع",   icon:<Building2 size={16}/>       },
    { id:"ca-modules",      label:"الوحدات النشطة",     icon:<Package size={16}/>         },
    { section:"المالية" },
    { id:"ca-billing",      label:"الفواتير والمدفوعات",icon:<Wallet size={16}/>          },
    { section:"الإعدادات" },
    { id:"ca-settings",     label:"إعدادات الشركة",     icon:<Settings size={16}/>        },
    { id:"ca-support",      label:"الدعم الفني",        icon:<Bell size={16}/>            },
  ],
  head:[
    { section:"الرئيسية" },
    { id:"head-dashboard",   label:"لوحة التحكم",        icon:<LayoutDashboard size={16}/> },
    { id:"head-pending",     label:"العمليات المعلقة",   icon:<Clock size={16}/>, badge:6   },
    { id:"head-approved",    label:"المعتمدة نهائياً",   icon:<CheckCircle2 size={16}/>    },
    { id:"head-brands",      label:"أداء العلامات",      icon:<BarChart3 size={16}/>       },
    { section:"الفريق" },
    { id:"head-accountants", label:"فريق المحاسبين",     icon:<Users size={16}/>           },
    { section:"التقارير" },
    { id:"head-reports",     label:"التقارير المالية",   icon:<FileText size={16}/>        },
  ],
  accountant:[
    { section:"الرئيسية" },
    { id:"acc-dashboard",  label:"لوحة التحكم",          icon:<LayoutDashboard size={16}/> },
    { section:"الوحدات" },
    { id:"acc-sales",      label:"المبيعات",              icon:<TrendingUp size={16}/>      },
    { id:"acc-expenses",   label:"المصروفات",             icon:<Wallet size={16}/>          },
    { id:"acc-purchases",  label:"المشتريات",             icon:<ShoppingCart size={16}/>    },
    { id:"acc-inventory",  label:"المخزون",               icon:<Package size={16}/>         },
    { id:"acc-assets",     label:"الأصول الثابتة",       icon:<Building2 size={16}/>       },
    { id:"acc-shifts",     label:"الشفتات",               icon:<Clock size={16}/>           },
    { section:"الأدوات" },
    { id:"acc-reminders",  label:"التذكيرات",             icon:<Bell size={16}/>, badge:2   },
  ],
  branch:[
    { section:"فرع العليا — برغر التاج" },
    { id:"br-dashboard",  label:"لوحة الفرع",            icon:<LayoutDashboard size={16}/> },
    { id:"br-daily",      label:"الرفع اليومي",          icon:<TrendingUp size={16}/>      },
    { id:"br-requests",   label:"طلبات الشراء",          icon:<ShoppingCart size={16}/>    },
    { id:"br-inventory",  label:"الجرد اليومي",          icon:<Package size={16}/>         },
    { id:"br-staff",      label:"الموظفون",               icon:<Users size={16}/>           },
    { id:"br-shifts",     label:"الشفتات",                icon:<Clock size={16}/>           },
  ],
  procurement:[
    { section:"الرئيسية" },
    { id:"pr-dashboard",  label:"لوحة المشتريات",        icon:<LayoutDashboard size={16}/> },
    { id:"pr-orders",     label:"أوامر الشراء",          icon:<ShoppingCart size={16}/>, badge:4 },
    { id:"pr-suppliers",  label:"الموردون",               icon:<Building2 size={16}/>       },
    { id:"pr-items",      label:"الأصناف والأسعار",      icon:<Package size={16}/>         },
    { section:"التقارير" },
    { id:"pr-reports",    label:"تقارير المشتريات",      icon:<BarChart3 size={16}/>       },
  ],
};

const ROLE_META:Record<CRole,{ label:string; icon:string; color:string; desc:string }> = {
  "company-admin":{ label:"أدمن الشركة",    icon:"🏢", color:"bg-purple-600", desc:"إدارة الاشتراك والمستخدمين" },
  head:           { label:"رئيس الحسابات", icon:"👑", color:"bg-blue-600",   desc:"الإشراف والاعتماد النهائي" },
  accountant:     { label:"محاسب",          icon:"📊", color:"bg-cyan-600",   desc:"مراجعة العمليات المالية" },
  branch:         { label:"مدير فرع",       icon:"🏪", color:"bg-emerald-600",desc:"رفع بيانات الفرع اليومية" },
  procurement:    { label:"مدير مشتريات",  icon:"🛒", color:"bg-amber-600",  desc:"أوامر الشراء والموردون" },
};

const DEFAULT_PAGE:Record<CRole,string> = {
  "company-admin":"ca-dashboard", head:"head-dashboard",
  accountant:"acc-dashboard",     branch:"br-dashboard", procurement:"pr-dashboard",
};

// ═══════════════════════════════════════════════════
// LOGIN SCREEN
// ═══════════════════════════════════════════════════
function CompanyLoginScreen({ onSelect }:{ onSelect:(r:CRole)=>void }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6" dir="rtl"
      style={{ background:"linear-gradient(135deg,#0F1C35 0%,#1B3A6B 60%,#2D1B69 100%)" }}>
      <div className="w-full max-w-2xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-4"
            style={{ background:"linear-gradient(135deg,#7C3AED,#00D9FF)" }}>
            <span className="text-3xl">👑</span>
          </div>
          <h1 className="text-3xl font-black text-white">بوابة الشركات</h1>
          <p className="text-blue-300 mt-2 text-sm">مدعوم بنظام <span className="text-cyan-400 font-bold">عصب</span> — مخصص لمجموعات المطاعم</p>
          <div className="mt-3 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20">
            <span className="text-white/70 text-xs">{COMPANY.name}</span>
            <span className="text-cyan-400 text-xs font-bold">● متصل</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-6">
          {(Object.entries(ROLE_META) as [CRole, typeof ROLE_META[CRole]][]).map(([id,meta])=>(
            <button key={id} onClick={()=>onSelect(id)}
              className="relative bg-white/8 backdrop-blur-sm rounded-2xl p-5 text-right border border-white/15 hover:border-white/40 hover:bg-white/15 transition-all group">
              {id==="company-admin"&&<div className="absolute top-3 left-3"><Badge className="bg-purple-500/30 text-purple-300 border border-purple-400/40 text-[10px]">مميز</Badge></div>}
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-3 ${meta.color} shadow-lg`}>{meta.icon}</div>
              <p className="font-bold text-white text-base">{meta.label}</p>
              <p className="text-white/50 text-xs mt-1 leading-relaxed">{meta.desc}</p>
              <ChevronRight size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-hover:text-white/70"/>
            </button>
          ))}
        </div>
        <p className="text-center text-white/30 text-xs">نظام عصب · الإدارة المالية لمجموعات المطاعم · v2.1</p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// APP SHELL
// ═══════════════════════════════════════════════════
function Shell({ role, page, navigate, onLogout, children }:{
  role:CRole; page:string; navigate:(p:string)=>void; onLogout:()=>void; children:ReactNode;
}) {
  const meta = ROLE_META[role];
  const nav  = NAV[role];
  const pageLabel = nav.find(e=>"id" in e && (e as any).id===page) ? (nav.find(e=>"id" in e && (e as any).id===page) as any).label : "";
  return (
    <div className="flex h-screen overflow-hidden" dir="rtl">
      <div className="w-60 flex-shrink-0 flex flex-col" style={{ background:SIDEBAR_GRAD }}>
        <div className="px-4 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background:"linear-gradient(135deg,#7C3AED,#00D9FF)" }}>{COMPANY.logo}</div>
            <div className="min-w-0">
              <p className="text-white font-bold text-sm leading-tight truncate">{COMPANY.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-xs text-cyan-400 font-semibold">{COMPANY.plan}</span>
                <span className="w-1 h-1 rounded-full bg-emerald-400"/>
              </div>
            </div>
          </div>
        </div>
        <div className="px-4 py-3 border-b border-white/10">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10">
            <span className="text-base">{meta.icon}</span>
            <div><p className="text-white text-xs font-bold">{meta.label}</p><p className="text-white/40 text-[10px]">مجموعة التاج</p></div>
          </div>
        </div>
        <nav className="flex-1 px-3 py-3 overflow-y-auto">
          {nav.map((entry,i)=>{
            if(isSection(entry)) return <p key={i} className="text-[10px] font-bold text-white/30 uppercase tracking-widest px-2 mt-4 mb-1 first:mt-0">{entry.section}</p>;
            const item = entry as any;
            const active = page===item.id;
            return (
              <button key={item.id} onClick={()=>navigate(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all mb-0.5 ${active?"bg-white/15 text-white":"text-white/60 hover:bg-white/8 hover:text-white/90"}`}>
                <span className={active?"text-cyan-400":""}>{item.icon}</span>
                <span className="flex-1 text-right">{item.label}</span>
                {item.badge&&<span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{item.badge}</span>}
              </button>
            );
          })}
        </nav>
        <div className="p-3 border-t border-white/10">
          <button onClick={onLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-white/50 hover:text-white/80 hover:bg-white/8 transition-all text-sm">
            <LogOut size={14}/> تسجيل الخروج
          </button>
        </div>
      </div>
      <div className="flex-1 flex flex-col overflow-hidden" style={{ background:BG_CONTENT }}>
        <div className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="font-bold text-gray-800">{COMPANY.name}</span>
            <ChevronRight size={12} className="text-gray-300"/>
            <span>{pageLabel}</span>
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
function CADashboard({ navigate }:{ navigate:(p:string)=>void }) {
  const totalSalesM = ALL_BRANCHES.reduce((s,b)=>s+b.salesM,0);
  const totalExpM   = ALL_BRANCHES.reduce((s,b)=>s+b.expM,0);
  const totalNet    = totalSalesM - totalExpM;
  return (
    <div className="space-y-5" dir="rtl">
      <div className="flex items-start justify-between">
        <div><h2 className="text-xl font-bold text-gray-800">مرحباً، {COMPANY.name} 🏢</h2><p className="text-gray-400 text-sm mt-0.5">لوحة التحكم · خطة {COMPANY.plan} · 12 فرع · 3 علامات تجارية</p></div>
        <button onClick={()=>navigate("ca-subscription")} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-purple-600 text-white text-sm font-bold hover:bg-purple-700 shadow-sm"><CreditCard size={14}/> إدارة الاشتراك</button>
      </div>
      <div className="bg-gradient-to-l from-purple-600 to-blue-700 rounded-2xl p-5 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold text-lg">خطة Professional — نشطة ✅</p>
            <p className="text-white/70 text-sm mt-0.5">تنتهي في 15 يناير 2026 · متبقي <span className="text-cyan-300 font-bold">87</span> يوم</p>
            <div className="flex items-center gap-6 mt-3">
              {[["العلامات","3 / ∞"],["المطاعم","7 / ∞"],["الفروع","12 / 20"],["المستخدمون","31 / 50"]].map(([l,v])=>(
                <div key={l}><p className="text-white/50 text-xs">{l}</p><p className="font-bold">{v}</p></div>
              ))}
            </div>
          </div>
          <div className="text-left">
            <p className="text-3xl font-black">4,800 <span className="text-base font-normal text-white/60">ر.س/سنة</span></p>
            <button onClick={()=>navigate("ca-subscription")} className="mt-2 px-4 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs font-bold border border-white/30">ترقية الخطة ↑</button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <KpiCard label="إجمالي المبيعات الشهرية" value={`${fmt(Math.round(totalSalesM/1000))}K`} sub="ر.س هذا الشهر" icon={<TrendingUp size={18} className="text-emerald-600"/>} accent="emerald" delta="+8.2%"/>
        <KpiCard label="إجمالي المصروفات"         value={`${fmt(Math.round(totalExpM/1000))}K`}   sub="ر.س هذا الشهر" icon={<Wallet size={18} className="text-red-500"/>}      accent="red"    delta="-2.1%"/>
        <KpiCard label="صافي الربح"                value={`${fmt(Math.round(totalNet/1000))}K`}    sub="ر.س هذا الشهر" icon={<BarChart3 size={18} className="text-purple-600"/>} accent="purple" delta="+12.4%"/>
        <KpiCard label="معدل إنجاز الفروع"         value="83%"                                      sub="10 من 12 فرع فوق الهدف" icon={<CheckCircle2 size={18} className="text-blue-600"/>} accent="blue"/>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {BRANDS.map(b=>{
          const brs = b.restaurants.flatMap(r=>r.branches);
          const brandSales = brs.reduce((s,br)=>s+br.salesM,0);
          const brandTarget = brs.reduce((s,br)=>s+br.target,0);
          const pct = Math.round((brandSales/brandTarget)*100);
          return (
            <div key={b.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{background:b.color}}>{b.abbr}</div>
                <div><p className="font-bold text-gray-800 text-sm">{b.name}</p><p className="text-[10px] text-gray-400">{brs.length} فروع · {b.restaurants.length} مطاعم</p></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mb-1"><span>المبيعات vs الهدف</span><span>{pct}%</span></div>
              <div className="w-full h-2 bg-gray-100 rounded-full mb-2">
                <div className="h-2 rounded-full" style={{width:`${Math.min(100,pct)}%`,background:b.color}}/>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-gray-500">{fmt(brandSales)} ر.س</span>
                <span className="text-gray-400">هدف: {fmt(brandTarget)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CASubscription() {
  const [billing, setBilling] = useState<"annual"|"monthly">("annual");
  const plans = [
    { id:"basic",plan:"Basic",price_m:199,price_a:1990,maxBr:5,maxU:15,features:["5 فروع","15 مستخدم","4 وحدات","دعم بريد"],highlight:false,current:false },
    { id:"professional",plan:"Professional",price_m:400,price_a:4800,maxBr:20,maxU:50,features:["20 فرعاً","50 مستخدم","كل الوحدات","مدير حساب","تقارير متقدمة"],highlight:true,current:true },
    { id:"enterprise",plan:"Enterprise",price_m:null,price_a:null,maxBr:999,maxU:999,features:["فروع غير محدودة","مستخدمون غير محدودون","SLA 99.9%","API مفتوح","تكامل ERP"],highlight:false,current:false },
  ];
  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div><h2 className="text-xl font-bold text-gray-800">الاشتراك والخطة</h2><p className="text-gray-400 text-sm">إدارة خطة الاشتراك · ترقية · مقارنة</p></div>
        <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
          {(["annual","monthly"] as const).map(b=>(
            <button key={b} onClick={()=>setBilling(b)} className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${billing===b?"bg-white text-gray-800 shadow-sm":"text-gray-500"}`}>{b==="annual"?"سنوي (وفّر 17%)":"شهري"}</button>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-purple-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 bg-gradient-to-l from-purple-600 to-blue-700 text-white flex items-center justify-between">
          <div><div className="flex items-center gap-2"><span className="font-black text-xl">Professional</span><Badge className="bg-white/20 text-white text-[10px]">الخطة الحالية</Badge></div><p className="text-white/70 text-xs mt-0.5">تنتهي 15 يناير 2026 · سنوي</p></div>
          <div className="text-left"><p className="text-2xl font-black">{billing==="annual"?"4,800":"400"} <span className="text-sm font-normal text-white/60">ر.س/{billing==="annual"?"سنة":"شهر"}</span></p></div>
        </div>
        <div className="p-5 grid grid-cols-3 gap-4">
          {[["الفروع",12,20,"bg-blue-500"],["المستخدمون",31,50,"bg-purple-500"],["التخزين (GB)",2.4,10,"bg-emerald-500"]].map(([l,u,m,c])=>(
            <div key={String(l)}><div className="flex justify-between mb-1.5 text-xs font-semibold text-gray-600"><span>{l}</span><span>{u}/{m}</span></div><div className="w-full h-2 bg-gray-100 rounded-full"><div className={`h-2 rounded-full ${c}`} style={{width:`${Math.round((Number(u)/Number(m))*100)}%`}}/></div></div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {plans.map(p=>(
          <div key={p.id} className={`bg-white rounded-2xl border-2 shadow-sm overflow-hidden ${p.highlight?"border-purple-400 shadow-purple-100":"border-gray-100"}`}>
            {p.highlight&&<div className="px-4 py-1.5 text-center text-xs font-bold bg-purple-600 text-white">⭐ خطتك الحالية</div>}
            <div className="p-5">
              <p className="font-black text-gray-900 text-lg">{p.plan}</p>
              <div className="mt-2 mb-4">
                {p.price_m===null?<p className="text-2xl font-black text-gray-800">حسب الطلب</p>:<><span className="text-2xl font-black text-gray-800">{billing==="annual"?p.price_a!.toLocaleString():p.price_m.toLocaleString()}</span><span className="text-gray-400 text-sm"> ر.س/{billing==="annual"?"سنة":"شهر"}</span></>}
              </div>
              <ul className="space-y-1.5 mb-5">
                {p.features.map(f=><li key={f} className="flex items-center gap-2 text-xs text-gray-600"><Check size={11} className="text-emerald-500 flex-shrink-0"/>{f}</li>)}
              </ul>
              {p.current?<div className="w-full py-2 rounded-lg bg-purple-100 text-purple-700 text-xs font-bold text-center">خطتك الحالية ✓</div>:p.price_m===null?<button className="w-full py-2 rounded-lg border-2 border-purple-300 text-purple-700 text-xs font-bold hover:bg-purple-50">تواصل مع المبيعات</button>:<button onClick={()=>alert("✅ طلب الترقية تم إرساله")} className="w-full py-2 rounded-lg bg-purple-600 text-white text-xs font-bold hover:bg-purple-700">ترقية ↑</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CAUsers() {
  type U = { id:string;name:string;role:string;branch:string;email:string;status:"active"|"inactive";last:string };
  const [users,setUsers] = useState<U[]>([
    { id:"U1",name:"أحمد العمري",    role:"رئيس الحسابات", branch:"—",             email:"ahmed@altaj.com",status:"active",  last:"اليوم"      },
    { id:"U2",name:"سارة الشهري",   role:"محاسب",         branch:"برغر التاج",   email:"sara@altaj.com", status:"active",  last:"أمس"        },
    { id:"U3",name:"محمد الحربي",   role:"محاسب",         branch:"بيتزا التاج",  email:"m.ali@altaj.com",status:"active",  last:"أمس"        },
    { id:"U4",name:"فاطمة السالم",  role:"مدير فرع",      branch:"فرع العليا",   email:"f.s@altaj.com",  status:"active",  last:"اليوم"      },
    { id:"U5",name:"خالد العتيبي",  role:"مدير فرع",      branch:"فرع الحمراء",  email:"k.o@altaj.com",  status:"active",  last:"قبل 3 أيام" },
    { id:"U6",name:"نورة الزهراني", role:"مدير مشتريات",  branch:"—",             email:"n.z@altaj.com",  status:"active",  last:"اليوم"      },
    { id:"U7",name:"عبدالله الدوسري",role:"مدير فرع",     branch:"فرع الكورنيش", email:"a.d@altaj.com",  status:"inactive",last:"أسبوع"      },
  ]);
  const [showAdd,setShowAdd]=useState(false);
  const [search,setSearch]=useState("");
  const toggle=(id:string)=>setUsers(p=>p.map(u=>u.id===id?{...u,status:u.status==="active"?"inactive":"active"}:u));
  const shown=users.filter(u=>!search||u.name.includes(search)||u.role.includes(search));
  const RB:Record<string,string>={"رئيس الحسابات":"bg-blue-50 text-blue-700 border border-blue-100","محاسب":"bg-purple-50 text-purple-700 border border-purple-100","مدير فرع":"bg-emerald-50 text-emerald-700 border border-emerald-100","مدير مشتريات":"bg-amber-50 text-amber-700 border border-amber-100"};
  return (
    <div className="space-y-5" dir="rtl">
      <div className="flex items-center justify-between"><div><h2 className="text-xl font-bold text-gray-800">إدارة المستخدمين</h2><p className="text-gray-400 text-sm">{users.filter(u=>u.status==="active").length} نشط · {users.length}/50 من حد الخطة</p></div><Btn variant="primary" onClick={()=>setShowAdd(true)}><Plus size={13}/> إضافة مستخدم</Btn></div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2"><Search size={13} className="text-gray-400"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="بحث..." className="flex-1 text-sm outline-none"/></div>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {shown.map(u=>(
          <div key={u.id} className="px-5 py-4 flex items-center gap-4 border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">{u.name[0]}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap"><span className="font-semibold text-gray-800 text-sm">{u.name}</span><Badge className={`${RB[u.role]||"bg-gray-50 text-gray-600"} text-[10px]`}>{u.role}</Badge><span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${u.status==="active"?"bg-emerald-50 text-emerald-700":"bg-gray-100 text-gray-400"}`}>{u.status==="active"?"● نشط":"○ غير نشط"}</span></div>
              <div className="flex gap-3 mt-0.5"><p className="text-xs text-gray-400" dir="ltr">{u.email}</p>{u.branch!=="—"&&<span className="text-[10px] text-gray-500">{u.branch}</span>}<span className="text-[10px] text-gray-400">{u.last}</span></div>
            </div>
            <div className="flex gap-1.5">
              <button onClick={()=>toggle(u.id)} className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border ${u.status==="active"?"bg-gray-50 border-gray-200 text-gray-600 hover:bg-red-50 hover:text-red-600":"bg-emerald-50 border-emerald-200 text-emerald-700"}`}>{u.status==="active"?"تعليق":"تفعيل"}</button>
              <button className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"><Edit2 size={13}/></button>
            </div>
          </div>
        ))}
      </div>
      {showAdd&&(
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={()=>setShowAdd(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" onClick={e=>e.stopPropagation()} dir="rtl">
            <div className="px-5 py-4 bg-purple-600 text-white flex items-center justify-between"><h3 className="font-bold">إضافة مستخدم جديد</h3><button onClick={()=>setShowAdd(false)} className="text-purple-200 hover:text-white"><X size={18}/></button></div>
            <div className="p-5 space-y-3">
              {[["الاسم الكامل",""],["البريد الإلكتروني","email@company.sa"]].map(([l,ph])=><div key={l}><label className="text-xs font-semibold text-gray-600 block mb-1">{l}</label><input placeholder={ph} className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 outline-none"/></div>)}
              <div><label className="text-xs font-semibold text-gray-600 block mb-1">الدور</label><select className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 outline-none">{["رئيس الحسابات","محاسب","مدير فرع","مدير مشتريات"].map(r=><option key={r}>{r}</option>)}</select></div>
              <div className="flex gap-2 justify-end"><Btn onClick={()=>setShowAdd(false)}>إلغاء</Btn><Btn variant="primary" onClick={()=>{setShowAdd(false);alert("✅ تم إرسال دعوة التسجيل")}}><Send size={13}/> إرسال دعوة</Btn></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CABranches() {
  const [expandedBrand, setExpandedBrand] = useState<string>("B1");
  const totalSales = ALL_BRANCHES.reduce((s,b)=>s+b.salesM,0);
  return (
    <div className="space-y-5" dir="rtl">
      <div className="flex items-center justify-between"><div><h2 className="text-xl font-bold text-gray-800">العلامات التجارية والفروع</h2><p className="text-gray-400 text-sm">{BRANDS.length} علامات · {BRANDS.reduce((s,b)=>s+b.restaurants.length,0)} مطاعم · {ALL_BRANCHES.length} فرع</p></div><Btn variant="primary"><Plus size={13}/> إضافة فرع</Btn></div>
      <div className="grid grid-cols-4 gap-4">
        <KpiCard label="العلامات التجارية" value={String(BRANDS.length)} sub="تحت إدارة المجموعة" icon={<Star size={18} className="text-amber-600"/>} accent="amber"/>
        <KpiCard label="إجمالي المطاعم" value={String(BRANDS.reduce((s,b)=>s+b.restaurants.length,0))} sub="مطعم" icon={<Home size={18} className="text-blue-600"/>} accent="blue"/>
        <KpiCard label="الفروع النشطة" value={String(ALL_BRANCHES.length)} sub="فرع من 20 مسموح" icon={<Building2 size={18} className="text-emerald-600"/>} accent="emerald"/>
        <KpiCard label="إجمالي مبيعات شهرية" value={`${fmt(Math.round(totalSales/1000))}K`} sub="ر.س" icon={<TrendingUp size={18} className="text-purple-600"/>} accent="purple"/>
      </div>
      <div className="space-y-3">
        {BRANDS.map(brand=>(
          <div key={brand.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <button className="w-full px-5 py-4 flex items-center gap-4 hover:bg-gray-50/50" onClick={()=>setExpandedBrand(expandedBrand===brand.id?"":brand.id)}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold" style={{background:brand.color}}>{brand.abbr}</div>
              <div className="flex-1 text-right">
                <p className="font-bold text-gray-800">{brand.name}</p>
                <p className="text-xs text-gray-400">{brand.restaurants.length} مطاعم · {brand.restaurants.flatMap(r=>r.branches).length} فروع</p>
              </div>
              <div className="text-left"><p className="font-mono font-bold text-gray-800 text-sm">{fmt(brand.restaurants.flatMap(r=>r.branches).reduce((s,b)=>s+b.salesM,0))} ر.س</p><p className="text-[10px] text-gray-400">مبيعات شهرية</p></div>
              <ChevronDown size={14} className={`text-gray-400 transition-transform ${expandedBrand===brand.id?"rotate-180":""}`}/>
            </button>
            {expandedBrand===brand.id&&(
              <div className="border-t border-gray-100">
                {brand.restaurants.map(rest=>(
                  <div key={rest.id} className="px-5 py-3 border-b border-gray-50">
                    <p className="text-xs font-bold text-gray-500 mb-2">{rest.name}</p>
                    <div className="space-y-2">
                      {rest.branches.map(br=>{
                        const pct = Math.round((br.salesM/br.target)*100);
                        return (
                          <div key={br.id} className="flex items-center gap-4 px-3 py-2.5 bg-gray-50 rounded-lg">
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{background:brand.color}}>{br.city[0]}</div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-700 text-xs">{br.name}</p>
                              <p className="text-[10px] text-gray-400">م.الفرع: {br.mgr} · {br.city}</p>
                            </div>
                            <div className="w-28 flex-shrink-0">
                              <div className="flex justify-between text-[10px] text-gray-400 mb-1"><span>{pct}% من الهدف</span></div>
                              <div className="w-full h-1.5 bg-gray-200 rounded-full"><div className={`h-1.5 rounded-full ${pct>=100?"bg-emerald-500":pct>=80?"bg-blue-500":"bg-amber-500"}`} style={{width:`${Math.min(100,pct)}%`}}/></div>
                            </div>
                            <div className="text-left flex-shrink-0"><p className="font-mono font-bold text-gray-700 text-xs">{fmt(br.salesM)} ر.س</p></div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function CAModules() {
  type Mod = { id:string;name:string;desc:string;icon:string;active:boolean;inPlan:boolean };
  const [mods,setMods]=useState<Mod[]>([
    { id:"sales",    name:"المبيعات",       desc:"تتبع المبيعات اليومية لجميع الفروع",        icon:"💰",active:true, inPlan:true },
    { id:"expenses", name:"المصروفات",      desc:"إدارة المصروفات بموافقات متعددة المستويات", icon:"💸",active:true, inPlan:true },
    { id:"purchases",name:"المشتريات",      desc:"أوامر الشراء والموردون ومطابقة الفواتير",   icon:"🛒",active:true, inPlan:true },
    { id:"inventory",name:"المخزون",        desc:"الجرد اليومي ومستويات المخزون",             icon:"📦",active:true, inPlan:true },
    { id:"assets",   name:"الأصول الثابتة",desc:"تسجيل الأصول والاستهلاك وسجل العهدة",       icon:"🏢",active:true, inPlan:true },
    { id:"shifts",   name:"الشفتات",        desc:"جداول العمل وإغلاق الشفت",                  icon:"🕐",active:true, inPlan:true },
    { id:"waste",    name:"الهدر والتالف",  desc:"تتبع هدر الخامات والمسؤولية",               icon:"🗑",active:false,inPlan:true },
    { id:"emp",      name:"كشف الحساب",     desc:"رواتب وسلف الموظفين",                       icon:"👥",active:false,inPlan:false },
    { id:"cash",     name:"العهدة النقدية", desc:"إدارة الخزينة والعهدة اليومية",             icon:"💵",active:false,inPlan:false },
  ]);
  const toggle=(id:string)=>{const m=mods.find(x=>x.id===id);if(!m?.inPlan){alert("يحتاج ترقية الخطة");return;}setMods(p=>p.map(x=>x.id===id?{...x,active:!x.active}:x));};
  return (
    <div className="space-y-5" dir="rtl">
      <div><h2 className="text-xl font-bold text-gray-800">الوحدات النشطة</h2><p className="text-gray-400 text-sm">تفعيل وتعطيل الوحدات المالية</p></div>
      <div className="grid grid-cols-3 gap-4">
        <KpiCard label="مفعّلة" value={String(mods.filter(m=>m.active).length)} sub="وحدات نشطة" icon={<CheckCircle2 size={18} className="text-emerald-600"/>} accent="emerald"/>
        <KpiCard label="متاحة للتفعيل" value={String(mods.filter(m=>!m.active&&m.inPlan).length)} sub="ضمن خطتك" icon={<Zap size={18} className="text-amber-600"/>} accent="amber"/>
        <KpiCard label="تحتاج ترقية" value={String(mods.filter(m=>!m.inPlan).length)} sub="غير مشمولة" icon={<Lock size={18} className="text-gray-500"/>} accent="blue"/>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {mods.map(m=>(
          <div key={m.id} className={`px-5 py-4 flex items-center gap-4 border-b border-gray-50 last:border-0 ${!m.inPlan?"bg-gray-50/60":""}`}>
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-xl flex-shrink-0">{m.icon}</div>
            <div className="flex-1"><div className="flex items-center gap-2"><span className="font-semibold text-gray-800 text-sm">{m.name}</span>{!m.inPlan&&<Badge className="bg-amber-50 text-amber-700 border border-amber-100 text-[10px]"><Lock size={9}/> يحتاج ترقية</Badge>}</div><p className="text-xs text-gray-400 mt-0.5">{m.desc}</p></div>
            <button onClick={()=>toggle(m.id)} className={`w-12 h-6 rounded-full transition-all flex-shrink-0 relative ${m.active?"bg-purple-500":m.inPlan?"bg-gray-300":"bg-gray-200 cursor-not-allowed"}`}>
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${m.active?"right-0.5":"left-0.5"}`}/>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function CABilling() {
  const invoices=[{ id:"INV-2025-012",date:"01 يناير 2025",amount:4800 },{ id:"INV-2024-012",date:"01 يناير 2024",amount:3600 }];
  return (
    <div className="space-y-5" dir="rtl">
      <div><h2 className="text-xl font-bold text-gray-800">الفواتير والمدفوعات</h2><p className="text-gray-400 text-sm">سجل الفواتير · طريقة الدفع · التجديد</p></div>
      <div className="grid grid-cols-3 gap-4">
        <KpiCard label="إجمالي المدفوع" value={`${fmt(invoices.reduce((s,i)=>s+i.amount,0))}`} sub="ر.س منذ البداية" icon={<Wallet size={18} className="text-emerald-600"/>} accent="emerald"/>
        <KpiCard label="الفاتورة التالية" value="15 يناير 2026" sub="4,800 ر.س" icon={<CreditCard size={18} className="text-blue-600"/>} accent="blue"/>
        <KpiCard label="طريقة الدفع" value="بطاقة ائتمان" sub="**** 4521" icon={<Shield size={18} className="text-purple-600"/>} accent="purple"/>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50/60 flex items-center justify-between"><h3 className="font-bold text-gray-900 text-sm">سجل الفواتير</h3><button className="text-xs text-emerald-700 font-semibold"><Download size={11} className="inline mb-0.5"/> تصدير</button></div>
        {invoices.map(inv=>(
          <div key={inv.id} className="px-5 py-4 flex items-center gap-4 border-b border-gray-50 last:border-0">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0"><FileText size={16} className="text-emerald-600"/></div>
            <div className="flex-1"><p className="font-semibold text-gray-800 text-sm" dir="ltr">{inv.id}</p><p className="text-xs text-gray-400">{inv.date}</p></div>
            <span className="font-mono font-bold text-gray-800">{fmt(inv.amount)} ر.س</span>
            <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px]">✓ مدفوع</Badge>
            <button className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"><Download size={13}/></button>
          </div>
        ))}
      </div>
    </div>
  );
}

function CASettings() {
  const [saved,setSaved]=useState(false);
  const save=()=>{setSaved(true);setTimeout(()=>setSaved(false),2000);};
  return (
    <div className="space-y-5" dir="rtl">
      <div><h2 className="text-xl font-bold text-gray-800">إعدادات الشركة</h2><p className="text-gray-400 text-sm">بيانات الشركة والإعدادات العامة</p></div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h3 className="font-bold text-gray-800 text-sm border-b border-gray-100 pb-3">بيانات الشركة</h3>
        <div className="grid grid-cols-2 gap-4">
          {[["اسم المجموعة","مجموعة التاج للمطاعم"],["المدينة الرئيسية","الرياض"],["رقم السجل التجاري","1010XXXXXX"],["البريد الإلكتروني","info@altaj.com"]].map(([l,v])=>(
            <div key={l}><label className="text-xs font-semibold text-gray-600 block mb-1">{l}</label><input defaultValue={v} className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:border-purple-400"/></div>
          ))}
        </div>
        <div className="flex justify-end"><button onClick={save} className={`inline-flex items-center gap-1.5 px-5 py-2 rounded-lg font-bold text-sm transition-all ${saved?"bg-emerald-500 text-white":"bg-purple-600 text-white hover:bg-purple-700"}`}>{saved?<><Check size={14}/> تم الحفظ</>:<><CheckCircle2 size={14}/> حفظ</>}</button></div>
      </div>
    </div>
  );
}

function CASupport() {
  return (
    <div className="space-y-5" dir="rtl">
      <div><h2 className="text-xl font-bold text-gray-800">الدعم الفني</h2><p className="text-gray-400 text-sm">تواصل مع فريق عصب</p></div>
      <div className="grid grid-cols-3 gap-4">
        {[["💬","الدردشة الفورية","9 ص — 9 م","متاح الآن"],["📞","الاتصال","800 123 4567","أيام العمل"],["📧","البريد","support@asab.sa","خلال 24 ساعة"]].map(([ic,t,d,b])=>(
          <button key={t} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 text-right hover:border-purple-200 transition-all">
            <div className="text-3xl mb-3">{ic}</div><p className="font-bold text-gray-800 text-sm">{t}</p><p className="text-xs text-gray-400 mt-1">{d}</p><Badge className="mt-2 bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px]">{b}</Badge>
          </button>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h3 className="font-bold text-gray-800 text-sm mb-3">إرسال طلب دعم</h3>
        <div className="space-y-3">
          <select className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 outline-none"><option>نوع المشكلة...</option><option>مشكلة في الاشتراك</option><option>مشكلة تقنية</option><option>استفسار</option></select>
          <textarea rows={4} placeholder="اشرح المشكلة..." className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 outline-none resize-none"/>
          <Btn variant="primary"><Send size={13}/> إرسال</Btn>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// HEAD ACCOUNTANT PAGES
// ═══════════════════════════════════════════════════
function HeadDashboard({ navigate }:{ navigate:(p:string)=>void }) {
  const pending = INITIAL_OPS.filter(o=>o.status==="pending");
  const totalSalesM = ALL_BRANCHES.reduce((s,b)=>s+b.salesM,0);
  const totalExpM   = ALL_BRANCHES.reduce((s,b)=>s+b.expM,0);
  return (
    <div className="space-y-5" dir="rtl">
      <div className="flex items-start justify-between">
        <div><h2 className="text-xl font-bold text-gray-800">لوحة رئيس الحسابات</h2><p className="text-gray-400 text-sm">{COMPANY.name} · {ALL_BRANCHES.length} فرع · {BRANDS.length} علامات تجارية</p></div>
        <button onClick={()=>navigate("head-pending")} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 text-white text-sm font-bold hover:bg-amber-600 shadow-sm relative">
          <Clock size={14}/> العمليات المعلقة
          <span className="absolute -top-1.5 -left-1.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{pending.length}</span>
        </button>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <KpiCard label="إجمالي المبيعات" value={`${fmt(Math.round(totalSalesM/1000))}K`} sub="ر.س هذا الشهر" icon={<TrendingUp size={18} className="text-emerald-600"/>} accent="emerald" delta="+8.2%"/>
        <KpiCard label="إجمالي المصروفات" value={`${fmt(Math.round(totalExpM/1000))}K`} sub="ر.س هذا الشهر" icon={<Wallet size={18} className="text-red-500"/>} accent="red"/>
        <KpiCard label="صافي الربح" value={`${fmt(Math.round((totalSalesM-totalExpM)/1000))}K`} sub="ر.س" icon={<BarChart3 size={18} className="text-purple-600"/>} accent="purple" delta="+12.4%"/>
        <KpiCard label="تنتظر اعتمادي" value={String(pending.length)} sub="عملية معلقة" icon={<Clock size={18} className="text-amber-600"/>} accent="amber"/>
      </div>
      {/* Brand performance */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h3 className="font-bold text-gray-800 text-sm mb-4">أداء العلامات التجارية هذا الشهر</h3>
        <div className="space-y-4">
          {BRANDS.map(b=>{
            const brs = b.restaurants.flatMap(r=>r.branches);
            const sales = brs.reduce((s,br)=>s+br.salesM,0);
            const target = brs.reduce((s,br)=>s+br.target,0);
            const expenses = brs.reduce((s,br)=>s+br.expM,0);
            const pct = Math.round((sales/target)*100);
            return (
              <div key={b.id} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{background:b.color}}>{b.abbr}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1"><span className="text-xs font-semibold text-gray-700">{b.name}</span><span className="text-xs text-gray-500">{pct}% من الهدف</span></div>
                  <div className="w-full h-2 bg-gray-100 rounded-full"><div className="h-2 rounded-full" style={{width:`${Math.min(100,pct)}%`,background:b.color}}/></div>
                </div>
                <div className="text-left flex-shrink-0 w-32">
                  <p className="font-mono font-bold text-gray-800 text-xs">{fmt(sales)}</p>
                  <p className="text-[10px] text-gray-400">مصر: {fmt(expenses)}</p>
                </div>
                <div className="w-16 text-left flex-shrink-0">
                  <p className={`font-bold text-sm ${sales-expenses>0?"text-emerald-600":"text-red-500"}`}>{fmt(sales-expenses)}</p>
                  <p className="text-[10px] text-gray-400">صافي</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Pending list preview */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100 bg-amber-50/60 flex items-center justify-between">
          <h3 className="font-bold text-amber-800 text-sm">⏳ عمليات تنتظر اعتمادك ({pending.length})</h3>
          <button onClick={()=>navigate("head-pending")} className="text-xs text-purple-600 font-semibold hover:underline">عرض الكل</button>
        </div>
        {pending.slice(0,4).map(op=>(
          <div key={op.id} className="px-5 py-3.5 flex items-center gap-4 border-b border-gray-50 last:border-0">
            <div><p className="text-xs font-bold text-gray-500" dir="ltr">{op.id}</p></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800">{op.moduleLabel} — {op.branch}</p>
              <p className="text-xs text-gray-400">{op.brandName} · {op.submittedBy} · {op.timeAgo}</p>
            </div>
            <span className="font-mono font-bold text-gray-800 text-sm">{fmt(op.amount)} ر.س</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${op.match==="exact"?"bg-emerald-50 text-emerald-700 border-emerald-200":op.match==="review"?"bg-amber-50 text-amber-700 border-amber-200":"bg-red-50 text-red-700 border-red-200"}`}>{op.match==="exact"?"✓ مطابق":op.match==="review"?"مراجعة":"⚠ فرق"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function HeadPending() {
  const [ops, setOps] = useState(INITIAL_OPS.filter(o=>o.status==="pending"));
  const [selected, setSelected] = useState<string|null>(null);
  const [brandFilter, setBrandFilter] = useState("الكل");
  const approve = (id:string) => setOps(p=>p.filter(o=>o.id!==id));
  const reject  = (id:string) => setOps(p=>p.filter(o=>o.id!==id));
  const brands = ["الكل",...new Set(INITIAL_OPS.map(o=>o.brandName))];
  const shown = ops.filter(o=>brandFilter==="الكل"||o.brandName===brandFilter);
  return (
    <div className="space-y-5" dir="rtl">
      <div className="flex items-center justify-between"><div><h2 className="text-xl font-bold text-gray-800">العمليات المعلقة</h2><p className="text-gray-400 text-sm">{ops.length} عملية تنتظر الاعتماد النهائي</p></div>
        <div className="flex gap-2">
          <Btn variant="success" onClick={()=>setOps([])}>اعتماد الكل ({ops.length})</Btn>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
          {brands.map(b=><button key={b} onClick={()=>setBrandFilter(b)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${brandFilter===b?"bg-white text-gray-800 shadow-sm":"text-gray-500"}`}>{b}</button>)}
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {shown.length===0?<div className="p-10 text-center text-gray-400 text-sm">✅ لا توجد عمليات معلقة</div>:shown.map(op=>(
          <div key={op.id} className={`border-b border-gray-50 last:border-0 ${selected===op.id?"bg-purple-50/30":""}`}>
            <div className="px-5 py-4 flex items-center gap-4 cursor-pointer" onClick={()=>setSelected(selected===op.id?null:op.id)}>
              <div className="text-left flex-shrink-0"><p className="text-xs font-bold text-gray-400" dir="ltr">{op.id}</p></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-gray-800 text-sm">{op.moduleLabel} — {op.branch}</span>
                  <Badge className="bg-gray-100 text-gray-600 text-[10px]">{op.brandName}</Badge>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${op.match==="exact"?"bg-emerald-50 text-emerald-700 border-emerald-200":op.match==="review"?"bg-amber-50 text-amber-700 border-amber-200":"bg-red-50 text-red-700 border-red-200"}`}>{op.match==="exact"?"✓ مطابق":op.match==="review"?"مراجعة":"⚠ فرق"}</span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{op.submittedBy} · {op.timeAgo} · {op.attachments} مرفق</p>
                {op.diff&&<p className="text-xs text-red-600 mt-0.5">⚠ {op.diff}</p>}
              </div>
              <span className="font-mono font-bold text-gray-800">{fmt(op.amount)} ر.س</span>
              <ChevronDown size={14} className={`text-gray-400 transition-transform ${selected===op.id?"rotate-180":""}`}/>
            </div>
            {selected===op.id&&(
              <div className="px-5 pb-4 flex gap-2 border-t border-gray-50">
                <Btn variant="success" size="sm" onClick={()=>approve(op.id)}><ThumbsUp size={12}/> اعتماد نهائي</Btn>
                <Btn variant="danger" size="sm" onClick={()=>reject(op.id)}><ThumbsDown size={12}/> رفض</Btn>
                <Btn size="sm"><Eye size={12}/> عرض التفاصيل</Btn>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function HeadApproved() {
  const approved = INITIAL_OPS.filter(o=>o.status==="approved"||o.status==="final-approved");
  return (
    <div className="space-y-5" dir="rtl">
      <div><h2 className="text-xl font-bold text-gray-800">المعتمدة نهائياً</h2><p className="text-gray-400 text-sm">{approved.length} عملية معتمدة</p></div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {approved.map(op=>(
          <div key={op.id} className="px-5 py-4 flex items-center gap-4 border-b border-gray-50 last:border-0">
            <div className="text-left"><p className="text-xs font-bold text-gray-400" dir="ltr">{op.id}</p></div>
            <div className="flex-1"><p className="font-semibold text-gray-800 text-sm">{op.moduleLabel} — {op.branch}</p><p className="text-xs text-gray-400">{op.brandName} · {op.submittedBy} · {op.timeAgo}</p></div>
            <span className="font-mono font-bold text-gray-800">{fmt(op.amount)} ر.س</span>
            <Badge className={`text-[10px] ${op.status==="final-approved"?"bg-purple-50 text-purple-700 border border-purple-100":"bg-emerald-50 text-emerald-700 border border-emerald-100"}`}>{op.status==="final-approved"?"✅ معتمد نهائياً":"✓ معتمد"}</Badge>
          </div>
        ))}
      </div>
    </div>
  );
}

function HeadBrands() {
  return (
    <div className="space-y-5" dir="rtl">
      <div><h2 className="text-xl font-bold text-gray-800">أداء العلامات التجارية</h2><p className="text-gray-400 text-sm">مقارنة تفصيلية لجميع العلامات والمطاعم</p></div>
      {BRANDS.map(b=>{
        const allBrs = b.restaurants.flatMap(r=>r.branches);
        const totalS = allBrs.reduce((s,br)=>s+br.salesM,0);
        const totalE = allBrs.reduce((s,br)=>s+br.expM,0);
        const totalT = allBrs.reduce((s,br)=>s+br.target,0);
        return (
          <div key={b.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3" style={{borderRightWidth:4,borderRightColor:b.color}}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold" style={{background:b.color}}>{b.abbr}</div>
              <div className="flex-1"><p className="font-bold text-gray-800">{b.name}</p><p className="text-xs text-gray-400">{b.restaurants.length} مطاعم · {allBrs.length} فروع</p></div>
              <div className="grid grid-cols-3 gap-4 text-center">
                {[["المبيعات",fmt(totalS)+" ر.س"],["المصروفات",fmt(totalE)+" ر.س"],["الصافي",fmt(totalS-totalE)+" ر.س"]].map(([l,v])=><div key={l}><p className="text-[10px] text-gray-400">{l}</p><p className="font-bold text-gray-800 text-sm">{v}</p></div>)}
              </div>
            </div>
            <div className="divide-y divide-gray-50">
              {allBrs.map(br=>{
                const pct = Math.round((br.salesM/br.target)*100);
                return (
                  <div key={br.id} className="px-5 py-3 flex items-center gap-4">
                    <div className="flex-1"><p className="text-sm font-semibold text-gray-700">{br.name}</p><p className="text-[10px] text-gray-400">{br.mgr}</p></div>
                    <div className="w-32"><div className="flex justify-between text-[10px] text-gray-400 mb-1"><span>{pct}%</span><span>هدف: {fmt(br.target)}</span></div><div className="w-full h-1.5 bg-gray-100 rounded-full"><div className={`h-1.5 rounded-full ${pct>=100?"bg-emerald-500":pct>=80?"bg-blue-500":"bg-amber-500"}`} style={{width:`${Math.min(100,pct)}%`}}/></div></div>
                    <span className="font-mono font-bold text-gray-800 text-sm w-24 text-left">{fmt(br.salesM)} ر.س</span>
                    <span className="text-xs text-gray-400 w-20 text-left">م: {fmt(br.expM)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function HeadAccountants() {
  const accs = [
    { name:"سارة الشهري",  brand:"برغر التاج",       ops:47, pending:2, status:"active" },
    { name:"محمد الحربي",  brand:"بيتزا التاج",      ops:38, pending:1, status:"active" },
    { name:"هند القحطاني", brand:"مطعم التاج الراقي", ops:52, pending:3, status:"active" },
  ];
  return (
    <div className="space-y-5" dir="rtl">
      <div><h2 className="text-xl font-bold text-gray-800">فريق المحاسبين</h2><p className="text-gray-400 text-sm">{accs.length} محاسبين نشطين</p></div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {accs.map((a,i)=>(
          <div key={i} className="px-5 py-4 flex items-center gap-4 border-b border-gray-50 last:border-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white font-bold">{a.name[0]}</div>
            <div className="flex-1"><p className="font-semibold text-gray-800 text-sm">{a.name}</p><p className="text-xs text-gray-400">مسؤول: {a.brand}</p></div>
            <div className="flex items-center gap-4 text-center">
              <div><p className="font-bold text-gray-800">{a.ops}</p><p className="text-[10px] text-gray-400">عملية هذا الشهر</p></div>
              <div><p className={`font-bold ${a.pending>0?"text-amber-600":"text-emerald-600"}`}>{a.pending}</p><p className="text-[10px] text-gray-400">معلقة</p></div>
            </div>
            <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px]">● نشط</Badge>
          </div>
        ))}
      </div>
    </div>
  );
}

function HeadReports() {
  return (
    <div className="space-y-5" dir="rtl">
      <div><h2 className="text-xl font-bold text-gray-800">التقارير المالية</h2><p className="text-gray-400 text-sm">تقارير شاملة لجميع علامات وفروع المجموعة</p></div>
      <div className="grid grid-cols-2 gap-4">
        {[["📊 تقرير الأرباح والخسائر","P&L لكل علامة تجارية"],["📈 مقارنة الفروع","أداء كل فرع مقابل الهدف"],["💰 ملخص المبيعات","مبيعات شهرية وسنوية"],["📉 تحليل المصروفات","تفصيل مصروفات كل علامة"]].map(([t,d])=>(
          <button key={t} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 text-right hover:border-purple-200 hover:shadow-md transition-all">
            <p className="font-bold text-gray-800">{t}</p><p className="text-xs text-gray-400 mt-1">{d}</p>
            <div className="mt-3"><Btn size="sm"><Download size={11}/> تحميل PDF</Btn></div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// ACCOUNTANT PAGES
// ═══════════════════════════════════════════════════
function AccDashboard({ navigate }:{ navigate:(p:string)=>void }) {
  const myBranches = ALL_BRANCHES.filter(b=>b.brandName==="برغر التاج"||b.brandName==="بيتزا التاج");
  const myOps = INITIAL_OPS.filter(o=>o.status==="pending").slice(0,4);
  const todaySales = 18340 + 12500 + 8200;
  return (
    <div className="space-y-5" dir="rtl">
      <div><h2 className="text-xl font-bold text-gray-800">لوحة المحاسب</h2><p className="text-gray-400 text-sm">{COMPANY.name} · مسؤول عن {myBranches.length} فروع</p></div>
      <div className="grid grid-cols-4 gap-4">
        <KpiCard label="مبيعات اليوم" value={fmt(todaySales)} sub="ر.س من 4 فروع" icon={<TrendingUp size={18} className="text-emerald-600"/>} accent="emerald"/>
        <KpiCard label="عمليات معلقة" value={String(myOps.length)} sub="تنتظر مراجعتي" icon={<Clock size={18} className="text-amber-600"/>} accent="amber"/>
        <KpiCard label="مكتملة اليوم" value="12" sub="عملية مكتملة" icon={<CheckCircle2 size={18} className="text-purple-600"/>} accent="purple"/>
        <KpiCard label="فروعي النشطة" value={String(myBranches.length)} sub="فرع مخصص لي" icon={<Building2 size={18} className="text-blue-600"/>} accent="blue"/>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-bold text-gray-800 text-sm mb-3">فروعي اليوم</h3>
          <div className="space-y-2">
            {myBranches.slice(0,4).map(br=>(
              <div key={br.id} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                <div><p className="text-sm font-semibold text-gray-700">{br.name}</p><p className="text-[10px] text-gray-400">{br.brandName}</p></div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-gray-700">{fmt(br.salesM)} ر.س</span>
                  <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px]">مرفوع</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-bold text-gray-800 text-sm mb-3">⏳ عمليات تنتظر المراجعة</h3>
          <div className="space-y-2">
            {myOps.map(op=>(
              <div key={op.id} className="flex items-center gap-2 py-1.5 border-b border-gray-50 last:border-0">
                <div className="flex-1"><p className="text-xs font-semibold text-gray-700">{op.moduleLabel} — {op.branch}</p><p className="text-[10px] text-gray-400">{op.timeAgo}</p></div>
                <span className="font-mono text-xs font-bold text-gray-700">{fmt(op.amount)}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${op.match==="exact"?"bg-emerald-50 text-emerald-700":op.match==="review"?"bg-amber-50 text-amber-700":"bg-red-50 text-red-700"}`}>{op.match==="exact"?"✓":op.match==="review"?"مراجعة":"⚠"}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AccOpsPage({ module, label }:{ module:ModKey; label:string }) {
  const [statusFilter, setStatusFilter] = useState<"all"|"pending"|"approved"|"rejected">("all");
  const [brandFilter, setBrandFilter] = useState("الكل");
  const ops = INITIAL_OPS.filter(o=>o.module===module||(module==="sales"&&true));
  const allMods = INITIAL_OPS;
  const brands = ["الكل",...new Set(allMods.map(o=>o.brandName))];
  const shown = allMods.filter(o=>(brandFilter==="الكل"||o.brandName===brandFilter)&&(statusFilter==="all"||o.status===statusFilter));
  const SC:Record<string,string>={pending:"bg-amber-50 text-amber-700 border border-amber-200",approved:"bg-emerald-50 text-emerald-700 border border-emerald-100","final-approved":"bg-purple-50 text-purple-700 border border-purple-100",rejected:"bg-red-50 text-red-700 border border-red-200"};
  const SL:Record<string,string>={pending:"معلق",approved:"معتمد",rejected:"مرفوض","final-approved":"معتمد نهائياً"};
  const total = shown.filter(o=>["pending","approved","final-approved"].includes(o.status)).reduce((s,o)=>s+o.amount,0);
  return (
    <div className="space-y-5" dir="rtl">
      <div className="flex items-start justify-between">
        <div><h2 className="text-xl font-bold text-gray-800">{label}</h2><p className="text-gray-400 text-sm">{shown.length} عملية · إجمالي {fmt(total)} ر.س</p></div>
        <Btn variant="primary"><Plus size={13}/> عملية جديدة</Btn>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-3">
        <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
          {(["all","pending","approved","rejected"] as const).map(s=><button key={s} onClick={()=>setStatusFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${statusFilter===s?"bg-white text-gray-800 shadow-sm":"text-gray-500"}`}>{s==="all"?"الكل":SL[s]}</button>)}
        </div>
        <div className="flex gap-1 flex-wrap">
          {brands.map(b=><button key={b} onClick={()=>setBrandFilter(b)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${brandFilter===b?"bg-purple-600 text-white border-purple-600":"bg-white text-gray-600 border-gray-200 hover:border-purple-300"}`}>{b}</button>)}
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 bg-gray-50/60 flex items-center justify-between">
          <h3 className="font-bold text-gray-900 text-sm">{shown.length} عملية</h3>
          <p className="font-mono text-sm font-bold text-gray-700">الإجمالي: {fmt(total)} ر.س</p>
        </div>
        {shown.map(op=>(
          <div key={op.id} className="px-5 py-4 flex items-center gap-4 border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
            <div className="flex-shrink-0"><p className="text-xs font-bold text-gray-400" dir="ltr">{op.id}</p></div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap"><span className="font-semibold text-gray-800 text-sm">{op.moduleLabel} — {op.branch}</span><Badge className="bg-gray-100 text-gray-600 text-[10px]">{op.brandName}</Badge></div>
              <div className="flex items-center gap-3 mt-0.5"><span className="text-xs text-gray-400">{op.submittedBy}</span><span className="text-xs text-gray-400">{op.timeAgo}</span><span className="text-xs text-gray-400">{op.attachments} مرفق</span></div>
              {op.diff&&<p className="text-xs text-red-600 mt-0.5">⚠ {op.diff}</p>}
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${op.match==="exact"?"bg-emerald-50 text-emerald-700 border-emerald-200":op.match==="review"?"bg-amber-50 text-amber-700 border-amber-200":"bg-red-50 text-red-700 border-red-200"}`}>{op.match==="exact"?"✓ مطابق":op.match==="review"?"مراجعة":"⚠ فرق"}</span>
            <span className="font-mono font-bold text-gray-800">{fmt(op.amount)} ر.س</span>
            <Badge className={`text-[10px] ${SC[op.status]}`}>{SL[op.status]}</Badge>
            <div className="flex gap-1">
              <button className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"><Eye size={13}/></button>
              <button className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"><Paperclip size={13}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AccAssets() {
  const assets=[
    { id:"A001",name:"ثلاجة صناعية 600L",branch:"فرع العليا",brand:"برغر التاج",   category:"معدات مطبخ",value:18000,dep:3600,date:"يناير 2023",mgr:"فاطمة السالم",    status:"active" },
    { id:"A002",name:"فرن بيتزا كهربائي",branch:"فرع الملقا",brand:"بيتزا التاج",  category:"معدات مطبخ",value:24000,dep:4800,date:"مارس 2023",  mgr:"أحمد الحربي",    status:"active" },
    { id:"A003",name:"كاميرات مراقبة (8)",branch:"فرع الحمراء",brand:"برغر التاج", category:"أجهزة",       value:8500, dep:1700,date:"يونيو 2023", mgr:"خالد العتيبي",   status:"active" },
    { id:"A004",name:"سيارة توصيل",        branch:"فرع الورود", brand:"مطعم التاج", category:"مركبات",       value:95000,dep:19000,date:"يناير 2024",mgr:"منى الزهراني",   status:"active" },
    { id:"A005",name:"طاولات وكراسي (20)", branch:"فرع الدانة", brand:"بيتزا التاج",category:"أثاث",        value:15000,dep:3000,date:"مارس 2022",  mgr:"سعد الرشيد",    status:"maintenance" },
  ];
  const statusCls:Record<string,string>={active:"bg-emerald-50 text-emerald-700 border-emerald-100",maintenance:"bg-amber-50 text-amber-700 border-amber-100"};
  const statusLabel:Record<string,string>={active:"نشط",maintenance:"صيانة"};
  return (
    <div className="space-y-5" dir="rtl">
      <div className="flex items-start justify-between">
        <div><h2 className="text-xl font-bold text-gray-800">الأصول الثابتة</h2><p className="text-gray-400 text-sm">{assets.length} أصل مسجل · جميع الفروع</p></div>
        <div className="flex gap-2"><Btn size="sm"><Upload size={12}/> استيراد Excel</Btn><Btn variant="primary"><Plus size={13}/> أصل جديد</Btn></div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <KpiCard label="إجمالي قيمة الأصول" value={`${fmt(assets.reduce((s,a)=>s+a.value,0))}`} sub="ر.س القيمة الدفترية" icon={<Building2 size={18} className="text-blue-600"/>} accent="blue"/>
        <KpiCard label="الاستهلاك السنوي" value={`${fmt(assets.reduce((s,a)=>s+a.dep,0))}`} sub="ر.س سنوياً" icon={<ArrowLeftRight size={18} className="text-amber-600"/>} accent="amber"/>
        <KpiCard label="أصول نشطة" value={String(assets.filter(a=>a.status==="active").length)} sub={`من أصل ${assets.length}`} icon={<CheckCircle2 size={18} className="text-emerald-600"/>} accent="emerald"/>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50/60 flex items-center gap-3">
          <Search size={13} className="text-gray-400"/>
          <input placeholder="بحث بالاسم أو الفرع..." className="flex-1 text-sm outline-none"/>
        </div>
        {assets.map(a=>(
          <div key={a.id} className="px-5 py-4 flex items-center gap-4 border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-xl flex-shrink-0">🏢</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap"><span className="font-semibold text-gray-800 text-sm">{a.name}</span><Badge className={`text-[10px] border ${statusCls[a.status]}`}>{statusLabel[a.status]}</Badge></div>
              <p className="text-xs text-gray-400 mt-0.5">{a.branch} · {a.brand} · {a.category} · مسؤول: {a.mgr}</p>
            </div>
            <div className="text-left"><p className="font-mono font-bold text-gray-800 text-sm">{fmt(a.value)} ر.س</p><p className="text-[10px] text-gray-400">استهلاك: {fmt(a.dep)}/سنة</p></div>
            <div className="flex gap-1"><button className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"><Edit2 size={13}/></button><button className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"><ArrowLeftRight size={13}/></button></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AccShifts() {
  const shifts=[
    { id:"SH001",branch:"فرع العليا",brand:"برغر التاج",    cashier:"أنس محمد",   shiftType:"صباحي",openAmt:500, closeAmt:4280, sales:18340, status:"closed",  date:"اليوم"      },
    { id:"SH002",branch:"فرع الحمراء",brand:"برغر التاج",   cashier:"ليلى سالم",  shiftType:"مسائي", openAmt:500, closeAmt:null, sales:null,  status:"open",    date:"اليوم"      },
    { id:"SH003",branch:"فرع الملقا", brand:"بيتزا التاج",  cashier:"راشد عمر",   shiftType:"صباحي",openAmt:500, closeAmt:3120, sales:12500, status:"closed",  date:"أمس"        },
    { id:"SH004",branch:"فرع الكورنيش",brand:"بيتزا التاج", cashier:"مها ناصر",   shiftType:"مسائي", openAmt:500, closeAmt:5670, sales:22100, status:"closed",  date:"أمس"        },
    { id:"SH005",branch:"فرع الورود", brand:"مطعم التاج",   cashier:"فالح جاسم",  shiftType:"صباحي",openAmt:500, closeAmt:null, sales:null,  status:"open",    date:"اليوم"      },
  ] as const;
  return (
    <div className="space-y-5" dir="rtl">
      <div className="flex items-center justify-between"><div><h2 className="text-xl font-bold text-gray-800">الشفتات</h2><p className="text-gray-400 text-sm">متابعة فتح وإغلاق الشفتات لجميع الفروع</p></div></div>
      <div className="grid grid-cols-3 gap-4">
        <KpiCard label="شفت مفتوح الآن" value={String(shifts.filter(s=>s.status==="open").length)} sub="فروع" icon={<Clock size={18} className="text-amber-600"/>} accent="amber"/>
        <KpiCard label="مغلقة اليوم" value={String(shifts.filter(s=>s.status==="closed"&&s.date==="اليوم").length)} sub="شفت مغلق" icon={<CheckCircle2 size={18} className="text-emerald-600"/>} accent="emerald"/>
        <KpiCard label="مبيعات اليوم" value={fmt(shifts.filter(s=>s.date==="اليوم"&&s.status==="closed").reduce((s,sh)=>s+(sh.sales||0),0))} sub="ر.س" icon={<Wallet size={18} className="text-purple-600"/>} accent="purple"/>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {shifts.map(s=>(
          <div key={s.id} className="px-5 py-4 flex items-center gap-4 border-b border-gray-50 last:border-0">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-xl flex-shrink-0">🕐</div>
            <div className="flex-1">
              <div className="flex items-center gap-2"><span className="font-semibold text-gray-800 text-sm">{s.branch}</span><Badge className="bg-gray-100 text-gray-600 text-[10px]">{s.brand}</Badge><Badge className="bg-blue-50 text-blue-700 border border-blue-100 text-[10px]">{s.shiftType}</Badge></div>
              <p className="text-xs text-gray-400 mt-0.5">كاشير: {s.cashier} · {s.date}</p>
            </div>
            <div className="text-left">
              {s.status==="closed"?<><p className="font-mono font-bold text-gray-800 text-sm">{fmt(s.sales||0)} ر.س</p><p className="text-[10px] text-gray-400">إغلاق: {fmt(s.closeAmt||0)}</p></>:<p className="text-amber-600 font-bold text-sm">جارٍ الآن...</p>}
            </div>
            <Badge className={`text-[10px] border ${s.status==="closed"?"bg-emerald-50 text-emerald-700 border-emerald-200":"bg-amber-50 text-amber-700 border-amber-200"}`}>{s.status==="closed"?"✓ مغلق":"● مفتوح"}</Badge>
          </div>
        ))}
      </div>
    </div>
  );
}

function AccReminders() {
  const reminders=[
    { title:"رفع مبيعات فرع الحمراء",  due:"اليوم 11 م",   priority:"high",    done:false },
    { title:"مطابقة فواتير المشتريات — برغر التاج", due:"غداً",    priority:"medium",  done:false },
    { title:"تقرير مخزون نهاية الشهر", due:"28 مارس",     priority:"low",     done:false },
    { title:"جرد الأصول — فرع الملقا", due:"30 مارس",     priority:"medium",  done:true  },
  ];
  const P:Record<string,string>={high:"bg-red-50 text-red-700 border border-red-200",medium:"bg-amber-50 text-amber-700 border border-amber-200",low:"bg-gray-100 text-gray-600"};
  return (
    <div className="space-y-5" dir="rtl">
      <div className="flex items-center justify-between"><div><h2 className="text-xl font-bold text-gray-800">التذكيرات</h2><p className="text-gray-400 text-sm">{reminders.filter(r=>!r.done).length} مهام تنتظر</p></div><Btn variant="primary"><Plus size={13}/> تذكير جديد</Btn></div>
      <div className="space-y-2">
        {reminders.map((r,i)=>(
          <div key={i} className={`bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-4 ${r.done?"opacity-60":""}`}>
            <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center cursor-pointer flex-shrink-0 ${r.done?"bg-emerald-500 border-emerald-500":"border-gray-300"}`}>{r.done&&<Check size={11} className="text-white"/>}</div>
            <div className="flex-1"><p className={`font-semibold text-sm ${r.done?"line-through text-gray-400":"text-gray-800"}`}>{r.title}</p><p className="text-xs text-gray-400 mt-0.5">المهلة: {r.due}</p></div>
            <Badge className={`text-[10px] ${P[r.priority]}`}>{r.priority==="high"?"عالية":r.priority==="medium"?"متوسطة":"منخفضة"}</Badge>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// BRANCH MANAGER PAGES
// ═══════════════════════════════════════════════════
const MY_BRANCH = { name:"فرع العليا", brand:"برغر التاج", city:"الرياض", target:130000, salesM:128000, expM:41000 };

function BranchDashboard() {
  const pct = Math.round((MY_BRANCH.salesM/MY_BRANCH.target)*100);
  const todaySales = 18340;
  return (
    <div className="space-y-5" dir="rtl">
      <div><h2 className="text-xl font-bold text-gray-800">لوحة فرع العليا</h2><p className="text-gray-400 text-sm">{MY_BRANCH.brand} · {MY_BRANCH.city}</p></div>
      <div className="bg-gradient-to-l from-emerald-600 to-teal-700 rounded-2xl p-5 text-white">
        <div className="flex items-center justify-between mb-3">
          <div><p className="font-black text-xl">إنجاز الشهر</p><p className="text-white/70 text-sm mt-0.5">الهدف الشهري: {fmt(MY_BRANCH.target)} ر.س</p></div>
          <div className="text-left"><p className="text-3xl font-black">{pct}%</p><p className="text-white/60 text-xs">من الهدف</p></div>
        </div>
        <div className="w-full h-3 bg-white/20 rounded-full"><div className="h-3 bg-white rounded-full" style={{width:`${Math.min(100,pct)}%`}}/></div>
        <div className="flex justify-between mt-2 text-xs text-white/60"><span>0</span><span>{fmt(MY_BRANCH.target)}</span></div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <KpiCard label="مبيعات اليوم" value={fmt(todaySales)} sub="ر.س" icon={<TrendingUp size={18} className="text-emerald-600"/>} accent="emerald" delta="+5.2%"/>
        <KpiCard label="مبيعات الشهر" value={`${fmt(Math.round(MY_BRANCH.salesM/1000))}K`} sub="ر.س" icon={<BarChart3 size={18} className="text-blue-600"/>} accent="blue"/>
        <KpiCard label="مصروفات الشهر" value={`${fmt(Math.round(MY_BRANCH.expM/1000))}K`} sub="ر.س" icon={<Wallet size={18} className="text-amber-600"/>} accent="amber"/>
        <KpiCard label="صافي الربح" value={`${fmt(Math.round((MY_BRANCH.salesM-MY_BRANCH.expM)/1000))}K`} sub="ر.س" icon={<CheckCircle2 size={18} className="text-purple-600"/>} accent="purple"/>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-bold text-gray-800 text-sm mb-3">📋 مهام اليوم</h3>
          <div className="space-y-2">
            {[["رفع مبيعات الشفت الصباحي","مكتمل","done"],["رفع مصروفات اليوم","مكتمل","done"],["جرد المخزون اليومي","معلق","pending"],["إغلاق شفت المساء","لاحقاً","later"]].map(([t,s,c])=>(
              <div key={t} className="flex items-center gap-2 py-1.5 border-b border-gray-50 last:border-0">
                <div className={`w-4 h-4 rounded-md flex items-center justify-center flex-shrink-0 ${c==="done"?"bg-emerald-500":"c"==="pending"?"bg-amber-400":"bg-gray-200"}`}>{c==="done"&&<Check size={9} className="text-white"/>}</div>
                <p className={`text-sm flex-1 ${c==="done"?"line-through text-gray-400":"text-gray-700"}`}>{t}</p>
                <Badge className={`text-[10px] ${c==="done"?"bg-emerald-50 text-emerald-700":c==="pending"?"bg-amber-50 text-amber-700":"bg-gray-100 text-gray-500"}`}>{s}</Badge>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-bold text-gray-800 text-sm mb-3">👥 طاقم اليوم</h3>
          <div className="space-y-2">
            {[["أنس محمد","كاشير","صباحي","نشط"],["ليلى سالم","كاشير","مسائي","قادم"],["فهد العمري","طاهٍ","صباحي","نشط"],["سارة الغامدي","خدمة","مسائي","نشط"]].map(([n,r,s,st])=>(
              <div key={n} className="flex items-center gap-2 py-1.5 border-b border-gray-50 last:border-0">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{n[0]}</div>
                <div className="flex-1"><p className="text-sm font-semibold text-gray-700">{n}</p><p className="text-[10px] text-gray-400">{r} · {s}</p></div>
                <Badge className={`text-[10px] ${st==="نشط"?"bg-emerald-50 text-emerald-700":"bg-gray-100 text-gray-500"}`}>{st}</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function BranchDaily() {
  const [salesAmt,setSalesAmt]=useState("");
  const [expAmt,setExpAmt]=useState("");
  const [submitted,setSubmitted]=useState(false);
  const submit=()=>{if(!salesAmt){alert("أدخل قيمة المبيعات");return;}setSubmitted(true);};
  if(submitted) return (
    <div className="flex flex-col items-center justify-center h-64 space-y-4 text-center" dir="rtl">
      <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center"><CheckCircle2 size={40} className="text-emerald-600"/></div>
      <h3 className="text-xl font-bold text-gray-800">تم رفع البيانات بنجاح!</h3>
      <p className="text-gray-500 text-sm">سيقوم المحاسب بمراجعة البيانات وإعادة الإبلاغ</p>
      <button onClick={()=>setSubmitted(false)} className="px-4 py-2 rounded-lg bg-purple-600 text-white text-sm font-bold hover:bg-purple-700">رفع جديد</button>
    </div>
  );
  return (
    <div className="space-y-5" dir="rtl">
      <div><h2 className="text-xl font-bold text-gray-800">الرفع اليومي</h2><p className="text-gray-400 text-sm">رفع بيانات {MY_BRANCH.name} ليوم {new Date().toLocaleDateString("ar-SA")}</p></div>
      <div className="grid grid-cols-2 gap-5">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
          <h3 className="font-bold text-gray-800">💰 المبيعات</h3>
          <div><label className="text-xs font-semibold text-gray-600 block mb-1">إجمالي المبيعات (ر.س) *</label><input type="number" value={salesAmt} onChange={e=>setSalesAmt(e.target.value)} placeholder="0.00" className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:border-emerald-400"/></div>
          <div><label className="text-xs font-semibold text-gray-600 block mb-1">الشفت</label><select className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 outline-none"><option>صباحي</option><option>مسائي</option><option>كامل اليوم</option></select></div>
          <div><label className="text-xs font-semibold text-gray-600 block mb-1">مرفق (صورة/PDF)</label><div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center cursor-pointer hover:border-purple-300"><Upload size={20} className="text-gray-400 mx-auto mb-1"/><p className="text-xs text-gray-400">رفع مرفق</p></div></div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
          <h3 className="font-bold text-gray-800">💸 المصروفات</h3>
          <div><label className="text-xs font-semibold text-gray-600 block mb-1">إجمالي المصروفات (ر.س)</label><input type="number" value={expAmt} onChange={e=>setExpAmt(e.target.value)} placeholder="0.00" className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:border-red-400"/></div>
          <div><label className="text-xs font-semibold text-gray-600 block mb-1">تفصيل المصروفات</label><textarea rows={3} placeholder="وصف مختصر للمصروفات..." className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 outline-none resize-none"/></div>
          <div><label className="text-xs font-semibold text-gray-600 block mb-1">الفاتورة</label><div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center cursor-pointer hover:border-red-300"><Paperclip size={20} className="text-gray-400 mx-auto mb-1"/><p className="text-xs text-gray-400">رفع الفاتورة</p></div></div>
        </div>
      </div>
      <button onClick={submit} className="w-full py-3 rounded-xl bg-purple-600 text-white font-bold text-base hover:bg-purple-700 shadow-sm transition-all"><Send size={16} className="inline ml-2 mb-0.5"/>رفع البيانات للمحاسب</button>
    </div>
  );
}

function BranchRequests() {
  const [requests,setRequests]=useState([
    { id:"R001",item:"زيت طهي 10 كجم",qty:20,unit:"كرتون",status:"approved",  date:"اليوم",    urgency:"عادي"   },
    { id:"R002",item:"خبز برجر",       qty:50,unit:"كيس",  status:"pending",   date:"اليوم",    urgency:"عاجل"   },
    { id:"R003",item:"لحم مفروم",      qty:30,unit:"كجم",  status:"pending",   date:"أمس",      urgency:"عادي"   },
    { id:"R004",item:"صلصة كاتشب",     qty:10,unit:"كرتون",status:"delivered", date:"أمس",      urgency:"عادي"   },
  ]);
  const [showAdd,setShowAdd]=useState(false);
  const SC:Record<string,string>={pending:"bg-amber-50 text-amber-700 border-amber-200",approved:"bg-blue-50 text-blue-700 border-blue-200",delivered:"bg-emerald-50 text-emerald-700 border-emerald-200"};
  const SL:Record<string,string>={pending:"معلق",approved:"معتمد",delivered:"تم التسليم"};
  return (
    <div className="space-y-5" dir="rtl">
      <div className="flex items-center justify-between"><div><h2 className="text-xl font-bold text-gray-800">طلبات الشراء</h2><p className="text-gray-400 text-sm">{requests.filter(r=>r.status==="pending").length} طلب معلق</p></div><Btn variant="primary" onClick={()=>setShowAdd(true)}><Plus size={13}/> طلب جديد</Btn></div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {requests.map(r=>(
          <div key={r.id} className="px-5 py-4 flex items-center gap-4 border-b border-gray-50 last:border-0">
            <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-lg flex-shrink-0">📦</div>
            <div className="flex-1"><p className="font-semibold text-gray-800 text-sm">{r.item}</p><p className="text-xs text-gray-400">{r.qty} {r.unit} · {r.date}</p></div>
            {r.urgency==="عاجل"&&<Badge className="bg-red-50 text-red-700 border border-red-200 text-[10px]">⚡ عاجل</Badge>}
            <Badge className={`text-[10px] border ${SC[r.status]}`}>{SL[r.status]}</Badge>
          </div>
        ))}
      </div>
      {showAdd&&(
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={()=>setShowAdd(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-5" onClick={e=>e.stopPropagation()} dir="rtl">
            <div className="flex items-center justify-between mb-4"><h3 className="font-bold text-gray-800">طلب شراء جديد</h3><button onClick={()=>setShowAdd(false)} className="text-gray-400 hover:text-gray-600"><X size={18}/></button></div>
            <div className="space-y-3">
              <div><label className="text-xs font-semibold text-gray-600 block mb-1">الصنف</label><input placeholder="اسم الصنف" className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 outline-none"/></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-semibold text-gray-600 block mb-1">الكمية</label><input type="number" placeholder="0" className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 outline-none"/></div>
                <div><label className="text-xs font-semibold text-gray-600 block mb-1">الوحدة</label><select className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 outline-none"><option>كجم</option><option>كرتون</option><option>قطعة</option><option>لتر</option></select></div>
              </div>
              <div><label className="text-xs font-semibold text-gray-600 block mb-1">الأولوية</label><select className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 outline-none"><option>عادي</option><option>عاجل</option></select></div>
              <div className="flex gap-2 justify-end"><Btn onClick={()=>setShowAdd(false)}>إلغاء</Btn><Btn variant="primary" onClick={()=>{setShowAdd(false);setRequests(p=>[...p,{id:`R${String(p.length+1).padStart(3,"0")}`,item:"صنف جديد",qty:0,unit:"كجم",status:"pending",date:"اليوم",urgency:"عادي"}]);}}><Send size={13}/> إرسال</Btn></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function BranchInventory() {
  const items=[
    { name:"دقيق أبيض",       qty:120, unit:"كجم",  min:50,  status:"ok"      },
    { name:"زيت طهي",         qty:18,  unit:"لتر",  min:20,  status:"low"     },
    { name:"لحم مفروم (مجمد)",qty:45,  unit:"كجم",  min:30,  status:"ok"      },
    { name:"خبز برجر",        qty:8,   unit:"كيس",  min:15,  status:"critical" },
    { name:"صلصة كاتشب",      qty:24,  unit:"عبوة", min:10,  status:"ok"      },
    { name:"جبن شيدر",        qty:12,  unit:"كجم",  min:8,   status:"ok"      },
  ];
  const SC:Record<string,string>={ok:"bg-emerald-50 text-emerald-700",low:"bg-amber-50 text-amber-700",critical:"bg-red-50 text-red-700"};
  return (
    <div className="space-y-5" dir="rtl">
      <div className="flex items-center justify-between"><div><h2 className="text-xl font-bold text-gray-800">الجرد اليومي</h2><p className="text-gray-400 text-sm">{MY_BRANCH.name} · {new Date().toLocaleDateString("ar-SA")}</p></div><Btn variant="primary"><Clipboard size={13}/> تسجيل جرد</Btn></div>
      <div className="grid grid-cols-3 gap-4">
        <KpiCard label="أصناف كافية" value={String(items.filter(i=>i.status==="ok").length)} sub="من إجمالي الأصناف" icon={<CheckCircle2 size={18} className="text-emerald-600"/>} accent="emerald"/>
        <KpiCard label="منخفض" value={String(items.filter(i=>i.status==="low").length)} sub="يحتاج طلب شراء" icon={<AlertTriangle size={18} className="text-amber-600"/>} accent="amber"/>
        <KpiCard label="حرج" value={String(items.filter(i=>i.status==="critical").length)} sub="طلب عاجل!" icon={<XCircle size={18} className="text-red-500"/>} accent="red"/>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {items.map(item=>(
          <div key={item.name} className="px-5 py-4 flex items-center gap-4 border-b border-gray-50 last:border-0">
            <div className="flex-1"><p className="font-semibold text-gray-800 text-sm">{item.name}</p><p className="text-xs text-gray-400">الحد الأدنى: {item.min} {item.unit}</p></div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-gray-800">{item.qty}</span><span className="text-gray-400 text-sm">{item.unit}</span>
            </div>
            <Badge className={`text-[10px] ${SC[item.status]}`}>{item.status==="ok"?"✓ كافٍ":item.status==="low"?"⚠ منخفض":"🔴 حرج"}</Badge>
          </div>
        ))}
      </div>
    </div>
  );
}

function BranchStaff() {
  const staff=[
    { name:"أنس محمد",   role:"كاشير",  shift:"صباحي", status:"present", phone:"+966 50 111 2222" },
    { name:"ليلى سالم",  role:"كاشير",  shift:"مسائي", status:"upcoming",phone:"+966 55 222 3333" },
    { name:"فهد العمري", role:"طاهٍ",   shift:"صباحي", status:"present", phone:"+966 53 333 4444" },
    { name:"سارة الغامدي",role:"خدمة",  shift:"مسائي", status:"upcoming",phone:"+966 56 444 5555" },
    { name:"عمر الحربي", role:"مساعد",  shift:"صباحي", status:"absent",  phone:"+966 58 555 6666" },
  ];
  return (
    <div className="space-y-5" dir="rtl">
      <div><h2 className="text-xl font-bold text-gray-800">طاقم الموظفين</h2><p className="text-gray-400 text-sm">{MY_BRANCH.name} · {staff.filter(s=>s.status==="present").length} حاضر اليوم</p></div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {staff.map(s=>(
          <div key={s.name} className="px-5 py-4 flex items-center gap-4 border-b border-gray-50 last:border-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold flex-shrink-0">{s.name[0]}</div>
            <div className="flex-1"><p className="font-semibold text-gray-800 text-sm">{s.name}</p><p className="text-xs text-gray-400">{s.role} · شفت {s.shift}</p></div>
            <span className="text-xs text-gray-400" dir="ltr">{s.phone}</span>
            <Badge className={`text-[10px] ${s.status==="present"?"bg-emerald-50 text-emerald-700 border border-emerald-100":s.status==="upcoming"?"bg-blue-50 text-blue-700 border border-blue-100":"bg-red-50 text-red-700 border border-red-200"}`}>{s.status==="present"?"● حاضر":s.status==="upcoming"?"قادم":"غائب"}</Badge>
          </div>
        ))}
      </div>
    </div>
  );
}

function BranchShifts() {
  return (
    <div className="space-y-5" dir="rtl">
      <div><h2 className="text-xl font-bold text-gray-800">شفتات الفرع</h2><p className="text-gray-400 text-sm">فتح وإغلاق شفتات {MY_BRANCH.name}</p></div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border-2 border-amber-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4"><div className="w-3 h-3 rounded-full bg-amber-400 animate-pulse"/><h3 className="font-bold text-amber-800">شفت مفتوح الآن</h3></div>
          <p className="text-gray-700 font-semibold">شفت مسائي — ليلى سالم</p>
          <p className="text-xs text-gray-400 mt-1">فتح: 4:00 م · مبلغ الصندوق: 500 ر.س</p>
          <div className="mt-4"><Btn variant="danger" onClick={()=>alert("✅ تم إغلاق الشفت والإرسال للمحاسب")}><X size={12}/> إغلاق الشفت</Btn></div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-bold text-gray-800 mb-4">فتح شفت جديد</h3>
          <div className="space-y-3">
            <div><label className="text-xs font-semibold text-gray-600 block mb-1">الكاشير</label><select className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 outline-none"><option>أنس محمد</option><option>ليلى سالم</option></select></div>
            <div><label className="text-xs font-semibold text-gray-600 block mb-1">مبلغ افتتاح الصندوق (ر.س)</label><input type="number" defaultValue="500" className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 outline-none"/></div>
            <Btn variant="success" onClick={()=>alert("✅ تم فتح الشفت")}><CheckCircle2 size={12}/> فتح شفت</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// PROCUREMENT PAGES
// ═══════════════════════════════════════════════════
function ProcDashboard({ navigate }:{ navigate:(p:string)=>void }) {
  const orders = [
    { id:"PO-001",supplier:"شركة المروج للتوريد",items:3,total:12400,status:"pending",   date:"اليوم"   },
    { id:"PO-002",supplier:"مؤسسة النخيل للأغذية",items:5,total:8200, status:"approved",  date:"أمس"     },
    { id:"PO-003",supplier:"شركة الخليج للمواد",  items:2,total:3600, status:"delivered", date:"أمس"     },
    { id:"PO-004",supplier:"مجموعة الوفاء",        items:8,total:22800,status:"pending",   date:"أسبوع"   },
  ];
  const totalPending = orders.filter(o=>o.status==="pending").reduce((s,o)=>s+o.total,0);
  return (
    <div className="space-y-5" dir="rtl">
      <div className="flex items-center justify-between"><div><h2 className="text-xl font-bold text-gray-800">لوحة المشتريات</h2><p className="text-gray-400 text-sm">{COMPANY.name} · جميع العلامات التجارية</p></div><button onClick={()=>navigate("pr-orders")} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 text-white text-sm font-bold hover:bg-amber-600"><Plus size={14}/> أمر شراء جديد</button></div>
      <div className="grid grid-cols-4 gap-4">
        <KpiCard label="أوامر معلقة" value={String(orders.filter(o=>o.status==="pending").length)} sub="تنتظر الاعتماد" icon={<Clock size={18} className="text-amber-600"/>} accent="amber"/>
        <KpiCard label="قيمة المعلقة" value={`${fmt(totalPending)}`} sub="ر.س" icon={<Wallet size={18} className="text-red-500"/>} accent="red"/>
        <KpiCard label="موردون نشطون" value="8" sub="مورد معتمد" icon={<Building2 size={18} className="text-blue-600"/>} accent="blue"/>
        <KpiCard label="مشتريات الشهر" value="187K" sub="ر.س إجمالي" icon={<ShoppingCart size={18} className="text-purple-600"/>} accent="purple"/>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50/60"><h3 className="font-bold text-gray-900 text-sm">أحدث أوامر الشراء</h3></div>
        {orders.map(o=>{
          const SC:Record<string,string>={pending:"bg-amber-50 text-amber-700 border-amber-200",approved:"bg-blue-50 text-blue-700 border-blue-200",delivered:"bg-emerald-50 text-emerald-700 border-emerald-200"};
          const SL:Record<string,string>={pending:"معلق",approved:"معتمد",delivered:"تم التسليم"};
          return (
            <div key={o.id} className="px-5 py-4 flex items-center gap-4 border-b border-gray-50 last:border-0">
              <div className="text-left flex-shrink-0"><p className="text-xs font-bold text-gray-400" dir="ltr">{o.id}</p></div>
              <div className="flex-1"><p className="font-semibold text-gray-800 text-sm">{o.supplier}</p><p className="text-xs text-gray-400">{o.items} أصناف · {o.date}</p></div>
              <span className="font-mono font-bold text-gray-800">{fmt(o.total)} ر.س</span>
              <Badge className={`text-[10px] border ${SC[o.status]}`}>{SL[o.status]}</Badge>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ProcOrders() {
  const [orders,setOrders]=useState([
    { id:"PO-001",supplier:"شركة المروج",       brand:"برغر التاج",       items:3,total:12400,status:"pending",   date:"اليوم",daysAgo:0 },
    { id:"PO-002",supplier:"مؤسسة النخيل",      brand:"بيتزا التاج",      items:5,total:8200, status:"approved",  date:"أمس",  daysAgo:1 },
    { id:"PO-003",supplier:"شركة الخليج",        brand:"مطعم التاج الراقي",items:2,total:3600, status:"delivered", date:"أمس",  daysAgo:1 },
    { id:"PO-004",supplier:"مجموعة الوفاء",      brand:"برغر التاج",       items:8,total:22800,status:"pending",   date:"أسبوع",daysAgo:7 },
    { id:"PO-005",supplier:"شركة المروج",        brand:"بيتزا التاج",      items:4,total:9100, status:"approved",  date:"أسبوع",daysAgo:5 },
  ]);
  const [showAdd,setShowAdd]=useState(false);
  const SC:Record<string,string>={pending:"bg-amber-50 text-amber-700 border-amber-200",approved:"bg-blue-50 text-blue-700 border-blue-200",delivered:"bg-emerald-50 text-emerald-700 border-emerald-200"};
  const SL:Record<string,string>={pending:"معلق",approved:"معتمد",delivered:"تم التسليم"};
  return (
    <div className="space-y-5" dir="rtl">
      <div className="flex items-center justify-between"><div><h2 className="text-xl font-bold text-gray-800">أوامر الشراء</h2><p className="text-gray-400 text-sm">{orders.length} أمر · {orders.filter(o=>o.status==="pending").length} معلق</p></div><Btn variant="primary" onClick={()=>setShowAdd(true)}><Plus size={13}/> أمر جديد</Btn></div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {orders.map(o=>(
          <div key={o.id} className="px-5 py-4 flex items-center gap-4 border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
            <div className="text-left flex-shrink-0 w-20"><p className="text-xs font-bold text-gray-400" dir="ltr">{o.id}</p><p className="text-[10px] text-gray-400">{o.date}</p></div>
            <div className="flex-1 min-w-0"><p className="font-semibold text-gray-800 text-sm">{o.supplier}</p><p className="text-xs text-gray-400">{o.brand} · {o.items} أصناف</p></div>
            <span className="font-mono font-bold text-gray-800">{fmt(o.total)} ر.س</span>
            <Badge className={`text-[10px] border ${SC[o.status]}`}>{SL[o.status]}</Badge>
            <div className="flex gap-1"><button className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"><Eye size={13}/></button><button className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"><Edit2 size={13}/></button></div>
          </div>
        ))}
      </div>
      {showAdd&&(
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={()=>setShowAdd(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-5" onClick={e=>e.stopPropagation()} dir="rtl">
            <div className="flex items-center justify-between mb-4"><h3 className="font-bold text-gray-800">أمر شراء جديد</h3><button onClick={()=>setShowAdd(false)} className="text-gray-400"><X size={18}/></button></div>
            <div className="space-y-3">
              <div><label className="text-xs font-semibold text-gray-600 block mb-1">المورد</label><select className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 outline-none"><option>شركة المروج</option><option>مؤسسة النخيل</option><option>شركة الخليج</option></select></div>
              <div><label className="text-xs font-semibold text-gray-600 block mb-1">العلامة التجارية</label><select className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 outline-none">{BRANDS.map(b=><option key={b.id}>{b.name}</option>)}</select></div>
              <div><label className="text-xs font-semibold text-gray-600 block mb-1">وصف الطلب</label><textarea rows={3} placeholder="اذكر الأصناف والكميات..." className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 outline-none resize-none"/></div>
              <div className="flex gap-2 justify-end"><Btn onClick={()=>setShowAdd(false)}>إلغاء</Btn><Btn variant="primary" onClick={()=>{setShowAdd(false);alert("✅ تم إنشاء أمر الشراء");}}><Send size={13}/> إنشاء</Btn></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProcSuppliers() {
  const suppliers=[
    { id:"S1",name:"شركة المروج للتوريد",    category:"مواد خام",       contact:"سليمان المروج",  phone:"+966 50 111 1111",rating:4.8,orders:24,totalSpent:187000,status:"active"   },
    { id:"S2",name:"مؤسسة النخيل للأغذية",   category:"خضروات وفاكهة",  contact:"منى النخيل",     phone:"+966 55 222 2222",rating:4.5,orders:18,totalSpent:92000, status:"active"   },
    { id:"S3",name:"شركة الخليج للمواد",      category:"بهارات وتوابل",  contact:"كريم الخليج",    phone:"+966 53 333 3333",rating:4.2,orders:31,totalSpent:45000, status:"active"   },
    { id:"S4",name:"مجموعة الوفاء",           category:"مشروبات وعصائر", contact:"ناصر الوفاء",    phone:"+966 56 444 4444",rating:3.9,orders:12,totalSpent:68000, status:"active"   },
    { id:"S5",name:"شركة الأمانة للتغليف",   category:"تغليف وعبوات",   contact:"هدى الأمانة",    phone:"+966 58 555 5555",rating:4.6,orders:8, totalSpent:22000, status:"inactive" },
  ];
  return (
    <div className="space-y-5" dir="rtl">
      <div className="flex items-center justify-between"><div><h2 className="text-xl font-bold text-gray-800">الموردون</h2><p className="text-gray-400 text-sm">{suppliers.filter(s=>s.status==="active").length} مورد نشط</p></div><Btn variant="primary"><Plus size={13}/> إضافة مورد</Btn></div>
      <div className="grid grid-cols-3 gap-4">
        <KpiCard label="موردون نشطون" value={String(suppliers.filter(s=>s.status==="active").length)} sub="مورد معتمد" icon={<Building2 size={18} className="text-blue-600"/>} accent="blue"/>
        <KpiCard label="إجمالي المشتريات" value={`${fmt(Math.round(suppliers.reduce((s,x)=>s+x.totalSpent,0)/1000))}K`} sub="ر.س منذ البداية" icon={<Wallet size={18} className="text-purple-600"/>} accent="purple"/>
        <KpiCard label="متوسط التقييم" value="4.4" sub="من 5 نجوم" icon={<Star size={18} className="text-amber-600"/>} accent="amber"/>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {suppliers.map(s=>(
          <div key={s.id} className="px-5 py-4 flex items-center gap-4 border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">{s.name[0]}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2"><span className="font-bold text-gray-800 text-sm">{s.name}</span><Badge className="bg-gray-100 text-gray-600 text-[10px]">{s.category}</Badge></div>
              <div className="flex items-center gap-3 mt-0.5"><span className="text-xs text-gray-400">{s.contact}</span><span className="text-xs text-gray-400" dir="ltr">{s.phone}</span></div>
            </div>
            <div className="text-left flex-shrink-0">
              <div className="flex items-center gap-0.5">{[1,2,3,4,5].map(i=><span key={i} className={`text-sm ${i<=Math.floor(s.rating)?"text-amber-400":"text-gray-200"}`}>★</span>)}<span className="text-xs text-gray-500 mr-1">{s.rating}</span></div>
              <p className="text-[10px] text-gray-400">{s.orders} طلب · {fmt(s.totalSpent)} ر.س</p>
            </div>
            <Badge className={`text-[10px] ${s.status==="active"?"bg-emerald-50 text-emerald-700 border border-emerald-100":"bg-gray-100 text-gray-500"}`}>{s.status==="active"?"● نشط":"○ موقوف"}</Badge>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProcItems() {
  const items=[
    { name:"لحم بقري مفروم",   unit:"كجم",  lastPrice:42,  brand:"برغر التاج",       suppliers:2 },
    { name:"دقيق أبيض",        unit:"كيس",  lastPrice:18,  brand:"بيتزا التاج",      suppliers:3 },
    { name:"زيت طهي 10L",     unit:"عبوة", lastPrice:85,  brand:"جميع العلامات",    suppliers:2 },
    { name:"جبن موزاريلا",    unit:"كجم",  lastPrice:38,  brand:"بيتزا التاج",      suppliers:1 },
    { name:"خبز برجر 12 حبة", unit:"كيس",  lastPrice:12,  brand:"برغر التاج",       suppliers:2 },
  ];
  return (
    <div className="space-y-5" dir="rtl">
      <div className="flex items-center justify-between"><div><h2 className="text-xl font-bold text-gray-800">الأصناف والأسعار</h2><p className="text-gray-400 text-sm">{items.length} صنف مسجل</p></div><Btn variant="primary"><Plus size={13}/> صنف جديد</Btn></div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="grid grid-cols-5 gap-4 px-5 py-3 border-b border-gray-100 bg-gray-50 text-xs font-semibold text-gray-500">
          <span>الصنف</span><span>الوحدة</span><span>آخر سعر</span><span>العلامة</span><span>عدد الموردين</span>
        </div>
        {items.map(i=>(
          <div key={i.name} className="grid grid-cols-5 gap-4 px-5 py-4 border-b border-gray-50 last:border-0 items-center hover:bg-gray-50/50">
            <span className="font-semibold text-gray-800 text-sm">{i.name}</span>
            <span className="text-gray-500 text-sm">{i.unit}</span>
            <span className="font-mono font-bold text-gray-800 text-sm">{i.lastPrice} ر.س</span>
            <span className="text-xs text-gray-500">{i.brand}</span>
            <div className="flex items-center gap-1"><span className="font-bold text-purple-700">{i.suppliers}</span><span className="text-xs text-gray-400">مورد</span></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProcReports() {
  return (
    <div className="space-y-5" dir="rtl">
      <div><h2 className="text-xl font-bold text-gray-800">تقارير المشتريات</h2><p className="text-gray-400 text-sm">تحليل تفصيلي لمشتريات المجموعة</p></div>
      <div className="grid grid-cols-2 gap-4">
        {[["📊 تقرير المشتريات الشهري","إجمالي المشتريات مصنفة حسب المورد"],["📈 مقارنة الأسعار","متابعة تغيرات أسعار الموردين"],["🏭 أداء الموردين","تقييم والتزام المواعيد"],["🛒 أوامر الشراء المعلقة","ملخص الأوامر التي تحتاج اعتماد"]].map(([t,d])=>(
          <button key={t} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 text-right hover:border-amber-200 transition-all">
            <p className="font-bold text-gray-800">{t}</p><p className="text-xs text-gray-400 mt-1">{d}</p>
            <div className="mt-3"><Btn size="sm"><Download size={11}/> تحميل</Btn></div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// PAGE ROUTER
// ═══════════════════════════════════════════════════
function PageRouter({ role, page, navigate }:{ role:CRole; page:string; navigate:(p:string)=>void }) {
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
  if(role==="head") {
    if(page==="head-dashboard")   return <HeadDashboard navigate={navigate}/>;
    if(page==="head-pending")     return <HeadPending/>;
    if(page==="head-approved")    return <HeadApproved/>;
    if(page==="head-brands")      return <HeadBrands/>;
    if(page==="head-accountants") return <HeadAccountants/>;
    if(page==="head-reports")     return <HeadReports/>;
    return <HeadDashboard navigate={navigate}/>;
  }
  if(role==="accountant") {
    if(page==="acc-dashboard") return <AccDashboard navigate={navigate}/>;
    if(page==="acc-sales")     return <AccOpsPage module="sales"     label="المبيعات"/>;
    if(page==="acc-expenses")  return <AccOpsPage module="expenses"  label="المصروفات"/>;
    if(page==="acc-purchases") return <AccOpsPage module="purchases" label="المشتريات"/>;
    if(page==="acc-inventory") return <AccOpsPage module="inventory" label="المخزون"/>;
    if(page==="acc-assets")    return <AccAssets/>;
    if(page==="acc-shifts")    return <AccShifts/>;
    if(page==="acc-reminders") return <AccReminders/>;
    return <AccDashboard navigate={navigate}/>;
  }
  if(role==="branch") {
    if(page==="br-dashboard") return <BranchDashboard/>;
    if(page==="br-daily")     return <BranchDaily/>;
    if(page==="br-requests")  return <BranchRequests/>;
    if(page==="br-inventory") return <BranchInventory/>;
    if(page==="br-staff")     return <BranchStaff/>;
    if(page==="br-shifts")    return <BranchShifts/>;
    return <BranchDashboard/>;
  }
  if(role==="procurement") {
    if(page==="pr-dashboard") return <ProcDashboard navigate={navigate}/>;
    if(page==="pr-orders")    return <ProcOrders/>;
    if(page==="pr-suppliers") return <ProcSuppliers/>;
    if(page==="pr-items")     return <ProcItems/>;
    if(page==="pr-reports")   return <ProcReports/>;
    return <ProcDashboard navigate={navigate}/>;
  }
  return null;
}

// ═══════════════════════════════════════════════════
// ROOT
// ═══════════════════════════════════════════════════
export default function CompanyDashboard() {
  const [role, setRole] = useState<CRole|null>(null);
  const [page, setPage] = useState<string>("");
  const selectRole = (r:CRole) => { setRole(r); setPage(DEFAULT_PAGE[r]); };
  const navigate   = (p:string) => setPage(p);
  const logout     = () => { setRole(null); setPage(""); };
  if(!role) return <CompanyLoginScreen onSelect={selectRole}/>;
  return (
    <Shell role={role} page={page} navigate={navigate} onLogout={logout}>
      <PageRouter role={role} page={page} navigate={navigate}/>
    </Shell>
  );
}
