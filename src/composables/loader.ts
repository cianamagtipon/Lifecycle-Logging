import { ref, onMounted } from 'vue'
import type { User } from '@/types/user'
import { fetchUsers } from '@/services/api'
import { ElMessage } from 'element-plus'

export function useLoader() {
  const users = ref<User[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const loadUsers = async (): Promise<User[]> => {
    isLoading.value = true
    error.value = null

    const MIN_LOADING_MS = 1000
    const start = Date.now()

    let data: User[] = []
    let success = false

    try {
      const raw = await fetchUsers()
      users.value = raw
      data = raw
      success = true
    } catch (err) {
      error.value = 'Failed to load users.'
      console.error('Error fetching users:', err)
    } finally {
      const duration = Date.now() - start
      const remaining = MIN_LOADING_MS - duration

      if (remaining > 0) {
        await new Promise((resolve) => setTimeout(resolve, remaining))
      }

      isLoading.value = false

      ElMessage.closeAll()
      if (success) {
        ElMessage.success('User data loaded successfully!')
      } else {
        ElMessage.error('Error loading user data.')
      }
    }

    return data
  }

  onMounted(loadUsers)

  return { users, isLoading, error, loadUsers }
}
