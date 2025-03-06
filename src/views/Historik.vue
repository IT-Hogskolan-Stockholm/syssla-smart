<script setup>
import { onMounted } from 'vue'
import { useChoreStore } from '../stores/ChoreStore'
import { useUserStore } from '../stores/UserStore'

const store = useChoreStore()
const userStore = useUserStore()

onMounted(async () => {
  await store.fetchHistory()
  await userStore.fetchUsers()
})

const getUserColor = (assignedTo) => {
  const user = userStore.users.find((user) => user.name === assignedTo)
  return user ? user.color : '#FFF'
}
</script>

<template>
  <div class="chores-container">
    <section class="list-of-chores-section d-flex justify-center flex-column align-center">
      <v-btn
        v-for="chore in store.history"
        :key="chore.id"
        :style="{ maxWidth: '400px' }"
        color="blue-lighten-4"
        class="border-md border-blue rounded-btn black-text custom-btn d-flex justify-space-between align-center"
      >
        <div class="chore-info-container d-flex flex-column align-start">
          <span class="black-text">{{ chore.title }}</span>
          <div class="deadline-container d-flex flex-row align-center">
            <span><v-icon>mdi-calendar-check</v-icon></span>
            <span>{{ chore.completedDate }}</span>
          </div>
        </div>
        <div class="icons-container d-flex flex-row align-center ga-4">
          <span
            class="assignment-brick d-flex justify-center align-center"
            :style="{ backgroundColor: getUserColor(chore.assignedTo) }"
          >
            {{ chore.assignedTo ? chore.assignedTo.substring(0, 2).toUpperCase() : '-' }}
          </span>
          <span class="d-flex justify-center align-center">
            {{ chore.pointValue }}
          </span>
        </div>
      </v-btn>
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

.rounded-btn {
  border-radius: 16px;
}

.black-text {
  color: #000;
  text-transform: none;
  font-weight: 400;
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
</style>
