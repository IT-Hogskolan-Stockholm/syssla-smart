import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('userStore', () => {
  const users = ref([
    {
      id: 1,
      name: 'Mamma',
      color: '#F48FB1',
      scoreValue: 1,
      completedTasks: 0
    },
    {
      id: 2,
      name: 'Pappa',
      color: '#7CB342',
      scoreValue: 1,
      completedTasks: 0
    },
    {
      id: 3,
      name: 'Algot',
      color: '#039BE5',
      scoreValue: 12,
      completedTasks: 0
    },
    {
      id: 4,
      name: 'Sofia',
      color: '#EC407A',
      scoreValue: 1,
      completedTasks: 0
    }
  ])
  return { users }
})
