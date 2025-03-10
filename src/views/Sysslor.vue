<script setup>
import { computed, reactive, ref, watch, onMounted } from 'vue'
import { useChoreStore } from '../stores/ChoreStore'
import { useUserStore } from '../stores/UserStore'

const store = useChoreStore()
const userStore = useUserStore()
const chores = computed(() => store.chores)
const archivedChores = computed(() => store.archivedChores)
const archiveChore = store.archiveChore
const undoArchiveChore = store.undoArchiveChore
const deleteChore = store.deleteChore
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
const pointValue = ref(1)
const selectedDate = ref(null)
const form = ref(null)
const dateError = ref(null)
const validateDate = ref(false)
const assignRandomUser = store.assignRandomUser

onMounted(async () => {
  await store.fetchChores()
  await userStore.fetchUsers()
})

const swipeProgress = reactive({})
const swipeStartX = reactive({})
const swipeDirection = reactive({})
const showUndo = ref({})

const startSwipe = (event, chore) => {
  if (!event.touches) return
  if (!swipeProgress[chore.id]) {
    swipeProgress[chore.id] = 0
  }
  swipeStartX[chore.id] = event.touches[0].clientX
  swipeDirection[chore.id] = null
}

const moveSwipe = (event, chore) => {
  if (!event.touches || !swipeStartX[chore.id]) return
  const moveAmount = event.touches[0].clientX
  const deltaX = moveAmount - swipeStartX[chore.id]
  swipeDirection[chore.id] = deltaX > 0 ? 'right' : 'left'
  if (!swipeProgress[chore.id]) {
    swipeProgress[chore.id] = 0
  }

  swipeProgress[chore.id] = Math.max(-1, Math.min(1, deltaX / window.innerWidth))
}

const endSwipe = (chore) => {
  if (swipeProgress[chore.id] === undefined) return
  const direction = swipeDirection[chore.id]
  if (Math.abs(swipeProgress[chore.id]) > 0.2) {
    if (direction === 'right') {
      archiveChore(chore)
      showUndo.value[chore.id] = true
    } else if (direction === 'left') {
      deleteChore(chore)
      showUndo.value[chore.id] = true
    }
  }
  setTimeout(() => {
    swipeProgress[chore.id] = 0
  }, 200)
}

const undoAction = (id) => {
  const chore =
    archivedChores.value.find((c) => c.id == id) || deletedChores.value.find((c) => c.id == id)
  if (chore) {
    if (archivedChores.value.includes(chore)) {
      undoArchiveChore(chore)
    } else {
      restoreDeletedChore(chore)
    }
  }
  showUndo.value[id] = false
}

watch(
  () => store.editingChore,
  (chore) => {
    if (chore) {
      choreName.value = chore.title
      selectedDate.value = chore.deadline ? new Date(chore.deadline) : null
    }
  }
)

const handleOpenDialog = (chore = null) => {
  closeAddChoreDialog()
  store.editingChore = null
  choreName.value = ''
  selectedDate.value = null
  if (chore) {
    choreName.value = chore.title
    selectedDate.value = chore.deadline ? new Date(chore.deadline) : null
  }
  store.editingChore = chore
  store.openAddChoreDialog()
}

const increasePoints = () => {
  if (pointValue.value < 100) pointValue.value++
}

const decreasePoints = () => {
  if (pointValue.value < 100 && pointValue.value > 0) pointValue.value--
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
    addChore(choreName.value, selectedDateDate.value, pointValue.value)
    closeAddChoreDialog()
    form.value.reset()
    selectedDate.value = null
    dateError.value = null
  }
}

const isOverdue = (deadline) => {
  if (!deadline) return false
  const today = new Date().toISOString().split('T')[0]
  return deadline < today
}
</script>

<template>
  <div class="chores-container">
    <!-- Undo btn -->
    <transition-group
      name="fade"
      tag="div"
      class="transition-container d-flex flex-column align-center ga-4"
    >
      <v-btn
        v-for="chore in archivedChores.filter((c) => showUndo[c.id])"
        :key="'undo-archived-' + chore.id"
        @click="undoAction(chore.id)"
        height="70px"
        color="green-lighten-3"
        class="border-lg border-purple rounded-btn black-text custom-btn d-flex justify-space-between align-center"
        max-width="400px"
      >
        <span class="black-text"> Ångra arkivering?</span>
        <v-icon class="ml-7 black-text">mdi-arrow-u-left-top</v-icon>
      </v-btn>
      <v-btn
        v-for="chore in store.deletedChores"
        :key="'undo-deleted-' + chore.id"
        @click="undoAction(chore.id)"
        height="70px"
        color="red-lighten-3"
        class="border-lg border-blue rounded-btn black-text custom-btn d-flex justify-space-between align-center"
        max-width="400px"
      >
        <span class="black-text"> Ångra borttagning?</span>
        <v-icon class="ml-7 black-text">mdi-arrow-u-left-top</v-icon>
      </v-btn>
    </transition-group>

    <section class="list-of-chores-section d-flex justify-center flex-column align-center">
      <v-btn
        v-for="chore in store.sortedChores"
        :key="chore.id"
        :style="{
          transform: `translateX(${(swipeProgress[chore.id] || 0) * 100}%)`,
          transition: 'transform 0.3s ease-out',
          backgroundColor:
            swipeProgress[chore.id] > 0
              ? '#a5d6a7 !important'
              : swipeProgress[chore.id] < 0
                ? '#ef9a9a !important'
                : '',
          maxWidth: '400px'
        }"
        :color="isOverdue(chore.deadline) ? 'red-lighten-2' : 'blue-lighten-4'"
        class="border-md border-blue rounded-btn black-text custom-btn d-flex justify-space-between align-center chore-button"
        :class="{
          'overdue-border': isOverdue(chore.deadline),
          'border-blue': !isOverdue(chore.deadline)
        }"
        @touchstart="startSwipe($event, chore)"
        @touchmove="moveSwipe($event, chore)"
        @touchend="endSwipe(chore)"
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
            @click="openAssignUserDialog(chore)"
            class="assignment-brick d-flex justify-center align-center"
            :style="{
              backgroundColor: getUserColor(chore.assignedTo)
            }"
          >
            {{ chore.assignedTo.substring(0, 2).toUpperCase() || '-' }}
          </span>
          <v-icon @click="handleOpenDialog(chore)" class="black-text" size="32" color="black">
            mdi-pencil-outline
          </v-icon>
        </div>
        <span class="alert-icon" v-if="isOverdue(chore.deadline)">
          <v-icon color="#8b0000" size="28">mdi-alert-circle</v-icon>
        </span>
        <div class="star-points" v-if="!isOverdue(chore.deadline)">
          <v-icon color="yellow" size="38">mdi-star</v-icon>
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
        v-model="addChoreDialog"
        max-width="400px"
        :content-class="'auto-height-dialog'"
        class="d-flex align-start"
        @update:model-value="
          (isOpen) => {
            if (!isOpen) {
              store.editingChore = null
              choreName = ''
              selectedDate = null
            }
          }
        "
      >
        <v-card class="d-flex flex-column" style="min-height: 0">
          <v-form ref="form">
            <v-card-text class="flex-grow-0 pb-0" style="overflow: visible">
              <v-text-field
                variant="outlined"
                v-model="choreName"
                placeholder="Titel"
                :rules="[rules.required]"
              ></v-text-field>
            </v-card-text>
            <v-card-text
              class="flex-grow-0 custom-card-text d-flex align-center justify-space-between py-0"
            >
              <div class="input-points d-flex align-center">
                <v-text-field
                  v-model="pointValue"
                  class="mc-3 text-center"
                  style="text-align: center"
                  label="Poäng"
                  type="number"
                  :hide-details="true"
                  :hide-spin-buttons="true"
                  single-line
                ></v-text-field>

                <div class="d-flex flex-column align-center mx-2">
                  <v-btn icon variant="flat" class="point-arrow d-flex" @click="increasePoints">
                    <v-icon>mdi-chevron-up</v-icon>
                  </v-btn>
                  <v-btn icon variant="flat" class="point-arrow d-flex" @click="decreasePoints">
                    <v-icon>mdi-chevron-down</v-icon>
                  </v-btn>
                </div>
              </div>
              <div class="counter-label">
                <span class="ml-2">Poäng</span>
                <v-icon class="m1-1" color="yellow darken-2" size="30">mdi-star</v-icon>
              </div>
            </v-card-text>
            <v-card-text class="flex-grow-0 pt-4" style="overflow: visible">
              <v-text-field
                v-model="selectedDate"
                type="date"
                variant="outlined"
                :hide-details="true"
              ></v-text-field>
            </v-card-text>

            <!-- Lägg till button section -->
            <v-card-actions class="justify-center flex-grow-0 px-4 pt-0 pb-2">
              <v-btn
                color="green"
                @click="handleSubmit(choreName, selectedDate, pointValue)"
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

.chores-container {
  width: 100%;
}

.input-points {
  border: 1px solid #a4a4a4;
  border-radius: 6px;
  width: 13rem;
}

::v-deep(.input-points .v-field__overlay) {
  display: none !important;
}

::v-deep(.input-points .v-field__outline) {
  display: none !important;
}

::v-deep(.v-input__details) {
  padding-bottom: 6px;
}

::v-deep(.error--text) {
  display: none !important;
}

.point-arrow {
  margin: 0.4rem;
  width: 0.625rem;
  height: 0.625rem;
  font-size: 1rem;
}

.counter-label {
  font-size: 1rem;
}

.date-text {
  font-size: 1rem;
}

.rounded-btn {
  border-radius: 16px;
}

.add-btn {
  background-color: #26a69a;
  font-size: 1.3rem;
  padding: 1rem 4rem !important;
  margin-bottom: 0.5rem;
  margin: 0 24px 0.5rem 24px;
  border-radius: 6px;
  height: unset !important;

  .v-btn__content {
    .black-text.rounded-btn {
      width: 100%;
    }
  }
}

.custom-btn {
  padding: 2rem 1rem;
  margin-bottom: 1rem;
  width: 90%;
  font-size: 1.1rem;
  transition:
    transform 0.2s ease-out,
    background-color 0.2s ease-in-out;
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
    cursor: pointer;
    .assigned-name {
      font-size: 1.4rem;
    }
  }
}

.overdue-border {
  border: 3px solid #b71c1c !important;
}

::v-deep(.bg-red-lighten-2) {
  color: #000 !important;
}

.chore-button {
  position: relative;
}

.alert-icon {
  position: absolute;
  width: 28px;
  top: -15px;
  right: -15px;
  z-index: 1;
  background: #ffebee;
  border-radius: 50%;
  padding: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);

  .v-icon {
    right: 0.1rem;
  }
}

.alert-icon {
  transition: transform 0.2s ease;
}

.alert-icon:hover {
  transform: scale(1.1);
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
