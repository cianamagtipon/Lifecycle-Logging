<script setup lang="ts">
import { ElButton } from 'element-plus'
</script>

<template>
  <div class="not-found">
    <h1>ERROR 404</h1>

    <router-link to="/">
      <el-button class="home-button">Go Back Home</el-button>
    </router-link>
  </div>
</template>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
}

.home-button {
  background-color: var(--earth-brown);
  border-color: var(--earth-brown);
  color: white;
}

.home-button:hover {
  background-color: var(--earth-green);
  border-color: var(--earth-green);
  color: white;
}
</style>
