import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useBranchStore = defineStore('branch', () => {
  const listBranch = ref([])
  const selectedBranch = ref(null)

  const setList = branches => (listBranch.value = branches)
  const setSelected = branch => (selectedBranch.value = branch)

  return { listBranch, selectedBranch, setList, setSelected }
})
