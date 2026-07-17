import { usePasswordStrength } from '../use-password-strength'
import { STRENGTH_CONFIG } from '../auth.validate'
import { CheckCheck, X } from 'lucide-react'

interface PasswordStrengthIndicatorProps {
  passwordValue: string
}
const PasswordStrengthIndicator = ({
  passwordValue,
}: PasswordStrengthIndicatorProps) => {
  const { score, requirements } = usePasswordStrength(passwordValue)
  return (
    <div className="w-full space-y-2 pt-1">
      <div className="flex w-full justify-between gap-1.5">
        {[1, 2, 3, 4, 5].map((index) => (
          <span
            key={index}
            className={`h-1.5 w-full rounded-full transition-colors duration-300 ${
              score >= index ? STRENGTH_CONFIG.colors[score] : 'bg-white/20'
            }`}
          />
        ))}
      </div>
      <p className="flex justify-between text-xs font-medium">
        <span className="text-muted-foreground">Password strength:</span>
        <span className={score > 0 ? 'font-semibold' : 'text-muted-foreground'}>
          {STRENGTH_CONFIG.texts[score]}
        </span>
      </p>

      <ul className="w-full space-y-1" aria-label="Password requirements">
        {requirements.map((req) => (
          <li key={req.id} className="flex items-center space-x-2">
            {req.met ? (
              <CheckCheck className="h-3.5 w-3.5 text-emerald-500" />
            ) : (
              <X className="h-3.5 w-3.5 text-muted-foreground/40" />
            )}
            <span
              className={`text-xs ${req.met ? 'font-medium text-emerald-600' : 'text-muted-foreground'}`}
            >
              {req.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default PasswordStrengthIndicator
