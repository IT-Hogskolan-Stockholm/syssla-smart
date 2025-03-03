import { defineStore } from 'pinia'
import axios from 'axios'
import { ref, computed } from 'vue'

export const useChoreStore = defineStore('choreStore', () => {
  const chores = ref([])
  const addChoreDialog = ref(false)
  const assignUserDialog = ref(false)
  const editingChore = ref(null)

  const fetchChores = async () => {
    try {
      const response = await axios.get('/mock-data/chores.json')
      chores.value = response.data.chores
    } catch (error) {
      console.error('Kunde inte hämta sysslor:', error)
    }
  }

  fetchChores()

  const sortedChores = computed(() => {
    return Array.isArray(chores.value)
      ? chores.value.slice().sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
      : []
  })

  const addChore = (title, deadline) => {
    if (editingChore.value) {
      editingChore.value.title = title
      editingChore.value.deadline = deadline
      editingChore.value = null
    } else {
      chores.value.push({ id: Date.now(), title, deadline, assignedTo: '' })
    }
    addChoreDialog.value = false
  }

  const openAddChoreDialog = () => {
    addChoreDialog.value = true
  }

  const openAssignUserDialog = (chore) => {
    editingChore.value = chore
    assignUserDialog.value = true
  }
  const addAssignedUser = (user) => {
    console.log('selectedChoreId:', selectedChoreId.value)
    console.log('chores:', chores.value)
    console.log('user:', user)

    const index = chores.value.findIndex((c) => c.id === selectedChoreId.value)
    if (index !== -1) {
      chores.value[index].assignedTo = user
    } else {
      console.error('Sysslan med id', selectedChoreId.value, 'hittades inte')
    }

    assignUserDialog.value = false
  }

  return {
    chores,
    addChoreDialog,
    openAddChoreDialog,
    assignUserDialog,
    editingChore,
    fetchChores,
    sortedChores,
    addChore,
    openAssignUserDialog,
    addAssignedUser
  }
})
