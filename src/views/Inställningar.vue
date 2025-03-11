<script setup></script>

<template>
  <div class="wrapper d-flex align-center justify-center">
    <v-empty-state
      headline="Whoops, 404"
      title="Page not found"
      text="The page you were looking for does not exist"
      image="https://cdn.vuetifyjs.com/docs/images/components/v-empty-state/connection.svg"
      class="py-0 px-0"
    ></v-empty-state>
  </div>
</template>

<style scoped>
.wrapper {
  height: 100vw;
}
</style>
