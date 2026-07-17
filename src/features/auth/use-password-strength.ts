import { useMemo } from 'react'
import { PASSWORD_REQUIREMENTS } from './auth.validate'
import type { StrengthScore } from './auth.validate'

export function usePasswordStrength(password: string) {
  return useMemo(() => {
    const requirements = PASSWORD_REQUIREMENTS.map((req) => ({
      id: req.id,
      met: req.regex.test(password),
      text: req.text,
    }))

    const score = requirements.filter((req) => req.met).length as StrengthScore

    return {
      requirements,
      score,
    }
  }, [password])
}
