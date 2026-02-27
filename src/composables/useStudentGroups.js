import { ref } from 'vue'
import { fetchStudentGroups } from '@/services/api/studentGroupApi'

export function useStudentGroups() {
  const loading = ref(false)
  const error = ref(null)

  const loadStudentGroupsMock = async () => {
    loading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 2500))

      return [
        { id: 1, name: '9/1-РПО-25/1' },
        { id: 2, name: '9/2-РПО-24/2' },
        { id: 3, name: '9/3-РПО-23/3' },
      ]
    } catch (e) {
      error.value = e
      throw e
    } finally {
      loading.value = false
    }
  }

  const loadStudentGroups = async () => {
    try {
      loading.value = true
      return await fetchStudentGroups()
    } catch (e) {
      error.value = e
      throw e
    } finally {
      loading.value = false
    }
  }

  return { loadStudentGroups, loadStudentGroupsMock, loading, error }
}
