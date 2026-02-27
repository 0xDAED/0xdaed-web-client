import { computed, ref } from 'vue'
import { QUICK_ACTIONS, TASK_TYPE_MAP } from './panelConstants'

export function useTasksPanel({ computerRef, cmd }) {
  const quickActions = QUICK_ACTIONS

  const runQuickAction = async action => {
    try {
      await cmd.quick(action.type)
    } catch (e) {
      console.error(e)
    }
  }

  const taskTypeUi = ref('')
  const taskParams = ref('')
  const taskDate = ref('')
  const taskTime = ref('')
  const creatingTask = ref(false)

  const buildScheduleIso = () => {
    if (!taskDate.value || !taskTime.value) return null
    return `${taskDate.value}T${taskTime.value}:00`
  }

  const submitTask = async () => {
    const type = TASK_TYPE_MAP[taskTypeUi.value]
    if (!type) return

    const payload = {
      params: taskParams.value?.trim() || '',
      schedule_at: buildScheduleIso(),
    }

    creatingTask.value = true
    try {
      await cmd.create(type, payload)

      taskTypeUi.value = ''
      taskParams.value = ''
      taskDate.value = ''
      taskTime.value = ''
    } catch (e) {
      console.error(e)
    } finally {
      creatingTask.value = false
    }
  }

  const taskQueue = computed(() =>
    (computerRef.value?.tasks || []).filter(t => t.status !== 'completed' && t.status !== 'failed')
  )

  const taskStatusBadge = status => {
    const badges = {
      pending: 'badge badge-warning',
      running: 'badge badge-info',
      completed: 'badge badge-success',
      failed: 'badge badge-error',
    }
    return badges[status] || 'badge'
  }

  return {
    quickActions,
    runQuickAction,

    taskTypeUi,
    taskParams,
    taskDate,
    taskTime,
    creatingTask,
    submitTask,

    taskQueue,
    taskStatusBadge,
  }
}
