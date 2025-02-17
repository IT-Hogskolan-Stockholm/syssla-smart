import { defineStore } from 'pinia'

export const useUserStore = defineStore('userStore', {
  state: () => ({
    users: [
      {
        id: 1,
        name: '',
        score_value: 1,
        completed_tasks: 0
      },
      {
        id: 2,
        name: '',
        score_value: 1,
        completed_tasks: 0
      },
      {
        id: 3,
        name: '',
        score_value: 1,
        completed_tasks: 0
      },
      {
        id: 4,
        name: '',
        score_value: 1,
        completed_tasks: 0
      },
      {
        id: 5,
        name: '',
        score_value: 1,
        completed_tasks: 0
      }
    ]
  })
})
