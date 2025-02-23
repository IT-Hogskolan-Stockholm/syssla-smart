import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('userStore', () => {
  const users = ref([
    {
      id: 1,
      name: 'MA',
      color: '#F48FB1',
      scoreValue: 1,
      completedTasks: 0
    },
    {
      id: 2,
      name: 'PA',
      color: '#7CB342',
      scoreValue: 1,
      completedTasks: 0
    },
    {
      id: 3,
      name: 'AL',
      color: '#039BE5',
      scoreValue: 1,
      completedTasks: 0
    },
    {
      id: 4,
      name: 'SO',
      color: '#EC407A',
      scoreValue: 1,
      completedTasks: 0
    }
  ])
  return { users }
})
