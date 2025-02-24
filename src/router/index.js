import { createRouter, createWebHistory } from "vue-router";
import Sysslor from "../views/Sysslor.vue";
import Beloningar from "../views/Beloningar.vue";

const routes = [
  { path: "/", component: Sysslor },
  { path: "/sysslor", component: Sysslor },
  { path: "/beloningar", component: Beloningar },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
