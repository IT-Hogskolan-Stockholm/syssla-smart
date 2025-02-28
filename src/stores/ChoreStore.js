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

  const openAddChoreDialog = () => {
    console.log("Opening add chore dialog.")
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
    console.log("Adding chore:", choreTitle, "Date:", selectedDate)
    if (!choreTitle.trim()) {
      console.warn("Chore title is empty, stopping function.")
      return
    } else {
      console.log("Chore tite is valid:", choreTitle)
    }
    if (editingChore.value) {
      console.log("Editing an existing chore...")
      const choreIndex = chores.value.findIndex((chore) => chore.id === editingChore.value.id)
      if (choreIndex !== -1) {
        chores.value[choreIndex].title = choreTitle
        chores.value[choreIndex].deadline = selectedDate
        console.log("Chore updated:", chores.value[choreIndex])
      }
    } else {
      console.log("Adding new chore...")
      chores.value.push({
        id: chores.value.length + 1,
        title: choreTitle,
        deadline: selectedDate || '',
        assignedTo: '',
        isCompleted: false,
        pointValue: null
      })
      console.log("Updated chores list:", chores.value)
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
