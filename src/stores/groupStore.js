import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useStudentGroupsStore = defineStore('group', () => {
  const listGroups = ref([])
  const selectedGroup = ref(null)

  const setList = groups => (listGroups.value = groups)
  const setSelected = selected => (selectedGroup.value = selected)

  return { listGroups, selectedGroup, setList, setSelected }
})
