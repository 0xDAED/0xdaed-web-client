import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useIconStore = defineStore(
  'icons',
  () => {
    const selectedIcons = ref({})

    const setSelectedIcon = (computerId, iconId) => {
      selectedIcons.value[computerId] = iconId
    }

    const getSelectedIcon = computerId => {
      return selectedIcons.value[computerId] || 1 // 1 - дефолтная иконка
    }

    const colorKeyByIconId = iconId => {
      const idx = (Number(iconId) - 1) % 4
      return ['green', 'orange', 'blue', 'purple'][idx]
    }

    const getColorKey = computerId => {
      const iconId = getSelectedIcon(computerId)
      return colorKeyByIconId(iconId)
    }

    return {
      selectedIcons,
      setSelectedIcon,
      getSelectedIcon,
      getColorKey,
    }
  },
  {
    persist: true, // Включаем сохранение в localStorage
  }
)
