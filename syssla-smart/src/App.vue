<template>
  <nav>
    <router-link to="/sysslor">Sysslor</router-link>
    <router-link to="/beloningar">Belöningar</router-link>
  </nav>
  <router-view />
</template>

<script setup></script>

<style>
  nav {
    display: flex;
    gap: 1rem;
  }
</style>
