import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('userStore', () => {
  const users = ref([
    {
      id: 1,
      name: '',
      scoreValue: 1,
      completedTasks: 0
    },
    {
      id: 2,
      name: '',
      scoreValue: 1,
      completedTasks: 0
    },
    {
      id: 3,
      name: '',
      scoreValue: 1,
      completedTasks: 0
    },
    {
      id: 4,
      name: '',
      scoreValue: 1,
      completedTasks: 0
    },
    {
      id: 5,
      name: '',
      scoreValue: 1,
      completedTasks: 0
    }
  ])
  return { users }
})
