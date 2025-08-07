<script setup lang="ts">
import { ref, watch } from 'vue'
import type { User } from '@/types/user'

const props = defineProps<{
  modelValue: boolean
  user: User | null
}>()

const emit = defineEmits(['update:modelValue', 'view', 'edit', 'delete'])

const visible = ref(props.modelValue)

watch(
  () => props.modelValue,
  (val) => (visible.value = val),
)
watch(visible, (val) => emit('update:modelValue', val))

const close = () => {
  visible.value = false
}

const emitAction = (action: 'view' | 'edit' | 'delete') => {
  emit(action)
  close()
}
</script>

<template>
  <transition name="zoom">
    <div v-if="visible" class="overlay" @click.self="close">
      <el-card class="zoom-card" shadow="always">
        <h3>{{ user?.name }}</h3>
        <p>
          <em>@{{ user?.username }}</em>
        </p>

        <div class="action-buttons">
          <el-button type="primary" plain @click="emitAction('view')"
            >View</el-button
          >
          <el-button type="success" plain @click="emitAction('edit')"
            >Edit</el-button
          >
          <el-button type="danger" plain @click="emitAction('delete')"
            >Delete</el-button
          >
        </div>
      </el-card>
    </div>
  </transition>
</template>

<style scoped>
.overlay {
  background-color: transparent !important;
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.zoom-card {
  width: 300px;
  padding: 1.5rem;
  border-radius: 12px;
  color: var(--text-color);
  border-color: var(--earth-clay);
  box-shadow: 0 4px 12px rgba(139, 94, 60, 0.3);
  transition: transform 0.3s ease;
  text-align: center;
}

.zoom-card h3 {
  color: var(--earth-green);
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}

.zoom-card p {
  color: var(--earth-brown);
  font-size: 1rem;
  margin: 0.3rem 0;
}

.action-buttons {
  display: flex;
  justify-content: space-around;
  margin-top: 1.5rem;
}

/* transition */
.zoom-enter-active,
.zoom-leave-active {
  transition: all 0.25s ease;
}

.zoom-enter-from,
.zoom-leave-to {
  transform: scale(0.8);
  opacity: 0;
}
</style>
