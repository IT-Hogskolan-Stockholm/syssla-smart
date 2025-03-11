<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { useUserStore } from '../stores/UserStore'
import Sync from '../components/Sync.vue'

const menuOpen = ref(false)
const userStore = useUserStore()
const currentUser = computed(() => userStore.users.find((user) => user.name === 'Algot'))

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
}
const closeMenu = (event) => {
  if (!event.target.closest('#meny') && !event.target.closest('#avatar')) {
    menuOpen.value = false
  }
}
onMounted(() => {
  document.addEventListener('click', closeMenu)
  userStore.fetchUsers()
})
onBeforeUnmount(() => {
  document.removeEventListener('click', closeMenu)
})
</script>

<template>
  <header class="d-flex justify-space-between align-center">
    <router-link to="/">
      <img id="logo" src="../assets/logo.svg" alt="Logo Syssla Smart" />
    </router-link>
    <div id="user" class="d-flex">
      <img id="avatar" src="../assets/avatarIcon.svg" alt="User icon" @click.stop="toggleMenu" />
      <v-overlay
        v-model="menuOpen"
        class="overlay"
        @click="menuOpen = false"
        style="z-index: 1"
      ></v-overlay>
      <nav id="menu" :class="{ open: menuOpen }">
        <div id="menu-header" class="d-flex justify-space-between align-center">
          <img id="avatar-menu" src="../assets/avatarIcon.svg" alt="User icon" />
          <v-icon class="black-text" size="40" color="black" @click="menuOpen = false"
            >mdi-close</v-icon
          >
        </div>
        <div id="user-score" class="d-flex align-center">
          <v-icon class="yellow-text star-icon" size="30" color="yellow">mdi-star</v-icon>
          <span>{{ currentUser?.scoreValue || 0 }} poäng</span>
        </div>
        <div id="menu-content" class="d-flex-column">
          <div id="menu-category" class="py-5 d-flex align-center">
            <v-icon class="black-text" size="30" color="black">mdi-home</v-icon>
            <router-link class="menu-links" to="/">Hem</router-link>
          </div>
          <div id="menu-category" class="py-5 d-flex align-center">
            <v-icon class="black-text" size="30" color="black">mdi-trophy-variant</v-icon>
            <router-link class="menu-links" to="/beloningar">Belöningar</router-link>
          </div>
          <div id="menu-category" class="py-5 d-flex align-center">
            <v-icon class="black-text" size="30" color="black">mdi-history</v-icon>
            <router-link class="menu-links" to="/historik">Historik</router-link>
          </div>
          <div id="menu-category" class="py-5 d-flex align-center">
            <v-icon class="black-text" size="30" color="black">mdi-cog</v-icon>
            <router-link class="menu-links" to="/installningar">Inställningar</router-link>
          </div>
          <div id="menu-category" class="py-5 d-flex align-center">
            <v-icon class="black-text" size="30" color="black">mdi-sync</v-icon>
            <Sync />
          </div>
          <div id="theme-toggle" class="py-5">
            <v-switch label="Tema" inset @click.stop></v-switch>
          </div>
        </div>
        <div id="menu-footer" class="d-flex justify-end align-center">
          <span>Logga ut</span>
          <v-icon class="black-text" size="30" color="black">mdi-logout</v-icon>
        </div>
      </nav>
    </div>
  </header>
</template>

<style scoped>
header {
  background-color: #f1f6ff;
  color: white;
  padding: 0.625rem 1.25rem;
  width: 100%;
  z-index: 10;
  border-radius: 0 0 8px 8px;
  box-shadow:
    rgba(9, 30, 66, 0.25) 0px 4px 8px -2px,
    rgba(9, 30, 66, 0.08) 0px 0px 0px 1px;
  position: sticky;
  top: 0;
  margin-bottom: 2rem;
  margin-bottom: 2rem;
}

#avatar {
  height: 3rem;
  cursor: pointer;
}

#menu {
  background-color: #fff;
  width: 20rem;
  height: 100vh;
  position: fixed;
  right: 0;
  top: 0;
  transform: translateX(50rem);
  transition: transform 0.5s ease-in-out;
  z-index: 10;
}

#menu.open {
  transform: translateX(0);
}

#menu-header {
  padding: 0.625rem;
}

#avatar-menu {
  height: 3rem;
}

#user-score {
  padding: 1.25rem;
}

#user-score span {
  font-size: 1.25rem;
  color: black;
  padding-left: 0.5rem;
}

#menu-content {
  padding: 1.25rem;
}

#menu-category {
  border-left-width: 0px;
  border-top-width: 0px;
  border-bottom-width: 1px;
  border-right-width: 0px;
  border-style: solid;
  border-bottom-color: rgba(34, 37, 41, 0.25);
  color: green;
}

#menu-category .menu-links {
  color: black !important;
  font-size: 1.25rem;
  font-weight: 400;
  padding-left: 1rem;
}

::v-deep(.v-label) {
  font-size: 1.25rem !important;
  color: black !important;
  padding-left: 1rem;
  font-weight: 400;
}

#menu-footer {
  padding: 0.625rem;
  position: absolute;
  bottom: 1rem;
  right: 1rem;
}

#menu-footer span {
  font-size: 1.25rem;
  color: black;
  padding-right: 0.5rem;
}

/* Blinka lilla stjäna där */
.star-icon {
  animation: sparkle 1.5s infinite ease-in-out;
}

@keyframes sparkle {
  0% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }

  25% {
    opacity: 0.8;
    transform: scale(1.2) rotate(20deg);
    filter: brightness(1.5);
  }

  50% {
    opacity: 1;
    transform: scale(0.9) rotate(-20deg);
  }

  75% {
    opacity: 0.8;
    transform: scale(1.1) rotate(10deg);
  }

  100% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}
</style>
