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
const { users, error, isLoading, loadUsers } = useLoader()

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

// Helper: simulate a fake loading delay
const fakeDelay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms))

onMounted(async () => {
  isLoading.value = true
  await fakeDelay(1000) // fake delay on initial mount

  if (!users.value.length) {
    await loadUsers()
  }

  if (user.value && !user.value.createdAt) {
    user.value.createdAt = new Date().toISOString()
  }
  isLoading.value = false
})

watch(
  () => route.params.id,
  async (newId) => {
    userId.value = newId as string

    // trigger fake loading on param change
    isLoading.value = true
    await fakeDelay(1000)
    isLoading.value = false

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
        <el-button type="info" @click="goBack" class="back-button">
          <el-icon><ArrowLeft /></el-icon>
          <span class="back-text">Back</span>
        </el-button>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="isLoading" class="loading-container">
      <p>Loading profile, please wait...</p>
      <div class="loading-bar-container">
        <div class="loading-bar"></div>
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="status-message error-message">
      {{ error }}
    </div>

    <!-- User not found -->
    <div v-else-if="!user" class="status-message not-found-message">
      User not found.
    </div>

    <!-- Profile sections -->
    <div v-else class="profile-sections">
      <!-- Name Section -->
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
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80vw;
  margin: 1rem auto;
  padding: 2rem;
  gap: 2rem;
}

.header {
  display: grid;
  align-items: start;
  width: 100%;
}

.header-left {
  justify-self: start;
}

.header-left .back-button {
  display: flex;
  align-items: center;
  gap: 3px;
  height: 30px;
  color: var(--earth-green);
  background-color: transparent;
  border: none;
  font-weight: 600;
}

.header-left .back-button .el-icon {
  font-size: 20px;
}

.header-left .back-text {
  font-style: italic;
  font-size: 0.95rem;
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

.loading-container {
  text-align: center;
  padding: 2rem;
  color: #666;
  font-style: italic;
  width: 100%;
}

.loading-bar-container {
  margin: 10px auto 0;
  width: 30%;
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
</style>
