<template>
  <div>
    <h1>Sysslor</h1>
    <p>Lista över sysslor...</p>
      <div class="create-chore">
        <v-btn @click="openDialog"
        color="purple lighten-4"
        outlined
        class="purple-border-btn rounded-btn black-text"
        max-width="400px">
          <span class="black-text">Ny Syssla</span>
          <v-icon class="ml-7 black-text" color="black">mdi-plus</v-icon>
        </v-btn>

        <v-dialog v-model="dialog" max-width="400px">
        <v-card>
          <v-card-text>
            <v-text-field v-model="choreName" placeholder="Titel"></v-text-field>
          </v-card-text>
          <v-card-actions class="justify-center">
            <v-btn variant="outlined" @click="addChore(choreName); closeDialog()">Lägg Till</v-btn>
          </v-card-actions>
        </v-card>
        </v-dialog>
    </div>
  </div>
</template>

<script setup>
  import { computed, ref } from "vue";
  import {useChoreStore} from "../stores/ChoreStore";

  const store = useChoreStore();
  const dialog = computed(() => store.dialog);
  const openDialog = store.openDialog;
  const closeDialog = store.closeDialog;
  const addChore = store.addChore;
  const choreName = ref("");

</script>

<style scoped>
  .rounded-btn {
    border-radius: 20px;
  }

  .black-text {
    color: black;
  }
</style>
