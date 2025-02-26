<script setup>
  import Header from './components/Header.vue'
  import Sync from './components/Sync.vue'
</script>

<template>
  <Header />
  <nav>
    <router-link to="/sysslor">Sysslor</router-link>
    <router-link to="/beloningar">Belöningar</router-link>
  </nav>
  <router-view />
<sync />
</template>

<style scoped>
  nav {
    display: flex;
    gap: 1rem;
  }
</style>
