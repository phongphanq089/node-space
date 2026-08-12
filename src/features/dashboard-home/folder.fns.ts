import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { getDb } from '@/db'
import { folder, user, workspace } from '@/db/schema'
import { eq, or, desc } from 'drizzle-orm'

export const createFolderSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Folder name is required.')
    .max(50, 'Folder name must be at most 50 characters.'),
  workspaceId: z.string().optional(),
  color: z.string().optional(),
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
      createdAt: now,
      updatedAt: now,
    }

    await db.insert(folder).values(newFolder)

    return {
      success: true,
      folder: newFolder,
    }
  })

export const getFoldersFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    const db = getDb()
    const result = await db
      .select()
      .from(folder)
      .orderBy(desc(folder.createdAt))

    return result
  }
)

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
