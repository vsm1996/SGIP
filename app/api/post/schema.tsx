import { z } from 'zod'

const schema = z.object({
  message: z.string().min(2, { message: "Post must contain at least 2 characters." }),
  content: z.string().optional(),
  isRichText: z.boolean().optional().default(false)
})

export default schema