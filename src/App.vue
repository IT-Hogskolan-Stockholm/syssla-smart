<script setup>
import Header from './components/Header.vue'
</script>

<template>
  <Header />
  <nav>
    <router-link to="/sysslor">Sysslor</router-link>
    <router-link to="/beloningar">Belöningar</router-link>
  </nav>
  <router-view />
</template>

<style scoped>
nav {
  display: flex;
  gap: 1rem;
  padding: 1rem 0 2rem 0;
}
</style>
