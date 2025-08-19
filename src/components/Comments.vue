<script setup lang="ts">
import { ref } from 'vue'
import type { NestedComment } from '@/types/comments'

const props = defineProps<{ comment: NestedComment }>()

const showReply = ref(false)
const replyText = ref('')

const submitReply = () => {
  if (!replyText.value.trim()) return

  const newReply: NestedComment = {
    id: Date.now(),
    postId: props.comment.postId,
    name: 'Anonymous',
    email: 'anonymous@example.com',
    body: replyText.value,
    replies: [],
    parentId: props.comment.id,
  }

  // push to the comment's replies
  if (!props.comment.replies) {
    props.comment.replies = []
  }
  props.comment.replies.push(newReply)

  // reset input
  replyText.value = ''
  showReply.value = false

  console.log(`Anonymous reply added to comment ${props.comment.id}:`, newReply)
}
</script>

<template>
  <el-card class="comment-card" shadow="always">
    <div class="header">
      <el-avatar>{{ comment.email.charAt(0).toUpperCase() }}</el-avatar>
      <div class="meta">
        <strong>{{ comment.name }}</strong>
        <small v-if="comment.email !== 'anonymous@example.com'">
          ({{ comment.email }})
        </small>
      </div>
    </div>

    <p class="body">{{ comment.body }}</p>

    <div class="actions">
      <el-button size="small" text @click="showReply = !showReply">
        {{ showReply ? 'Cancel' : 'Reply' }}
      </el-button>
    </div>

    <div v-if="showReply" class="reply-box">
      <el-input
        v-model="replyText"
        type="textarea"
        placeholder="Write a reply..."
        rows="3"
      />
      <el-button
        size="small"
        type="default"
        @click="submitReply"
        style="margin-top: 1rem"
      >
        Submit
      </el-button>
    </div>

    <div v-if="comment.replies?.length" class="replies">
      <el-card
        v-for="reply in comment.replies"
        :key="reply.id"
        class="reply-card"
        shadow="never"
      >
        <div class="header">
          <el-avatar>{{ reply.email.charAt(0).toUpperCase() }}</el-avatar>
          <div class="meta">
            <strong>{{ reply.name }}</strong>
            <small v-if="reply.email !== 'anonymous@example.com'">
              ({{ reply.email }})
            </small>
          </div>
        </div>
        <p class="body">{{ reply.body }}</p>
      </el-card>
    </div>
  </el-card>
</template>

<style scoped>
.comment-card {
  width: 80vw;
  margin: 1rem auto;
  max-width: 1440px;
  border-radius: 12px;
  color: var(--text-color);
  border: 1px solid var(--earth-clay);
}

.reply-card {
  margin-top: 0.5rem;
  margin-left: 2rem;
  border-left: 3px solid var(--earth-green);
  padding-left: 1rem;
  border-radius: 8px;
  background-color: var(--earth-clay);
}

.header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.meta {
  display: flex;
  flex-direction: column;
}

.body {
  margin: 0.5rem 0;
}

.actions {
  margin-top: 0.5rem;
}

.actions .el-button {
  color: var(--earth-green);
  font-weight: 600;
}

.reply-box {
  margin-top: 0.5rem;
}

.reply-box .el-input {
  background-color: var(--earth-sand);
  border: 1px solid var(--earth-clay);
  color: var(--text-color);
}

.reply-box .el-button {
  background-color: var(--earth-green);
  color: white;
  font-weight: 600;
  border: none;
  box-shadow: none;
}

.replies {
  margin-top: 1rem;
}

.el-avatar {
  background-color: var(--earth-green);
  color: white;
  font-weight: bold;
}
</style>
