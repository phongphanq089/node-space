import { betterAuth } from 'better-auth'
import { drizzleAdapter } from '@better-auth/drizzle-adapter'
import { getDb } from '@/db'
import * as dbSchema from '@/db/schema'
import { tanstackStartCookies } from 'better-auth/tanstack-start'

// Dynamic auth instance for application runtime
export const getAuth = () => {
  const db = getDb()
  return betterAuth({
    database: drizzleAdapter(db, {
      provider: 'sqlite',
      schema: dbSchema,
    }),
    emailAndPassword: {
      enabled: true,
    },
    plugins: [
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
  emailAndPassword: {
    enabled: true,
  },
  plugins: [tanstackStartCookies()],
})
