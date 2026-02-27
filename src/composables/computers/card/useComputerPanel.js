import { ref } from 'vue'

export function useComputerPanel() {
  const isPanelActive = ref(false)

  const openPanel = () => (isPanelActive.value = true)
  const closePanel = () => (isPanelActive.value = false)
  const togglePanel = () => (isPanelActive.value = !isPanelActive.value)

  return { isPanelActive, openPanel, closePanel, togglePanel }
}
