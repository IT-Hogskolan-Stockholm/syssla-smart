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
      pointValue: 1,
    },
    {
      id: 2,
      title: 'Diska',
      deadline: '2025-03-12',
      assignedTo: 'Pappa',
      isCompleted: false,
      pointValue: 1,
    },
    {
      id: 3,
      title: 'Skriva inköpslista',
      deadline: '2025-03-16',
      assignedTo: 'Algot',
      isCompleted: false,
      pointValue: 1,
    },
    {
      id: 4,
      title: 'Rensa kylskåpet',
      deadline: '2025-03-11',
      assignedTo: 'Sofia',
      isCompleted: false,
      pointValue: 1,
    },
    {
      id: 5,
      title: 'Putsa fönster',
      deadline: '2025-03-14',
      assignedTo: '',
      isCompleted: false,
      pointValue: 1,
    },
  ])

  const sortedChores = computed(() => {
    return [...chores.value].sort((a, b) => {
      return new Date(a.deadline) - new Date(b.deadline)
    })
  })

  const addChoreDialog = ref(false)
  const assignUserDialog = ref(false)
  const selectedChoreId = ref(null)
  const userStore = useUserStore()

  const openAddChoreDialog = () => {
    addChoreDialog.value = true
  }

  const closeAddChoreDialog = () => {
    addChoreDialog.value = false
  }

  const openAssignUserDialog = (chore) => {
    selectedChoreId.value = chore.id
    assignUserDialog.value = true
  }

  const closeAssignUserDialog = () => {
    assignUserDialog.value = false
  }

  const addChore = (choreTitle, selectedDate) => {
    if (!choreTitle.trim()) return

    chores.value.push({
      id: chores.value.length + 1,
      title: choreTitle,
      deadline: selectedDate || '',
      assignedTo: '',
      isCompleted: false,
      pointValue: null,
    })

    addChoreDialog.value = false
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

  return {
    chores,
    addChoreDialog,
    openAddChoreDialog,
    closeAddChoreDialog,
    addChore,
    openAssignUserDialog,
    closeAssignUserDialog,
    addAssignedUser,
    assignUserDialog,
    sortedChores,
    assignRandomUser
  }
})
