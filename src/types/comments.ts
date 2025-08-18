export interface Comment {
  id: number
  postId: number
  name: string
  email: string
  body: string
  parentId?: number // <-- add this
}

export interface NestedComment extends Comment {
  replies?: NestedComment[]
}
