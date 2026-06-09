import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: LandingPage })

const FEATURES = [
  { icon: '⬡', title: 'Node Link', desc: 'Kết nối ý tưởng trực quan' },
  { icon: '</>', title: 'Markdown', desc: 'Code highlight đầy đủ' },
  { icon: '⬡', title: 'Graph View', desc: 'Toàn bộ mối liên kết' },
  { icon: '◎', title: 'Focus Mode', desc: 'Viết không gián đoạn' },
]

export default function LandingPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center overflow-hidden bg-ns-bg font-sans">
      {/* Grid overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(79,184,178,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(79,184,178,.05) 1px,transparent 1px)',
          backgroundSize: '40px 40px',
          maskImage:
            'radial-gradient(ellipse at 50% 20%,black 30%,transparent 80%)',
        }}
      />

      {/* Orbs */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed -top-48 -left-24 h-[600px] w-[600px] rounded-full opacity-60"
        style={{
          background:
            'radial-gradient(circle,color-mix(in srgb,var(--color-ns-accent) 20%,transparent) ,transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed -top-24 -right-24 h-[500px] w-[500px] rounded-full opacity-50"
        style={{
          background:
            'radial-gradient(circle,color-mix(in srgb,var(--color-ns-purple) 18%,transparent),transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed bottom-0 left-1/2 h-[400px] w-[400px] -translate-x-1/2 rounded-full opacity-40"
        style={{
          background:
            'radial-gradient(circle,rgba(47,106,74,.15),transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      {/* ── Navbar ── */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-ns-border bg-ns-bg/70 backdrop-blur-xl">
        <div className="mx-auto flex h-[60px] max-w-[1100px] items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-br from-ns-accent to-ns-purple shadow-[0_0_10px_var(--color-ns-accent)]" />
            <span className="text-[1.05rem] font-bold tracking-tight text-ns-text">
              NodeSpaceđứaasd
            </span>
          </div>
          <nav className="flex items-center gap-3">
            <Link
              to="/login"
              className="rounded-full border border-ns-border-md px-[1.1rem] py-[0.45rem] text-sm font-semibold text-ns-muted no-underline transition-all hover:border-ns-border-em hover:bg-ns-hover-md hover:text-ns-text-2"
            >
              Đăng nhập
            </Link>
            <Link
              to="/register"
              className="rounded-full bg-gradient-to-r from-ns-accent to-ns-accent-lt px-5 py-[0.45rem] text-sm font-bold text-ns-on-accent no-underline shadow-[0_0_20px_var(--color-ns-accent)] transition-all hover:-translate-y-0.5 hover:shadow-[0_0_30px_var(--color-ns-accent)]"
            >
              Đăng ký miễn phí
            </Link>
          </nav>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="rise-in relative z-10 mt-[60px] flex w-full max-w-[760px] flex-col items-center px-6 pt-20 pb-12 text-center">
        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-ns-border-em bg-ns-active px-4 py-1.5 text-xs font-semibold tracking-wide text-ns-accent-lt">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ns-accent shadow-[0_0_8px_var(--color-ns-accent)]" />
          Sắp ra mắt — Tham gia danh sách chờ ngay hôm nay
        </div>

        <h1 className="m-0 mb-5 text-[clamp(2.6rem,6vw,4.2rem)] leading-[1.08] font-extrabold tracking-[-0.04em] text-ns-text">
          Suy nghĩ của bạn,
          <br />
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage:
                'linear-gradient(135deg,var(--color-ns-accent) 0%,var(--color-ns-purple) 55%,var(--color-ns-pink) 100%)',
            }}
          >
            được kết nối.
          </span>
        </h1>

        <p className="m-0 mb-9 max-w-[560px] text-[1.08rem] leading-[1.7] text-ns-muted">
          NodeSpace là không gian ghi chú dạng node thế hệ mới — giúp bạn tư duy
          tự do, kết nối ý tưởng và xây dựng kiến thức theo cách của riêng mình.
        </p>

        {/* CTAs */}
        <div className="mb-7 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/register"
            id="cta-register"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-ns-accent to-ns-accent-lt px-7 py-3 text-[0.95rem] font-bold text-ns-on-accent no-underline shadow-[0_0_30px_var(--color-ns-accent)] transition-all hover:-translate-y-0.5 hover:shadow-[0_0_40px_var(--color-ns-accent)]"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
            >
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
            Bắt đầu miễn phí
          </Link>
          <Link
            to="/login"
            id="cta-login"
            className="inline-flex items-center rounded-full border border-ns-border-md bg-ns-hover px-6 py-3 text-[0.95rem] font-semibold text-ns-muted no-underline transition-all hover:border-ns-border-em hover:bg-ns-hover-md hover:text-ns-text-2"
          >
            Đăng nhập
          </Link>
        </div>

        <div className="inline-flex items-center gap-2 text-xs text-ns-faint">
          <span className="h-1.5 w-1.5 rounded-full bg-ns-amber shadow-[0_0_6px_var(--color-ns-amber)]" />
          Đang trong quá trình phát triển — Beta sắp ra mắt
        </div>
      </section>

      {/* ── Feature cards ── */}
      <section
        className="rise-in relative z-10 grid w-full max-w-[660px] grid-cols-2 gap-3 px-6 pb-20 sm:grid-cols-4"
        style={{ animationDelay: '200ms' }}
      >
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="flex flex-col items-center gap-2 rounded-2xl border border-ns-border bg-ns-input p-4 text-center backdrop-blur transition-all hover:-translate-y-0.5 hover:border-ns-border-em hover:bg-ns-hover"
          >
            <span className="text-xl text-ns-accent opacity-80">{f.icon}</span>
            <span className="text-xs font-bold text-ns-text">{f.title}</span>
            <span className="text-[0.68rem] leading-snug text-ns-ghost">
              {f.desc}
            </span>
          </div>
        ))}
      </section>

      {/* Bottom fade */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-0 h-28 bg-gradient-to-t from-ns-bg to-transparent"
      />
    </div>
  )
}
