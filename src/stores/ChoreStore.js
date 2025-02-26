import { defineStore } from 'pinia'
import { ref } from 'vue'

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
      deadline: '2025-03-14',
      assignedTo: 'Pappa',
      isCompleted: false,
      pointValue: 1
    },
    {
      id: 3,
      title: 'Skriva inköpslista',
      deadline: '2025-03-14',
      assignedTo: 'Algot',
      isCompleted: false,
      pointValue: 1
    },
    {
      id: 4,
      title: 'Tömma kylskåpet',
      deadline: '2025-03-14',
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

  const addChoreDialog = ref(false)
  const assignUserDialog = ref(false)
  const selectedChoreId = ref(null)
  const editingChore = ref(null)

  const openAddChoreDialog = (chore = null) => {
    editingChore.value = chore
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

  const addChore = (choreTitle, selectedDate) => {
    if (!choreTitle.trim()) return

    if (editingChore.value) {
      const choreIndex = chores.value.findIndex(chore => chore.id === editingChore.value.id)
      if (choreIndex !== -1) {
        chores.value[choreIndex].title = choreTitle
        chores.value[choreIndex].deadline = selectedDate
      }
    } else {
      chores.value.push({
        id: chores.value.length + 1,
        title: choreTitle,
        deadline: selectedDate || '',
        assignedTo: '',
        isCompleted: false,
        pointValue: null
      })
    }
    closeAddChoreDialog()
  }

  const addAssignedUser = (user) => {
    const index = chores.value.findIndex((c) => c.id === selectedChoreId.value)
    if (index !== -1) {
      chores.value[index].assignedTo = user
    }
    assignUserDialog.value = false
  }
  return {
    chores,
    addChoreDialog,
    openAddChoreDialog,
    closeAddChoreDialog,
    addChore,
    editingChore,
    openAssignUserDialog,
    closeAssignUserDialog,
    addAssignedUser,
    assignUserDialog
  }
})
