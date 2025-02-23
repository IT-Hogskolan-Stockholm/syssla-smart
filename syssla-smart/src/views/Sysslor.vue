<script setup>
  import { computed, ref } from 'vue'
  import { useChoreStore } from '../stores/ChoreStore'
  import { useUserStore } from '../stores/UserStore'

  const store = useChoreStore()
  const userStore = useUserStore()
  const dialog = computed(() => store.dialog)
  const openDialog = store.openDialog
  const closeDialog = store.closeDialog
  const addChore = store.addChore
  const choreName = ref('')

  const selectedDate = ref(null)
  const menu = ref(false)

  const formattedDate = computed(() => {
    return selectedDate.value
      ? new Date(selectedDate.value).toLocaleDateString()
      : 'Choose a deadline'
  })

  const updateDate = (date) => {
    selectedDate.value = date
    menu.value = false
  }

  const getUserColor = (assignedTo) => {
    const user = userStore.users.find((user) => user.name === assignedTo)
    return user ? user.color : '#FFF'
  }
</script>

<template>
  <div class="chores-container">
    <section
      class="list-of-chores-section d-flex justify-center flex-column align-center"
    >
      <v-btn
        v-for="chore in store.chores"
        color="blue-lighten-4"
        class="border-md border-blue rounded-btn black-text custom-btn d-flex justify-space-between align-center"
        max-width="400px"
      >
        <div class="chore-info-container d-flex flex-column align-start">
          <span class="black-text">{{ chore.title }}</span>
          <div class="deadline-container d-flex flex-row align-center">
            <span><v-icon>mdi-calendar-month</v-icon></span>
            <span>{{ chore.deadline }}</span>
          </div>
        </div>
        <div class="icons-container d-flex flex-row align-center ga-4">
          <span
            class="assignment-brick d-flex justify-center align-center"
            :style="{
              backgroundColor: getUserColor(chore.assignedTo)
            }"
            >{{ chore.assignedTo || '-' }}</span
          >
          <v-icon class="black-text" size="36" color="black"
            >mdi-pencil-outline</v-icon
          >
        </div>
      </v-btn>
    </section>
    <section
      class="create-new-section d-flex justify-center flex-column align-center"
    >
      <v-btn
        @click="openDialog"
        color="purple-lighten-4"
        class="border-md border-purple rounded-btn black-text custom-btn d-flex justify-space-between align-center"
        max-width="400px"
      >
        <span class="black-text">Ny Syssla</span>
        <v-icon class="ml-7 black-text" color="black">mdi-plus</v-icon>
      </v-btn>
      <!-- dialog section-->
      <v-dialog
        v-model="dialog"
        max-width="400px"
        :content-class="'auto-height-dialog'"
        class="d-flex align-start"
      >
        <v-card class="d-flex flex-column" style="min-height: 0">
          <v-card-text
            class="flex-grow-0"
            style="overflow: visible; padding-bottom: 0"
          >
            <v-text-field
              v-model="choreName"
              placeholder="Titel"
            ></v-text-field>

            <!-- Date Picker -->
            <div class="d-flex justify-space-between align-center mt-4">
              <div class="flex-grow">
                <span>{{ formattedDate }}</span>
              </div>

              <div>
                <v-menu
                  v-model="menu"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  :attach="true"
                  content-class="date-picker-popup"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn v-bind="attrs" @click="menu = true" icon>
                      <v-icon color="black">mdi-calendar</v-icon>
                    </v-btn>
                  </template>
                  <v-card>
                    <v-date-picker
                      v-model="selectedDate"
                      @update:modelValue="updateDate"
                      no-title
                    ></v-date-picker>
                  </v-card>
                </v-menu>
              </div>
            </div>
          </v-card-text>

          <!--Lägg till button section-->
          <v-card-actions class="justify-center flex-grow-0 mt-5">
            <v-btn
              color="green"
              @click="addChore(choreName, selectedDate), closeDialog()"
              size="large"
              class="add-btn"
              block
            >
              <span class="black-text rounded-btn">Lägg Till</span>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </section>
  </div>
</template>

<style scoped>
  .auto-height-dialog .v-card {
    min-height: auto !important;
    max-height: none !important;
    overflow: visible !important;
  }

  .chores-container,
  .create-chore {
    width: 100%;
  }

  .rounded-btn {
    border-radius: 16px;
  }

  .black-text {
    color: black;
    text-transform: none;
    font-weight: 400;
  }

  .add-btn {
    background-color: #26a69a;
    font-size: 1.3rem;
    padding: 1rem 4rem !important;
    margin-bottom: 0.5rem;
    margin: 0 24px 0.5rem 24px;
    border-radius: 16px;
    height: unset !important;
    .v-btn__content {
      .black-text.rounded-btn {
        width: 100%;
      }
    }
  }
  :deep(.v-card-actions) {
    padding: 16px 24px !important;
  }

  .custom-btn {
    padding: 2rem 1rem;
    margin-bottom: 1rem;
    width: 90%;
    font-size: 1.1rem;
  }

  .border-purple {
    color: #6a1b9a;
  }
  .border-blue {
    color: #0d47a1;
  }

  :deep(.v-btn__content) {
    justify-content: space-between;
    width: 100%;
  }

  .chore-info-container {
    gap: 0.4rem;
    .black-text {
      font-size: 1.2rem;
    }
  }
  .deadline-container {
    gap: 0.6rem;
    font-size: 0.8rem;
  }
  .icons-container {
    .assignment-brick {
      background-color: #fff;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      font-size: 1rem;
      font-weight: 600;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    }
  }
</style>
