import { Like } from '@prisma/client'

export interface User {
  id: string
  name: string
  username?: string
  firstName?: string
}

export interface BaseItem {
  id: string
  message: string
  createdAt: Date
  userId: string
  sessionId: string | null
  user: User
  likes: Like[]
}

export interface Post extends BaseItem {
  comments: Comment[]
  mentionContext?: {
    type: 'comment' | 'reply'
    message: string
    user: User
  }
}

export interface Comment extends BaseItem {
  postId: string
  commentReplies: Reply[]
}

export interface Reply extends BaseItem {
  commentId: string
}

export interface BaseComponentProps {
  handleFetch: () => void
}

export interface PostProps extends BaseComponentProps {
  post?: Post
}

export interface CommentProps extends BaseComponentProps {
  type?: 'post' | 'comment'
  comment: Comment
  postId: string
}

export interface ReplyProps extends BaseComponentProps {
  reply: Reply
  commentId: string
}

export interface LikeButtonProps extends BaseComponentProps {
  session: any
  liked: boolean
  setLiked: (value: boolean) => void
}