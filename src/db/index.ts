import { drizzle } from 'drizzle-orm/d1'
import { env } from 'cloudflare:workers'

export const getDb = () => {
  if (!env.DB) {
    throw new Error(
      'D1 Database binding "DB" is not available. Check your wrangler.toml configuration.'
    )
  }
  return drizzle(env.DB)
}
