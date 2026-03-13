import "./_group.css";
import { AppLayout } from "./_shared/AppLayout";
import { KPICard } from "./_shared/KPICard";
import { Users, Building2, Shield, Settings, ChevronsRight, BarChart2, CheckCircle2, AlertTriangle, Plus, Edit, Trash2, ToggleLeft, ToggleRight } from "lucide-react";

const usersList = [
  { name: "أحمد محمد", role: "محاسب", modules: "مبيعات، مصروفات", branches: "1-20", status: "active", lastLogin: "اليوم 10:30" },
  { name: "محمد عبدالله", role: "محاسب", modules: "مشتريات، مخزون", branches: "21-40", status: "active", lastLogin: "اليوم 09:15" },
  { name: "خالد أحمد", role: "رئيس حسابات", modules: "جميع الموديولات", branches: "جميع الفروع", status: "active", lastLogin: "اليوم 08:00" },
  { name: "فاطمة السيد", role: "محاسب", modules: "كشف الموظفين", branches: "41-60", status: "active", lastLogin: "أمس 16:45" },
  { name: "سلمى القحطاني", role: "محاسب", modules: "العهد النقدية", branches: "61-80", status: "inactive", lastLogin: "منذ 3 أيام" },
];

const roleColors: Record<string, string> = {
  "أدمن": "bg-red-50 text-red-700",
  "رئيس حسابات": "bg-amber-50 text-amber-700",
  "محاسب": "bg-blue-50 text-blue-700",
};

export function AdminDashboard() {
  return (
    <AppLayout role="admin" userName="عمر المدير" activeSection="dashboard" notificationsCount={3}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-gray-800 font-bold text-xl">لوحة الأدمن</h2>
            <p className="text-gray-400 text-sm mt-0.5">إدارة شاملة للنظام — صلاحيات كاملة</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">
              <Settings size={15} /> إعدادات النظام
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 text-white text-sm hover:bg-purple-700">
              <ChevronsRight size={15} /> تصدير جماعي ERP
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-4 gap-4">
          <KPICard title="إجمالي المستخدمين" value="24" subtitle="5 محاسبين · 2 رؤساء حسابات" icon={<Users size={22} className="text-purple-600" />} iconBg="bg-purple-50" />
          <KPICard title="الفروع المسجلة" value="100" subtitle="جميع الفروع نشطة" icon={<Building2 size={22} className="text-blue-600" />} iconBg="bg-blue-50" status="success" />
          <KPICard title="عمليات اليوم" value="856" subtitle="متوسط 8.5/فرع" icon={<BarChart2 size={22} className="text-emerald-600" />} iconBg="bg-emerald-50" trend="up" trendValue="+12%" />
          <KPICard title="معدل الاعتماد الكلي" value="91.2%" subtitle="هذا الشهر" icon={<CheckCircle2 size={22} className="text-emerald-600" />} iconBg="bg-emerald-50" trend="up" trendValue="+2.1%" />
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Users Management */}
          <div className="col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="font-bold text-gray-800">إدارة المستخدمين</h3>
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-600 text-white text-xs hover:bg-purple-700">
                <Plus size={14} /> إضافة مستخدم
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500">المستخدم</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500">الدور</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500">الموديولات</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500">الفروع</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500">آخر دخول</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500">الحالة</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList.map((user, i) => (
                    <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-cyan-400 flex items-center justify-center">
                            <span className="text-white text-xs font-bold">{user.name[0]}</span>
                          </div>
                          <span className="font-medium text-gray-800">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${roleColors[user.role] ?? "bg-gray-50 text-gray-600"}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500 max-w-[120px] truncate">{user.modules}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">{user.branches}</td>
                      <td className="px-4 py-3 text-xs text-gray-400">{user.lastLogin}</td>
                      <td className="px-4 py-3">
                        <span className={`flex items-center gap-1 text-xs font-medium ${user.status === "active" ? "text-emerald-600" : "text-gray-400"}`}>
                          {user.status === "active" ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                          {user.status === "active" ? "نشط" : "غير نشط"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button className="p-1.5 rounded bg-blue-50 text-blue-600 hover:bg-blue-100">
                            <Edit size={13} />
                          </button>
                          <button className="p-1.5 rounded bg-amber-50 text-amber-600 hover:bg-amber-100">
                            <Shield size={13} />
                          </button>
                          <button className="p-1.5 rounded bg-red-50 text-red-600 hover:bg-red-100">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* System Overview & Quick Actions */}
          <div className="space-y-4">
            {/* ERP Integration Status */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-bold text-gray-800 mb-4">حالة تكامل ERP</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                  <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-emerald-700">الاتصال بـ ERP: نشط</p>
                    <p className="text-[11px] text-emerald-600">آخر ترحيل: اليوم 09:30 صباحاً</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">معتمدة جاهزة للترحيل</span>
                    <span className="font-bold text-purple-600">125</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">تم ترحيلها اليوم</span>
                    <span className="font-bold text-emerald-600">48</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">إجمالي الشهر</span>
                    <span className="font-bold text-gray-700">980</span>
                  </div>
                </div>
                <button className="w-full py-2.5 rounded-xl bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 transition-colors">
                  🚀 تصدير جماعي للـ ERP
                </button>
              </div>
            </div>

            {/* Permissions Matrix */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-bold text-gray-800 mb-3">مصفوفة الصلاحيات</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr>
                      <th className="text-right py-1 text-gray-500 font-medium">الدور</th>
                      <th className="text-center py-1 text-gray-500 font-medium">عرض</th>
                      <th className="text-center py-1 text-gray-500 font-medium">اعتماد</th>
                      <th className="text-center py-1 text-gray-500 font-medium">ترحيل</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { role: "محاسب", view: true, approve: true, transfer: false },
                      { role: "رئيس حسابات", view: true, approve: true, transfer: true },
                      { role: "أدمن", view: true, approve: true, transfer: true },
                    ].map((r, i) => (
                      <tr key={i} className="border-t border-gray-100">
                        <td className="py-2 text-gray-700 font-medium">{r.role}</td>
                        <td className="py-2 text-center">{r.view ? "✅" : "❌"}</td>
                        <td className="py-2 text-center">{r.approve ? "✅" : "❌"}</td>
                        <td className="py-2 text-center">{r.transfer ? "✅" : "❌"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button className="w-full mt-3 py-2 rounded-lg border border-purple-200 text-purple-600 text-xs font-medium hover:bg-purple-50">
                تعديل الصلاحيات
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
