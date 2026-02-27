import { computed, ref } from 'vue'
import { BULK_TYPE_MAP } from './bulkConstants'

export function useBulkSender({ selectedPcIds, createCommand }) {
  const bulkTypeUi = ref('Выполнить команду')
  const bulkParams = ref('')

  const bulkSending = ref(false)
  const bulkError = ref(null)
  const bulkDone = ref(false)

  const canSendBulk = computed(() => {
    if (!selectedPcIds.value.length) return false
    const type = BULK_TYPE_MAP[bulkTypeUi.value]
    if (!type) return false
    if (type === 'RUN_SHELL') return Boolean((bulkParams.value || '').trim())
    return true
  })

  const resetDoneSoon = () => {
    window.setTimeout(() => {
      bulkDone.value = false
    }, 1200)
  }

  const sendBulk = async () => {
    bulkError.value = null
    bulkDone.value = false
    if (!canSendBulk.value) return

    const type = BULK_TYPE_MAP[bulkTypeUi.value]
    const payload = {}

    if (type === 'RUN_SHELL') payload.params = (bulkParams.value || '').trim()

    bulkSending.value = true
    try {
      await Promise.allSettled(selectedPcIds.value.map(pcId => createCommand(pcId, type, payload)))

      bulkDone.value = true
      if (type === 'RUN_SHELL') bulkParams.value = ''
      resetDoneSoon()
    } catch (e) {
      bulkError.value = e?.message || String(e)
    } finally {
      bulkSending.value = false
    }
  }

  return {
    bulkTypeUi,
    bulkParams,
    bulkSending,
    bulkError,
    bulkDone,
    canSendBulk,
    sendBulk,
  }
}
