import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  uploadMediaFn,
  uploadMultipleMediaFn,
  deleteMediaFn,
} from '../media.fns'
import type {
  UploadMediaResponse,
  UploadMultipleMediaResponse,
  DeleteMediaResponse,
  UploadFileInput,
  UploadMultipleFilesInput,
} from '../types'

function validateFile(
  file: File,
  options?: { maxSizeInMB?: number; allowedTypes?: string[] }
) {
  const maxSize = options?.maxSizeInMB ?? 10
  const maxBytes = maxSize * 1024 * 1024

  if (file.size > maxBytes) {
    throw new Error(
      `File "${file.name}" (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds maximum limit of ${maxSize}MB.`
    )
  }

  if (
    options?.allowedTypes &&
    options.allowedTypes.length > 0 &&
    !options.allowedTypes.includes(file.type)
  ) {
    throw new Error(`File type "${file.type}" is not allowed.`)
  }
}

export function useUploadMediaMutation() {
  return useMutation<UploadMediaResponse, Error, UploadFileInput | FormData>({
    mutationFn: async (input) => {
      let formData: FormData

      if (input instanceof FormData) {
        formData = input
      } else {
        const { file, options } = input
        validateFile(file, options)

        formData = new FormData()
        formData.append('file', file)
        if (options?.folder) {
          formData.append('folder', options.folder)
        }
      }

      return await uploadMediaFn({ data: formData })
    },
    onSuccess: () => {
      toast.success('Media uploaded successfully!')
    },
    onError: (error) => {
      console.error('Media upload failed:', error)
      toast.error(error.message || 'Failed to upload media. Please try again.')
    },
  })
}

export function useUploadMultipleMediaMutation() {
  return useMutation<
    UploadMultipleMediaResponse,
    Error,
    UploadMultipleFilesInput | FormData
  >({
    mutationFn: async (input) => {
      let formData: FormData

      if (input instanceof FormData) {
        formData = input
      } else {
        const { files, options } = input
        if (!files || files.length === 0) {
          throw new Error('No files selected for upload.')
        }

        files.forEach((file) => validateFile(file, options))

        formData = new FormData()
        files.forEach((file) => {
          formData.append('files', file)
        })
        if (options?.folder) {
          formData.append('folder', options.folder)
        }
      }

      return await uploadMultipleMediaFn({ data: formData })
    },
    onSuccess: (data) => {
      toast.success(
        `Successfully uploaded ${data.items.length} media ${data.items.length === 1 ? 'file' : 'files'}!`
      )
    },
    onError: (error) => {
      console.error('Batch media upload failed:', error)
      toast.error(
        error.message || 'Failed to upload media files. Please try again.'
      )
    },
  })
}

export function useDeleteMediaMutation() {
  return useMutation<DeleteMediaResponse, Error, string>({
    mutationFn: async (key: string) => {
      return await deleteMediaFn({ data: { key } })
    },
    onSuccess: () => {
      toast.success('Media deleted successfully!')
    },
    onError: (error) => {
      console.error('Media deletion failed:', error)
      toast.error(error.message || 'Failed to delete media.')
    },
  })
}
