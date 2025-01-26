import { z } from 'zod'

const schema = z.object({
  message: z.string().min(2, { message: "Reply must contain at least 2 characters." })
})

export default schema 