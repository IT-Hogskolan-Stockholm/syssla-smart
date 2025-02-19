<template>
  <div>
    <h1>Sysslor</h1>
    <p>Lista över sysslor...</p>
      <div class="create-chore">
        <v-btn @click="openDialog" color="primary" max-width="400px">Skapa Syssla</v-btn>

        <v-dialog v-model="dialog" max-width="400px">
        <v-card>
          <v-card-text>
            <v-text-field v-model="choreName" label="Titel"></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-btn @click="closeDialog">Lägg Till</v-btn>
          </v-card-actions>
        </v-card>
        </v-dialog>
    </div>
  </div>
</template>

<script setup>
  import { ref } from "vue";
  import {useChoreStore} from "../stores/ChoreStore";

  const store = useChoreStore();
  const { dialog, openDialog, closeDialog } = store;
  const choreName = ref("");

</script>
