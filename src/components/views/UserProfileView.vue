<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

import UserProfile from '@/components/UserProfile.vue'
import Comments from '@/components/Comments.vue'
import { fetchComments, buildCommentTree } from '@/services/api'
import type { NestedComment } from '@/types/comments'

const route = useRoute()

const comments = ref<NestedComment[]>([])

function getRandomComments<T>(arr: T[], count: number): T[] {
  const shuffled = arr.slice().sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

onMounted(async () => {
  const raw = await fetchComments()

  // grab ~10 random comments from the full list
  const randomSubset = getRandomComments(raw, 10)

  // build the nested tree
  comments.value = buildCommentTree(randomSubset)
})
</script>

<template>
  <div class="user-profile">
    <UserProfile />
  </div>

  <div class="comment-tree">
    <Comments
      v-for="comment in comments"
      :key="comment.id"
      :comment="comment"
    />
  </div>
</template>
