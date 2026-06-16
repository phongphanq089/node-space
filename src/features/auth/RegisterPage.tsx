import { Link } from '@tanstack/react-router'

import AuthCard from './components/AuthCard'
import AuthInput from './components/AuthInput'

const FIELDS = [
  {
    id: 'input-name',
    label: 'Họ tên',
    type: 'text',
    placeholder: 'Nguyễn Văn A',
    autoComplete: 'name',
  },
  {
    id: 'input-email',
    label: 'Email',
    type: 'email',
    placeholder: 'you@example.com',
    autoComplete: 'email',
  },
  {
    id: 'input-password',
    label: 'Mật khẩu',
    type: 'password',
    placeholder: '••••••••',
    autoComplete: 'new-password',
  },
  {
    id: 'input-confirm',
    label: 'Xác nhận mật khẩu',
    type: 'password',
    placeholder: '••••••••',
    autoComplete: 'new-password',
  },
] as const

export default function RegisterPage() {
  return (
    <AuthCard
      title="Tạo tài khoản"
      subtitle="Bắt đầu hành trình kết nối ý tưởng của bạn"
      footer={
        <>
          Đã có tài khoản?{' '}
          <Link
            to="/login"
            className="font-semibold text-ns-accent-lt no-underline transition-colors hover:text-ns-accent"
          >
            Đăng nhập
          </Link>
        </>
      }
    >
      <form
        onSubmit={(e) => e.preventDefault()}
        className="flex flex-col gap-4"
      >
        {FIELDS.map((f) => (
          <AuthInput key={f.id} {...f} />
        ))}

        <Link
          to="/dashboard"
          id="btn-register-submit"
          className="mt-1 flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-ns-accent to-ns-accent-lt py-2.5 text-sm font-bold text-ns-on-accent no-underline shadow-[0_0_20px_var(--color-ns-accent)] transition-all hover:-translate-y-0.5 hover:shadow-[0_0_28px_var(--color-ns-accent)]"
        >
          Tạo tài khoản
        </Link>
      </form>
    </AuthCard>
  )
}
