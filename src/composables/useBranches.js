import { ref } from 'vue'
import { fetchUserBranches } from '@/services/api/branchApi'

export function useBranches() {
  const loading = ref(false)
  const error = ref(null)

  const loadUserBranchesMock = async () => {
    loading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 2500))

      return [
        { id: 1, name: 'Москва' },
        { id: 2, name: 'Химки' },
        { id: 3, name: 'Сыктывкар' },
      ]
    } catch (e) {
      error.value = e
      throw e
    } finally {
      loading.value = false
    }
  }

  const loadUserBranches = async () => {
    try {
      loading.value = true
      return await fetchUserBranches()
    } catch (e) {
      error.value = e
      throw e
    } finally {
      loading.value = false
    }
  }

  return { loadUserBranches, loadUserBranchesMock, loading, error }
}
