<script setup lang="ts">
import dayjs from 'dayjs'

import { onMounted, ref } from 'vue'
import { useActions } from '@/composables/actions'
import { useFilter } from '@/composables/filter'
import { useLoader } from '@/composables/loader'
import type { User } from '@/types/user'

import { View, Edit, Delete } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const isGridView = ref(true)
const toggleView = () => (isGridView.value = !isGridView.value)

const { users, isLoading, error, loadUsers } = useLoader()
const { searchQuery, filteredUsers } = useFilter(users)
const { editUser, deleteUser, refreshUsers } = useActions(users, loadUsers)

const viewUser = (user: User) => {
  router.push({ name: 'user-profile', params: { id: user.id } })
}
</script>

<template>
  <div class="container">
    <h2>User Profile Viewer</h2>

    <div class="actions">
      <el-input
        v-model="searchQuery"
        placeholder="Search name, email, or username"
        class="search-input"
        clearable
      />

      <el-button type="info" @click="refreshUsers" plain>
        Refresh Users
      </el-button>

      <el-button type="success" @click="toggleView" plain>
        Switch to {{ isGridView ? 'Table' : 'Grid' }} View
      </el-button>
    </div>

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
      >
        <h3>{{ user.name }}</h3>
        <p>
          <em>@{{ user.username }}</em>
        </p>
        <p></p>

        <div class="card-actions">
          <el-button size="small" type="primary" @click="viewUser(user)"
            >View</el-button
          >
          <el-button size="small" @click="editUser(user)">Edit</el-button>
          <el-button
            size="small"
            type="danger"
            plain
            @click="deleteUser(user.id)"
          >
            Delete
          </el-button>
        </div>
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

      <el-table-column prop="createdAt" label="Created At" />
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
            @click="editUser(scope.row)"
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
  </div>
</template>
