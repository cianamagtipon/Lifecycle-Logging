import { ref, computed, type Ref } from 'vue'
import type { User } from '@/types/user'

export function useFilter(users: Ref<User[]>) {
  const searchQuery = ref('')

  const filteredUsers = computed(() => {
    const q = searchQuery.value.trim().toLowerCase()
    return q
      ? users.value.filter(
          (user) =>
            user.name.toLowerCase().includes(q) ||
            user.username.toLowerCase().includes(q),
          // user.email.toLowerCase().includes(q),
        )
      : users.value
  })

  return { searchQuery, filteredUsers }
}
