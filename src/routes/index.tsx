import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/')({ component: LandingPage })

const NAV_LINKS = [
  { label: 'Features', to: '#' },
  { label: 'Templates', to: '#' },
  { label: 'Pricing', to: '#' },
  { label: 'Blog', to: '#' },
  { label: 'Changelog', to: '#' },
]

function LandingPage() {
  const [timeLeft, setTimeLeft] = useState({
    days: '24',
    hours: '18',
    minutes: '46',
    seconds: '09',
  })

  useEffect(() => {
    // Target date is set to 24 days 18 hours 46 minutes 9 seconds from June 11, 2026 10:40:11 (approx 2026-07-06T05:26:20Z)
    const targetDate = new Date('2026-07-06T05:26:20Z').getTime()

    const interval = setInterval(() => {
      const now = new Date().getTime()
      const difference = targetDate - now

      if (difference <= 0) {
        clearInterval(interval)
        return
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24))
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      )
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((difference % (1000 * 60)) / 1000)

      setTimeLeft({
        days: String(days).padStart(2, '0'),
        hours: String(hours).padStart(2, '0'),
        minutes: String(minutes).padStart(2, '0'),
        seconds: String(seconds).padStart(2, '0'),
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative flex min-h-screen flex-col justify-between overflow-hidden bg-[#05020c] font-sans text-ns-text-2">
      {/* Background Hero Banner */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-90"
        style={{ backgroundImage: "url('/hero-banner.png')" }}
      />

      {/* Subtle overlay gradients for depth */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-black/40 via-transparent to-[#05020c]/80" />

      {/* ── Navbar ── */}
      <header className="relative z-50 w-full">
        <div className="mx-auto flex h-[76px] max-w-[1200px] items-center justify-between px-6">
          {/* Logo & Brand */}
          <Link
            to="/"
            className="flex items-center gap-3 no-underline transition-opacity hover:opacity-90"
          >
            <img
              src="/logo.png"
              alt="NoteFlow Logo"
              className="h-7 w-auto object-contain"
            />
            <span className="font-sans text-xl font-bold tracking-tight text-white">
              NoteFlow
            </span>
          </Link>

          {/* Center navigation links (hidden on mobile) */}
          <nav className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.to}
                className="text-sm font-medium text-ns-muted no-underline transition-all hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-sm font-semibold text-ns-muted no-underline transition-colors hover:text-white"
            >
              Đăng nhập
            </Link>
            <Link
              to="/register"
              className="rounded-full bg-gradient-to-r from-ns-accent to-[#6366f1] px-5 py-2.5 text-sm font-bold text-white no-underline shadow-[0_0_24px_rgba(124,58,237,0.5)] transition-all hover:-translate-y-0.5 hover:shadow-[0_0_32px_rgba(124,58,237,0.7)]"
            >
              Bắt đầu miễn phí
            </Link>
          </div>
        </div>
      </header>

      {/* ── Main Hero Section ── */}
      <main className="relative z-10 mx-auto flex w-full max-w-[1200px] flex-1 flex-col justify-center px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Left Column: Content */}
          <div className="flex flex-col items-start text-left">
            {/* Status Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-ns-border bg-ns-surface-alt/60 px-4.5 py-1.5 text-xs font-semibold tracking-wide text-ns-text-2 backdrop-blur-md">
              <span className="font-bold text-ns-amber">+</span>
              Something amazing is on the way
            </div>

            {/* Main Title */}
            <h1 className="m-0 mb-4 text-[clamp(2.8rem,5.5vw,4.5rem)] leading-[1.05] font-extrabold tracking-[-0.04em] text-white">
              Coming Soon
            </h1>

            {/* Sub-heading */}
            <p className="m-0 mb-4 text-xl leading-snug font-bold text-white sm:text-2xl">
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

            {/* Email Form */}
            <form
              onSubmit={(e) => e.preventDefault()}
              className="mb-4 flex w-full max-w-[480px] flex-col gap-3 sm:flex-row sm:items-center sm:rounded-2xl sm:border sm:border-ns-border sm:bg-[#0c0720]/50 sm:p-1.5 sm:backdrop-blur-md"
            >
              <div className="relative flex flex-1 items-center">
                <span className="absolute left-4 text-ns-muted">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </span>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full rounded-xl border border-ns-border bg-[#0c0720]/50 py-3.5 pr-4 pl-12 text-sm text-white placeholder-ns-placeholder transition-all outline-none focus:border-ns-accent sm:border-none sm:bg-transparent"
                />
              </div>
              <button
                type="submit"
                className="cursor-pointer rounded-xl bg-gradient-to-r from-ns-accent to-[#6366f1] px-6 py-3.5 text-sm font-bold text-white shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all hover:opacity-95 hover:shadow-[0_0_28px_rgba(124,58,237,0.6)] active:scale-98 sm:py-3"
              >
                Thông báo cho tôi
              </button>
            </form>

            {/* Footnote */}
            <div className="inline-flex items-center gap-2 text-xs text-ns-muted-md">
              <span>
                <svg
                  className="h-4 w-4 text-ns-accent"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </span>
              Không spam. Chỉ gửi thông tin quan trọng.
            </div>
          </div>

          {/* Right Column: Floating 3D Icon */}
          <div className="relative flex items-center justify-center">
            {/* Ambient radial glow behind the icon */}
            <div className="absolute h-72 w-72 rounded-full bg-ns-accent/10 blur-[90px]" />
            <img
              src="/icon-banner.png"
              alt="NoteFlow Pedestal Graphic"
              className="ns-animate-float z-10 max-h-[360px] w-auto object-contain md:max-h-[420px]"
            />
          </div>
        </div>
      </main>

      {/* ── Countdown Timer Section ── */}
      <footer className="relative z-10 w-full px-6 pb-12 md:pb-16">
        <div className="mx-auto flex max-w-[800px] flex-col items-center">
          <div className="flex items-center justify-center gap-3 sm:gap-5">
            {/* Days */}
            <div className="flex flex-col items-center">
              <div className="ns-countdown-card flex h-20 w-20 items-center justify-center rounded-2xl text-2xl font-extrabold text-white sm:h-24 sm:w-24 sm:text-3xl">
                {timeLeft.days}
              </div>
              <span className="mt-2 text-xs font-semibold tracking-wider text-ns-muted">
                Ngày
              </span>
            </div>

            <span className="text-xl font-bold text-ns-muted/70 sm:text-2xl">
              :
            </span>

            {/* Hours */}
            <div className="flex flex-col items-center">
              <div className="ns-countdown-card flex h-20 w-20 items-center justify-center rounded-2xl text-2xl font-extrabold text-white sm:h-24 sm:w-24 sm:text-3xl">
                {timeLeft.hours}
              </div>
              <span className="mt-2 text-xs font-semibold tracking-wider text-ns-muted">
                Giờ
              </span>
            </div>

            <span className="text-xl font-bold text-ns-muted/70 sm:text-2xl">
              :
            </span>

            {/* Minutes */}
            <div className="flex flex-col items-center">
              <div className="ns-countdown-card flex h-20 w-20 items-center justify-center rounded-2xl text-2xl font-extrabold text-white sm:h-24 sm:w-24 sm:text-3xl">
                {timeLeft.minutes}
              </div>
              <span className="mt-2 text-xs font-semibold tracking-wider text-ns-muted">
                Phút
              </span>
            </div>

            <span className="text-xl font-bold text-ns-muted/70 sm:text-2xl">
              :
            </span>

            {/* Seconds */}
            <div className="flex flex-col items-center">
              <div className="ns-countdown-card flex h-20 w-20 items-center justify-center rounded-2xl text-2xl font-extrabold text-white sm:h-24 sm:w-24 sm:text-3xl">
                {timeLeft.seconds}
              </div>
              <span className="mt-2 text-xs font-semibold tracking-wider text-ns-muted">
                Giây
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
