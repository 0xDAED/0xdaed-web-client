import { computed, ref } from 'vue'

export function useBulkSelection(computersRef) {
  const bulkMode = ref(false)
  const selectedPcIds = ref([])

  const visiblePcIds = computed(() => (computersRef.value || []).map(c => c.id))
  const selectedCount = computed(() => selectedPcIds.value.length)

  const allVisibleSelected = computed(() => {
    const vis = visiblePcIds.value
    if (!vis.length) return false
    const sel = new Set(selectedPcIds.value)
    return vis.every(id => sel.has(id))
  })

  const enableBulkMode = () => {
    bulkMode.value = true
  }

  const disableBulkMode = () => {
    bulkMode.value = false
    selectedPcIds.value = []
  }

  const toggleBulkMode = () => {
    if (bulkMode.value) disableBulkMode()
    else enableBulkMode()
  }

  const toggleSelected = pcId => {
    const cur = new Set(selectedPcIds.value)
    if (cur.has(pcId)) cur.delete(pcId)
    else cur.add(pcId)
    selectedPcIds.value = Array.from(cur)
  }

  const selectAllVisible = () => {
    selectedPcIds.value = [...visiblePcIds.value]
  }

  const clearSelection = () => {
    selectedPcIds.value = []
  }

  const toggleSelectAllVisible = () => {
    if (allVisibleSelected.value) clearSelection()
    else selectAllVisible()
  }

  return {
    bulkMode,
    selectedPcIds,
    selectedCount,
    visiblePcIds,
    allVisibleSelected,

    toggleBulkMode,
    toggleSelected,
    selectAllVisible,
    clearSelection,
    toggleSelectAllVisible,

    enableBulkMode,
    disableBulkMode,
  }
}
