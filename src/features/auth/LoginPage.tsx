import { Link } from '@tanstack/react-router'

import AuthCard from './components/AuthCard'
import AuthInput from './components/AuthInput'

export default function LoginPage() {
  return (
    <AuthCard
      title="Chào mừng trở lại"
      subtitle="Đăng nhập để tiếp tục với NodeSpace"
      footer={
        <>
          Chưa có tài khoản?{' '}
          <Link
            to="/register"
            className="font-semibold text-ns-accent-lt no-underline transition-colors hover:text-ns-accent"
          >
            Đăng ký miễn phí
          </Link>
        </>
      }
    >
      <form
        onSubmit={(e) => e.preventDefault()}
        className="flex flex-col gap-4"
      >
        <AuthInput
          id="input-email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
        />

        {/* Password — has an extra "Forgot password" link next to label */}
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
            className="w-full rounded-xl border border-ns-border-md bg-ns-input px-4 py-2.5 text-sm text-ns-text placeholder-ns-placeholder outline-none transition-all focus:border-ns-input-focus focus:bg-ns-hover"
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
    </AuthCard>
  )
}
