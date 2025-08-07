import type { Ref } from 'vue'
import type { User } from '@/types/user'
import { ElMessage, ElMessageBox } from 'element-plus'

export function useActions(
  users: Ref<User[]>,
  fetchUsers: () => Promise<User[]>,
) {
  const addUser = (newUser: User) => {
    const duplicate = users.value.find(
      (u) =>
        u.id === newUser.id ||
        u.email === newUser.email ||
        u.username === newUser.username,
    )

    if (duplicate) {
      if (duplicate.id === newUser.id) {
        ElMessage.closeAll()
        ElMessage.warning(`User with ID ${newUser.id} already exists.`)
      } else if (duplicate.email === newUser.email) {
        ElMessage.closeAll()
        ElMessage.warning(`Email "${newUser.email}" is already taken.`)
      } else if (duplicate.username === newUser.username) {
        ElMessage.closeAll()
        ElMessage.warning(`Username "${newUser.username}" is already taken.`)
      }
      return
    }

    users.value.push({ ...newUser })
    ElMessage.closeAll()
    ElMessage.success(`User "${newUser.name}" added successfully.`)
  }

  const editUser = (updatedUser: User) => {
    const index = users.value.findIndex((u) => u.id === updatedUser.id)

    if (index === -1) {
      ElMessage.closeAll()
      ElMessage.warning('User not found.')
      return
    }

    const existingUser = users.value[index]

    // check changes
    const isUnchanged =
      existingUser.name === updatedUser.name &&
      existingUser.email === updatedUser.email &&
      existingUser.username === updatedUser.username

    if (isUnchanged) {
      ElMessage.closeAll()
      ElMessage.info('No changes were made.')
      return
    }

    // check duplicates (excluding user)
    const duplicate = users.value.find(
      (u) =>
        u.id !== updatedUser.id &&
        (u.email === updatedUser.email || u.username === updatedUser.username),
    )

    if (duplicate) {
      if (duplicate.email === updatedUser.email) {
        ElMessage.closeAll()
        ElMessage.warning(`Email "${updatedUser.email}" is already taken.`)
      } else if (duplicate.username === updatedUser.username) {
        ElMessage.closeAll()
        ElMessage.warning(
          `Username "${updatedUser.username}" is already taken.`,
        )
      }
      return
    }

    users.value[index] = { ...updatedUser }
    ElMessage.closeAll()
    ElMessage.success(`User "${updatedUser.name}" updated successfully.`)
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

  return {
    addUser,
    editUser,
    deleteUser,
    refreshUsers,
  }
}
