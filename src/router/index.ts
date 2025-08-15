import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import UserListView from '@/components/views/UserListView.vue'
import UserProfileView from '@/components/views/UserProfileView.vue'
import ErrorView from '@/components/views/ErrorView.vue'

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
    props: true, // enables passing 'id' as a prop
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: ErrorView,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
