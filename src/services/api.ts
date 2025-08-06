import axios from 'axios'
import type { User } from '@/types/user'

export const fetchUsers = async (): Promise<User[]> => {
  const { data } = await axios.get<User[]>(
    'https://jsonplaceholder.typicode.com/users',
  )
  return data
}
