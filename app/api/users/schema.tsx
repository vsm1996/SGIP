import { z } from 'zod';

const schema = z.object({
  firstName: z.string().min(3),
  lastName: z.string().min(3),
  email: z.string().email()
})

export default schema