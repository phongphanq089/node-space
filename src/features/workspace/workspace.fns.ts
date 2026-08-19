import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { getDb } from '@/db'
import { workspace, folder, note, tag, user } from '@/db/schema'
import { eq, desc, and, like, sql } from 'drizzle-orm'

let isWorkspaceTagsColumnChecked = false

async function ensureWorkspaceTagsColumnExists(db: any) {
  if (isWorkspaceTagsColumnChecked) return
  try {
    await db.run(sql`ALTER TABLE workspace ADD COLUMN tags TEXT`)
  } catch {
    // Column already exists
  }
  isWorkspaceTagsColumnChecked = true
}

export const createWorkspaceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Workspace name is required.')
    .max(50, 'Workspace name must be at most 50 characters.'),
  color: z.string().optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
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
    await ensureWorkspaceTagsColumnExists(db)

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
      tags: data.tags || [],
      ownerId: ownerId,
      createdAt: now,
      updatedAt: now,
    }

    try {
      await db.insert(workspace).values(newWorkspace)
    } catch {
      const { tags: _, ...fallbackWs } = newWorkspace as any
      await db.insert(workspace).values(fallbackWs)
    }

    return {
      success: true,
      workspace: newWorkspace,
    }
  })

export const getWorkspacesFn = createServerFn({ method: 'GET' })
  .validator(
    (
      data:
        | {
            limit?: number
            offset?: number
            search?: string
          }
        | undefined
    ) =>
      z
        .object({
          limit: z.number().optional(),
          offset: z.number().optional(),
          search: z.string().optional(),
        })
        .parse(data ?? {})
  )
  .handler(async ({ data }) => {
    const limit = data?.limit ?? 10
    const offset = data?.offset ?? 0
    const db = getDb()
    await ensureWorkspaceTagsColumnExists(db)

    const conditions = []
    if (data?.search && data.search.trim() !== '') {
      conditions.push(like(workspace.name, `%${data.search.trim()}%`))
    }

    let rows: any[] = []
    try {
      rows = await db
        .select()
        .from(workspace)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(workspace.createdAt))
        .limit(limit + 1)
        .offset(offset)
    } catch {
      // Fallback
    }

    const hasMore = rows.length > limit
    const rawItems = hasMore ? rows.slice(0, limit) : rows
    const items = rawItems.map((w: any) => {
      let parsedTags: string[] = []
      if (Array.isArray(w.tags)) {
        parsedTags = w.tags
      } else if (typeof w.tags === 'string' && w.tags.trim()) {
        try {
          parsedTags = JSON.parse(w.tags)
        } catch {
          parsedTags = []
        }
      }
      return {
        ...w,
        tags: parsedTags,
      }
    })

    return {
      items,
      hasMore,
    }
  })

export const updateWorkspaceSchema = z.object({
  workspaceId: z.string().min(1, 'Workspace ID is required.'),
  name: z
    .string()
    .trim()
    .min(1, 'Workspace name is required.')
    .max(50, 'Workspace name must be at most 50 characters.')
    .optional(),
  color: z.string().optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
})

export type UpdateWorkspaceInput = z.infer<typeof updateWorkspaceSchema>

export const updateWorkspaceFn = createServerFn({ method: 'POST' })
  .validator((data: UpdateWorkspaceInput) => updateWorkspaceSchema.parse(data))
  .handler(async ({ data }) => {
    const db = getDb()
    await ensureWorkspaceTagsColumnExists(db)

    const updatePayload: Record<string, any> = {
      updatedAt: new Date(),
    }

    if (data.name !== undefined) updatePayload.name = data.name
    if (data.color !== undefined) updatePayload.color = data.color
    if (data.description !== undefined)
      updatePayload.description = data.description
    if (data.tags !== undefined) updatePayload.tags = data.tags

    try {
      await db
        .update(workspace)
        .set(updatePayload)
        .where(eq(workspace.id, data.workspaceId))
    } catch {
      const { tags: _, ...fallbackPayload } = updatePayload
      await db
        .update(workspace)
        .set(fallbackPayload)
        .where(eq(workspace.id, data.workspaceId))
    }

    return { success: true, workspaceId: data.workspaceId }
  })

export const deleteWorkspaceFn = createServerFn({ method: 'POST' })
  .validator((data: { workspaceId: string }) =>
    z.object({ workspaceId: z.string().min(1) }).parse(data)
  )
  .handler(async ({ data }) => {
    const db = getDb()

    // 1. Find all folders in this workspace to delete all notes inside them
    const workspaceFolders = await db
      .select({ id: folder.id })
      .from(folder)
      .where(eq(folder.workspace_id, data.workspaceId))

    for (const f of workspaceFolders) {
      await db.delete(note).where(eq(note.folder_id, f.id))
    }

    // 2. Cascade delete notes belonging directly to this workspace
    await db.delete(note).where(eq(note.workspace_id, data.workspaceId))

    // 3. Cascade delete all folders in this workspace
    await db.delete(folder).where(eq(folder.workspace_id, data.workspaceId))

    // 4. Cascade delete all tags in this workspace
    await db.delete(tag).where(eq(tag.workspace_id, data.workspaceId))

    // 5. Delete the workspace itself
    await db.delete(workspace).where(eq(workspace.id, data.workspaceId))

    return { success: true, workspaceId: data.workspaceId }
  })
