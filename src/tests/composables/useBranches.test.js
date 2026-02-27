import { useBranches } from '@/composables/useBranches'
import * as api from '@/services/api/branchApi'

import { describe, test, expect, vi } from 'vitest'

describe('useBranches composable', () => {
  test('успешно загружает данные и корректно управляет состоянием loading', async () => {
    vi.spyOn(api, 'fetchUserBranches').mockResolvedValue([
      {
        id: 1,
        name: 'Химки',
      },
    ])

    const { loadUserBranches, loading, error } = useBranches()

    expect(loading.value).toBe(false)
    const promise = loadUserBranches()
    expect(loading.value).toBe(true)

    const result = await promise
    expect(result).toEqual([{ id: 1, name: 'Химки' }])
    expect(loading.value).toBe(false)
    expect(error.value).toBe(null)
  })

  test('обрабатывает ошибку API', async () => {
    const apiError = new Error('Network error')

    vi.spyOn(api, 'fetchUserBranches').mockRejectedValue(apiError)

    const { loadUserBranches, error, loading } = useBranches()

    await expect(loadUserBranches()).rejects.toThrow('Network error')

    expect(error.value).toBe(apiError)
    expect(loading.value).toBe(false)
  })
})
