<script setup lang="ts">
import { ref, watch } from 'vue'
import type { User } from '@/types/user'

const props = defineProps<{
  modelValue: boolean
  user: User | null
}>()

const emit = defineEmits(['update:modelValue', 'submit'])

const visible = ref(props.modelValue)
const formRef = ref()
const form = ref<User | null>(null)

watch(
  () => props.user,
  (val) => {
    form.value = val ? JSON.parse(JSON.stringify(val)) : null
  },
  { immediate: true },
)

watch(
  () => props.modelValue,
  (val) => (visible.value = val),
)
watch(visible, (val) => emit('update:modelValue', val))

const rules = {
  name: [{ required: true, message: 'Name is required', trigger: 'blur' }],
  email: [{ required: true, message: 'Email is required', trigger: 'blur' }],
  username: [
    { required: true, message: 'Username is required', trigger: 'blur' },
  ],
  'address.street': [
    { required: true, message: 'Street is required', trigger: 'blur' },
  ],
  'address.city': [
    { required: true, message: 'City is required', trigger: 'blur' },
  ],
}

const close = () => {
  visible.value = false
}

const submit = async () => {
  try {
    await formRef.value?.validate()
    emit('submit', form.value)
    close()
  } catch {
    // validation failed
  }
}
</script>

<template>
  <transition name="zoom">
    <div v-if="visible" class="overlay" @click.self="close">
      <el-card class="zoom-card form-card" shadow="always">
        <div class="card-header">
          {{ form?.id ? 'Edit Profile' : 'Add Profile' }}
        </div>

        <div class="form-wrapper" v-if="form">
          <el-form
            :model="form"
            :rules="rules"
            label-width="100px"
            ref="formRef"
          >
            <el-form-item label="Name" prop="name">
              <el-input v-model="form.name" />
            </el-form-item>
            <el-form-item label="Email" prop="email">
              <el-input v-model="form.email" />
            </el-form-item>
            <el-form-item label="Username" prop="username">
              <el-input v-model="form.username" />
            </el-form-item>
            <el-form-item label="Street" prop="address.street">
              <el-input v-model="form.address.street" />
            </el-form-item>
            <el-form-item label="City" prop="address.city">
              <el-input v-model="form.address.city" />
            </el-form-item>
          </el-form>
        </div>

        <div class="dialog-footer">
          <el-button plain @click="close">Cancel</el-button>
          <el-button type="primary" @click="submit">Submit</el-button>
        </div>
      </el-card>
    </div>
  </transition>
</template>

<style scoped>
/* overlay and transition */
.overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.zoom-enter-active,
.zoom-leave-active {
  transition: all 0.25s ease;
}

.zoom-enter-from,
.zoom-leave-to {
  transform: scale(0.8);
  opacity: 0;
}

/* card */
.zoom-card {
  width: 500px;
  padding: 1.5rem;
  border-radius: 12px;
  color: var(--text-color);
  border: 1px solid var(--earth-clay);
  box-shadow: 0 6px 20px rgba(139, 94, 60, 0.4) !important; /* stronger shadow and force it */
  transition: transform 0.3s ease;
  text-align: center;
  background-color: white;
}

.card-header {
  font-size: 1.375rem;
  font-weight: 600;
  color: var(--earth-green);
  margin-bottom: 1.25rem;
  text-align: center;
}

.form-wrapper {
  padding: 0 12px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 1.5rem;
}

/* buttons */
.el-button--primary {
  background-color: var(--earth-green, #6b8e23);
  border-color: var(--earth-green, #6b8e23);
  color: white;
}

.el-button--primary:hover {
  background-color: #5f7d1d;
  border-color: #5f7d1d;
}
</style>
