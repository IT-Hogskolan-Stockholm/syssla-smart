<script setup>
import { ref } from 'vue';

const loading = ref(false);
const synced = ref(false);

const startLoading = () => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
    synced.value = true;
  }, 2000);
};

const resetDialog = () => {
  synced.value = false;
};
</script>

<template>
  <v-dialog max-width="500" @update:model-value="resetDialog">
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn v-bind="activatorProps" color="surface-variant" text="Open Dialog" variant="flat"></v-btn>
    </template>

    <template v-slot:default>
      <v-card
        v-if="!loading && !synced"
        title="Ange Kod:"
        class="d-flex flex-column"
        style="min-height: 220px; border-radius: 20px; box-shadow: 10px 10px 15px rgba(0, 0, 0, 0.3)"
      >
        <v-card-text>
          <v-text-field label="Hushållskod"></v-text-field>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text="Synka ->" @click="startLoading"></v-btn>
        </v-card-actions>
      </v-card>

      <v-card
        v-else-if="loading"
        class="d-flex align-center justify-center"
        style="min-height: 220px; border-radius: 20px; box-shadow: 10px 10px 15px rgba(0, 0, 0, 0.3)"
      >
        <v-progress-circular indeterminate size="100" color="primary"></v-progress-circular>
      </v-card>

      <v-card
        v-else
        class="d-flex flex-column"
        style="min-height: 220px; border-radius: 20px; box-shadow: 10px 10px 15px rgba(0, 0, 0, 0.3)"
      >
        <v-card-text class="d-flex align-center justify-center" style="padding: 0">
          <v-icon size="100" color="rgb(151, 211, 149)">mdi-check-circle</v-icon>
        </v-card-text>

        <v-card-actions class="justify-center mt-n8">
          <h2>Hushållet är nu synkat!</h2>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>
