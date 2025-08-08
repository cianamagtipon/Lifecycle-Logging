import type { Ref } from 'vue'
import type { User } from '@/types/user'
import { ElMessage, ElMessageBox } from 'element-plus'

export function useActions(
  users: Ref<User[]>,
  fetchUsers: () => Promise<User[]>,
) {
  const normalize = (val: string) => val.trim().toLowerCase()

  const addUser = (newUser: User) => {
    const duplicate = users.value.find(
      (u) =>
        u.id === newUser.id ||
        normalize(u.email) === normalize(newUser.email) ||
        normalize(u.username) === normalize(newUser.username),
    )

    if (duplicate) {
      if (duplicate.id === newUser.id) {
        ElMessage.closeAll()
        ElMessage.warning(`User with ID ${newUser.id} already exists.`)
      } else if (normalize(duplicate.email) === normalize(newUser.email)) {
        ElMessage.closeAll()
        ElMessage.warning(`Email "${newUser.email}" is already taken.`)
      } else if (
        normalize(duplicate.username) === normalize(newUser.username)
      ) {
        ElMessage.closeAll()
        ElMessage.warning(`Username "${newUser.username}" is already taken.`)
      }
      return
    }

    users.value.push({ ...newUser })
    ElMessage.closeAll()
    ElMessage.success(`User "${newUser.name}" added successfully.`)
  }

  const editUser = (updatedUser: User): boolean => {
    const index = users.value.findIndex((u) => u.id === updatedUser.id)

    if (index === -1) {
      ElMessage.closeAll()
      ElMessage.warning('User not found.')
      return false
    }

    const existingUser = users.value[index]

    // check changes
    const isUnchanged =
      existingUser.name === updatedUser.name &&
      normalize(existingUser.email) === normalize(updatedUser.email) &&
      normalize(existingUser.username) === normalize(updatedUser.username)

    if (isUnchanged) {
      ElMessage.closeAll()
      ElMessage.info('No changes were made.')
      return false
    }

    // check duplicates (excluding current user)
    const duplicate = users.value.find(
      (u) =>
        u.id !== updatedUser.id &&
        (normalize(u.email) === normalize(updatedUser.email) ||
          normalize(u.username) === normalize(updatedUser.username)),
    )

    if (duplicate) {
      if (normalize(duplicate.email) === normalize(updatedUser.email)) {
        ElMessage.closeAll()
        ElMessage.warning(`Email "${updatedUser.email}" is already taken.`)
      } else if (
        normalize(duplicate.username) === normalize(updatedUser.username)
      ) {
        ElMessage.closeAll()
        ElMessage.warning(
          `Username "${updatedUser.username}" is already taken.`,
        )
      }
      return false
    }

    users.value[index] = { ...updatedUser }
    ElMessage.closeAll()
    ElMessage.success(`User "${updatedUser.name}" updated successfully.`)
    return true
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
