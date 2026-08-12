import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core'

export const SYSTEM_ROLES = ['user', 'lifetime', 'admin'] as const
export type SystemRole = (typeof SYSTEM_ROLES)[number]

// ========= DESIGN SYSTEM USER DB ============= //
export const user = sqliteTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: integer('emailVerified', { mode: 'boolean' }).notNull(),
  image: text('image'),
  role: text('role', { enum: SYSTEM_ROLES }).default('user').notNull(),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull(),
})

export const session = sqliteTable('session', {
  id: text('id').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  expiresAt: integer('expiresAt', { mode: 'timestamp' }).notNull(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull(),
})

export const account = sqliteTable('account', {
  id: text('id').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  password: text('password'),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: integer('accessTokenExpiresAt', { mode: 'timestamp' }),
  refreshTokenExpiresAt: integer('refreshTokenExpiresAt', {
    mode: 'timestamp',
  }),
  scope: text('scope'),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull(),
})

export const verification = sqliteTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: integer('expiresAt', { mode: 'timestamp' }).notNull(),
  createdAt: integer('createdAt', { mode: 'timestamp' }),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }),
})

// ========= DESIGN SYSTEM NOTE DB ============= //

export const workspace = sqliteTable('workspace', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull().unique(),
  description: text('description'),
  color: text('color'),
  isFavorite: integer('is_favorite', { mode: 'boolean' })
    .default(false)
    .notNull(),
  ownerId: text('owner_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  createdAt: integer('createdAt', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .notNull(),
})

export const folder = sqliteTable('folder', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  workspace_id: text('workspace_id').references(() => workspace.id),
  author_id: text('author_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  parentId: text('parent_id'),
  name: text('name').notNull(),
  color: text('color'),
  image: text('image'),
  isFavorite: integer('is_favorite', { mode: 'boolean' })
    .default(false)
    .notNull(),
  createdAt: integer('createdAt', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .notNull(),
})

export const note = sqliteTable('note', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  workspace_id: text('workspace_id').references(() => workspace.id),
  folder_id: text('folder_id')
    .notNull()
    .references(() => folder.id, { onDelete: 'set null' }),
  author_id: text('author_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  isPinned: integer('is_pinned', { mode: 'boolean' }).default(false).notNull(),
  isFavorite: integer('is_favorite', { mode: 'boolean' })
    .default(false)
    .notNull(),
  isArchived: integer('is_archived', { mode: 'boolean' })
    .default(false)
    .notNull(),
  isTrash: integer('is_trash', { mode: 'boolean' }).default(false).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .notNull(),
})

export const tag = sqliteTable('tag', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull().unique(),
  workspace_id: text('workspace_id').references(() => workspace.id, {
    onDelete: 'cascade',
  }),
})

export const noteTags = sqliteTable(
  'note_tag',
  {
    noteId: text('note_id')
      .notNull()
      .references(() => note.id, { onDelete: 'cascade' }),
    tagId: text('tag_id')
      .notNull()
      .references(() => tag.id, { onDelete: 'cascade' }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.noteId, table.tagId] }),
  })
)

export const noteShares = sqliteTable('note_share', {
  id: text('id').primaryKey(),
  noteId: text('note_id')
    .notNull()
    .references(() => note.id, { onDelete: 'cascade' }),
  accessLevel: text('access_level', { enum: ['public_read'] })
    .default('public_read')
    .notNull(),
  passwordHash: text('password_hash'),
  expiresAt: integer('expires_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
})
