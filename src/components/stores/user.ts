import { defineStore } from 'pinia'
import type { User } from '@/types/user'
import { fetchUsers } from '@/services/api'

interface UserState {
  users: User[]
  loading: boolean
  error: string | null
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    users: [],
    loading: false,
    error: null,
  }),

  getters: {
    getUserById: (state) => {
      return (id: number) => state.users.find((u) => u.id === id)
    },
  },

  actions: {
    async loadUsers() {
      this.loading = true
      this.error = null
      try {
        this.users = await fetchUsers()
      } catch (err) {
        this.error = err instanceof Error ? err.message : String(err)
      } finally {
        this.loading = false
      }
    },

    addUser(user: User) {
      this.users.push(user)
    },

    editUser(updatedUser: User) {
      const index = this.users.findIndex((u) => u.id === updatedUser.id)
      if (index !== -1) {
        this.users[index] = updatedUser
      }
    },

    deleteUser(id: number) {
      this.users = this.users.filter((u) => u.id !== id)
    },
  },
})
