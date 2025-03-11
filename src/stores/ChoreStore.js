import { defineStore } from 'pinia'
import axios from 'axios'
import { ref, computed } from 'vue'

export const useChoreStore = defineStore('choreStore', () => {
  const chores = ref([])
  const archivedChores = ref([])
  const deletedChores = ref([])
  const history = ref([])
  const rewards = ref([])
  const addChoreDialog = ref(false)
  const assignUserDialog = ref(false)
  const editingChore = ref(null)
  const addRewardDialog = ref(false)
  const sortedChores = computed(() => {
    return Array.isArray(chores.value)
      ? [...chores.value].sort((a, b) => {
          return new Date(a.deadline) - new Date(b.deadline)
        })
      : []
  })

  // Initial fetching from JSON-Server
  const fetchChores = async () => {
    try {
      const response = await axios.get('http://localhost:3000/chores')
      chores.value = Array.isArray(response.data) ? response.data : []
    } catch (error) {
      console.error('Kunde inte hämta sysslor:', error)
    }
  }

  fetchChores()

  const fetchHistory = async () => {
    try {
      const response = await axios.get('http://localhost:3000/history')
      history.value = Array.isArray(response.data) ? response.data : []
    } catch (error) {
      console.error('Kunde inte hämta sysslor:', error)
    }
  }

  fetchHistory()

  const fetchRewards = async () => {
    try {
      const response = await axios.get('http://localhost:3000/rewards')
      rewards.value = Array.isArray(response.data) ? response.data : []
    } catch (error) {
      console.error('Kunde inte hämta sysslor:', error)
    }
  }

  fetchRewards()

  // Functionality for application

  // Chore-section
  const addChore = async (title, deadline, pointValue) => {
    if (editingChore.value) {
      try {
        await axios.patch(`http://localhost:3000/chores/${editingChore.value.id}`, {
          title,
          deadline,
          pointValue
        })
        editingChore.value.title = title
        editingChore.value.deadline = deadline
        editingChore.value.pointValue = pointValue
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
        pointValue
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
      }, 5000)
    }
  }

  const undoArchiveChore = async (chore) => {
    const index = archivedChores.value.findIndex((c) => c.id === chore.id)
    if (index !== -1) {
      const [restoredChore] = archivedChores.value.splice(index, 1)
      chores.value.push(restoredChore)
      const choreId = String(chore.id)
      try {
        const historyResponse = await axios.get('http://localhost:3000/history')
        const historyItem = historyResponse.data.find((h) => String(h.id) === choreId)
        if (historyItem) {
          await axios.delete(`http://localhost:3000/history/${historyItem.id}`)
        } else {
          console.warn(`Syssla med id ${choreId} hittades inte i historiken!`)
        }
      } catch (error) {
        console.error('Kunde inte ta bort sysslan från historiken:', error)
      }
      if (restoredChore.assignedTo) {
        try {
          const userResponse = await axios.get('http://localhost:3000/users')
          const users = userResponse.data
          const user = users.find((u) => u.name === restoredChore.assignedTo)
          if (user) {
            await axios.patch(`http://localhost:3000/users/${user.id}`, {
              completedTasks: Math.max(user.completedTasks - 1, 0),
              scoreValue: Math.max(user.scoreValue - restoredChore.pointValue, 0)
            })
          } else {
            console.warn(`Användaren ${restoredChore.assignedTo} hittades inte!`)
          }
        } catch (error) {
          console.error('Kunde inte återställa användarens poäng:', error)
        }
      }
    } else {
      console.warn(`Syssla med id ${chore.id} hittades inte!`)
    }
  }

  const deleteChore = async (chore) => {
    const index = chores.value.findIndex((c) => c.id === chore.id)
    if (index !== -1) {
      const [deletedChore] = chores.value.splice(index, 1)
      deletedChores.value.push(deletedChore)
      setTimeout(async () => {
        const isStillDeleted = deletedChores.value.find((c) => c.id === chore.id)
        if (isStillDeleted) {
          try {
            await axios.delete(`http://localhost:3000/chores/${chore.id}`)
            deletedChores.value = deletedChores.value.filter((c) => c.id !== chore.id)
          } catch (error) {
            console.error('Kunde inte ta bort sysslan från chores:', error)
          }
        }
      }, 5000)
    }
  }

  const restoreDeletedChore = async (chore) => {
    const index = deletedChores.value.findIndex((c) => c.id === chore.id)
    if (index !== -1) {
      const [restoredChore] = deletedChores.value.splice(index, 1)
      chores.value.push(restoredChore)
    }
  }

  const openAddChoreDialog = () => {
    addChoreDialog.value = true
  }

  const closeAddChoreDialog = () => {
    addChoreDialog.value = false
  }

  // User-section
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

  const assignRandomUser = async () => {
    try {
      const response = await axios.get('http://localhost:3000/users')
      const validUsers = response.data.filter((user) => user.name)

      if (validUsers.length === 0) {
        console.error('Inga giltiga användare att tilldela')
        return
      }

      const randomIndex = Math.floor(Math.random() * validUsers.length)
      const randomUser = validUsers[randomIndex].name

      addAssignedUser(randomUser)
    } catch (error) {
      console.error('Kunde inte hämta användare:', error)
    }
  }

  const openAssignUserDialog = (chore) => {
    editingChore.value = chore
    assignUserDialog.value = true
  }

  // Reward-section
  const addReward = async (name, description, pointsCost, imgSrc = '') => {
    try {
      const highestId =
        rewards.value.length > 0 ? Math.max(...rewards.value.map((reward) => reward.id)) : 0
      const newId = (highestId + 1).toString()
      const newReward = {
        id: newId,
        name,
        description,
        pointsCost,
        imgSrc
      }
      await axios.post('http://localhost:3000/rewards', newReward)
      rewards.value.push(newReward)
    } catch (error) {
      console.error('Kunde inte skapa belöningen:', error)
    }
    addRewardDialog.value = false
  }

  const openAddRewardDialog = () => {
    addRewardDialog.value = true
  }
  const closeAddRewardDialog = () => {
    addRewardDialog.value = false
  }

  return {
    chores,
    archivedChores,
    deletedChores,
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
    undoArchiveChore,
    deleteChore,
    restoreDeletedChore,
    history,
    fetchHistory,
    rewards,
    fetchRewards,
    addReward,
    openAddRewardDialog,
    closeAddRewardDialog
  }
})
