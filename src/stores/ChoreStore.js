import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useChoreStore = defineStore('choreStore', () => {
  const chores = ref([
    {
      id: 1,
      title: 'Dammsuga',
      deadline: '2025-03-14',
      assignedTo: 'MA',
      isCompleted: false,
      pointValue: 1
    },
    {
      id: 2,
      title: 'Diska',
      deadline: '2025-03-14',
      assignedTo: 'PA',
      isCompleted: false,
      pointValue: 1
    },
    {
      id: 3,
      title: 'Skriva inköpslista',
      deadline: '2025-03-14',
      assignedTo: 'AL',
      isCompleted: false,
      pointValue: 1
    },
    {
      id: 4,
      title: 'Tömma kylskåpet',
      deadline: '2025-03-14',
      assignedTo: 'SO',
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

  const dialog = ref(false)

  const openDialog = () => {
    dialog.value = true
  }

  const closeDialog = () => {
    dialog.value = false
  }

  const addChore = (choreTitle, selectedDate) => {
    if (!choreTitle.trim()) return

    chores.value.push({
      id: chores.value.length + 1,
      title: choreTitle,
      deadline: selectedDate || '',
      assignedTo: '',
      isCompleted: false,
      pointValue: null
    })

    dialog.value = false
  }
  return { chores, dialog, openDialog, closeDialog, addChore }
})
