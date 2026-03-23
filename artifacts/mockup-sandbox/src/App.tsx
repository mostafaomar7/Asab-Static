import { useEffect, useState, type ComponentType } from "react";
import { modules as discoveredModules } from "./.generated/mockup-components";

type ModuleMap = Record<string, () => Promise<Record<string, unknown>>>;

function _resolveComponent(
  mod: Record<string, unknown>,
  name: string,
): ComponentType | undefined {
  const fns = Object.values(mod).filter(
    (v) => typeof v === "function",
  ) as ComponentType[];
  return (
    (mod.default as ComponentType) ||
    (mod.Preview as ComponentType) ||
    (mod[name] as ComponentType) ||
    fns[fns.length - 1]
  );
}

function PreviewRenderer({
  componentPath,
  modules,
}: {
  componentPath: string;
  modules: ModuleMap;
}) {
  const [Component, setComponent] = useState<ComponentType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setComponent(null);
    setError(null);

    async function loadComponent(): Promise<void> {
      const key = `./components/mockups/${componentPath}.tsx`;
      const loader = modules[key];
      if (!loader) {
        setError(`No component found at ${componentPath}.tsx`);
        return;
      }
      try {
        const mod = await loader();
        if (cancelled) return;
        const name = componentPath.split("/").pop()!;
        const comp = _resolveComponent(mod, name);
        if (!comp) {
          setError(`No exported React component found in ${componentPath}.tsx`);
          return;
        }
        setComponent(() => comp);
      } catch (e) {
        if (cancelled) return;
        const message = e instanceof Error ? e.message : String(e);
        setError(`Failed to load preview.\n${message}`);
      }
    }

    void loadComponent();
    return () => { cancelled = true; };
  }, [componentPath, modules]);

  if (error) {
    return (
      <pre style={{ color: "red", padding: "2rem", fontFamily: "system-ui" }}>
        {error}
      </pre>
    );
  }
  if (!Component) return null;
  return <Component />;
}

function getBasePath(): string {
  return import.meta.env.BASE_URL.replace(/\/$/, "");
}

function getPreviewPath(): string | null {
  const basePath = getBasePath();
  const { pathname } = window.location;
  const local =
    basePath && pathname.startsWith(basePath)
      ? pathname.slice(basePath.length) || "/"
      : pathname;
  const match = local.match(/^\/preview\/(.+)$/);
  return match ? match[1] : null;
}

// ─── ASAB Landing Page ────────────────────────────────────────────────────────
function ASABLanding() {
  const basePath = getBasePath();

  const dashboards = [
    {
      href: `${basePath}/preview/asab/ASABPrototype`,
      title: "الداشبورد الرئيسي",
      subtitle: "نظام عصب الكامل",
      description: "إدارة مالية متكاملة — المبيعات، المصروفات، المشتريات، المخزون، الشفتات، العهد النقدية، والأصول الثابتة",
      roles: ["محاسب", "رئيس حسابات", "مدير فرع", "مدير مشتريات", "مشرف", "مدير شركة"],
      badge: "9 موديولات · 6 أدوار · خط اعتماد 6 مراحل",
      color: "#7C3AED",
      bg: "rgba(124,58,237,0.12)",
      border: "rgba(124,58,237,0.25)",
      icon: "🏢",
      gradient: "linear-gradient(135deg, rgba(124,58,237,0.2) 0%, rgba(0,217,255,0.1) 100%)",
    },
    {
      href: `${basePath}/preview/asab/CompanyDashboard`,
      title: "بوابة الشركات",
      subtitle: "مجموعة التاج — B2B Portal",
      description: "لوحة إدارة متعددة الفروع لمجموعات المطاعم — مراجعة البيانات وتدقيق العمليات عبر جميع العلامات التجارية",
      roles: ["المدير التنفيذي", "المشرف المالي", "محاسب المجموعة", "محلل البيانات", "مدير مشتريات"],
      badge: "5 أدوار · 4 علامات تجارية · متعدد الفروع",
      color: "#00D9FF",
      bg: "rgba(0,217,255,0.1)",
      border: "rgba(0,217,255,0.25)",
      icon: "🏨",
      gradient: "linear-gradient(135deg, rgba(0,217,255,0.15) 0%, rgba(124,58,237,0.1) 100%)",
    },
  ] as const;

  const features = [
    { icon: "📊", text: "تقارير مالية متكاملة" },
    { icon: "✅", text: "خط اعتماد 6 مراحل" },
    { icon: "🔔", text: "إشعارات فورية" },
    { icon: "🔗", text: "تصدير ERP" },
    { icon: "🌙", text: "واجهة عربية RTL" },
    { icon: "📱", text: "متوافق مع الجوال" },
  ];

  return (
    <div
      dir="rtl"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(145deg, #0A1628 0%, #0F1C35 40%, #1B3A6B 100%)",
        fontFamily: "'IBM Plex Sans Arabic', 'Segoe UI', system-ui, sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── Header ── */}
      <header style={{ textAlign: "center", padding: "56px 32px 40px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
          <div style={{
            width: 52, height: 52, borderRadius: 16,
            background: "linear-gradient(135deg, #7C3AED, #00D9FF)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22, fontWeight: 900, color: "white",
          }}>ع</div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 32, fontWeight: 900, color: "white", lineHeight: 1 }}>
              عصب <span style={{ color: "#00D9FF", fontFamily: "system-ui" }}>ASAB</span>
            </div>
            <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>Financial Management System</div>
          </div>
        </div>
        <h1 style={{ fontSize: 18, color: "#94a3b8", fontWeight: 400, margin: "0 0 8px" }}>
          نظام إدارة مالية المطاعم المتكامل
        </h1>
        <p style={{ fontSize: 13, color: "#475569", margin: 0 }}>
          النموذج التفاعلي الكامل — اختر الداشبورد للبدء
        </p>
      </header>

      {/* ── Dashboard Cards ── */}
      <main style={{ flex: 1, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "0 24px 48px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, width: "100%", maxWidth: 880 }}>
          {dashboards.map((d) => (
            <a
              key={d.href}
              href={d.href}
              style={{
                display: "block",
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${d.border}`,
                borderRadius: 20,
                padding: 28,
                textDecoration: "none",
                cursor: "pointer",
                transition: "all 0.2s ease",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.07)";
                (e.currentTarget as HTMLAnchorElement).style.borderColor = d.color;
                (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.04)";
                (e.currentTarget as HTMLAnchorElement).style.borderColor = d.border;
                (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
              }}
            >
              {/* Gradient background layer */}
              <div style={{
                position: "absolute", inset: 0, borderRadius: 20,
                background: d.gradient, pointerEvents: "none",
              }}/>

              <div style={{ position: "relative" }}>
                {/* Icon & Title */}
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 14,
                    background: `${d.color}20`, border: `1px solid ${d.color}40`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 24, flexShrink: 0,
                  }}>{d.icon}</div>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 900, color: "white" }}>{d.title}</div>
                    <div style={{ fontSize: 12, color: d.color, fontWeight: 600, marginTop: 2 }}>{d.subtitle}</div>
                  </div>
                </div>

                {/* Description */}
                <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.7, margin: "0 0 16px" }}>
                  {d.description}
                </p>

                {/* Roles */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
                  {d.roles.map((r) => (
                    <span key={r} style={{
                      fontSize: 11, padding: "2px 10px", borderRadius: 99,
                      border: `1px solid ${d.color}40`,
                      color: d.color, background: `${d.color}12`,
                      fontWeight: 600,
                    }}>{r}</span>
                  ))}
                </div>

                {/* Badge */}
                <p style={{ fontSize: 10, color: "#475569", margin: "0 0 20px" }}>{d.badge}</p>

                {/* CTA Button */}
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: d.color, color: "white",
                  padding: "10px 22px", borderRadius: 12,
                  fontSize: 13, fontWeight: 700,
                }}>
                  فتح الداشبورد
                  <span style={{ fontSize: 16 }}>←</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </main>

      {/* ── Feature Pills ── */}
      <section style={{ textAlign: "center", padding: "0 24px 40px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10, maxWidth: 600, margin: "0 auto" }}>
          {features.map((f) => (
            <span key={f.text} style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 99, padding: "6px 14px",
              fontSize: 12, color: "#94a3b8",
            }}>
              <span>{f.icon}</span>{f.text}
            </span>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ textAlign: "center", padding: "16px 24px 32px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <p style={{ fontSize: 12, color: "#334155", margin: 0 }}>
          عصب ASAB · نظام إدارة مالية المطاعم · النسخة التجريبية 2.0 · جميع الحقوق محفوظة
        </p>
      </footer>
    </div>
  );
}

// ─── App Router ───────────────────────────────────────────────────────────────
function App() {
  const previewPath = getPreviewPath();

  if (previewPath) {
    return (
      <PreviewRenderer
        componentPath={previewPath}
        modules={discoveredModules}
      />
    );
  }

  return <ASABLanding />;
}

export default App;
