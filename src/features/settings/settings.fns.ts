import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { getDb } from '@/db'
import { user } from '@/db/schema'
import { eq, sql } from 'drizzle-orm'

let isUserThemeColumnsChecked = false

async function ensureUserThemeColumnsExist(db: any) {
  if (isUserThemeColumnsChecked) return
  try {
    await db.run(
      sql`ALTER TABLE user ADD COLUMN theme_mode TEXT DEFAULT 'dark'`
    )
  } catch {
    // Column already exists
  }
  try {
    await db.run(
      sql`ALTER TABLE user ADD COLUMN theme_accent TEXT DEFAULT 'violet'`
    )
  } catch {
    // Column already exists
  }
  try {
    await db.run(sql`ALTER TABLE user ADD COLUMN theme_custom_color TEXT`)
  } catch {
    // Column already exists
  }
  isUserThemeColumnsChecked = true
}

export const themeSettingsSchema = z.object({
  mode: z.enum(['light', 'dark', 'system']),
  accent: z.enum([
    'violet',
    'emerald',
    'ocean',
    'amber',
    'rose',
    'cyberpunk',
    'custom',
  ]),
  customColor: z.string().optional(),
})

export type ThemeSettingsInput = z.infer<typeof themeSettingsSchema>

export const saveThemeSettingsFn = createServerFn({ method: 'POST' })
  .validator((data: ThemeSettingsInput) => themeSettingsSchema.parse(data))
  .handler(async ({ data }) => {
    const { getAuth } = await import('@/shared/lib/auth')
    const { getRequest } = await import('@tanstack/react-start/server')
    const request = getRequest()

    let userId: string | null = null

    if (request) {
      try {
        const auth = getAuth()
        const session = await auth.api.getSession({
          headers: request.headers,
        })
        if (session?.user) {
          userId = session.user.id
        }
      } catch (err) {
        console.warn('⚠️ Could not retrieve auth session:', err)
      }
    }

    const db = getDb()
    await ensureUserThemeColumnsExist(db)

    if (userId) {
      await db
        .update(user)
        .set({
          themeMode: data.mode,
          themeAccent: data.accent,
          themeCustomColor: data.customColor || null,
          updatedAt: new Date(),
        })
        .where(eq(user.id, userId))

      return { success: true, message: 'Theme saved to account' }
    }

    // If running in dev without session, find the first user
    const firstUser = await db.select({ id: user.id }).from(user).limit(1)
    if (firstUser.length > 0) {
      await db
        .update(user)
        .set({
          themeMode: data.mode,
          themeAccent: data.accent,
          themeCustomColor: data.customColor || null,
          updatedAt: new Date(),
        })
        .where(eq(user.id, firstUser[0].id))

      return { success: true, message: 'Theme saved to local profile' }
    }

    return { success: true, message: 'Theme applied' }
  })

export const getThemeSettingsFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    const { getAuth } = await import('@/shared/lib/auth')
    const { getRequest } = await import('@tanstack/react-start/server')
    const request = getRequest()

    let userId: string | null = null

    if (request) {
      try {
        const auth = getAuth()
        const session = await auth.api.getSession({
          headers: request.headers,
        })
        if (session?.user) {
          userId = session.user.id
        }
      } catch {
        // Unauthenticated
      }
    }

    const db = getDb()
    await ensureUserThemeColumnsExist(db)

    try {
      if (userId) {
        const [foundUser] = await db
          .select({
            themeMode: user.themeMode,
            themeAccent: user.themeAccent,
            themeCustomColor: user.themeCustomColor,
          })
          .from(user)
          .where(eq(user.id, userId))
          .limit(1)

        if (foundUser) {
          return {
            mode: (foundUser.themeMode || 'dark') as
              'light' | 'dark' | 'system',
            accent: (foundUser.themeAccent || 'violet') as any,
            customColor: foundUser.themeCustomColor || '#7c3aed',
          }
        }
      }
    } catch {
      // Fallback
    }

    return { mode: 'dark', accent: 'violet', customColor: '#7c3aed' }
  }
)
