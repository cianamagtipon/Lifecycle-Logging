<script setup lang="ts">
import EditUser from '@/components/forms/EditUser.vue'
import AddUser from '@/components/forms/AddUser.vue'
import ActionCards from '@/components/ActionCards.vue'

import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { useActions } from '@/composables/actions'
import { useFilter } from '@/composables/filter'
import { useLoader } from '@/composables/loader'
import type { User } from '@/types/user'

import {
  View,
  Edit,
  Delete,
  Plus,
  Refresh,
  Grid,
  List,
} from '@element-plus/icons-vue'

const router = useRouter()

const isGridView = ref(true)
const toggleView = () => (isGridView.value = !isGridView.value)

const { users, isLoading, error, loadUsers } = useLoader()
const { searchQuery, filteredUsers } = useFilter(users)
const { addUser, editUser, deleteUser, refreshUsers } = useActions(
  users,
  loadUsers,
)

const selectedUser = ref<User | null>(null)
const isEditing = ref(false)
const isAdding = ref(false)

const isActionDialogVisible = ref(false)

const openEdit = (user: User) => {
  selectedUser.value = user
  isEditing.value = true
}

const submitEdit = (updatedUser: User) => {
  const success = editUser(updatedUser)

  if (!success && selectedUser.value) {
    // re-trigger watcher in EditUser.vue to revert form (since it didn't before lol)
    selectedUser.value = { ...selectedUser.value }
    return
  }

  isEditing.value = false
}

const submitAdd = (newUser: User) => {
  addUser(newUser)
  isAdding.value = false
}

const viewUser = (user: User) => {
  router.push({ name: 'user-profile', params: { id: user.id } })
}

const openActionDialog = (user: User) => {
  selectedUser.value = user
  isActionDialogVisible.value = true
}

const handleView = () => {
  if (selectedUser.value) viewUser(selectedUser.value)
}

const handleEdit = () => {
  if (selectedUser.value) openEdit(selectedUser.value)
}

const handleDelete = () => {
  if (selectedUser.value) deleteUser(selectedUser.value.id)
}
</script>

<template>
  <div class="container">
    <h2>User Profile Viewer</h2>

    <div class="actions">
      <el-input
        v-model="searchQuery"
        placeholder="Search name or username"
        class="search-input"
        clearable
      />

      <el-button type="primary" @click="isAdding = true">
        <el-icon><Plus /></el-icon>
      </el-button>

      <el-button type="info" @click="refreshUsers">
        <el-icon><Refresh /></el-icon>
      </el-button>

      <el-button type="success" @click="toggleView">
        <el-icon>
          <component :is="isGridView ? List : Grid" />
        </el-icon>
      </el-button>
    </div>

    <!-- Skeleton -->
    <template v-if="isLoading && isGridView">
      <div class="grid-view">
        <el-card
          v-for="(_, index) in filteredUsers.length || 6"
          :key="index"
          class="card"
          shadow="hover"
        >
          <el-skeleton animated class="custom-skeleton">
            <template #template>
              <el-skeleton-item variant="h1" style="width: 60%" />
              <el-skeleton-item variant="h1" style="width: 80%" />
              <el-skeleton-item variant="h1" style="width: 70%" />
              <el-skeleton-item variant="h1" style="width: 90%" />
              <el-skeleton-item variant="h1" style="width: 40%" />
            </template>
          </el-skeleton>
        </el-card>
      </div>
    </template>

    <div v-else-if="error">{{ error }}</div>

    <!-- Grid  -->
    <div v-else-if="isGridView" class="grid-view">
      <el-card
        v-for="user in filteredUsers"
        :key="user.id"
        class="card"
        shadow="hover"
        @click="openActionDialog(user)"
        style="cursor: pointer"
      >
        <h3>{{ user.name }}</h3>
        <p>
          <em>@{{ user.username }}</em>
        </p>
      </el-card>
    </div>

    <!-- Table  -->
    <el-table
      v-else
      :data="filteredUsers"
      style="width: 100%"
      highlight-current-row
    >
      <el-table-column prop="name" label="Name" />
      <el-table-column prop="email" label="Email" />
      <el-table-column prop="username" label="Username" />
      <el-table-column
        label="Address"
        :formatter="(row: User) => `${row.address.street}, ${row.address.city}`"
      />

      <el-table-column label="Actions" align="center">
        <template #default="scope">
          <el-button
            class="view-button"
            link
            type="primary"
            size="medium"
            @click="viewUser(scope.row)"
          >
            <el-icon><View /></el-icon>
          </el-button>
          <el-button
            class="edit-button"
            link
            type="primary"
            size="medium"
            @click="openEdit(scope.row)"
          >
            <el-icon><Edit /></el-icon>
          </el-button>
          <el-button
            class="remove-button"
            link
            type="primary"
            size="medium"
            @click.prevent="deleteUser(scope.row.id)"
          >
            <el-icon class="delete-icon"><Delete /></el-icon>
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Modals -->
    <ActionCards
      v-model="isActionDialogVisible"
      :user="selectedUser"
      @view="handleView"
      @edit="handleEdit"
      @delete="handleDelete"
    />
    <EditUser v-model="isEditing" :user="selectedUser" @submit="submitEdit" />
    <AddUser v-model="isAdding" @submit="submitAdd" />
  </div>
</template>
