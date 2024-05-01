import { z } from 'zod'

const schema = z.object({
  message: z.string().min(3)
})

export default schema 