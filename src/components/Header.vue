<script setup>
  import { ref, onMounted, onBeforeUnmount } from 'vue'
</script>

<template>
  <header>
    <img id="logo" src="../assets/logo.svg" alt="Logo Syssla Smart" />
    <img id="avatar" src="../assets/avatarIcon.svg" alt="User icon" />
  </header>
</template>

<style scoped>
  h1 {
    font-size: 1rem;
  }

  header {
    background-color: #f1f6ff;
    color: white;
    padding: 10px 20px;
    width: 100%;
    z-index: 10;
    display: flex;
    justify-content: space-between;
    /* gör så logo är till vänster och avataren till höger, med utrymme emellan*/
    align-items: center;
    border-radius: 0 0 8px 8px;
    box-shadow: rgba(9, 30, 66, 0.25) 0px 4px 8px -2px,
      rgba(9, 30, 66, 0.08) 0px 0px 0px 1px;
    /* skugga under header */
    position: sticky;
    top: 0;
  }
</style>
