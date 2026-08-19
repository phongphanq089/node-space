import { betterAuth } from 'better-auth'
import { drizzleAdapter } from '@better-auth/drizzle-adapter'
import { getDb } from '@/db'
import * as dbSchema from '@/db/schema'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
import { sendEmail } from './mail'
import { render } from '@react-email/render'
import { VerificationEmail } from '@/features/auth/emails/VerificationEmail'
import React from 'react'
import { emailOTP } from 'better-auth/plugins'

const emailOTPConfig = emailOTP({
  overrideDefaultEmailVerification: true,
  async sendVerificationOTP({ email, otp, type }) {
    if (type === 'email-verification' || type === 'forget-password') {
      const isReset = type === 'forget-password'
      const htmlContent = await render(
        React.createElement(VerificationEmail, {
          name: email.split('@')[0],
          code: otp,
          purpose: isReset ? 'reset-password' : 'verification',
        })
      )

      await sendEmail({
        to: email,
        subject: isReset
          ? 'Reset your NodeSpace Password'
          : 'Verify your NodeSpace Account',
        htmlContent,
      })
    }
  },
})

// Dynamic auth instance for application runtime
export const getAuth = () => {
  const db = getDb()
  return betterAuth({
    database: drizzleAdapter(db, {
      provider: 'sqlite',
      schema: dbSchema,
    }),
    user: {
      additionalFields: {
        role: {
          type: 'string',
          defaultValue: 'user',
        },
        themeMode: {
          type: 'string',
          fieldName: 'theme_mode',
          defaultValue: 'dark',
        },
        themeAccent: {
          type: 'string',
          fieldName: 'theme_accent',
          defaultValue: 'violet',
        },
        themeCustomColor: {
          type: 'string',
          fieldName: 'theme_custom_color',
          required: false,
        },
      },
    },
    emailAndPassword: {
      enabled: true,
    },
    plugins: [
      emailOTPConfig,
      tanstackStartCookies(), // Must be the last plugin
    ],
  })
}

// Static export for Better Auth CLI to parse schema/plugins
export const auth = betterAuth({
  database: drizzleAdapter({} as any, {
    provider: 'sqlite',
    schema: dbSchema,
  }),
  user: {
    additionalFields: {
      role: {
        type: 'string',
        defaultValue: 'user',
      },
      themeMode: {
        type: 'string',
        fieldName: 'theme_mode',
        defaultValue: 'dark',
      },
      themeAccent: {
        type: 'string',
        fieldName: 'theme_accent',
        defaultValue: 'violet',
      },
      themeCustomColor: {
        type: 'string',
        fieldName: 'theme_custom_color',
        required: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  plugins: [emailOTPConfig, tanstackStartCookies()],
})
