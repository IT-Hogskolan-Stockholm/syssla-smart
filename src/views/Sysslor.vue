<script setup>
import { computed, ref, watch } from 'vue'
import { useChoreStore } from '../stores/ChoreStore'
import { useUserStore } from '../stores/UserStore'

const store = useChoreStore()
const userStore = useUserStore()
const chores = computed(() => store.chores)
const archivedChores = computed(() => store.archivedChores)

const archiveChore = store.archiveChore
const undoArchiveChore = store.undoArchiveChore
const addChoreDialog = computed({
  get: () => store.addChoreDialog,
  set: (value) => (store.addChoreDialog = value)
})
const assignUserDialog = computed({
  get: () => store.assignUserDialog,
  set: (value) => (store.assignUserDialog = value)
})

const openAddChoreDialog = store.openAddChoreDialog
const closeAddChoreDialog = store.closeAddChoreDialog
const openAssignUserDialog = store.openAssignUserDialog
const addChore = store.addChore
const addAssignedUser = store.addAssignedUser
const choreName = ref('')
const form = ref(null)
const dateError = ref(null)
const validateDate = ref(false)
const assignRandomUser = store.assignRandomUser
const rewardPoints = ref(null)

// *** Swipe functionality
const swipeProgress = ref({})
const showUndo = ref({})

// When user starts swipe
const startSwipe = (chore) => {
  swipeProgress.value[chore.id] = 0
}

const moveSwipe = (chore, event) => {
  const moveAmount = event.touches[0].clientX
  const swipeAmount = moveAmount / window.innerWidth
  swipeProgress.value[chore.id] = Math.min(swipeAmount * 0.7, 1)
}

const endSwipe = (chore) => {
  if (swipeProgress.value[chore.id] > 0.5) {
    archiveChore(chore) // Archive the chore if the swipe is more than 50%
    showUndo.value[chore.id] = true
    setTimeout(() => {
      showUndo.value[chore.id] = false
    }, 3000)
  }
  swipeProgress.value[chore.id] = 0
}

const undoArchive = (chore) => {
  undoArchiveChore(chore)
  showUndo.value[chore.id] = false
}

watch(
  () => store.editingChore,
  (chore) => {
    if (chore) {
      choreName.value = chore.title
      selectedDate.value = chore.deadline ? new Date(chore.deadline) : null
      rewardPoints.value = chore.pointValue
    } else {
      choreName.value = ''
      selectedDate.value = null
      rewardPoints.value = null
    }
  }
)

const handleOpenDialog = (chore = null) => {
  store.editingChore = chore
  store.openAddChoreDialog()
}

const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return d.toISOString().split('T')[0]
}

const formattedDate = computed(() => {
  return selectedDate.value ? new Date(selectedDate.value).toLocaleDateString() : 'Välj ett datum'
})
const selectedDate = ref(null)
const menu = ref(false)

const updateDate = (date) => {
  selectedDate.value = date
  menu.value = false
  dateError.value = null
  validateDate.value = false
}

const getUserColor = (assignedTo) => {
  const user = userStore.users.find((user) => user.name === assignedTo)
  return user ? user.color : '#FFF'
}

const rules = {
  required: (value) => !!value || 'Du måste ange en titel'
}

const handleSubmit = async () => {
  validateDate.value = true
  dateError.value = null

  const { valid: titleValid } = await form.value.validate()

  const dateValid = !!selectedDate.value
  if (!dateValid) {
    dateError.value = 'Du måste välja ett datum'
  }

  if (titleValid && dateValid) {
    addChore(choreName.value, formattedDate.value, rewardPoints.value)
    closeAddChoreDialog()
    form.value.reset()
    selectedDate.value = null
    dateError.value = null
    rewardPoints.value = null
  }
}
</script>

<template>
  <div class="chores-container">
    <!-- Undo btn -->
    <transition-group name="fade" tag="div" class="transition-container">
      <v-btn
        v-for="chore in archivedChores.filter((c) => showUndo[c.id])"
        :key="'undo-' + chore.id"
        @click="undoArchive(chore)"
        height="70px"
        color="red-lighten-3"
        class="border-lg border-purple rounded-btn black-text custom-btn d-flex justify-space-between align-center"
        max-width="400px"
      >
        <b>Ångra </b>Ta bort "{{ chore.title }}" ?
      </v-btn>
    </transition-group>

    <section class="list-of-chores-section d-flex justify-center flex-column align-center">
      <v-btn
        v-for="chore in store.sortedChores"
        :key="chore.id"
        :style="{
          transform: `translateX(${swipeProgress[chore.id] * 100}%)`,
          backgroundColor: swipeProgress[chore.id] > 0 ? '#a5d6a7 !important' : '', // turns green on swipe
          maxWidth: '400px'
        }"
        color="blue-lighten-4"
        class="border-md border-blue rounded-btn black-text custom-btn d-flex justify-space-between align-center"
        @touchstart="startSwipe(chore)"
        @touchmove="moveSwipe(chore, $event)"
        @touchend="endSwipe(chore)"
      >
        <div class="chore-info-container d-flex flex-column align-start">
          <span class="black-text">{{ chore.title }}</span>
          <div class="deadline-container d-flex flex-row align-center">
            <span><v-icon>mdi-calendar-month</v-icon></span>
          </div>
        </div>
        <div class="icons-container d-flex flex-row align-center ga-4">
          <span
            @click="openAssignUserDialog(chore)"
            class="assignment-brick d-flex justify-center align-center"
            :style="{
              backgroundColor: getUserColor(chore.assignedTo)
            }"
          >
            {{ chore.assignedTo.substring(0, 2).toUpperCase() || '-' }}
          </span>
          <v-icon @click="handleOpenDialog(chore)" class="black-text" size="36" color="black">
            mdi-pencil-outline
          </v-icon>
        </div>
        <div class="star-points">
          <v-icon color="yellow" size="32">mdi-star</v-icon>
          <span class="star-number">{{ chore.pointValue }}</span>
        </div>
      </v-btn>
      <v-dialog
        v-model="assignUserDialog"
        max-width="400px"
        :content-class="'auto-height-dialog'"
        class="assigned-to-dialog d-flex align-center"
      >
        <div class="assign-container">
          <template v-for="(user, index) in userStore.users">
            <v-card-text
              v-if="user.name"
              @click="addAssignedUser(user.name)"
              class="flex-grow-0"
              style="overflow: visible"
              :key="user.id"
            >
              <div class="user-container d-flex flex-row justify-center align-center">
                <span
                  class="assignment-brick d-flex justify-center align-center mr-6"
                  :style="{
                    backgroundColor: getUserColor(user.name)
                  }"
                >
                  {{ user.name.substring(0, 2).toUpperCase() }}
                </span>
                <v-card-text class="assigned-name">{{ user.name }}</v-card-text>
              </div>
              <hr />
            </v-card-text>
          </template>
          <div class="random-user-container d-flex flex-row" @click="assignRandomUser">
            <v-icon size="36">mdi-dice-multiple</v-icon
            ><span class="assigned-name ml-6">Slumpa användare</span>
          </div>
        </div>
      </v-dialog>
    </section>
    <section class="create-new-section d-flex justify-center flex-column align-center">
      <v-btn
        @click="openAddChoreDialog"
        color="purple-lighten-4"
        class="border-md border-purple rounded-btn black-text custom-btn d-flex justify-space-between align-center"
        max-width="400px"
      >
        <span class="black-text">Ny Syssla</span>
        <v-icon class="ml-7 black-text" color="black">mdi-plus</v-icon>
      </v-btn>

      <!-- addChoreDialog section -->
      <v-dialog
        v-model="store.addChoreDialog"
        max-width="400px"
        :content-class="'auto-height-dialog'"
        class="d-flex align-start"
      >
        <v-card class="d-flex flex-column" style="min-height: 0">
          <v-form ref="form">
            <v-card-text class="flex-grow-0" style="overflow: visible; padding-bottom: 0">
              <v-text-field
                v-model="choreName"
                placeholder="Titel"
                :rules="[rules.required]"
              ></v-text-field>
              <v-text-field
                v-model="rewardPoints"
                placeholder="Poäng"
                type="number"
                class="mt-4"
              ></v-text-field>

              <!-- Date Picker -->
              <div class="d-flex justify-space-between align-center mt-4">
                <div class="flex-grow">
                  <span :class="{ 'error--text': dateError }">{{ formattedDate }}</span>
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
                        :hide-header="true"
                        v-model="selectedDate"
                        @update:modelValue="updateDate"
                        no-title
                      ></v-date-picker>
                    </v-card>
                  </v-menu>
                </div>
              </div>
              <div class="v-messages error--text" role="alert">
                <div class="v-messages__wrapper">
                  <div class="v-messages__message">{{ dateError }}</div>
                </div>
              </div>
            </v-card-text>

            <!-- Lägg till button section -->
            <v-card-actions class="justify-center flex-grow-0 mt-5">
              <v-btn
                color="green"
                @click="handleSubmit(choreName, formattedDate)"
                size="large"
                class="add-btn"
                block
              >
                <span class="black-text rounded-btn">{{
                  store.editingChore ? 'Ändra' : 'Lägg Till'
                }}</span>
              </v-btn>
            </v-card-actions>
          </v-form>
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
  color: #000;
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
  transition:
    background-color 0.3s ease-in-out,
    transform 0.3s ease-in-out;
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

.assignment-brick {
  background-color: #fff;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 1rem;
  font-weight: 600;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

.assigned-to-dialog {
  .v-card-text {
    padding: 0;
  }

  hr {
    color: #000;
    margin: 0.7rem 0;
  }

  .assign-container {
    background-color: #fff;
    border-radius: 16px;
    max-width: 95%;
    padding: 1rem;

    .assigned-name {
      font-size: 1.4rem;
    }
  }
}

/* Animation add/remove chores */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.transition-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.undo-btn {
  background-color: pink;
  color: white;
}
.star-points {
  position: absolute;
  top: -15px;
  right: -15px;
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
