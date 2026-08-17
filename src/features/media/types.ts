export interface UploadMediaResponse {
  success: boolean
  key: string
  url: string
  size: number
  contentType: string
  uploadedAt: string
}

export interface UploadMultipleMediaResponse {
  success: boolean
  items: UploadMediaResponse[]
}

export interface DeleteMediaInput {
  key: string
}

export interface DeleteMediaResponse {
  success: boolean
  key: string
}

export interface MediaUploadOptions {
  folder?: string
  maxSizeInMB?: number
  allowedTypes?: string[]
}

export interface UploadFileInput {
  file: File
  options?: MediaUploadOptions
}

export interface UploadMultipleFilesInput {
  files: File[]
  options?: MediaUploadOptions
}
