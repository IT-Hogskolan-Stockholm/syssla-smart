import { defineStore } from 'pinia'

export const useUserStore = defineStore('userStore', {
  state: () => ({
    users: [
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
    ]
  })
})
