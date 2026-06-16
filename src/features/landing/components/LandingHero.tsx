export default function LandingHero() {
  return (
    <main className="relative z-10 mx-auto flex w-full max-w-[1200px] flex-1 flex-col justify-center px-6 py-12 md:py-16">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        {/* ── Left: Content ── */}
        <div className="flex flex-col items-start text-left">
          {/* Status badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-ns-border bg-ns-surface-alt/60 px-4 py-1.5 text-xs font-semibold tracking-wide text-ns-text-2 backdrop-blur-md">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ns-amber" />
            Something amazing is on the way
          </div>

          {/* Title */}
          <h1 className="m-0 mb-4 text-[clamp(2.8rem,5.5vw,4.5rem)] font-extrabold leading-[1.05] tracking-[-0.04em] text-white">
            Coming Soon
          </h1>

          {/* Subheading */}
          <p className="m-0 mb-4 text-xl font-bold leading-snug text-white sm:text-2xl">
            Một{' '}
            <span className="bg-gradient-to-r from-ns-accent-lt to-ns-purple bg-clip-text text-transparent">
              trải nghiệm
            </span>{' '}
            hoàn toàn mới đang được hoàn thiện.
          </p>

          {/* Description */}
          <p className="m-0 mb-8 max-w-[500px] text-sm leading-relaxed text-ns-muted">
            Chúng tôi đang xây dựng không gian làm việc thế hệ tiếp theo cho
            những người sáng tạo và tư duy khác biệt.
          </p>

          {/* Email form */}
          <form
            onSubmit={(e) => e.preventDefault()}
            className="mb-4 flex w-full max-w-[480px] flex-col gap-3 sm:flex-row sm:items-center sm:rounded-2xl sm:border sm:border-ns-border sm:bg-ns-surface-alt/50 sm:p-1.5 sm:backdrop-blur-md"
          >
            <div className="relative flex flex-1 items-center">
              <span className="absolute left-4 text-ns-muted">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </span>
              <input
                id="input-notify-email"
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-xl border border-ns-border bg-ns-surface-alt/50 py-3.5 pr-4 pl-12 text-sm text-white placeholder-ns-placeholder outline-none transition-all focus:border-ns-input-focus sm:border-none sm:bg-transparent"
              />
            </div>
            <button
              type="submit"
              className="cursor-pointer whitespace-nowrap rounded-xl bg-gradient-to-r from-ns-accent to-ns-secondary px-6 py-3.5 text-sm font-bold text-white shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all hover:opacity-95 hover:shadow-[0_0_28px_rgba(124,58,237,0.6)] active:scale-[0.98] sm:py-3"
            >
              Thông báo cho tôi
            </button>
          </form>

          {/* Footnote */}
          <div className="inline-flex items-center gap-2 text-xs text-ns-muted-md">
            <svg
              className="h-4 w-4 text-ns-accent"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            Không spam. Chỉ gửi thông tin quan trọng.
          </div>
        </div>

        {/* ── Right: Floating graphic ── */}
        <div className="relative flex items-center justify-center">
          <div className="absolute h-72 w-72 rounded-full bg-ns-accent/10 blur-[90px]" />
          <img
            src="/icon-banner.png"
            alt="NodeSpace graphic"
            className="ns-animate-float z-10 max-h-[360px] w-auto object-contain md:max-h-[420px]"
          />
        </div>
      </div>
    </main>
  )
}
