import { defineStore } from 'pinia'
import axios from 'axios'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('userStore', () => {
  const users = ref([])

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/users')
      users.value = Array.isArray(response.data) ? response.data : []
    } catch (error) {
      console.error('Fel vid hämtning av användare:', error)
    }
  }

  const assignUser = (choreId, userName) => {
    const chore = chores.find((chore) => chore.id === choreId)
    if (chore) {
      chore.assignedTo = userName
    }
  }
  const getUsers = computed(() => users.value)
  return { users, fetchUsers, assignUser }
})
