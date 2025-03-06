<script setup></script>

<template>
  <div>
    <h1>Belöningar</h1>
    <p>Lista över belöningar...</p>
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
          model-value="75"
          height="10"
          rounded
          color="blue lighten-2"
          class="w-75"
        ></v-progress-linear>

        <v-chip class="star-chip">
          <v-icon color="yellow darken-2">mdi-star</v-icon>
          <span class="ml-1">15</span>
        </v-chip>
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
</style>
