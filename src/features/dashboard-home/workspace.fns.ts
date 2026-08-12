import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { getDb } from '@/db'
import { workspace, user } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'

export const createWorkspaceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Workspace name is required.')
    .max(50, 'Workspace name must be at most 50 characters.'),
  color: z.string().optional(),
  description: z.string().optional(),
})

export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>

export const createWorkspaceFn = createServerFn({ method: 'POST' })
  .validator((data: CreateWorkspaceInput) => createWorkspaceSchema.parse(data))
  .handler(async ({ data }) => {
    const { getAuth } = await import('@/shared/lib/auth')
    const { getRequest } = await import('@tanstack/react-start/server')
    const request = getRequest()

    let ownerId: string | null = null

    if (request) {
      try {
        const auth = getAuth()
        const session = await auth.api.getSession({
          headers: request.headers,
        })
        if (session?.user) {
          ownerId = session.user.id
        }
      } catch (err) {
        console.warn('⚠️ Could not retrieve auth session:', err)
      }
    }

    const db = getDb()

    // Fallback ownerId if unauthenticated in dev
    if (!ownerId) {
      const existingUser = await db.select({ id: user.id }).from(user).limit(1)
      if (existingUser.length > 0) {
        ownerId = existingUser[0].id
      } else {
        const guestId = crypto.randomUUID()
        await db.insert(user).values({
          id: guestId,
          name: 'Guest User',
          email: 'guest@nodespace.local',
          emailVerified: false,
          role: 'user',
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        ownerId = guestId
      }
    }

    const newWsId = crypto.randomUUID()
    const now = new Date()

    const newWorkspace = {
      id: newWsId,
      name: data.name,
      description: data.description || null,
      color: data.color || '#3b82f6',
      ownerId: ownerId,
      createdAt: now,
      updatedAt: now,
    }

    await db.insert(workspace).values(newWorkspace)

    return {
      success: true,
      workspace: newWorkspace,
    }
  })

export const getWorkspacesFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    const db = getDb()
    const result = await db
      .select()
      .from(workspace)
      .orderBy(desc(workspace.createdAt))

    return result
  }
)

export const deleteWorkspaceFn = createServerFn({ method: 'POST' })
  .validator((data: { workspaceId: string }) =>
    z.object({ workspaceId: z.string().min(1) }).parse(data)
  )
  .handler(async ({ data }) => {
    const db = getDb()
    await db.delete(workspace).where(eq(workspace.id, data.workspaceId))

    return { success: true, workspaceId: data.workspaceId }
  })
