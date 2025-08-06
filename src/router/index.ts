import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import UserListView from '@/components/views/UserListView.vue'
import UserProfileView from '@/components/views/UserProfileView.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'user-list',
    component: UserListView,
  },
  {
    path: '/users/:id',
    name: 'user-profile',
    component: UserProfileView,
    props: true, // Enables passing `id` as a prop
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
