<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useLoader } from '@/composables/loader'
import type { User } from '@/types/user'

import { ElCard } from 'element-plus'
import { Loading } from '@element-plus/icons-vue'
import dayjs from 'dayjs'

const route = useRoute()
const userId = ref(route.params.id as string)
const { users, isLoading, error, loadUsers } = useLoader()

const user = computed<User | null>(() => {
  return users.value.find((u) => u.id.toString() === userId.value) || null
})

onMounted(async () => {
  await loadUsers()
  users.value = users.value.map((user) => ({
    ...user,
    createdAt: dayjs(user.createdAt).format('YYYY-MM-DD HH:mm:ss'),
  }))
})

watch(
  () => route.params.id,
  (newId) => {
    userId.value = newId as string
  },
)
</script>

<template>
  <div class="profile-container">
    <div v-if="isLoading" class="loading-container">
      <el-icon class="is-loading" size="48"><Loading /></el-icon>
      <p>Loading user profile...</p>
    </div>

    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>

    <div v-else-if="!user" class="error-message">User not found.</div>

    <el-card v-else class="user-profile-card">
      <template #header>
        <div class="card-header">
          <h2>{{ user.name }}</h2>
          <span class="username">@{{ user.username }}</span>
        </div>
      </template>

      <p><strong>Email:</strong> {{ user.email }}</p>
      <p>
        <strong>City:</strong>
        {{ user.address.city }}
      </p>
      <p><strong>Street:</strong> {{ user.address.street }}</p>
      <p>
        <strong>Created:</strong>
        {{
          user.createdAt
            ? dayjs(user.createdAt).format('YYYY-MM-DD HH:mm:ss')
            : 'Unknown'
        }}
      </p>
    </el-card>
  </div>
</template>

<style scoped>
.profile-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 400px;
  min-height: 70vh;
  padding: 2rem;
  box-sizing: border-box;
}

.user-profile-card {
  width: 100%;
  max-width: 600px;
  padding: 1rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.username {
  color: var(--text-color);
  font-style: italic;
}

.error-message {
  text-align: center;
  color: red;
}
</style>
