import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useUserStore } from '../stores/UserStore'

export const useChoreStore = defineStore('choreStore', () => {
  const chores = ref([
    {
      id: 1,
      title: 'Dammsuga',
      deadline: '2025-03-14',
      assignedTo: 'Mamma',
      isCompleted: false,
      pointValue: 1
    },
    {
      id: 2,
      title: 'Diska',
      deadline: '2025-03-12',
      assignedTo: 'Pappa',
      isCompleted: false,
      pointValue: 1
    },
    {
      id: 3,
      title: 'Skriva inköpslista',
      deadline: '2025-03-16',
      assignedTo: 'Algot',
      isCompleted: false,
      pointValue: 1
    },
    {
      id: 4,
      title: 'Rensa kylskåpet',
      deadline: '2025-03-11',
      assignedTo: 'Sofia',
      isCompleted: false,
      pointValue: 1
    },
    {
      id: 5,
      title: 'Putsa fönster',
      deadline: '2025-03-14',
      assignedTo: '',
      isCompleted: false,
      pointValue: 1
    }
  ])
  const archivedChores = ref([])

  const sortedChores = computed(() => {
    return [...chores.value].sort((a, b) => {
      return new Date(a.deadline) - new Date(b.deadline)
    })
  })
  const rewards = ref([])
  const addRewardDialog = ref(false)
  const addChoreDialog = ref(false)
  const assignUserDialog = ref(false)
  const selectedChoreId = ref(null)
  const editingChore = ref(null)
  const userStore = useUserStore()

  const addReward = (reward) => {
    if (!reward.name.trim()) return

    if (rewards.value.length < 1) {
      rewards.value.push({
        id: rewards.value.length + 1,
        name: reward.name,
        description: reward.description,
        points: reward.points,
        imageUrl: reward.imageUrl
      })
    } else {
      rewards.value[0] = {
        id: rewards.value.length + 1,
        name: reward.name,
        description: reward.description,
        points: reward.points,
        imageUrl: reward.imageUrl
      }
    }
  }

  const openAddRewardDialog = () => {
    console.log('Opening add reward dialog')
    addRewardDialog.value = true
  }
  const closeAddRewardDialog = () => {
    console.log('Closing add reward dialog')
    console.log(rewards.value)
    addRewardDialog.value = false
  }

  const openAddChoreDialog = () => {
    console.log('Opening add chore dialog.')
    addChoreDialog.value = true
  }

  const closeAddChoreDialog = () => {
    addChoreDialog.value = false
    editingChore.value = null
  }

  const openAssignUserDialog = (chore) => {
    selectedChoreId.value = chore.id
    assignUserDialog.value = true
  }

  const closeAssignUserDialog = () => {
    assignUserDialog.value = false
  }

  const addChore = (choreTitle, selectedDate, rewardPoints) => {
    console.log('Adding chore:', choreTitle, 'Date:', selectedDate, 'Points:', rewardPoints)
    if (!choreTitle.trim()) {
      console.warn('Chore title is empty, stopping function.')
      return
    } else {
      console.log('Chore tite is valid:', choreTitle)
    }
    if (editingChore.value) {
      console.log('Editing an existing chore...')
      const choreIndex = chores.value.findIndex((chore) => chore.id === editingChore.value.id)
      if (choreIndex !== -1) {
        chores.value[choreIndex].title = choreTitle
        chores.value[choreIndex].deadline = selectedDate
        chores.value[choreIndex].pointValue = rewardPoints
        console.log('Chore updated:', chores.value[choreIndex])
      }
    } else {
      console.log('Adding new chore...')
      chores.value.push({
        id: chores.value.length + 1,
        title: choreTitle,
        deadline: selectedDate || '',
        assignedTo: '',
        isCompleted: false,
        pointValue: rewardPoints
      })
      console.log('Updated chores list:', chores.value)
    }

    editingChore.value = null
    closeAddChoreDialog()
  }

  const addAssignedUser = (user) => {
    const index = chores.value.findIndex((c) => c.id === selectedChoreId.value)
    if (index !== -1) {
      chores.value[index].assignedTo = user
    }
    assignUserDialog.value = false
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
      // Using splice() to remove and push the chore into archivedChores
      const [archivedChore] = chores.value.splice(index, 1)
      archivedChores.value.push(archivedChore)
    }
  }

  const undoArchiveChore = (chore) => {
    const index = archivedChores.value.findIndex((c) => c.id === chore.id)
    if (index !== -1) {
      // Using splice() to remove and push the chore back into chores
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
    addChore,
    editingChore,
    openAssignUserDialog,
    closeAssignUserDialog,
    addAssignedUser,
    assignUserDialog,
    sortedChores,
    assignRandomUser,
    archiveChore,
    undoArchiveChore,
    openAddRewardDialog,
    closeAddRewardDialog,
    addRewardDialog,
    rewards,
    addReward
  }
})
