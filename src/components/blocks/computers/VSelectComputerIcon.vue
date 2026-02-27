<script setup>
  import { computed } from 'vue'
  import { useIconStore } from '@/stores/iconStore'

  const props = defineProps({
    icons: {
      type: Array,
      required: true,
    },
    computerId: {
      type: [String, Number],
      required: true,
    },
    modalId: {
      type: String,
      required: true,
    },
  })

  const iconStore = useIconStore()

  const selectedIcon = computed(() => {
    const iconId = iconStore.selectedIcons[props.computerId] || 1
    return props.icons.find(icon => icon.id === iconId) || props.icons[0]
  })

  const openModal = () => {
    document.getElementById(props.modalId)?.showModal()
  }

  const selectIcon = icon => {
    iconStore.setSelectedIcon(props.computerId, icon.id)
    document.getElementById(props.modalId)?.close()
  }
</script>

<template>
  <div>
    <div @click="openModal" class="cursor-pointer">
      <component
        :is="selectedIcon.component"
        :color="selectedIcon.color"
        class="h-6 w-6 rounded-full object-cover"
      />
    </div>

    <dialog :id="modalId" class="modal">
      <div class="modal-box">
        <h3 class="text-lg font-bold">Выберите иконку</h3>

        <div class="grid grid-cols-4 gap-4 py-4">
          <div
            v-for="icon in icons"
            :key="icon.id"
            @click="selectIcon(icon)"
            class="hover:bg-base-200 flex cursor-pointer flex-col items-center rounded-lg p-3 transition-colors"
          >
            <component :is="icon.component" :color="icon.color" class="mb-2 h-8 w-8" />
          </div>
        </div>

        <div class="modal-action">
          <form method="dialog">
            <button class="btn">Закрыть</button>
          </form>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button>Закрыть</button>
      </form>
    </dialog>
  </div>
</template>
