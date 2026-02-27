import { computed } from 'vue'

export function useComputerStatus(computerRef) {
  const statusColor = computed(() => (computerRef.value?.computerActive ? 'green' : 'red'))
  return { statusColor }
}
