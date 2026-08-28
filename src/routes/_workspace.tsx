import { createFileRoute, redirect } from '@tanstack/react-router'
import { getSessionFn } from '@/features/auth/auth.fns'

import { registerPlugin } from 'react-filepond'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'
import Workspace from '@/app/workspace'

registerPlugin(FilePondPluginImagePreview, FilePondPluginFileValidateType)

export const Route = createFileRoute('/_workspace')({
  head: () => ({
    meta: [
      { title: 'Workspace | Note Flow' },
      { name: 'robots', content: 'noindex, nofollow' },
    ],
  }),
  beforeLoad: async () => {
    const session = await getSessionFn()
    if (!session) {
      throw redirect({
        to: '/login',
      })
    }
    if (!session.user.emailVerified) {
      throw redirect({
        to: '/verify-email',
      })
    }
    return {
      session,
    }
  },
  component: Workspace,
})
