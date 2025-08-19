<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

import UserProfile from '@/components/UserProfile.vue'
import Comments from '@/components/Comments.vue'
import { fetchComments, buildCommentTree } from '@/services/api'
import type { NestedComment } from '@/types/comments'

const route = useRoute()

const comments = ref<NestedComment[]>([])
const isVisible = ref(false) // controls when comments show up

function getRandomComments<T>(arr: T[], count: number): T[] {
  const shuffled = arr.slice().sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

// helper: delay function
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

onMounted(async () => {
  const raw = await fetchComments()
  const randomSubset = getRandomComments(raw, 10)
  comments.value = buildCommentTree(randomSubset)

  // wait before showing
  await delay(1000)
  isVisible.value = true
})
</script>

<template>
  <div class="user-profile">
    <UserProfile />
  </div>

  <!-- Only show after delay -->
  <div class="comment-tree" v-if="isVisible">
    <Comments
      v-for="comment in comments"
      :key="comment.id"
      :comment="comment"
    />
  </div>
</template>
