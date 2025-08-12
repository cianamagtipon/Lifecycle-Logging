<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLoader } from '@/composables/loader'
import { useLifecycleHooks } from '@/composables/lifecycleHooks'
import { useTitleCase } from '@/composables/formatter'
import type { User } from '@/types/user'

import { ArrowLeft } from '@element-plus/icons-vue'
import dayjs from 'dayjs'

useLifecycleHooks('ProfileView')

const route = useRoute()
const router = useRouter()
const userId = ref(route.params.id as string)

const { toTitleCase } = useTitleCase()
const { users, error, loadUsers } = useLoader()

const user = computed<User | null>(() => {
  return users.value.find((u) => u.id.toString() === userId.value) || null
})

const formattedCreatedAt = computed(() => {
  return user.value?.createdAt
    ? dayjs(user.value.createdAt).format('YYYY-MM-DD HH:mm:ss')
    : 'Unknown'
})

const goBack = () => {
  router.back()
}

onMounted(async () => {
  if (!users.value.length) {
    await loadUsers()
  }

  if (user.value && !user.value.createdAt) {
    user.value.createdAt = new Date().toISOString()
  }
})

watch(
  () => route.params.id,
  (newId) => {
    userId.value = newId as string
    if (user.value && !user.value.createdAt) {
      user.value.createdAt = new Date().toISOString()
    }
  },
)

watch(user, (newUser) => {
  if (newUser && !newUser.createdAt) {
    newUser.createdAt = new Date().toISOString()
  }
})
</script>

<template>
  <div class="container">
    <div class="header">
      <div class="header-left">
        <el-button type="info" @click="goBack">
          <el-icon><ArrowLeft /></el-icon>
        </el-button>
      </div>
      <div class="header-center">
        <h2>User Profile</h2>
      </div>
      <div class="header-right"></div>
    </div>

    <!-- Error state -->
    <div v-if="error" class="status-message error-message">
      {{ error }}
    </div>

    <!-- User not found -->
    <div v-else-if="!user" class="status-message not-found-message">
      User not found.
    </div>

    <!-- Profile sections -->
    <div v-else class="profile-sections">
      <!-- Name Section - Full Width -->
      <el-card class="section-card name-section card" shadow="always">
        <h3>{{ user.name }}</h3>
        <p class="username">@{{ user.username }}</p>
      </el-card>

      <!-- Profile Info Section -->
      <el-card class="section-card info-section card" shadow="always">
        <h4>Profile Information</h4>
        <p><strong>Email: </strong> {{ user.email }}</p>
        <p><strong>Created: </strong> {{ formattedCreatedAt }}</p>
      </el-card>

      <!-- Address Section -->
      <el-card class="section-card address-section card" shadow="always">
        <h4>Address</h4>
        <p><strong>Street: </strong> {{ toTitleCase(user.address.street) }}</p>
        <p><strong>City: </strong> {{ toTitleCase(user.address.city) }}</p>
      </el-card>
    </div>
  </div>
</template>

<style scoped>
.container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  gap: 2rem;
}

.header {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  align-items: center;
  width: 100%;
  margin-bottom: 2rem;
}

.header-left {
  justify-self: start;
}

.header-center {
  justify-self: center;
}

.header-center h2 {
  margin: 0;
  text-align: center;
}

.header-right {
  justify-self: end;
}

.header-left .el-button {
  width: 30px;
  height: 30px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-left .el-icon {
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

p strong {
  margin-right: 0.25rem;
}

.profile-sections {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto;
  gap: 1.5rem;
  width: 100%;
  max-width: 1200px;
}

.name-section {
  grid-column: 1 / -1;
  text-align: center;
}

.section-card {
  cursor: default;
  min-height: 150px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.section-card h3 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
  text-align: center;
  color: var(--earth-green);
}

.section-card h4 {
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  text-align: center;
  color: var(--earth-green);
  border-bottom: 2px solid var(--earth-green);
  padding-bottom: 0.5rem;
}

.section-card p {
  margin: 0.5rem 0;
  line-height: 1.6;
}

.name-section {
  text-align: center;
}

.name-section .username {
  color: #666;
  font-size: 1.1rem;
  margin-top: 0.5rem;
}

.info-section p,
.address-section p {
  text-align: left;
}

.status-message {
  text-align: center;
  width: 100%;
  padding: 20px;
  border-radius: 8px;
}

.error-message {
  color: #f56c6c;
  background-color: #fef0f0;
  border: 1px solid #fbc4c4;
}

.not-found-message {
  color: #666;
  font-style: italic;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
}

@media (max-width: 1024px) {
  .profile-sections {
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
}

@media (max-width: 768px) {
  .header {
    grid-template-columns: auto 1fr auto;
    gap: 1rem;
  }

  .profile-sections {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .section-card {
    min-height: auto;
  }
}

@media (max-width: 600px) {
  .header {
    grid-template-columns: auto 1fr;
  }

  .header-left {
    order: 1;
    display: flex;
    gap: 0.5rem;
  }

  .header-center {
    order: 2;
  }
}
</style>
