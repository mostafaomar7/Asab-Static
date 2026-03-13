import "./_group.css";
import { AppLayout } from "./_shared/AppLayout";
import { KPICard } from "./_shared/KPICard";
import { OperationRow } from "./_shared/OperationRow";
import {
  BarChart2, CheckCircle2, Clock, TrendingUp, Users, ChevronsRight,
  Star, ArrowUpRight, Search, Award
} from "lucide-react";

const accountants = [
  {
    name: "أحمد محمد",
    specialty: "مبيعات + مصروفات",
    reviewed: 250, approved: 230,
    avgTime: "4.5 دقيقة",
    rate: 92,
    performance: "ممتاز",
    performanceColor: "text-emerald-600 bg-emerald-50",
  },
  {
    name: "محمد عبدالله",
    specialty: "مشتريات + مخزون",
    reviewed: 230, approved: 200,
    avgTime: "5.2 دقيقة",
    rate: 87,
    performance: "جيد جداً",
    performanceColor: "text-blue-600 bg-blue-50",
  },
  {
    name: "فاطمة السيد",
    specialty: "كشف الموظفين",
    reviewed: 180, approved: 160,
    avgTime: "3.8 دقيقة",
    rate: 89,
    performance: "جيد جداً",
    performanceColor: "text-blue-600 bg-blue-50",
  },
  {
    name: "خالد الأحمدي",
    specialty: "العهد النقدية",
    reviewed: 140, approved: 112,
    avgTime: "6.1 دقيقة",
    rate: 80,
    performance: "جيد",
    performanceColor: "text-amber-600 bg-amber-50",
  },
  {
    name: "نورة الغامدي",
    specialty: "الأصول الثابتة",
    reviewed: 95, approved: 85,
    avgTime: "4.2 دقيقة",
    rate: 89,
    performance: "جيد جداً",
    performanceColor: "text-blue-600 bg-blue-50",
  },
];

const pendingOps = [
  { id: "OPS-2401", branch: "فرع الرياض - العليا", type: "مبيعات", amount: "45,230 ر.س", date: "14 أكتوبر", status: "approved" as const, reviewedBy: "أحمد محمد" },
  { id: "OPS-2398", branch: "فرع جدة - الحمراء", type: "مصروفات", amount: "12,500 ر.س", date: "14 أكتوبر", status: "approved" as const, reviewedBy: "محمد عبدالله" },
  { id: "OPS-2395", branch: "فرع مكة - المعابدة", type: "مشتريات", amount: "28,750 ر.س", date: "13 أكتوبر", status: "approved" as const, reviewedBy: "أحمد محمد" },
];

export function HeadAccountantDashboard() {
  return (
    <AppLayout role="head-accountant" userName="خالد أحمد" activeSection="dashboard" notificationsCount={8}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-gray-800 font-bold text-xl">لوحة رئيس الحسابات</h2>
            <p className="text-gray-400 text-sm mt-0.5">أكتوبر 2025 — 5 محاسبين تابعين · 100 فرع</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">
              <ChevronsRight size={15} />
              ترحيل جماعي إلى ERP
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-4 gap-4">
          <KPICard title="إجمالي العمليات الشهر" value="1,245" subtitle="من 5 محاسبين" icon={<BarChart2 size={22} className="text-purple-600" />} iconBg="bg-purple-50" trend="up" trendValue="+15%" />
          <KPICard title="معتمدة نهائياً" value="1,120" subtitle="90% معدل الاعتماد" icon={<CheckCircle2 size={22} className="text-emerald-600" />} iconBg="bg-emerald-50" status="success" />
          <KPICard title="تنتظر اعتمادي" value="125" subtitle="من 5 محاسبين" icon={<Clock size={22} className="text-amber-600" />} iconBg="bg-amber-50" status="warning" />
          <KPICard title="تم ترحيلها لـ ERP" value="980" subtitle="هذا الشهر" icon={<ChevronsRight size={22} className="text-blue-600" />} iconBg="bg-blue-50" trend="up" trendValue="+20%" />
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Accountants Performance */}
          <div className="col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="font-bold text-gray-800">أداء المحاسبين</h3>
              <button className="text-xs text-purple-600 hover:underline flex items-center gap-1">
                تقرير تفصيلي <ArrowUpRight size={12} />
              </button>
            </div>
            <div className="p-4 space-y-3">
              {accountants.map((acc, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-cyan-400 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-bold">{acc.name[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-800 text-sm">{acc.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${acc.performanceColor}`}>
                        {acc.performance}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">{acc.specialty}</div>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full ${acc.rate >= 90 ? "bg-emerald-500" : acc.rate >= 85 ? "bg-blue-500" : "bg-amber-500"}`}
                          style={{ width: `${acc.rate}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-bold text-gray-700 w-10">{acc.rate}%</span>
                    </div>
                  </div>
                  <div className="text-center flex-shrink-0">
                    <div className="text-sm font-bold text-gray-800">{acc.reviewed}</div>
                    <div className="text-[11px] text-gray-400">مراجعة</div>
                  </div>
                  <div className="text-center flex-shrink-0">
                    <div className="text-sm font-bold text-emerald-600">{acc.approved}</div>
                    <div className="text-[11px] text-gray-400">معتمد</div>
                  </div>
                  <div className="text-center flex-shrink-0">
                    <div className="text-sm font-medium text-gray-600">{acc.avgTime}</div>
                    <div className="text-[11px] text-gray-400">متوسط</div>
                  </div>
                  <button className="text-xs px-3 py-1.5 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 flex-shrink-0">
                    تفاصيل
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-4">
            {/* Module Breakdown */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-bold text-gray-800 mb-4">توزيع العمليات بالموديول</h3>
              <div className="space-y-3">
                {[
                  { label: "مبيعات", count: 380, pct: 30, color: "bg-emerald-500" },
                  { label: "مصروفات", count: 290, pct: 23, color: "bg-red-400" },
                  { label: "مشتريات", count: 250, pct: 20, color: "bg-blue-500" },
                  { label: "مخزون", count: 180, pct: 14, color: "bg-amber-500" },
                  { label: "أخرى", count: 145, pct: 12, color: "bg-purple-400" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-xs text-gray-600 w-20 text-right">{item.label}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-2">
                      <div className={`h-2 rounded-full ${item.color}`} style={{ width: `${item.pct}%` }}></div>
                    </div>
                    <span className="text-xs font-medium text-gray-700 w-8">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ERP Export Status */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-bold text-gray-800 mb-3">حالة الترحيل لـ ERP</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">معتمدة جاهزة</span>
                  <span className="font-bold text-emerald-600">125 عملية</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">تم ترحيلها اليوم</span>
                  <span className="font-bold text-blue-600">48 عملية</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">آخر ترحيل</span>
                  <span className="font-medium text-gray-800">09:30 صباحاً</span>
                </div>
                <button className="w-full mt-3 py-2.5 rounded-xl bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 transition-colors flex items-center justify-center gap-2">
                  <ChevronsRight size={16} />
                  ترحيل العمليات المعتمدة
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Final Approval */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h3 className="font-bold text-gray-800">تنتظر اعتمادي النهائي <span className="text-purple-600">(125)</span></h3>
            <div className="flex items-center gap-3">
              <select className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 text-gray-600 bg-gray-50">
                <option>كل الموديولات</option>
                <option>مبيعات</option>
                <option>مصروفات</option>
              </select>
              <select className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 text-gray-600 bg-gray-50">
                <option>كل المحاسبين</option>
                <option>أحمد محمد</option>
                <option>محمد عبدالله</option>
              </select>
              <button className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-700">
                ✓ اعتماد الكل
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500">رقم العملية</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500">الفرع</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500">الموديول</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500">المبلغ</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500">التاريخ</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500">الحالة</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {pendingOps.map((op) => (
                  <OperationRow key={op.id} {...op} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
