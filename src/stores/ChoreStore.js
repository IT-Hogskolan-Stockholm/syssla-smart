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
  const archivedChores = ref([])

  const addChoreDialog = ref(false)
  const assignUserDialog = ref(false)
  const selectedChoreId = ref(null)

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

    const newChore = {
      id: chores.value.length + 1,
      title: choreTitle,
      deadline: selectedDate || '',
      assignedTo: '',
      isCompleted: false,
      pointValue: null
    }

    console.log('Lägger till syssla:', newChore) // 👈 Kolla vad som skickas in

    chores.value.push(newChore) // Lägg till i listan

    console.log('Ny lista av sysslor:', chores.value) // 👈 Kolla att den faktiskt läggs till

    addChoreDialog.value = false
  }

  const addAssignedUser = (user) => {
    const index = chores.value.findIndex((c) => c.id === selectedChoreId.value)
    if (index !== -1) {
      chores.value[index].assignedTo = user
    }
    assignUserDialog.value = false
  }

  // Funktion för att arkivera en syssla
  const archiveChore = (chore) => {
    const index = chores.value.findIndex((c) => c.id === chore.id)
    if (index !== -1) {
      const archivedChore = chores.value.splice(index, 1)[0] // Ta bort från aktiva sysslor
      archivedChores.value.push(archivedChore) // Lägg till i arkiverade sysslor
    }
  }
  // Funktion för att ångra arkivering
  const undoArchiveChore = (chore) => {
    const index = archivedChores.value.findIndex((c) => c.id === chore.id)
    if (index !== -1) {
      const unarchivedChore = archivedChores.value.splice(index, 1)[0] // Ta bort från arkiverade sysslor
      chores.value.push(unarchivedChore) // Lägg tillbaka i aktiva sysslor
    }
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
    archivedChores, // Exportera arkiverade sysslor
    archiveChore, // exportera arkiveringsfunktion
    undoArchiveChore // Exportera ångra-arkiveringsfunktion
  }
})
