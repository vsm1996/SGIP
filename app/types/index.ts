import { Post, User } from "@prisma/client"

export type Discussion = {
  title: string,
  description: string,
  posts: Post[],
  user: User
}