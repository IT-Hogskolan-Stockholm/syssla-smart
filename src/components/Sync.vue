<script setup>
import { ref } from 'vue'

const houseCode = ref('')
const loading = ref(false)
const synced = ref(false)
const codeValid = ref(false)

const rules = [
  (value) => {
    if (value) return true
    return 'Du måste skriva in en Hushållskod'
  },
  (value) => {
    if (value.toLowerCase() === 'hsh-1234') {
      codeValid.value = true
      return true
    }
    codeValid.value = false
    return 'Hittar inget hushåll med den koden'
  }
]

const startLoading = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    synced.value = true
  }, 2000)
}

const resetDialog = () => {
  synced.value = false
}
</script>

<template>
  <v-dialog max-width="500" @update:model-value="resetDialog">
    <template v-slot:activator="{ props: activatorProps }">
      <a v-bind="activatorProps" class="menu-links">Synka hushåll</a>
    </template>

    <template v-slot:default>
      <v-card
        v-if="!loading && !synced"
        title="Ange Kod:"
        class="d-flex flex-column"
        style="
          min-height: 220px;
          border-radius: 20px;
          box-shadow: 10px 10px 15px rgba(0, 0, 0, 0.3);
        "
      >
        <v-form @submit.prevent>
          <v-card-text>
            <v-text-field v-model="houseCode" :rules="rules" label="Hushållskod" />
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn type="submit" @click="startLoading" :disabled="!houseCode || !codeValid"
              >Synka <v-icon>mdi-arrow-right</v-icon></v-btn
            >
          </v-card-actions>
        </v-form>
      </v-card>

      <v-card
        v-else-if="loading"
        class="d-flex align-center justify-center"
        style="
          min-height: 220px;
          border-radius: 20px;
          box-shadow: 10px 10px 15px rgba(0, 0, 0, 0.3);
        "
      >
        <v-progress-circular indeterminate size="100" color="primary"></v-progress-circular>
      </v-card>

      <v-card
        v-else
        class="d-flex flex-column"
        style="
          min-height: 220px;
          border-radius: 20px;
          box-shadow: 10px 10px 15px rgba(0, 0, 0, 0.3);
        "
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

<style scoped>
.menu-links {
  color: black !important;
  font-size: 1.25rem;
  padding-left: 1rem;
  cursor: pointer;
}
</style>
