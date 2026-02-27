import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useComputersStore } from '@/stores/computersStore'

export function useComputer() {
  const store = useComputersStore()

  const { computers, loading, error, sortedComputers, filteredComputers, stats } =
    storeToRefs(store)

  onMounted(() => {
    store.loadDashboard()
  })

  return {
    computers,
    sortedComputers,
    filteredComputers,
    loading,
    error,
    stats,
    refresh: store.loadDashboard,
  }
}
