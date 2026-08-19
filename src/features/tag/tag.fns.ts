import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { getDb } from '@/db'
import { tag } from '@/db/schema'
import { eq, like, and } from 'drizzle-orm'

export const getTagsInputSchema = z.object({
  search: z.string().optional(),
  workspaceId: z.string().optional(),
  page: z.number().default(0),
  limit: z.number().default(50),
})

export type GetTagsInput = z.infer<typeof getTagsInputSchema>

export interface TagRecord {
  id: string
  name: string
  count: number
  color: string
  bg: string
  workspaceId?: string | null
}

const PRESET_TAG_COLORS = [
  { color: '#a78bfa', bg: 'rgba(167, 139, 250, 0.12)' },
  { color: '#34d399', bg: 'rgba(52, 211, 153, 0.12)' },
  { color: '#60a5fa', bg: 'rgba(96, 165, 250, 0.12)' },
  { color: '#f87171', bg: 'rgba(248, 113, 113, 0.12)' },
  { color: '#f97316', bg: 'rgba(249, 115, 22, 0.12)' },
  { color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.12)' },
  { color: '#a855f7', bg: 'rgba(168, 85, 247, 0.12)' },
  { color: '#14b8a6', bg: 'rgba(20, 184, 166, 0.12)' },
  { color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.12)' },
  { color: '#6366f1', bg: 'rgba(99, 102, 241, 0.12)' },
  { color: '#ec4899', bg: 'rgba(236, 72, 153, 0.12)' },
  { color: '#eab308', bg: 'rgba(234, 179, 8, 0.12)' },
]

export const DEFAULT_TAGS_DATA: TagRecord[] = [
  {
    id: 't1',
    name: 'productivity',
    count: 5,
    color: '#a78bfa',
    bg: 'rgba(167, 139, 250, 0.12)',
  },
  {
    id: 't2',
    name: 'algorithm',
    count: 3,
    color: '#34d399',
    bg: 'rgba(52, 211, 153, 0.12)',
  },
  {
    id: 't3',
    name: 'devops',
    count: 4,
    color: '#60a5fa',
    bg: 'rgba(96, 165, 250, 0.12)',
  },
  {
    id: 't4',
    name: 'book',
    count: 2,
    color: '#f87171',
    bg: 'rgba(248, 113, 113, 0.12)',
  },
  {
    id: 't5',
    name: 'database',
    count: 4,
    color: '#f97316',
    bg: 'rgba(249, 115, 22, 0.12)',
  },
  {
    id: 't6',
    name: 'clean-code',
    count: 6,
    color: '#3b82f6',
    bg: 'rgba(59, 130, 246, 0.12)',
  },
  {
    id: 't7',
    name: 'linux',
    count: 3,
    color: '#a855f7',
    bg: 'rgba(168, 85, 247, 0.12)',
  },
  {
    id: 't8',
    name: 'overview',
    count: 3,
    color: '#14b8a6',
    bg: 'rgba(20, 184, 166, 0.12)',
  },
  {
    id: 't9',
    name: 'feature',
    count: 4,
    color: '#06b6d4',
    bg: 'rgba(6, 182, 212, 0.12)',
  },
  {
    id: 't10',
    name: 'tech',
    count: 7,
    color: '#6366f1',
    bg: 'rgba(99, 102, 241, 0.12)',
  },
  {
    id: 't11',
    name: 'stack',
    count: 2,
    color: '#ec4899',
    bg: 'rgba(236, 72, 153, 0.12)',
  },
  {
    id: 't12',
    name: 'roadmap',
    count: 2,
    color: '#eab308',
    bg: 'rgba(234, 179, 8, 0.12)',
  },
]

let isTagsSeeded = false

export async function ensureTagsExist(
  db: any,
  tagNames: string[] = [],
  workspaceId?: string | null
) {
  if (!tagNames || tagNames.length === 0) return
  for (const rawName of tagNames) {
    const cleanName = rawName.replace(/^#/, '').toLowerCase().trim()
    if (!cleanName) continue
    try {
      const existing = await db
        .select()
        .from(tag)
        .where(eq(tag.name, cleanName))
        .limit(1)
      if (existing.length === 0) {
        await db.insert(tag).values({
          id: crypto.randomUUID(),
          name: cleanName,
          workspace_id: workspaceId || null,
        })
      }
    } catch {
      // Ignore duplicate/conflict errors
    }
  }
}

async function autoSeedTagsIfEmpty(db: any, workspaceId?: string) {
  if (isTagsSeeded) return
  try {
    const existing = await db.select().from(tag).limit(1)
    if (existing.length === 0) {
      for (const dt of DEFAULT_TAGS_DATA) {
        try {
          await db.insert(tag).values({
            id: crypto.randomUUID(),
            name: dt.name,
            workspace_id: workspaceId || null,
          })
        } catch {
          // ignore duplicate
        }
      }
    }
    isTagsSeeded = true
  } catch {
    // Database table might not be initialized
  }
}

export const getTagsFn = createServerFn({ method: 'GET' })
  .validator((data?: GetTagsInput) => getTagsInputSchema.parse(data ?? {}))
  .handler(async ({ data }) => {
    const db = getDb()
    const limit = data.limit ?? 50
    const page = data.page ?? 0
    const search = data.search?.trim().toLowerCase() ?? ''

    try {
      await autoSeedTagsIfEmpty(db, data.workspaceId)

      const conditions = []

      if (search) {
        conditions.push(like(tag.name, `%${search}%`))
      }

      if (data.workspaceId) {
        conditions.push(eq(tag.workspace_id, data.workspaceId))
      }

      const rows = await db
        .select()
        .from(tag)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .limit(limit + 1)
        .offset(page * limit)

      const hasMore = rows.length > limit
      const items = rows.slice(0, limit).map((t, index) => {
        const colorObj = PRESET_TAG_COLORS[index % PRESET_TAG_COLORS.length]
        return {
          id: t.id,
          name: t.name,
          count: 1,
          color: colorObj.color,
          bg: colorObj.bg,
          workspaceId: t.workspace_id,
        }
      })

      return { items, hasMore }
    } catch {
      // Fallback if DB is unavailable
      let filtered = DEFAULT_TAGS_DATA
      if (search) {
        filtered = DEFAULT_TAGS_DATA.filter((t) =>
          t.name.toLowerCase().includes(search)
        )
      }

      const offset = page * limit
      const items = filtered.slice(offset, offset + limit)
      const hasMore = offset + limit < filtered.length

      return { items, hasMore }
    }
  })

export const createTagSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Tag name is required.')
    .max(30, 'Tag name must be at most 30 characters.'),
  workspaceId: z.string().optional(),
})

export type CreateTagInput = z.infer<typeof createTagSchema>

export const createTagFn = createServerFn({ method: 'POST' })
  .validator((data: CreateTagInput) => createTagSchema.parse(data))
  .handler(async ({ data }) => {
    const db = getDb()
    const cleanName = data.name.replace(/^#/, '').toLowerCase().trim()

    // Check if tag already exists
    const existing = await db
      .select()
      .from(tag)
      .where(eq(tag.name, cleanName))
      .limit(1)

    if (existing.length > 0) {
      return {
        success: true,
        tag: { id: existing[0].id, name: existing[0].name },
      }
    }

    const newTagId = crypto.randomUUID()
    await db.insert(tag).values({
      id: newTagId,
      name: cleanName,
      workspace_id: data.workspaceId || null,
    })

    return {
      success: true,
      tag: { id: newTagId, name: cleanName },
    }
  })

export const updateTagSchema = z.object({
  tagId: z.string().min(1, 'Tag ID is required.'),
  name: z
    .string()
    .trim()
    .min(1, 'Tag name is required.')
    .max(30, 'Tag name must be at most 30 characters.'),
})

export type UpdateTagInput = z.infer<typeof updateTagSchema>

export const updateTagFn = createServerFn({ method: 'POST' })
  .validator((data: UpdateTagInput) => updateTagSchema.parse(data))
  .handler(async ({ data }) => {
    const db = getDb()
    const cleanName = data.name.replace(/^#/, '').toLowerCase().trim()

    await db.update(tag).set({ name: cleanName }).where(eq(tag.id, data.tagId))

    return { success: true, tagId: data.tagId, name: cleanName }
  })

export const deleteTagFn = createServerFn({ method: 'POST' })
  .validator((data: { tagId: string }) =>
    z.object({ tagId: z.string().min(1) }).parse(data)
  )
  .handler(async ({ data }) => {
    const db = getDb()
    await db.delete(tag).where(eq(tag.id, data.tagId))

    return { success: true, tagId: data.tagId }
  })
