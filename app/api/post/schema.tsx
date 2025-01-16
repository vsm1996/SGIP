import { z } from 'zod'

const schema = z.object({
  message: z.string().min(2, { message: "Post must contain at least 2 characters." })
})

export default schema 