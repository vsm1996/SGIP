import { z } from 'zod';

const schema = z.object({
  firstName: z.string().min(2, { message: "First name must contain least 2 characters." }),
  lastName: z.string().min(2, { message: "Last name must contain least 2 characters." }),
  email: z.string().email({ message: "Must use valid email." })
})

export default schema