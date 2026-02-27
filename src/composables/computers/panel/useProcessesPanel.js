import { computed } from 'vue'
import { sortProcesses } from '@/utils/useProcessSort'

export function useProcessesPanel({ computerRef, store, cmd, computerIdRef }) {
  const blockedRules = computed(() => store.blockedRulesByPc?.[computerIdRef.value] || [])
  const processes = computed(() => computerRef.value?.processList || [])

  const mergedProcesses = computed(() => {
    const live = processes.value || []
    const liveNames = new Set(live.map(p => (p.name || '').toLowerCase()))

    const extra = blockedRules.value
      .filter(name => name && !liveNames.has(String(name).toLowerCase()))
      .map(name => ({
        pid: -1,
        name,
        status: 'not_running',
        blocked: true,
        cpu: 0,
        memoryMb: 0,
        _virtual: true,
      }))

    return [...live, ...extra]
  })

  const sortedProcesses = computed(() => sortProcesses(mergedProcesses.value))

  const loadBlockedRules = async () => {
    try {
      await cmd.getBlockedList()
    } catch (e) {
      console.error(e)
    }
  }

  const refreshProcesses = () => cmd.requestProcesses()

  const stopProcess = proc => {
    if (!proc?.pid) return
    return cmd.killProcess(proc)
  }

  const toggleProcessBlock = async proc => {
    const name = (proc?.name || '').trim()
    if (!name) return

    // оптимистично обновляем стор
    if (proc?._virtual || proc?.blocked) store.removeBlockedRule?.(computerIdRef.value, name)
    else store.addBlockedRule?.(computerIdRef.value, name)

    try {
      if (proc?._virtual) await cmd.unblockByName(name)
      else await cmd.toggleBlock(proc)
    } catch (e) {
      // откат при ошибке
      await loadBlockedRules()
      throw e
    } finally {
      // синхронизируемся с агентом
      await cmd.getBlockedList()
    }
  }

  return {
    blockedRules,
    processes,
    sortedProcesses,

    loadBlockedRules,
    refreshProcesses,
    stopProcess,
    toggleProcessBlock,
  }
}
