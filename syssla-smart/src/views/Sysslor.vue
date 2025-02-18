<template>
  <div>
    <h1>Sysslor</h1>
    <p>Lista över sysslor...</p>
    <div class="skapa-syssla">
      <v-btn @click="openDialog" color="primary">Skapa Syssla</v-btn>
    </div>

    <v-dialog v-model="dialog" max-width="400px">
      <v-card>
        <v-card-text>
          <v-text-field v-model="choreName" label="Titel"</v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="createChore" color="primary">Lägg Till</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
  const openDialog = () => {
    console.log("Create chore clicked!")
  }
</script>
