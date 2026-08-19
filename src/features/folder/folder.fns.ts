import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { getDb } from '@/db'
import { folder, user, workspace } from '@/db/schema'
import { eq, or, desc, and, like, sql } from 'drizzle-orm'
import { ensureTagsExist } from '../tag'

let isFolderColumnsChecked = false

async function ensureFolderColumnsExist(db: any) {
  if (isFolderColumnsChecked) return

  const alters = [
    sql`ALTER TABLE folder ADD COLUMN tags TEXT`,
    sql`ALTER TABLE folder ADD COLUMN color TEXT`,
    sql`ALTER TABLE folder ADD COLUMN image TEXT`,
    sql`ALTER TABLE folder ADD COLUMN is_favorite INTEGER DEFAULT 0`,
  ]

  for (const query of alters) {
    try {
      await db.run(query)
    } catch {
      // Column might already exist
    }
  }

  isFolderColumnsChecked = true
}

export const createFolderSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Folder name is required.')
    .max(50, 'Folder name must be at most 50 characters.'),
  workspaceId: z.string().optional(),
  color: z.string().optional(),
  tags: z.array(z.string()).optional(),
  image: z.string().optional(),
  parentId: z.string().optional(),
})

export type CreateFolderInput = z.infer<typeof createFolderSchema>

export const createFolderFn = createServerFn({ method: 'POST' })
  .validator((data: CreateFolderInput) => createFolderSchema.parse(data))
  .handler(async ({ data }) => {
    const { getAuth } = await import('@/shared/lib/auth')
    const { getRequest } = await import('@tanstack/react-start/server')
    const request = getRequest()

    let authorId: string | null = null

    if (request) {
      try {
        const auth = getAuth()
        const session = await auth.api.getSession({
          headers: request.headers,
        })
        if (session?.user) {
          authorId = session.user.id
        }
      } catch (err) {
        console.warn('⚠️ Could not retrieve auth session:', err)
      }
    }

    const db = getDb()
    await ensureFolderColumnsExist(db)

    // Fallback authorId if unauthenticated in dev
    if (!authorId) {
      const existingUser = await db.select({ id: user.id }).from(user).limit(1)
      if (existingUser.length > 0) {
        authorId = existingUser[0].id
      } else {
        // Create a default guest/dev user record if DB is completely empty
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
        authorId = guestId
      }
    }

    const now = new Date()
    let targetWorkspaceId: string | null = null

    // Ensure valid workspace_id reference in DB
    if (data.workspaceId && data.workspaceId.trim() !== '') {
      const existingWs = await db
        .select({ id: workspace.id })
        .from(workspace)
        .where(
          or(
            eq(workspace.id, data.workspaceId),
            eq(workspace.name, data.workspaceId)
          )
        )
        .limit(1)

      if (existingWs.length > 0) {
        targetWorkspaceId = existingWs[0].id
      } else {
        // Create workspace row automatically if selecting a new workspace name
        const newWsId = crypto.randomUUID()
        await db.insert(workspace).values({
          id: newWsId,
          name: data.workspaceId,
          ownerId: authorId,
          createdAt: now,
          updatedAt: now,
        })
        targetWorkspaceId = newWsId
      }
    }

    const newFolderId = crypto.randomUUID()

    const newFolder = {
      id: newFolderId,
      name: data.name,
      workspace_id: targetWorkspaceId,
      author_id: authorId,
      parentId: data.parentId || null,
      color: data.color || null,
      image: data.image || null,
      tags: data.tags || [],
      createdAt: now,
      updatedAt: now,
    }

    if (data.tags && data.tags.length > 0) {
      await ensureTagsExist(db, data.tags, targetWorkspaceId)
    }

    try {
      await db.insert(folder).values(newFolder)
    } catch {
      const { tags: _, ...fallbackFolder } = newFolder as any
      await db.insert(folder).values(fallbackFolder)
    }

    return {
      success: true,
      folder: newFolder,
    }
  })

export const getFoldersFn = createServerFn({ method: 'GET' })
  .validator(
    (
      data:
        | {
            limit?: number
            offset?: number
            search?: string
            workspaceId?: string | null
            tag?: string | null
          }
        | undefined
    ) =>
      z
        .object({
          limit: z.number().optional(),
          offset: z.number().optional(),
          search: z.string().optional(),
          workspaceId: z.string().nullable().optional(),
          tag: z.string().nullable().optional(),
        })
        .parse(data ?? {})
  )
  .handler(async ({ data }) => {
    const limit = data?.limit ?? 10
    const offset = data?.offset ?? 0
    const db = getDb()
    await ensureFolderColumnsExist(db)

    let authorId: string | null = null
    try {
      const existingUser = await db.select({ id: user.id }).from(user).limit(1)
      if (existingUser.length > 0) {
        authorId = existingUser[0].id
      }
    } catch {
      // Ignore user query failure in dev
    }

    const conditions = []
    if (data?.workspaceId && data.workspaceId.trim() !== '') {
      conditions.push(eq(folder.workspace_id, data.workspaceId))
    }
    if (data?.search && data.search.trim() !== '') {
      conditions.push(like(folder.name, `%${data.search.trim()}%`))
    }
    if (data?.tag && data.tag.trim() !== '') {
      conditions.push(like(folder.tags, `%${data.tag.trim()}%`))
    }

    let rows: any[] = []
    try {
      rows = await db
        .select()
        .from(folder)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(folder.createdAt))
        .limit(limit + 1)
        .offset(offset)
    } catch (err) {
      console.warn('⚠️ Querying folders table failed:', err)
    }

    // Auto-seed default folders into DB if table is completely empty
    if (rows.length === 0 && offset === 0 && conditions.length === 0) {
      try {
        const DEFAULT_SEED_FOLDERS = [
          {
            name: 'Documentation',
            color: '#a78bfa',
            tags: ['productivity', 'clean-code'],
          },
          { name: 'Algorithms', color: '#34d399', tags: ['algorithm', 'tech'] },
          {
            name: 'DevOps & Systems',
            color: '#60a5fa',
            tags: ['devops', 'linux'],
          },
          { name: 'Reading List', color: '#f87171', tags: ['book', 'usecase'] },
          {
            name: 'Database & Architecture',
            color: '#f97316',
            tags: ['database', 'stack'],
          },
        ]

        for (const seed of DEFAULT_SEED_FOLDERS) {
          const seedValues = {
            id: crypto.randomUUID(),
            name: seed.name,
            color: seed.color,
            tags: seed.tags,
            author_id: authorId || 'guest_user',
            createdAt: new Date(),
            updatedAt: new Date(),
          }
          try {
            await db.insert(folder).values(seedValues)
          } catch {
            const { tags: _, ...fallbackSeed } = seedValues as any
            await db.insert(folder).values(fallbackSeed)
          }
        }

        rows = await db
          .select()
          .from(folder)
          .orderBy(desc(folder.createdAt))
          .limit(limit + 1)
          .offset(offset)
      } catch (seedErr) {
        console.warn('⚠️ Seeding default folders failed:', seedErr)
      }
    }

    const hasMore = rows.length > limit
    const rawItems = hasMore ? rows.slice(0, limit) : rows
    const items = rawItems.map((f: any) => {
      let parsedTags: string[] = []
      if (Array.isArray(f.tags)) {
        parsedTags = f.tags
      } else if (typeof f.tags === 'string' && f.tags.trim()) {
        try {
          parsedTags = JSON.parse(f.tags)
        } catch {
          parsedTags = []
        }
      }

      return {
        ...f,
        tags: parsedTags,
      }
    })

    return {
      items,
      hasMore,
    }
  })

export const deleteFolderFn = createServerFn({ method: 'POST' })
  .validator((data: { folderId: string }) =>
    z.object({ folderId: z.string().min(1) }).parse(data)
  )
  .handler(async ({ data }) => {
    const db = getDb()
    await db.delete(folder).where(eq(folder.id, data.folderId))

    return { success: true, folderId: data.folderId }
  })

export const toggleFavoriteFolderFn = createServerFn({ method: 'POST' })
  .validator((data: { folderId: string }) =>
    z.object({ folderId: z.string().min(1) }).parse(data)
  )
  .handler(async ({ data }) => {
    const db = getDb()
    const targetFolder = await db
      .select({ id: folder.id, isFavorite: folder.isFavorite })
      .from(folder)
      .where(eq(folder.id, data.folderId))
      .limit(1)

    if (targetFolder.length === 0) {
      throw new Error('Folder not found')
    }

    const nextState = !targetFolder[0].isFavorite
    await db
      .update(folder)
      .set({ isFavorite: nextState, updatedAt: new Date() })
      .where(eq(folder.id, data.folderId))

    return { success: true, folderId: data.folderId, isFavorite: nextState }
  })

export const updateFolderSchema = z.object({
  folderId: z.string().min(1, 'Folder ID is required.'),
  name: z
    .string()
    .trim()
    .min(1, 'Folder name is required.')
    .max(50, 'Folder name must be at most 50 characters.')
    .optional(),
  workspaceId: z.string().optional(),
  color: z.string().optional(),
  tags: z.array(z.string()).optional(),
  image: z.string().optional(),
  parentId: z.string().optional(),
})

export type UpdateFolderInput = z.infer<typeof updateFolderSchema>

export const updateFolderFn = createServerFn({ method: 'POST' })
  .validator((data: UpdateFolderInput) => updateFolderSchema.parse(data))
  .handler(async ({ data }) => {
    const db = getDb()
    await ensureFolderColumnsExist(db)

    const updatePayload: Record<string, any> = {
      updatedAt: new Date(),
    }

    if (data.name !== undefined) updatePayload.name = data.name
    if (data.color !== undefined) updatePayload.color = data.color
    if (data.image !== undefined) updatePayload.image = data.image
    if (data.tags !== undefined) {
      updatePayload.tags = data.tags
      if (data.tags.length > 0) {
        await ensureTagsExist(db, data.tags, data.workspaceId)
      }
    }
    if (data.parentId !== undefined)
      updatePayload.parentId = data.parentId || null

    if (data.workspaceId !== undefined) {
      if (data.workspaceId && data.workspaceId.trim() !== '') {
        const existingWs = await db
          .select({ id: workspace.id })
          .from(workspace)
          .where(
            or(
              eq(workspace.id, data.workspaceId),
              eq(workspace.name, data.workspaceId)
            )
          )
          .limit(1)

        if (existingWs.length > 0) {
          updatePayload.workspace_id = existingWs[0].id
        } else {
          let ownerId: string | null = null
          const existingUser = await db
            .select({ id: user.id })
            .from(user)
            .limit(1)
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

          const newWsId = crypto.randomUUID()
          await db.insert(workspace).values({
            id: newWsId,
            name: data.workspaceId,
            ownerId: ownerId,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
          updatePayload.workspace_id = newWsId
        }
      } else {
        updatePayload.workspace_id = null
      }
    }

    try {
      await db
        .update(folder)
        .set(updatePayload)
        .where(eq(folder.id, data.folderId))
    } catch {
      const { tags: _, ...fallbackPayload } = updatePayload
      await db
        .update(folder)
        .set(fallbackPayload)
        .where(eq(folder.id, data.folderId))
    }

    return { success: true, folderId: data.folderId }
  })
