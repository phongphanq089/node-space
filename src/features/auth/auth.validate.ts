import { z } from 'zod'

export type StrengthScore = 0 | 1 | 2 | 3 | 4 | 5

export const STRENGTH_CONFIG = {
  colors: {
    0: 'bg-white',
    1: 'bg-red-500',
    2: 'bg-orange-500',
    3: 'bg-amber-500',
    4: 'bg-amber-700',
    5: 'bg-emerald-500',
  } satisfies Record<StrengthScore, string>,
  texts: {
    0: 'Enter a password',
    1: 'Weak password',
    2: 'Medium password!',
    3: 'Strong password!!',
    4: 'Very Strong password!!!',
    5: 'Extremely Secure!',
  } satisfies Record<StrengthScore, string>,
} as const

export const PASSWORD_REQUIREMENTS = [
  { id: 'length', regex: /.{8,}/, text: 'At least 8 characters' },
  { id: 'number', regex: /[0-9]/, text: 'At least 1 number' },
  { id: 'lowercase', regex: /[a-z]/, text: 'At least 1 lowercase letter' },
  { id: 'uppercase', regex: /[A-Z]/, text: 'At least 1 uppercase letter' },
  {
    id: 'special',
    regex: /[!-/:-@[-`{-~]/,
    text: 'At least 1 special character',
  },
] as const

let passwordValidation = z.string()
PASSWORD_REQUIREMENTS.forEach((req) => {
  passwordValidation = passwordValidation.refine((val) => req.regex.test(val), {
    message: req.text,
  })
})

export const loginSchema = z.object({
  email: z.email({ message: 'Invalid email address' }),
  password: passwordValidation,
})

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(1, 'Full name is required.')
      .min(4, 'Full name must be at least 4 characters.'),
    email: z.email({ message: 'Invalid email address' }),
    password: passwordValidation,
    confirmPassword: z.string().min(1, 'please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type LoginSchemaValues = z.infer<typeof loginSchema>

export type RegisterSchemaValues = z.infer<typeof registerSchema>
