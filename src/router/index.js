import { createRouter, createWebHistory } from 'vue-router'
import Sysslor from '../views/Sysslor.vue'
import Beloningar from '../views/Beloningar.vue'
import Historik from '../views/Historik.vue'
import Inställningar from '../views/Inställningar.vue'

const routes = [
  { path: '/', component: Sysslor },
  { path: '/beloningar', component: Beloningar },
  { path: '/historik', component: Historik },
  { path: '/installningar', component: Inställningar }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
