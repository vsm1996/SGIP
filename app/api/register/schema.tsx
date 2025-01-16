import { z } from 'zod'

const schema = z.object({
  email: z.string().email({ message: "Must use valid email." }),
  password: z.string().min(5, { message: "Password must contain at least 5 characters." }),
  firstName: z.string().min(2, { message: "First name must contain at least 2 characters." }),
  lastName: z.string().min(2, { message: "Last name must contain at least 2 characters." }),
  username: z.string().min(3, { message: "Username must contain at least 3 characters." }),
})

export default schema