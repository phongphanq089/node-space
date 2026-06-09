import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/register')({ component: RegisterPage })

const inputClass =
  'w-full rounded-xl border border-ns-border-md bg-ns-input px-4 py-2.5 text-sm text-ns-text placeholder-ns-placeholder outline-none transition-all focus:border-ns-input-focus focus:bg-ns-hover'

const FIELDS = [
  { id: 'input-name', label: 'Họ tên', type: 'text', placeholder: 'Nguyễn Văn A', autoComplete: 'name' },
  { id: 'input-email', label: 'Email', type: 'email', placeholder: 'you@example.com', autoComplete: 'email' },
  { id: 'input-password', label: 'Mật khẩu', type: 'password', placeholder: '••••••••', autoComplete: 'new-password' },
  { id: 'input-confirm', label: 'Xác nhận mật khẩu', type: 'password', placeholder: '••••••••', autoComplete: 'new-password' },
]

function RegisterPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ns-bg px-4 font-sans">
      <div aria-hidden className="pointer-events-none fixed -top-40 -right-20 h-[500px] w-[500px] rounded-full opacity-40" style={{ background: 'radial-gradient(circle,color-mix(in srgb,var(--color-ns-accent) 20%,transparent),transparent 70%)', filter: 'blur(80px)' }} />
      <div aria-hidden className="pointer-events-none fixed -bottom-40 -left-20 h-[500px] w-[500px] rounded-full opacity-30" style={{ background: 'radial-gradient(circle,color-mix(in srgb,var(--color-ns-purple) 20%,transparent),transparent 70%)', filter: 'blur(80px)' }} />

      <div className="rise-in relative z-10 w-full max-w-[420px]">
        <div className="rounded-2xl border border-ns-border-md bg-ns-surface p-8 shadow-[0_24px_64px_rgba(0,0,0,.5)] backdrop-blur-xl">
          {/* Logo */}
          <div className="mb-7 flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-ns-accent to-ns-purple shadow-[0_0_16px_var(--color-ns-accent)]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-ns-on-accent)" strokeWidth="2.5">
                <circle cx="12" cy="12" r="3" />
                <line x1="3" y1="12" x2="9" y2="12" />
                <line x1="15" y1="12" x2="21" y2="12" />
                <line x1="12" y1="3" x2="12" y2="9" />
                <line x1="12" y1="15" x2="12" y2="21" />
              </svg>
            </div>
            <span className="text-lg font-bold tracking-tight text-ns-text">NodeSpace</span>
          </div>

          <h1 className="mb-1 text-xl font-bold text-ns-text">Tạo tài khoản</h1>
          <p className="mb-6 text-sm text-ns-muted-md">Bắt đầu hành trình kết nối ý tưởng của bạn</p>

          <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-4">
            {FIELDS.map((f) => (
              <div key={f.id} className="flex flex-col gap-1.5">
                <label htmlFor={f.id} className="text-xs font-semibold text-ns-ghost">{f.label}</label>
                <input id={f.id} type={f.type} placeholder={f.placeholder} autoComplete={f.autoComplete} className={inputClass} />
              </div>
            ))}

            <Link
              to="/dashboard"
              id="btn-register-submit"
              className="mt-1 flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-ns-accent to-ns-accent-lt py-2.5 text-sm font-bold text-ns-on-accent no-underline shadow-[0_0_20px_var(--color-ns-accent)] transition-all hover:-translate-y-0.5 hover:shadow-[0_0_28px_var(--color-ns-accent)]"
            >
              Tạo tài khoản
            </Link>
          </form>

          <p className="mt-5 text-center text-xs text-ns-muted-sm">
            Đã có tài khoản?{' '}
            <Link to="/login" className="font-semibold text-ns-accent-lt no-underline transition-colors hover:text-ns-accent">
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
