import { ref, onMounted } from 'vue'
import type { User } from '@/types/user'
import { fetchUsers } from '@/services/api'
import { ElMessage } from 'element-plus'
import { logStyle } from '@/assets/logStyles'

const users = ref<User[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)

export function useLoader() {
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
      console.error(
        '%c[LOAD USERS]%c Error fetching users:',
        logStyle.error,
        '',
        err,
      )
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
        console.warn(
          '%c[LOAD USERS]%c Displaying error message.',
          logStyle.error,
          '',
        )
        ElMessage.error('Error loading user data.')
      }
    }

    return data
  }

  onMounted(() => {
    console.log('%c[LOAD USERS]%c Component mounted.', logStyle.lifecycle, '')
    if (!users.value.length) {
      loadUsers()
    }
  })

  return { users, isLoading, error, loadUsers }
}
