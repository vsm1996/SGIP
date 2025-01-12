import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(5),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  username: z.string().min(4),
})

export default schema