import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getDb } from '@/db'
import { sql } from 'drizzle-orm'
import LandingPage from '@/app/landing-page'

const testD1Connection = createServerFn({ method: 'GET' }).handler(async () => {
  try {
    const db = getDb()
    // Run a simple query to verify the D1 database connection
    const result = await db.run(sql`SELECT 1 as test`)
    console.log(
      '🚀 [D1 Connection Test] Connected successfully! Result:',
      result
    )
    return { success: true, message: 'D1 connected successfully' }
  } catch (error) {
    console.error('❌ [D1 Connection Test] Connection failed:', error)
    return { success: false, error: String(error) }
  }
})

export const Route = createFileRoute('/')({
  loader: async () => {
    return await testD1Connection()
  },
  component: LandingPage,
})
