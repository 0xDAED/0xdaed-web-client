import { computed } from 'vue'
import { Cpu, MemoryStick, HardDrive, Activity } from 'lucide-vue-next'

export function useComputerPanelMeta(computerRef) {
  const computerId = computed(() => computerRef.value?.id)

  const statusBadge = computed(() =>
    computerRef.value?.computerActive ? 'badge badge-success' : 'badge badge-error'
  )
  const statusColor = computed(() =>
    computerRef.value?.computerActive ? 'text-success' : 'text-error'
  )

  const systemStats = computed(() => {
    const c = computerRef.value || {}
    return [
      { label: 'ЦПУ', value: `${Number(c.cpu?.value ?? 0)}%`, icon: Cpu, color: 'text-error' },
      {
        label: 'ОЗУ',
        value: `${Number(c.ozu?.value ?? 0)}%`,
        icon: MemoryStick,
        color: 'text-warning',
      },
      {
        label: 'Диск',
        value: `${Number(c.hard_drive?.value ?? 0)}%`,
        icon: HardDrive,
        color: 'text-info',
      },
      { label: 'Процессы', value: c.processes ?? 0, icon: Activity, color: 'text-success' },
    ]
  })

  return { computerId, statusBadge, statusColor, systemStats }
}
