import type { Ref } from 'vue'
import type { User } from '@/types/user'
import { ElMessage, ElMessageBox } from 'element-plus'
import { logStyle } from '@/assets/logStyles'
import { postUser, updateUser } from '@/services/api'

export function useActions(
  users: Ref<User[]>,
  fetchUsers: () => Promise<User[]>,
) {
  const normalize = (val: string) => val.trim().toLowerCase()

  const addUser = async (newUser: User) => {
    const duplicate = users.value.find(
      (u) =>
        u.id === newUser.id ||
        normalize(u.email) === normalize(newUser.email) ||
        normalize(u.username) === normalize(newUser.username),
    )

    if (duplicate) {
      console.warn(
        '%c[ADD USER]%c Duplicate detected:',
        logStyle.warn,
        '',
        duplicate,
      )

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

    try {
      console.log('[ADD USER] Posting new user to server:', newUser)
      const savedUser = await postUser(newUser) // POST request
      users.value.push(savedUser)
      console.log(
        '[ADD USER] User added successfully (server confirmed):',
        savedUser,
      )
      ElMessage.closeAll()
      ElMessage.success(`User "${savedUser.name}" added successfully.`)
    } catch (error) {
      console.error(
        '%c[ADD USER]%c Failed to add user:',
        logStyle.error,
        '',
        error,
      )
      ElMessage.error('Failed to add user.')
    }
  }

  const editUser = async (updatedUser: User): Promise<boolean> => {
    const index = users.value.findIndex((u) => u.id === updatedUser.id)
    if (index === -1) {
      console.warn(
        '%c[EDIT USER]%c User not found with ID:',
        logStyle.warn,
        '',
        updatedUser.id,
      )
      ElMessage.closeAll()
      ElMessage.warning('User not found.')
      return false
    }

    const existingUser = users.value[index]
    console.log('[EDIT USER] Current stored user data:', existingUser)

    const isUnchanged =
      existingUser.name === updatedUser.name &&
      normalize(existingUser.email) === normalize(updatedUser.email) &&
      normalize(existingUser.username) === normalize(updatedUser.username)

    if (isUnchanged) {
      console.log('[EDIT USER] No changes detected.')
      ElMessage.closeAll()
      ElMessage.info('No changes were made.')
      return false
    }

    const duplicate = users.value.find(
      (u) =>
        u.id !== updatedUser.id &&
        (normalize(u.email) === normalize(updatedUser.email) ||
          normalize(u.username) === normalize(updatedUser.username)),
    )

    if (duplicate) {
      console.warn(
        '%c[EDIT USER]%c Duplicate detected:',
        logStyle.warn,
        '',
        duplicate,
      )
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

    try {
      console.log('[EDIT USER] Sending update to server:', updatedUser)
      const savedUser = await updateUser(updatedUser) // PUT/PATCH request

      users.value[index] = { ...savedUser } // updates local state with confirmed server data
      console.log(
        '[EDIT USER] User updated successfully (server confirmed):',
        savedUser,
      )

      ElMessage.closeAll()
      ElMessage.success(`User "${savedUser.name}" updated successfully.`)
      return true
    } catch (error) {
      console.error(
        '%c[EDIT USER]%c Failed to update user:',
        logStyle.error,
        '',
        error,
      )
      ElMessage.error('Failed to update user.')
      return false
    }
  }

  const deleteUser = (id: number) => {
    console.log('[DELETE USER] Attempting to delete user with ID:', id)
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
        console.log('[DELETE USER] User deleted with ID:', id)
        ElMessage.closeAll()
        ElMessage.success(`User ID ${id} deleted.`)
      })
      .catch(() => {
        console.log('[DELETE USER] Deletion canceled for user ID:', id)
      })
  }

  const refreshUsers = async () => {
    console.log('[REFRESH USERS] Fetching latest users...')
    ElMessage.closeAll()
    try {
      const updated = await fetchUsers()
      users.value = updated
      console.log('[REFRESH USERS] Successfully refreshed.')
    } catch (error) {
      console.error(
        '%c[REFRESH USERS]%c Failed to refresh:',
        logStyle.error,
        '',
        error,
      )
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
