import axios from 'axios'
import type { User } from '@/types/user'

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
