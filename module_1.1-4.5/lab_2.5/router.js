import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('../pages/Home.vue')
  },
  {
    path: '/tasks',
    component: () => import('../pages/Tasks.vue')
  },
  {
    path: '/profile',
    component: () => import('../pages/Profile.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router