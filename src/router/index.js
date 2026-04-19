import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const AdminView = () => import('../views/AdminView.vue')

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminView
    }
  ]
})
