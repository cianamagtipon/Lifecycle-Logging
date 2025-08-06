import type { Ref } from 'vue'
import type { User } from '@/types/user'
import { ElMessage, ElMessageBox } from 'element-plus'

export function useActions(
  users: Ref<User[]>,
  fetchUsers: () => Promise<User[]>,
) {
  const editUser = (user: User) => {
    ElMessage.closeAll()
    ElMessage.success(`Editing user: ${user.name} (mock)`)
  }

  const deleteUser = (id: number) => {
    ElMessageBox.confirm(
      'Are you sure you want to delete this user?',
      'Confirm Deletion',
      {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        type: 'warning',
      },
    )
      .then(() => {
        users.value = users.value.filter((u) => u.id !== id)
        ElMessage.closeAll()
        ElMessage.success(`User ID ${id} deleted.`)
      })
      .catch(() => {})
  }

  const refreshUsers = async () => {
    ElMessage.closeAll()
    try {
      const updated = await fetchUsers()
      users.value = updated
    } catch (error) {
      console.error('Refresh failed:', error)
      ElMessage.error('Failed to refresh users.')
    }
  }

  return { editUser, deleteUser, refreshUsers }
}
