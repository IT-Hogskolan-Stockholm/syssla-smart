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
      const newId = (highestId + 1).toString()
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

  const archiveChore = async (chore) => {
    const index = chores.value.findIndex((c) => c.id === chore.id)
    if (index !== -1) {
      const [archivedChore] = chores.value.splice(index, 1)
      archivedChores.value.push(archivedChore)

      const completedChore = {
        ...archivedChore,
        completedDate: new Date().toISOString().split('T')[0],
        isCompleted: true
      }

      try {
        await axios.post('http://localhost:3000/history', completedChore)
      } catch (error) {
        console.error('Kunde inte arkivera sysslan i historiken:', error)
      }

      if (archivedChore.assignedTo) {
        try {
          const userResponse = await axios.get('http://localhost:3000/users')
          const users = userResponse.data
          const user = users.find((u) => u.name === archivedChore.assignedTo)

          if (user) {
            await axios.patch(`http://localhost:3000/users/${user.id}`, {
              completedTasks: user.completedTasks + 1,
              scoreValue: user.scoreValue + archivedChore.pointValue
            })
          }
        } catch (error) {
          console.error('Kunde inte uppdatera användaren:', error)
        }
      }

      setTimeout(async () => {
        const isStillArchived = archivedChores.value.find((c) => c.id === chore.id)
        if (isStillArchived) {
          try {
            await axios.delete(`http://localhost:3000/chores/${chore.id}`)
          } catch (error) {
            console.error('Kunde inte ta bort sysslan från chores:', error)
          }
        }
      }, 3000)
    }
  }

  const undoArchiveChore = async (chore) => {
    const index = archivedChores.value.findIndex((c) => c.id === chore.id)
    if (index !== -1) {
      const [restoredChore] = archivedChores.value.splice(index, 1)
      chores.value.push(restoredChore)

      try {
        await axios.post('http://localhost:3000/chores', restoredChore)
      } catch (error) {
        console.error('Kunde inte återställa sysslan:', error)
      }
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
    archiveChore,
    undoArchiveChore
  }
})
