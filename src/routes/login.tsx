import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/login')({ component: LoginPage })

const inputClass =
  'w-full rounded-xl border border-ns-border-md bg-ns-input px-4 py-2.5 text-sm text-ns-text placeholder-ns-placeholder outline-none transition-all focus:border-ns-input-focus focus:bg-ns-hover'

function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ns-bg px-4 font-sans">
      <div
        aria-hidden
        className="ns-orb-accent-20-blur pointer-events-none fixed -top-40 -left-20 h-[500px] w-[500px] rounded-full opacity-40"
      />
      <div
        aria-hidden
        className="ns-orb-purple-20-blur pointer-events-none fixed -right-20 -bottom-40 h-[500px] w-[500px] rounded-full opacity-30"
      />

      <div className="rise-in relative z-10 w-full max-w-[400px]">
        <div className="rounded-2xl border border-ns-border-md bg-ns-surface p-8 shadow-[0_24px_64px_rgba(0,0,0,.5)] backdrop-blur-xl">
          {/* Logo */}
          <div className="mb-7 flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-ns-accent to-ns-purple shadow-[0_0_16px_var(--color-ns-accent)]">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--color-ns-on-accent)"
                strokeWidth="2.5"
              >
                <circle cx="12" cy="12" r="3" />
                <line x1="3" y1="12" x2="9" y2="12" />
                <line x1="15" y1="12" x2="21" y2="12" />
                <line x1="12" y1="3" x2="12" y2="9" />
                <line x1="12" y1="15" x2="12" y2="21" />
              </svg>
            </div>
            <span className="text-lg font-bold tracking-tight text-ns-text">
              NodeSpace
            </span>
          </div>

          <h1 className="mb-1 text-xl font-bold text-ns-text">
            Chào mừng trở lại
          </h1>
          <p className="mb-6 text-sm text-ns-muted-md">
            Đăng nhập để tiếp tục với NodeSpace
          </p>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="input-email"
                className="text-xs font-semibold text-ns-ghost"
              >
                Email
              </label>
              <input
                id="input-email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="input-password"
                  className="text-xs font-semibold text-ns-ghost"
                >
                  Mật khẩu
                </label>
                <a
                  href="#"
                  className="text-xs text-ns-accent-lt no-underline transition-colors hover:text-ns-accent"
                >
                  Quên mật khẩu?
                </a>
              </div>
              <input
                id="input-password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                className={inputClass}
              />
            </div>

            <Link
              to="/dashboard"
              id="btn-login-submit"
              className="mt-1 flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-ns-accent to-ns-accent-lt py-2.5 text-sm font-bold text-ns-on-accent no-underline shadow-[0_0_20px_var(--color-ns-accent)] transition-all hover:-translate-y-0.5 hover:shadow-[0_0_28px_var(--color-ns-accent)]"
            >
              Đăng nhập
            </Link>
          </form>

          <p className="mt-5 text-center text-xs text-ns-muted-sm">
            Chưa có tài khoản?{' '}
            <Link
              to="/register"
              className="font-semibold text-ns-accent-lt no-underline transition-colors hover:text-ns-accent"
            >
              Đăng ký miễn phí
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
