import { z } from 'zod'

export const newNoteSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Note title is required.')
    .max(120, 'Title must be under 120 characters.'),
  folder_id: z.string().optional(),
  workspace_id: z.string().optional(),
  tags: z.array(z.string()).max(10, 'You can add up to 10 tags.'),
  isPinned: z.boolean(),
})

export type NewNoteValues = z.infer<typeof newNoteSchema>
