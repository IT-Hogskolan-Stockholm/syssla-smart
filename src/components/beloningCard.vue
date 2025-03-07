<script setup>
import { useUserStore } from '../stores/UserStore'
import { computed } from 'vue'
import { ref } from 'vue'

const userStore = useUserStore()
const algotScoreValue = computed(() => {
  const algot = userStore.users.find((user) => user.name === 'Algot')
  return algot ? algot.scoreValue : 0
})
const score = ref(algotScoreValue)
</script>

<template>
  <div>
    <v-card class="mx-auto my-4" max-width="300" elevation="4" rounded="lg">
      <v-img src="/src/assets/pizza.jpeg" height="200px" cover></v-img>
      <v-card-text class="text-center">
        <div class="title-font">PIZZA-KVÄLL!!!</div>
        <p class="text-body-1">
          En ute-kväll för hela familjen där vi går ut på La Luna och äter pizza!
        </p>
      </v-card-text>

      <v-card-actions class="d-flex flex-column align-center">
        <v-progress-linear
          max="15"
          v-model="score"
          height="10"
          rounded
          color="blue lighten-2"
          class="w-75"
        ></v-progress-linear>

        <div class="star-points">
          <v-icon color="yellow" size="42">mdi-star</v-icon>
          <span class="star-number">15</span>
        </div>
      </v-card-actions>
    </v-card>
  </div>
</template>

<style scoped>
.title-font {
  font-family: 'Comic Sans MS', cursive, sans-serif;
  font-size: 24px;
  font-weight: bold;
}

.star-chip {
  background-color: white;
  border: 2px solid gold;
  font-size: 16px;
  font-weight: bold;
}
.star-points {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-left: 215px;
  margin-top: -35px;
}

.star-number {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  color: rgb(0, 0, 0);
  font-size: 14px;
}
</style>
