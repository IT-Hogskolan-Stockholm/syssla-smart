import { createRouter, createWebHistory } from 'vue-router'
import Sysslor from '../views/Sysslor.vue'
import Beloningar from '../views/Beloningar.vue'
import Historik from '../views/Historik.vue'

const routes = [
  { path: '/', component: Sysslor },
  { path: '/sysslor', component: Sysslor },
  { path: '/beloningar', component: Beloningar },
  { path: '/historik', component: Historik }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
