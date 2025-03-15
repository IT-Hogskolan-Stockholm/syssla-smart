<script setup>
import { useChoreStore } from '../stores/ChoreStore'
import { useUserStore } from '../stores/UserStore'
import { computed } from 'vue'

import fallbackImage from '../assets/placeholder-image.webp'

const store = useChoreStore()
const rewards = computed(() => store.rewards)
const userStore = useUserStore()

const algotScoreValue = computed(() => {
  const algot = userStore.users.find((user) => user.name === 'Algot')
  return algot ? algot.scoreValue : 0
})

const getRewardImage = (reward) => {
  return reward.imgSrc ? reward.imgSrc : fallbackImage
}
</script>

<template>
  <v-container class="py-0">
    <v-row>
      <v-col v-for="reward in rewards" :key="reward.id" cols="12">
        <v-card class="mx-auto mt-0 mb-4" max-width="400" elevation="4" rounded="lg">
          <v-img :src="getRewardImage(reward)" alt="Belöning Bild" height="200px" cover></v-img>
          <v-card-title class="title-font text-center">
            {{ reward.name }}
          </v-card-title>
          <v-card-text class="text-center">
            {{ reward.description }}
          </v-card-text>
          <v-card-actions class="d-flex flex-column align-center">
            <v-progress-linear
              :max="reward.pointsCost"
              :model-value="algotScoreValue"
              height="10"
              rounded
              color="blue lighten-2"
              class="w-75"
            ></v-progress-linear>
            <div class="star-points">
              <v-icon color="yellow" size="48">mdi-star</v-icon>
              <span class="star-number">{{ reward.pointsCost }}</span>
            </div>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.title-font {
  font-size: 1.5rem;
}

.star-chip {
  background-color: white;
  border: 2px solid gold;
  font-weight: bold;
}

.star-points {
  position: relative;
  margin-left: 16.563rem;
  margin-top: -2.375rem;
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
