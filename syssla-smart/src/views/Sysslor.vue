<template>
  <div>
    <h1>Sysslor</h1>
    <p>Lista över sysslor...</p>
      <div class="create-chore">
        <v-btn @click="openDialog"
        color="purple lighten-3"
        outlined
        class="purple-border-btn rounded-btn black-text"
        max-width="400px">
          <span class="black-text">Ny Syssla</span>
          <v-icon class="ml-7 black-text" color="black">mdi-plus</v-icon>
        </v-btn>
        <!-- dialog section-->
        <v-dialog v-model="dialog" max-width="400px">
        <v-card>
          <v-card-text>
            <v-text-field v-model="choreName" placeholder="Titel" ></v-text-field>

          <!-- Date Picker -->
          <v-row align="center" class="mt-4">
            <v-col cols="6">
              <span>{{ formattedDate }}</span>
            </v-col>

            <v-col cols="6">
              <v-menu v-model="menu" :close-on-content-click="false" transition="scale-transition" offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn v-bind="attrs" @click="menu = true" icon>
                    <v-icon color="black">mdi-calendar</v-icon>
                  </v-btn>
                </template>
                <v-card>
                  <v-date-picker v-model="selectedDate" @update:modelValue="updateDate" no-title></v-date-picker>
                </v-card>
              </v-menu>
            </v-col>
          </v-row>
        </v-card-text>

        <!--Lägg till button section-->
          <v-card-actions class="justify-center">
            <v-btn color="green" @click="addChore(choreName, selectedDate); closeDialog()" size="large">
              <span class="black-text green-btn rounded-btn custom-btn">Lägg Till</span>
            </v-btn>
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

  const selectedDate = ref(null);
  const menu = ref(false);

  const formattedDate = computed(() => {
    return selectedDate.value ? new Date(selectedDate.value).toLocaleDateString() : "Choose a deadline";
  })

  const updateDate = (date) => {
    selectedDate.value = date;
    menu.value = false;
  }

</script>

<style scoped>
  .rounded-btn {
    border-radius: 10px;
  }

  .black-text {
    color: black;
  }

  .green-btn {
    background-color: green;
    color:black;
  }

  .custom-btn {
    padding: 10px 30px;
  }

</style>
