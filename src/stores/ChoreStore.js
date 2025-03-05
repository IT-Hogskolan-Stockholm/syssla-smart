import { defineStore } from 'pinia'
import axios from 'axios'
import { ref, computed } from 'vue'

export const useChoreStore = defineStore('choreStore', () => {
  const chores = ref([])
  const archivedChores = ref([])

  const sortedChores = computed(() => {
    return Array.isArray(chores.value)
      ? [...chores.value].sort((a, b) => {
          return new Date(a.deadline) - new Date(b.deadline)
        })
      : []
  })

  const addChoreDialog = ref(false)
  const assignUserDialog = ref(false)
  const editingChore = ref(null)

  const fetchChores = async () => {
    try {
      const response = await axios.get('http://localhost:3000/chores')
      chores.value = Array.isArray(response.data) ? response.data : []
    } catch (error) {
      console.error('Kunde inte hämta sysslor:', error)
    }
  }

  fetchChores()

  const addChore = async (title, deadline) => {
    if (editingChore.value) {
      try {
        await axios.patch(`http://localhost:3000/chores/${editingChore.value.id}`, {
          title,
          deadline
        })
        editingChore.value.title = title
        editingChore.value.deadline = deadline
      } catch (error) {
        console.error('Kunde inte uppdatera sysslan:', error)
      }
      editingChore.value = null
    } else {
      const highestId =
        chores.value.length > 0 ? Math.max(...chores.value.map((chore) => chore.id)) : 0
      const newId = highestId + 1
      const newChore = {
        id: newId,
        title,
        deadline,
        assignedTo: '',
        isCompleted: false,
        pointValue: 1
      }
      try {
        await axios.post('http://localhost:3000/chores', newChore)
        chores.value.push(newChore)
      } catch (error) {
        console.error('Kunde inte skapa sysslan:', error)
      }
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

  const addAssignedUser = async (user) => {
    const index = chores.value.findIndex((c) => c.id === editingChore.value?.id)
    if (index !== -1) {
      try {
        await axios.patch(`http://localhost:3000/chores/${chores.value[index].id}`, {
          assignedTo: user
        })
        chores.value[index].assignedTo = user
      } catch (error) {
        console.error('Kunde inte uppdatera tilldelad användare:', error)
      }
    } else {
      console.error('Sysslan hittades inte')
    }
    assignUserDialog.value = false
  }

  const closeAddChoreDialog = () => {
    addChoreDialog.value = false
  }

  const assignRandomUser = () => {
    const validUsers = userStore.users.filter((user) => user.name)
    const randomIndex = Math.floor(Math.random() * validUsers.length)
    const randomUser = validUsers[randomIndex]
    addAssignedUser(randomUser.name)
  }

  const archiveChore = (chore) => {
    const index = chores.value.findIndex((c) => c.id === chore.id)
    if (index !== -1) {
      const [archivedChore] = chores.value.splice(index, 1)
      archivedChores.value.push(archivedChore)
    }
  }

  const undoArchiveChore = (chore) => {
    const index = archivedChores.value.findIndex((c) => c.id === chore.id)
    if (index !== -1) {
      const [restoredChore] = archivedChores.value.splice(index, 1)
      chores.value.push(restoredChore)
    }
  }

  return {
    chores,
    archivedChores,
    addChoreDialog,
    openAddChoreDialog,
    closeAddChoreDialog,
    assignUserDialog,
    editingChore,
    fetchChores,
    sortedChores,
    addChore,
    openAssignUserDialog,
    addAssignedUser,
    assignRandomUser,
    archiveChore,
    undoArchiveChore
  }
})
