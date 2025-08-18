import axios from 'axios'
import type { User } from '@/types/user'
import type { Comment, NestedComment } from '@/types/comments'

export const fetchUsers = async (): Promise<User[]> => {
  const { data } = await axios.get<User[]>(
    'https://jsonplaceholder.typicode.com/users',
  )
  return data
}

export const postUser = async (user: User): Promise<User> => {
  const { data } = await axios.post<User>(
    'https://jsonplaceholder.typicode.com/users',
    user,
  )
  return data
}

export const updateUser = async (user: User): Promise<User> => {
  const { data } = await axios.put<User>(
    `https://jsonplaceholder.typicode.com/users/${user.id}`,
    user,
  )
  return data
}

export const fetchComments = async (): Promise<Comment[]> => {
  const { data } = await axios.get<Comment[]>(
    'https://jsonplaceholder.typicode.com/comments',
  )
  return data
}

export const postComment = async (comment: Comment): Promise<Comment> => {
  const { data } = await axios.post<Comment>(
    'https://jsonplaceholder.typicode.com/comments',
    comment,
  )
  return data
}

// helper: build tree
export function buildCommentTree(comments: Comment[]): NestedComment[] {
  const map = new Map<number, NestedComment>()
  const roots: NestedComment[] = []

  // convert to NestedComment
  comments.forEach((c) => {
    map.set(c.id, { ...c, replies: [] })
  })

  // randomly assign some comments a parentId (only once, no deep nesting)
  comments.forEach((c) => {
    if (Math.random() < 0.4) {
      const randomParent = comments[Math.floor(Math.random() * comments.length)]
      // ensure it's not itself and parent is root (no chaining)
      if (randomParent.id !== c.id && !randomParent.parentId) {
        ;(map.get(c.id) as NestedComment).parentId = randomParent.id
      }
    }
  })

  // build tree
  comments.forEach((c) => {
    const node = map.get(c.id)!
    if (node.parentId && map.has(node.parentId)) {
      map.get(node.parentId)!.replies!.push(node)
    } else {
      roots.push(node)
    }
  })

  return roots
}
