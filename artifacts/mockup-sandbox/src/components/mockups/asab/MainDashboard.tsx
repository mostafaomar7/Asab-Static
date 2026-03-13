import "./_group.css";
import { AppLayout } from "./_shared/AppLayout";
import { KPICard } from "./_shared/KPICard";
import { OperationRow } from "./_shared/OperationRow";
import {
  TrendingUp, Wallet, ShoppingCart, Package, AlertTriangle,
  CheckCircle2, Clock, ArrowUpRight, ChevronsRight, Filter,
  BarChart2, RefreshCw, FileDown
} from "lucide-react";

const modules = [
  { id: "sales", label: "المبيعات", pending: 14, total: 42, icon: "💰", color: "bg-emerald-500" },
  { id: "expenses", label: "المصروفات", pending: 22, total: 67, icon: "💸", color: "bg-red-500" },
  { id: "purchases", label: "المشتريات", pending: 8, total: 31, icon: "🛒", color: "bg-blue-500" },
  { id: "inventory", label: "المخزون", pending: 5, total: 18, icon: "📦", color: "bg-amber-500" },
  { id: "assets", label: "الأصول", pending: 0, total: 4, icon: "🏢", color: "bg-purple-500" },
  { id: "shifts", label: "الشفتات", pending: 3, total: 12, icon: "⏰", color: "bg-cyan-500" },
  { id: "employees", label: "كشف الموظفين", pending: 6, total: 25, icon: "👥", color: "bg-indigo-500" },
  { id: "cash", label: "العهد النقدية", pending: 2, total: 9, icon: "💼", color: "bg-orange-500" },
];

const recentOps = [
  { id: "OPS-2401", branch: "فرع الرياض - العليا", type: "مبيعات", amount: "45,230 ر.س", date: "14 أكتوبر", status: "pending" as const },
  { id: "OPS-2400", branch: "فرع جدة - الحمراء", type: "مصروفات", amount: "12,500 ر.س", date: "14 أكتوبر", status: "pending" as const },
  { id: "OPS-2399", branch: "فرع مكة - المعابدة", type: "مشتريات", amount: "28,750 ر.س", date: "13 أكتوبر", status: "approved" as const },
  { id: "OPS-2398", branch: "فرع الدمام - الكورنيش", type: "مخزون", amount: "8,400 ر.س", date: "13 أكتوبر", status: "rejected" as const },
  { id: "OPS-2397", branch: "فرع الرياض - النزهة", type: "مبيعات", amount: "38,900 ر.س", date: "12 أكتوبر", status: "final-approved" as const },
];

const alerts = [
  { type: "danger", msg: "فرع الرياض العليا: تباين في المبيعات يبلغ 3,200 ر.س", time: "منذ 15 دقيقة" },
  { type: "warning", msg: "فرع جدة: لم يتم إرسال تقرير المبيعات ليوم أمس", time: "منذ 2 ساعة" },
  { type: "info", msg: "تم استلام 45 عملية جديدة من 12 فرع", time: "منذ 3 ساعات" },
];

export function MainDashboard() {
  return (
    <AppLayout role="accountant" userName="أحمد محمد" activeSection="dashboard" notificationsCount={12}>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-gray-800 font-bold text-xl">ملخص اليوم — الاثنين، 14 أكتوبر 2025</h2>
            <p className="text-gray-400 text-sm mt-0.5">آخر تحديث: 10:45 صباحاً</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
              <Filter size={15} />
              تصفية
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 text-white text-sm hover:bg-purple-700 transition-colors">
              <FileDown size={15} />
              تصدير تقرير
            </button>
          </div>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-4 gap-4">
          <KPICard title="إجمالي العمليات اليوم" value="245" subtitle="من 28 فرع" icon={<BarChart2 size={22} className="text-purple-600" />} iconBg="bg-purple-50" trend="up" trendValue="+12%" />
          <KPICard title="تنتظر مراجعتي" value="60" subtitle="14 مبيعات · 22 مصروفات" icon={<Clock size={22} className="text-amber-600" />} iconBg="bg-amber-50" status="warning" />
          <KPICard title="تمت الموافقة" value="180" subtitle="73.5% معدل الاعتماد" icon={<CheckCircle2 size={22} className="text-emerald-600" />} iconBg="bg-emerald-50" trend="up" trendValue="+5%" />
          <KPICard title="تنبيهات مفتوحة" value="7" subtitle="3 حرجة · 4 تحذير" icon={<AlertTriangle size={22} className="text-red-600" />} iconBg="bg-red-50" status="danger" />
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Modules Overview */}
          <div className="col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="font-bold text-gray-800">حالة الموديولات</h3>
              <span className="text-xs text-gray-400">العمليات المعلقة / الإجمالي</span>
            </div>
            <div className="p-4 grid grid-cols-4 gap-3">
              {modules.map((mod) => (
                <button
                  key={mod.id}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50/50 transition-all group"
                >
                  <div className={`w-10 h-10 rounded-xl ${mod.color} flex items-center justify-center text-lg`}>
                    {mod.icon}
                  </div>
                  <span className="text-xs font-medium text-gray-700 text-center leading-tight">{mod.label}</span>
                  <div className="flex items-center gap-1">
                    {mod.pending > 0 && (
                      <span className="bg-red-100 text-red-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">{mod.pending}</span>
                    )}
                    <span className="text-gray-300 text-[10px]">/</span>
                    <span className="text-gray-500 text-[10px]">{mod.total}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Alerts */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="font-bold text-gray-800">تنبيهات هامة</h3>
              <button className="text-xs text-purple-600 hover:underline">عرض الكل</button>
            </div>
            <div className="p-4 space-y-3">
              {alerts.map((a, i) => (
                <div key={i} className={`p-3 rounded-lg border-r-4 ${
                  a.type === "danger" ? "bg-red-50 border-red-500" :
                  a.type === "warning" ? "bg-amber-50 border-amber-500" :
                  "bg-blue-50 border-blue-500"
                }`}>
                  <p className="text-xs font-medium text-gray-700 leading-relaxed">{a.msg}</p>
                  <p className="text-[11px] text-gray-400 mt-1">{a.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Operations Table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h3 className="font-bold text-gray-800">أحدث العمليات</h3>
            <div className="flex items-center gap-3">
              <select className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 text-gray-600 bg-gray-50">
                <option>الكل</option>
                <option>مبيعات</option>
                <option>مصروفات</option>
                <option>مشتريات</option>
              </select>
              <select className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 text-gray-600 bg-gray-50">
                <option>كل الحالات</option>
                <option>في الانتظار</option>
                <option>معتمد</option>
                <option>مرفوض</option>
              </select>
              <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700">
                <RefreshCw size={13} /> تحديث
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
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
                {recentOps.map((op) => (
                  <OperationRow key={op.id} {...op} />
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-400">عرض 5 من 245 عملية</span>
            <button className="flex items-center gap-1 text-sm text-purple-600 font-medium hover:underline">
              عرض جميع العمليات <ArrowUpRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
