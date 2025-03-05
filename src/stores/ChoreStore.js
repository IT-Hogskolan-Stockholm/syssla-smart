import { defineStore } from 'pinia'
import axios from 'axios'
import { ref, computed } from 'vue'

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
