import { apiFetch } from '@/services/api/computerApi'
import { useComputersStore } from '@/stores/computersStore'

export function useCommands() {
  const createCommand = async (pcId, type, payload = {}) => {
    return apiFetch('/ui/commands', {
      method: 'POST',
      body: JSON.stringify({ pc_id: pcId, type, payload }),
    })
  }

  return { createCommand }
}

export function useComputerCommands(computerIdRef) {
  const store = useComputersStore()

  const create = (type, payload = {}) => store.createCommand(computerIdRef.value, type, payload)

  const killProcess = proc => create('KILL_PROCESS', { pid: proc.pid })
  const requestProcesses = () => create('REQUEST_PROCESSES', {})
  const blockByName = name => create('BLOCK_PROCESS_NAME', { name })
  const unblockByName = name => create('UNBLOCK_PROCESS_NAME', { name })

  const toggleBlock = proc => (proc.blocked ? unblockByName(proc.name) : blockByName(proc.name))

  const quick = type => create(type, {})

  return { create, killProcess, requestProcesses, toggleBlock, quick }
}
