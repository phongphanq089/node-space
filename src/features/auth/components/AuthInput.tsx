type AuthInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  id: string
  label: string
}

const inputClass =
  'w-full rounded-xl border border-ns-border-md bg-ns-input px-4 py-2.5 text-sm text-ns-text placeholder-ns-placeholder outline-none transition-all focus:border-ns-input-focus focus:bg-ns-hover'

export default function AuthInput({ id, label, ...props }: AuthInputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-semibold text-ns-ghost">
        {label}
      </label>
      <input id={id} className={inputClass} {...props} />
    </div>
  )
}
