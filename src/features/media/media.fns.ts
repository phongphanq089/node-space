import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { env as cfEnv } from 'cloudflare:workers'
import type {
  UploadMediaResponse,
  UploadMultipleMediaResponse,
  DeleteMediaInput,
  DeleteMediaResponse,
} from './types'

export const deleteMediaSchema = z.object({
  key: z.string().min(1, 'Media key is required.'),
})

function getR2(): R2Bucket {
  if (cfEnv && (cfEnv as any).MEDIA_BUCKET) {
    return (cfEnv as any).MEDIA_BUCKET
  }
  throw new Error(
    'Cloudflare R2 Bucket "MEDIA_BUCKET" is not bound. Please check wrangler.toml.'
  )
}

function getPublicUrl(key: string): string {
  const customPublicUrl =
    (cfEnv as any)?.R2_PUBLIC_URL || process.env.R2_PUBLIC_URL
  const normalizedKey = key.startsWith('/') ? key.slice(1) : key

  if (
    customPublicUrl &&
    !customPublicUrl.includes('pub-your-bucket-id') &&
    process.env.NODE_ENV === 'production'
  ) {
    const normalizedBase = customPublicUrl.endsWith('/')
      ? customPublicUrl.slice(0, -1)
      : customPublicUrl
    return `${normalizedBase}/${normalizedKey}`
  }

  return `/api/media/${normalizedKey}`
}

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9.-]/g, '_').toLowerCase()
}

async function uploadSingleFileToR2(
  file: File,
  folder = 'uploads'
): Promise<UploadMediaResponse> {
  const bucket = getR2()
  const sanitizedName = sanitizeFilename(file.name)
  const folderPrefix = folder
    ? `${folder.replace(/^\/+|\/+$/g, '')}/`
    : 'uploads/'
  const key = `${folderPrefix}${Date.now()}-${crypto.randomUUID()}-${sanitizedName}`

  const arrayBuffer = await file.arrayBuffer()

  // Upload raw binary arrayBuffer directly to Cloudflare R2
  await bucket.put(key, arrayBuffer, {
    httpMetadata: {
      contentType: file.type || 'application/octet-stream',
      cacheControl: 'public, max-age=31536000, immutable',
    },
  })

  return {
    success: true,
    key,
    url: getPublicUrl(key),
    size: arrayBuffer.byteLength,
    contentType: file.type || 'application/octet-stream',
    uploadedAt: new Date().toISOString(),
  }
}

export const uploadMediaFn = createServerFn({ method: 'POST' })
  .validator((data: unknown): FormData => {
    if (!(data instanceof FormData)) {
      throw new Error('Invalid upload payload. Expected FormData.')
    }
    return data
  })
  .handler(async ({ data: formData }): Promise<UploadMediaResponse> => {
    const file = formData.get('file') as File | null
    if (!file) {
      throw new Error('No file provided in form data.')
    }

    const folder = (formData.get('folder') as string) || 'uploads'
    return await uploadSingleFileToR2(file, folder)
  })

export const uploadMultipleMediaFn = createServerFn({ method: 'POST' })
  .validator((data: unknown): FormData => {
    if (!(data instanceof FormData)) {
      throw new Error('Invalid upload payload. Expected FormData.')
    }
    return data
  })
  .handler(async ({ data: formData }): Promise<UploadMultipleMediaResponse> => {
    const files = formData.getAll('files') as File[]
    const fallbackFiles = formData.getAll('file') as File[]
    const targetFiles = files.length > 0 ? files : fallbackFiles

    if (targetFiles.length === 0) {
      throw new Error('No files provided in form data.')
    }

    const folder = (formData.get('folder') as string) || 'uploads'
    const results = await Promise.all(
      targetFiles.map((file) => uploadSingleFileToR2(file, folder))
    )

    return {
      success: true,
      items: results,
    }
  })

export const deleteMediaFn = createServerFn({ method: 'POST' })
  .validator((data: DeleteMediaInput) => deleteMediaSchema.parse(data))
  .handler(async ({ data }): Promise<DeleteMediaResponse> => {
    const bucket = getR2()
    await bucket.delete(data.key)
    return {
      success: true,
      key: data.key,
    }
  })
