export function useBulkToggle({ emit, getPcId }) {
  const onToggleSelect = e => {
    e?.stopPropagation?.()
    emit('toggleSelected', getPcId())
  }

  return { onToggleSelect }
}
