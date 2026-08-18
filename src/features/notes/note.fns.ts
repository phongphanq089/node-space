import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { getDb } from '@/db'
import { note, folder, user, workspace } from '@/db/schema'
import { eq, desc, and, like, sql, or } from 'drizzle-orm'

let isNoteColumnsChecked = false

async function ensureNoteColumnsExist(db: any) {
  if (isNoteColumnsChecked) return
  try {
    await db.run(sql`ALTER TABLE note ADD COLUMN content TEXT`)
  } catch {
    // Column might already exist
  }
  try {
    await db.run(sql`ALTER TABLE note ADD COLUMN tags TEXT`)
  } catch {
    // Column might already exist
  }
  isNoteColumnsChecked = true
}

// ==================== SCHEMAS ==================== //

export const createNoteSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Note title is required.')
    .max(100, 'Note title must be at most 100 characters.'),
  folderId: z.string().optional(),
  workspaceId: z.string().optional(),
  content: z.string().optional(),
  tags: z.array(z.string()).optional(),
  isPinned: z.boolean().optional(),
  isFavorite: z.boolean().optional(),
})

export type CreateNoteInput = z.infer<typeof createNoteSchema>

export const updateNoteSchema = z.object({
  id: z.string().min(1, 'Note ID is required.'),
  name: z.string().trim().min(1).max(100).optional(),
  folderId: z.string().optional().nullable(),
  workspaceId: z.string().optional().nullable(),
  content: z.string().optional(),
  tags: z.array(z.string()).optional(),
  isPinned: z.boolean().optional(),
  isFavorite: z.boolean().optional(),
  isArchived: z.boolean().optional(),
  isTrash: z.boolean().optional(),
})

export type UpdateNoteInput = z.infer<typeof updateNoteSchema>

export const getNotesSchema = z.object({
  folderId: z.string().optional(),
  workspaceId: z.string().optional(),
  search: z.string().optional(),
  tag: z.string().optional(),
  isPinned: z.boolean().optional(),
  isFavorite: z.boolean().optional(),
  isTrash: z.boolean().optional(),
  isArchived: z.boolean().optional(),
  limit: z.number().min(1).max(100).default(50),
  offset: z.number().min(0).default(0),
})

export type GetNotesInput = z.infer<typeof getNotesSchema>

// ==================== HELPER: GET USER ID ==================== //

async function getAuthenticatedUserId(db: any): Promise<string> {
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

  if (!authorId) {
    const existingUser = await db.select({ id: user.id }).from(user).limit(1)
    if (existingUser.length > 0) {
      authorId = existingUser[0].id
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
      authorId = guestId
    }
  }

  return authorId as string
}

// ==================== SERVER FUNCTIONS ==================== //

/**
 * Get Notes List with Filtering & Pagination
 */
export const getNotesFn = createServerFn({ method: 'GET' })
  .validator((data: GetNotesInput) => getNotesSchema.parse(data))
  .handler(async ({ data }) => {
    const db = getDb()
    await ensureNoteColumnsExist(db)

    const conditions = []

    // Trash filter: default to false unless explicitly querying trash
    if (data.isTrash !== undefined) {
      conditions.push(eq(note.isTrash, data.isTrash))
    } else {
      conditions.push(eq(note.isTrash, false))
    }

    if (data.isArchived !== undefined) {
      conditions.push(eq(note.isArchived, data.isArchived))
    }

    if (data.isPinned !== undefined) {
      conditions.push(eq(note.isPinned, data.isPinned))
    }

    if (data.isFavorite !== undefined) {
      conditions.push(eq(note.isFavorite, data.isFavorite))
    }

    // Folder filter: match ID or match folder name
    if (data.folderId && data.folderId.trim() !== '') {
      const decodedFolderId = decodeURIComponent(data.folderId)
      // Check if folder exists by ID or by name
      const matchingFolder = await db
        .select({ id: folder.id })
        .from(folder)
        .where(
          or(
            eq(folder.id, data.folderId),
            eq(folder.id, decodedFolderId),
            eq(folder.name, data.folderId),
            eq(folder.name, decodedFolderId)
          )
        )
        .limit(1)

      if (matchingFolder.length > 0) {
        conditions.push(eq(note.folder_id, matchingFolder[0].id))
      } else {
        conditions.push(
          or(
            eq(note.folder_id, data.folderId),
            eq(note.folder_id, decodedFolderId)
          )
        )
      }
    }

    // Workspace filter
    if (data.workspaceId && data.workspaceId.trim() !== '') {
      conditions.push(eq(note.workspace_id, data.workspaceId))
    }

    // Search filter
    if (data.search && data.search.trim() !== '') {
      conditions.push(like(note.name, `%${data.search.trim()}%`))
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined

    const items = await db
      .select({
        id: note.id,
        name: note.name,
        content: note.content,
        tags: note.tags,
        isPinned: note.isPinned,
        isFavorite: note.isFavorite,
        isArchived: note.isArchived,
        isTrash: note.isTrash,
        folderId: note.folder_id,
        workspaceId: note.workspace_id,
        authorId: note.author_id,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt,
      })
      .from(note)
      .where(whereClause)
      .orderBy(desc(note.isPinned), desc(note.updatedAt))
      .limit(data.limit)
      .offset(data.offset)

    return {
      items,
      hasMore: items.length === data.limit,
      totalCount: items.length,
    }
  })

/**
 * Get Single Note by ID
 */
export const getNoteByIdFn = createServerFn({ method: 'GET' })
  .validator((data: { noteId: string }) => data)
  .handler(async ({ data }) => {
    const db = getDb()
    await ensureNoteColumnsExist(db)

    const decodedId = decodeURIComponent(data.noteId)

    const items = await db
      .select()
      .from(note)
      .where(
        or(
          eq(note.id, data.noteId),
          eq(note.id, decodedId),
          eq(note.name, data.noteId),
          eq(note.name, decodedId)
        )
      )
      .limit(1)

    if (items.length === 0) {
      return null
    }

    return items[0]
  })

/**
 * Create a New Note
 */
export const createNoteFn = createServerFn({ method: 'POST' })
  .validator((data: CreateNoteInput) => createNoteSchema.parse(data))
  .handler(async ({ data }) => {
    const db = getDb()
    await ensureNoteColumnsExist(db)

    const authorId = await getAuthenticatedUserId(db)
    const now = new Date()

    let targetFolderId: string | null = null

    // Resolve target folder if passed
    if (data.folderId && data.folderId.trim() !== '') {
      const decodedFolderId = decodeURIComponent(data.folderId)
      const existingFolder = await db
        .select({ id: folder.id })
        .from(folder)
        .where(
          or(
            eq(folder.id, data.folderId),
            eq(folder.id, decodedFolderId),
            eq(folder.name, data.folderId),
            eq(folder.name, decodedFolderId)
          )
        )
        .limit(1)

      if (existingFolder.length > 0) {
        targetFolderId = existingFolder[0].id
      } else {
        targetFolderId = data.folderId
      }
    }

    let targetWorkspaceId: string | null = null
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
      }
    }

    const noteId = crypto.randomUUID()

    await db.insert(note).values({
      id: noteId,
      name: data.name,
      content:
        data.content ?? `# ${data.name}\n\nStart writing your note content...`,
      tags: data.tags ?? [],
      folder_id: targetFolderId,
      workspace_id: targetWorkspaceId,
      author_id: authorId,
      isPinned: !!data.isPinned,
      isFavorite: !!data.isFavorite,
      isArchived: false,
      isTrash: false,
      createdAt: now,
      updatedAt: now,
    })

    const inserted = await db
      .select()
      .from(note)
      .where(eq(note.id, noteId))
      .limit(1)

    return inserted[0]
  })

/**
 * Update an Existing Note
 */
export const updateNoteFn = createServerFn({ method: 'POST' })
  .validator((data: UpdateNoteInput) => updateNoteSchema.parse(data))
  .handler(async ({ data }) => {
    const db = getDb()
    await ensureNoteColumnsExist(db)

    const updatePayload: Record<string, any> = {
      updatedAt: new Date(),
    }

    if (data.name !== undefined) updatePayload.name = data.name
    if (data.content !== undefined) updatePayload.content = data.content
    if (data.tags !== undefined) updatePayload.tags = data.tags
    if (data.isPinned !== undefined) updatePayload.isPinned = data.isPinned
    if (data.isFavorite !== undefined)
      updatePayload.isFavorite = data.isFavorite
    if (data.isArchived !== undefined)
      updatePayload.isArchived = data.isArchived
    if (data.isTrash !== undefined) updatePayload.isTrash = data.isTrash
    if (data.folderId !== undefined) updatePayload.folder_id = data.folderId
    if (data.workspaceId !== undefined)
      updatePayload.workspace_id = data.workspaceId

    await db.update(note).set(updatePayload).where(eq(note.id, data.id))

    const updated = await db
      .select()
      .from(note)
      .where(eq(note.id, data.id))
      .limit(1)

    return updated[0]
  })

/**
 * Delete Note (or move to trash)
 */
export const deleteNoteFn = createServerFn({ method: 'POST' })
  .validator((data: { noteId: string; permanent?: boolean }) => data)
  .handler(async ({ data }) => {
    const db = getDb()

    if (data.permanent) {
      await db.delete(note).where(eq(note.id, data.noteId))
      return { success: true, permanent: true }
    }

    // Move to trash by default
    await db
      .update(note)
      .set({ isTrash: true, updatedAt: new Date() })
      .where(eq(note.id, data.noteId))

    return { success: true, permanent: false }
  })

/**
 * Toggle Pin Note
 */
export const togglePinNoteFn = createServerFn({ method: 'POST' })
  .validator((data: { noteId: string }) => data)
  .handler(async ({ data }) => {
    const db = getDb()
    await ensureNoteColumnsExist(db)

    const existing = await db
      .select({ id: note.id, isPinned: note.isPinned })
      .from(note)
      .where(eq(note.id, data.noteId))
      .limit(1)

    if (existing.length === 0) {
      throw new Error('Note not found.')
    }

    const newPinned = !existing[0].isPinned

    await db
      .update(note)
      .set({ isPinned: newPinned, updatedAt: new Date() })
      .where(eq(note.id, data.noteId))

    return { id: data.noteId, isPinned: newPinned }
  })

/**
 * Toggle Favorite Note
 */
export const toggleFavoriteNoteFn = createServerFn({ method: 'POST' })
  .validator((data: { noteId: string }) => data)
  .handler(async ({ data }) => {
    const db = getDb()
    await ensureNoteColumnsExist(db)

    const existing = await db
      .select({ id: note.id, isFavorite: note.isFavorite })
      .from(note)
      .where(eq(note.id, data.noteId))
      .limit(1)

    if (existing.length === 0) {
      throw new Error('Note not found.')
    }

    const newFavorite = !existing[0].isFavorite

    await db
      .update(note)
      .set({ isFavorite: newFavorite, updatedAt: new Date() })
      .where(eq(note.id, data.noteId))

    return { id: data.noteId, isFavorite: newFavorite }
  })
