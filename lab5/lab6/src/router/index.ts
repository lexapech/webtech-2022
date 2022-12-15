import { createRouter, createWebHistory } from 'vue-router'
import Login from '../components/Login.vue'
import Market from '../components/Market.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/market',
      name: 'market',
      component: Market
    }
  ]
})

export default router
