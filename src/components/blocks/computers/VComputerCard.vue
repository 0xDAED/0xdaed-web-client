<script setup>
  import { computed, toRef } from 'vue'
  import '@/assets/styles/computerDashboard.css'

  import VRadialProgress from '@/components/ui/computers/VRadialProgress.vue'
  import VSelectComputerIcon from './VSelectComputerIcon.vue'
  import VComputerRightPanel from './VComputerRightPanel.vue'

  import { Cpu, MemoryStick, HardDrive } from 'lucide-vue-next'

  import { useComputerPanel } from '@/composables/computers/card/useComputerPanel'
  import { useComputerStatus } from '@/composables/computers/card/useComputerStatus'
  import { useDeviceIcons } from '@/composables/computers/card/useDeviceIcons'
  import { useBulkToggle } from '@/composables/computers/card/useBulkToggle'

  const props = defineProps({
    computer: {
      type: Object,
      required: true,
      validator: value => {
        return [
          'id',
          'computerActive',
          'computerName',
          'computerMacAddress',
          'lastTimeActive',
          'processes',
          'cpu',
          'ozu',
          'hard_drive',
          'audience',
        ].every(prop => prop in value)
      },
    },

    bulkMode: { type: Boolean, default: false },
    selected: { type: Boolean, default: false },

    showSaveButton: { type: Boolean, default: true },
  })

  const emit = defineEmits(['save', 'toggleSelected'])

  const computerRef = toRef(props, 'computer')

  const { isPanelActive, closePanel, togglePanel } = useComputerPanel()
  const { statusColor } = useComputerStatus(computerRef)
  const { deviceIcons } = useDeviceIcons()

  const { onToggleSelect } = useBulkToggle({
    emit,
    getPcId: () => props.computer.id,
  })

  const cpu = computed(() => props.computer?.cpu ?? 0)
  const ozu = computed(() => props.computer?.ozu ?? 0)
  const disk = computed(() => props.computer?.hard_drive ?? 0)
</script>

<template>
  <div class="card-computer-custom mx-auto w-85 overflow-hidden rounded-lg p-3 sm:w-62.5">
    <div class="mt-1 flex items-start justify-between px-1 py-1">
      <div class="flex flex-1 items-center">
        <div class="tooltip tooltip-right" data-tip="Заменить иконку">
          <div class="card-profile flex items-center">
            <VSelectComputerIcon
              :icons="deviceIcons"
              :computer-id="computer.id"
              :modal-id="`select_icon_${computer.id}`"
            />
          </div>
        </div>

        <div class="tooltip tooltip-right ml-2" data-tip="Статус">
          <div class="card-lifestyle mt-1 ml-3 h-3 w-3 rounded-full" :class="statusColor"></div>
        </div>
      </div>

      <div v-if="bulkMode" class="mt-3 ml-2 flex items-center">
        <input
          type="checkbox"
          class="checkbox checkbox-sm p-1"
          :checked="selected"
          @click.stop
          @change="onToggleSelect"
        />
      </div>
    </div>

    <!-- Body -->
    <div class="tooltip" data-tip="Управление">
      <div class="card-information-panel bg-base-300 mt-1 px-4 py-2 pt-3 pb-3" @click="togglePanel">
        <slot></slot>

        <div class="mb-1">
          <h6 class="text-xs opacity-70">{{ computer.computerMacAddress }}</h6>
          <h2 class="text-lg font-medium">{{ computer.computerName }}</h2>
        </div>

        <div class="mb-1">
          <h6 class="text-xs opacity-70">Нагрузка:</h6>
        </div>

        <div class="mx-auto mt-2 grid grid-cols-3 items-center justify-center gap-3">
          <VRadialProgress :progress="cpu" :active="computer.computerActive" type="ЦПУ">
            <template #icon><Cpu /></template>
          </VRadialProgress>

          <VRadialProgress :progress="ozu" :active="computer.computerActive" type="ОЗУ">
            <template #icon><MemoryStick /></template>
          </VRadialProgress>

          <VRadialProgress :progress="disk" :active="computer.computerActive" type="ДИСК">
            <template #icon><HardDrive /></template>
          </VRadialProgress>
        </div>

        <div class="mt-3">
          <div class="card-info p-2 text-center">
            <h6 style="font-size: 9px">{{ computer.processes }}</h6>
          </div>
        </div>
      </div>

      <transition
        enter-active-class="transition ease-out duration-300"
        enter-from-class="transform translate-x-full opacity-0"
        enter-to-class="transform translate-x-0 opacity-100"
        leave-active-class="transition ease-in duration-200"
        leave-from-class="transform translate-x-0 opacity-100"
        leave-to-class="transform translate-x-full opacity-0"
      >
        <VComputerRightPanel v-if="isPanelActive" :computer="computer" @close="closePanel">
          <template #default>
            <slot name="right-panel" :computer="computer"></slot>
          </template>
        </VComputerRightPanel>
      </transition>
    </div>
  </div>
</template>
