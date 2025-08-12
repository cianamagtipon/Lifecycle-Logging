<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import EditUser from '@/components/forms/EditUser.vue'
import AddUser from '@/components/forms/AddUser.vue'
import ActionCards from '@/components/ActionCards.vue'

import { useLifecycleHooks } from '@/composables/lifecycleHooks'
import { useActions } from '@/composables/actions'
import { useFilter } from '@/composables/filter'
import { useLoader } from '@/composables/loader'
import { useTitleCase } from '@/composables/formatter'
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

useLifecycleHooks('UserListView')

const isGridView = ref(true)
const toggleView = () => (isGridView.value = !isGridView.value)

const { formatSubmittedData, toTitleCase } = useTitleCase()
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
  const formattedUser = formatSubmittedData(updatedUser)
  const success = editUser(formattedUser)

  if (!success && selectedUser.value) {
    selectedUser.value = { ...selectedUser.value }
    return
  }

  isEditing.value = false
}

const submitAdd = (newUser: User) => {
  const formattedUser = formatSubmittedData(newUser)
  addUser(formattedUser)
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

// For table skeleton rows
const skeletonRows = Array(6).fill({})
</script>

<template>
  <div class="container">
    <h2>User Profile Viewer</h2>

    <div class="actions">
      <el-input
        v-model="searchQuery"
        placeholder="Search name, username, or email"
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

    <!-- Table Loading -->
    <el-table
      v-else-if="isLoading && !isGridView"
      :data="[{}]"
      style="width: 100%"
      highlight-current-row
    >
      <el-table-column>
        <template #default>
          <div
            style="
              text-align: center;
              font-style: italic;
              color: #999;
              padding: 20px 0;
            "
          >
            Loading users, please wait...
            <div class="loading-bar-container">
              <div class="loading-bar"></div>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>

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

    <!-- Table -->
    <div class="table-wrapper" v-else>
      <el-table :data="filteredUsers" style="width: 100%" highlight-current-row>
        <el-table-column prop="name" label="Name" min-width="150" />
        <el-table-column prop="email" label="Email" min-width="180" />
        <el-table-column prop="username" label="Username" min-width="140" />
        <el-table-column
          label="Address"
          min-width="220"
          :formatter="
            (row: User) =>
              `${toTitleCase(row.address.street)}, ${toTitleCase(row.address.city)}`
          "
        />
        <el-table-column label="Actions" align="center" min-width="120">
          <template #default="scope">
            <el-button
              link
              type="primary"
              size="small"
              @click="viewUser(scope.row)"
            >
              <el-icon><View /></el-icon>
            </el-button>
            <el-button
              link
              type="primary"
              size="small"
              @click="openEdit(scope.row)"
            >
              <el-icon><Edit /></el-icon>
            </el-button>
            <el-button
              link
              type="danger"
              size="small"
              @click.prevent="deleteUser(scope.row.id)"
            >
              <el-icon><Delete /></el-icon>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

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

<style scoped>
.loading-bar-container {
  margin: 10px auto 0;
  width: 50%;
  height: 6px;
  background-color: #eee;
  border-radius: 3px;
  overflow: hidden;
  position: relative;
}

.loading-bar {
  height: 100%;
  width: 40%;
  background-color: var(--earth-green);
  border-radius: 3px;
  position: absolute;
  animation: loading-bar-slide 1.2s ease-in-out infinite;
}

.table-wrapper {
  width: 100%;
  overflow-x: auto;
}

.table-wrapper::-webkit-scrollbar {
  height: 6px;
}

.table-wrapper::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 3px;
}

@media (max-width: 600px) {
  .el-table {
    font-size: 13px;
  }
  .el-table .cell {
    white-space: nowrap;
  }
}

@keyframes loading-bar-slide {
  0% {
    left: -40%;
  }
  50% {
    left: 50%;
  }
  100% {
    left: 100%;
  }
}
</style>
