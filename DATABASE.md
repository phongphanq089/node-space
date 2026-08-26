# Database Architecture & Integration Guide

This document details the database architecture, configurations, schemas, and workflows for **Note Flow**, utilizing **Cloudflare D1**, **Drizzle ORM**, and **Better Auth** in a **TanStack Start** environment.

---

## 🛠️ Tech Stack & Key Concepts

1. **Cloudflare D1**: A serverless, SQL-compliant SQLite database designed for the Cloudflare Workers runtime.
2. **Drizzle ORM**: A lightweight TypeScript ORM. We use the `@drizzle-orm/d1` driver for queries.
3. **Better Auth**: A framework-agnostic auth library. We use `@better-auth/drizzle-adapter` to map authentication tables (users, sessions, accounts, verifications) to D1 via Drizzle.

---

## ⚙️ Configuration Files

### 1. `wrangler.toml`

Defines Cloudflare Workers bindings. Since Drizzle Kit `v0.30+` generates migrations inside subdirectory folders, we must define `migrations_pattern` so Wrangler can discover and execute them.

```toml
[[d1_databases]]
binding = "DB"
database_name = "note-space-db"
database_id = "260d08a1-c939-41f3-be50-35f65c8570a9"
migrations_dir = "drizzle"
migrations_pattern = "drizzle/*/migration.sql" # Essential for Drizzle Kit subfolders
```

### 2. `drizzle.config.ts`

Instructs Drizzle Kit where your schemas and migrations are. We configure `dbCredentials.url` pointing to Wrangler's local SQLite state file, enabling **Drizzle Studio** to read and write directly to your local database.

```typescript
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: 'sqlite',
  schema: './src/db/schema.ts',
  out: './drizzle',
  dbCredentials: {
    // Points directly to the local miniflare D1 database file
    url: '.wrangler/state/v3/d1/miniflare-D1DatabaseObject/ae917dad9a27c2843d2d49e735e212070c1debd58679973a4aefaee8413c87d8.sqlite',
  },
})
```

---

## 🗄️ Database Connection Pattern

In a Cloudflare Workers environment, environment bindings (like `env.DB`) are only injected **per request** during the runtime execution lifecycle.

### Dynamic Initialization (`src/db/index.ts`)

To prevent `undefined` runtime database connection errors (which happen if we instantiate the client at the top-level module scope), we initialize the database connection dynamically inside a `getDb()` function:

```typescript
import { drizzle } from 'drizzle-orm/d1'
import { env } from 'cloudflare:workers'

export const getDb = () => {
  if (!env.DB) {
    throw new Error('D1 Database binding "DB" is not available.')
  }
  return drizzle(env.DB)
}
```

---

## 👥 Better Auth Integration

Authentication is set up dynamically for requests but exports a static fallback configuration to satisfy compile-time AST parsers like the Better Auth CLI.

### Auth Config (`src/lib/auth.ts`)

```typescript
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from '@better-auth/drizzle-adapter'
import { getDb } from '@/db'
import * as dbSchema from '@/db/schema'
import { tanstackStartCookies } from 'better-auth/tanstack-start'

// Used for API routes and Server Functions at runtime
export const getAuth = () => {
  const db = getDb()
  return betterAuth({
    database: drizzleAdapter(db, {
      provider: 'sqlite',
      schema: dbSchema,
    }),
    emailAndPassword: { enabled: true },
    plugins: [tanstackStartCookies()],
  })
}
```

### Catch-All API Route (`src/routes/api/auth/$.ts`)

All Better Auth requests are routed through this TanStack Start API endpoint:

```typescript
import { getAuth } from '@/lib/auth'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/auth/$')({
  server: {
    handlers: {
      GET: async ({ request }) => await getAuth().handler(request),
      POST: async ({ request }) => await getAuth().handler(request),
    },
  },
})
```

---

## 🗂️ Database Schemas (`src/db/schema.ts`)

We maintain our primary schemas alongside Better Auth's required tables. All timestamps in SQLite use `integer` format with `mode: 'timestamp'`.

1. **`users`**: Legacy/custom app users table.
2. **`user`**: Core Better Auth user credentials and profile state.
3. **`session`**: Active login sessions.
4. **`account`**: Credentials/password and OAuth provider tokens.
5. **`verification`**: Email verification OTPs, reset password tokens, etc.

---

## 💻 Commands & Scripts

The following scripts are configured in `package.json` for database operations:

| Command                  | Command Line                                          | Description                                                                 |
| :----------------------- | :---------------------------------------------------- | :-------------------------------------------------------------------------- |
| `pnpm db:generate`       | `drizzle-kit generate`                                | Compares `schema.ts` against existing migrations and generates SQL scripts. |
| `pnpm db:migrate:local`  | `wrangler d1 migrations apply note-space-db --local`  | Executes SQL migrations on your local sqlite database file.                 |
| `pnpm db:migrate:remote` | `wrangler d1 migrations apply note-space-db --remote` | Executes SQL migrations on the live production Cloudflare D1.               |
| `pnpm db:studio`         | `drizzle-kit studio`                                  | Starts a web GUI on `localhost` to view/edit local database tables.         |
| `pnpm db:drop`           | `drizzle-kit drop`                                    | Discards a generated migration script.                                      |
| `pnpm db:pull`           | `drizzle-kit pull`                                    | Introspects the database and generates schema code from existing tables.    |

---

## 🔄 Standard Workflows

### 1. Schema Change Flow (Local Development)

When you modify database tables in `src/db/schema.ts`:

1. Generate the migration file:
   ```bash
   pnpm db:generate
   ```
2. Apply the migration to your local dev D1 database:
   ```bash
   pnpm db:migrate:local
   ```
3. Run Drizzle Studio to inspect and populate tables:
   ```bash
   pnpm db:studio
   ```

### 2. Deployment Flow (Production Release)

When ready to push updates to production:

1. Apply the migrations to the remote D1 instance:
   ```bash
   pnpm db:migrate:remote
   ```
2. Deploy the application worker (usually handled via CI/CD or wrangler deploy):
   ```bash
   pnpm wrangler deploy
   ```

# 1. Tạo D1 Database riêng cho Staging

npx wrangler d1 create note-space-db-staging

# 2. (Tùy chọn) Tạo R2 Bucket riêng cho Staging media

npx wrangler r2 bucket create node-space-media-staging
