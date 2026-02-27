<script setup>
  import { computed, ref, onMounted, watch } from 'vue'
  import {
    LaptopMinimal,
    PanelRightClose,
    StopCircle,
    Lock,
    Unlock,
    Settings,
    Activity,
    HardDrive,
    Cpu,
    MemoryStick,
    Plus,
    RefreshCw,
    Trash2,
    Zap,
    Timer,
    Calendar,
  } from 'lucide-vue-next'

  import { useComputersStore } from '@/stores/computersStore'
  import { sortProcesses } from '@/utils/useProcessSort'
  import { useComputerCommands } from '@/composables/useCommands'

  const props = defineProps({
    computer: { type: Object, required: true },
  })
  const emit = defineEmits(['close'])

  const store = useComputersStore()

  const computerId = computed(() => props.computer.id)
  const cmd = useComputerCommands(computerId)

  const blockedRules = computed(() => store.blockedRulesByPc?.[computerId.value] || [])

  const processes = computed(() => props.computer.processList || [])

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

  const activeTab = ref('processes')

  const quickActions = [
    { name: 'Перезагрузка', type: 'REBOOT', icon: RefreshCw, color: 'error' },
    { name: 'Выключение', type: 'SHUTDOWN', icon: StopCircle, color: 'error' },
    { name: 'Сон', type: 'SLEEP', icon: StopCircle, color: 'info' },
  ]

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

  const TASK_TYPE_MAP = {
    'Выполнить команду': 'RUN_SHELL',
    'Запустить программу': 'RUN_PROGRAM',
    Перезагрузка: 'REBOOT',
    Выключение: 'SHUTDOWN',
  }

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

  const sortedProcesses = computed(() => sortProcesses(mergedProcesses.value))

  const loadBlockedRules = async () => {
    try {
      await cmd.getBlockedList()
    } catch (e) {
      console.error(e)
    }
  }

  const stopProcess = proc => {
    if (!proc?.pid) return
    return cmd.killProcess(proc)
  }
  const refreshProcesses = () => cmd.requestProcesses()
  const toggleProcessBlock = async proc => {
    const name = (proc?.name || '').trim()
    if (!name) return

    // оптимистично
    if (proc?._virtual || proc?.blocked) {
      store.removeBlockedRule?.(computerId.value, name)
    } else {
      store.addBlockedRule?.(computerId.value, name)
    }

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

  const taskQueue = computed(() =>
    (props.computer.tasks || []).filter(t => t.status !== 'completed' && t.status !== 'failed')
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

  const systemStats = computed(() => [
    {
      label: 'ЦПУ',
      value: `${Number(props.computer.cpu?.value ?? 0)}%`,
      icon: Cpu,
      color: 'text-error',
    },
    {
      label: 'ОЗУ',
      value: `${Number(props.computer.ozu?.value ?? 0)}%`,
      icon: MemoryStick,
      color: 'text-warning',
    },
    {
      label: 'Диск',
      value: `${Number(props.computer.hard_drive?.value ?? 0)}%`,
      icon: HardDrive,
      color: 'text-info',
    },
    {
      label: 'Процессы',
      value: props.computer.processes ?? 0,
      icon: Activity,
      color: 'text-success',
    },
  ])

  const handleOverlayClick = () => emit('close')

  const statusBadge = computed(() =>
    props.computer.computerActive ? 'badge badge-success' : 'badge badge-error'
  )
  const statusColor = computed(() =>
    props.computer.computerActive ? 'text-success' : 'text-error'
  )

  onMounted(loadBlockedRules)
  watch(() => computerId.value, loadBlockedRules)
</script>

<template>
  <div class="fixed inset-0 z-50 flex">
    <div class="flex-1 bg-black/50" @click="handleOverlayClick"></div>

    <div class="bg-base-100 h-full w-200 max-w-full overflow-y-auto shadow-2xl" @click.stop>
      <div
        class="bg-base-200 border-base-300 top-0 flex items-center justify-between border-b px-4 py-3"
      >
        <div class="flex items-center gap-3">
          <div class="avatar placeholder bg-base-300 rounded-lg p-2">
            <LaptopMinimal class="h-6 w-6" />
          </div>

          <div>
            <h2 class="text-lg font-bold">{{ computer.computerName }}</h2>
            <div class="mt-1 flex items-center gap-2">
              <span class="badge badge-sm" :class="statusBadge">
                <span :class="statusColor" class="mx-auto">
                  <h3 class="mx-auto font-bold text-black">
                    {{ computer.computerActive ? 'Онлайн' : 'Офлайн' }}
                  </h3></span
                >
              </span>
              <span class="text-base-content/60 text-xs">{{ computer.computerMacAddress }}</span>
            </div>
          </div>
        </div>
        <button class="btn btn-ghost btn-sm btn-square" @click="$emit('close')">
          <PanelRightClose class="h-5 w-5" />
        </button>
      </div>

      <div class="border-base-300 bg-base-200 border-b px-4">
        <div class="tabs tabs-bordered">
          <a
            class="tab"
            :class="{ 'tab-active': activeTab === 'processes' }"
            @click="activeTab = 'processes'"
          >
            <Activity class="mr-2 h-4 w-4" />
            Процессы
          </a>
          <a
            class="tab"
            :class="{ 'tab-active': activeTab === 'tasks' }"
            @click="activeTab = 'tasks'"
          >
            <Zap class="mr-2 h-4 w-4" />
            Задачи
          </a>
          <a
            class="tab"
            :class="{ 'tab-active': activeTab === 'system' }"
            @click="activeTab = 'system'"
          >
            <Settings class="mr-2 h-4 w-4" />
            Система
          </a>
        </div>
      </div>

      <div class="space-y-4 p-4">
        <div class="card bg-base-200 rounded-box grid grid-cols-4 p-4">
          <div
            v-for="(stat, index) in systemStats"
            :key="index"
            class="bg-base-100 ml-1 grid grid-cols-[auto_1fr] items-center justify-center gap-3 rounded-lg p-2 md:w-42.5"
          >
            <component :is="stat.icon" :class="['ml-3 hidden h-5 w-5 sm:block', stat.color]" />
            <div class="ml-3 justify-center space-y-0.5">
              <div class="text-xs opacity-70">{{ stat.label }}</div>
              <div class="text-xs font-bold sm:text-lg">{{ stat.value }}</div>
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'processes'" class="space-y-3">
          <div class="card bg-base-200 rounded-box p-4">
            <div class="flex items-center justify-between">
              <h4 class="flex items-center gap-2 text-base font-bold">
                <Lock class="h-4 w-4" />
                Заблокированные правила
              </h4>
              <button class="btn btn-xs btn-ghost" @click="loadBlockedRules">
                <RefreshCw class="h-3 w-3" />
              </button>
            </div>

            <div v-if="blockedRules.length === 0" class="mt-2 text-sm opacity-70">
              Нет правил блокировки
            </div>

            <div v-else class="mt-3 flex flex-wrap gap-2">
              <div
                v-for="name in blockedRules"
                :key="name"
                class="badge badge-error badge-outline gap-2 p-4"
              >
                <span class="text-xs font-medium">{{ name }}</span>
                <button
                  class="btn btn-xs btn-success"
                  @click="toggleProcessBlock({ name, blocked: true, _virtual: true })"
                >
                  <Unlock class="h-2.5 w-2.5" />
                </button>
              </div>
            </div>
          </div>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-bold">Запущенные процессы</h3>
            <div class="flex items-center gap-2">
              <button class="btn btn-sm btn-ghost" @click="refreshProcesses">
                <RefreshCw class="h-4 w-4" />
              </button>
              <span class="badge badge-primary">{{ processes.length }} процессов</span>
            </div>
          </div>

          <div class="card bg-base-100 rounded-box">
            <div class="max-h-150 overflow-x-hidden overflow-y-auto">
              <table class="table-zebra table-sm table w-full">
                <thead>
                  <tr>
                    <th class="whitespace-nowrap">Имя</th>
                    <th class="hidden whitespace-nowrap sm:table-cell">PID</th>
                    <th class="hidden whitespace-nowrap md:table-cell">Статус</th>
                    <th class="text-center whitespace-nowrap">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="process in sortedProcesses" :key="process.pid">
                    <td class="font-medium">
                      <div class="flex items-center gap-2">
                        <span
                          :class="{
                            'text-error': process.blocked,
                            'text-success': !process.blocked,
                          }"
                        >
                          {{ process.name }}
                        </span>
                        <span v-if="process.blocked" class="badge badge-xs badge-error">
                          <Lock class="h-3 w-3" />
                        </span>
                      </div>
                    </td>
                    <td class="hidden sm:table-cell">
                      <span class="badge badge-ghost badge-sm">{{ process.pid }}</span>
                    </td>
                    <td class="hidden md:table-cell">
                      <span
                        class="badge badge-sm"
                        :class="{
                          'badge-success': process.status === 'running',
                          'badge-error': process.status === 'stopped',
                        }"
                      >
                        {{ process.status === 'running' ? 'Работает' : 'Остановлен' }}
                      </span>
                    </td>
                    <td class="flex justify-center gap-1">
                      <button
                        v-if="process.status === 'running'"
                        class="btn btn-xs btn-error"
                        @click="stopProcess(process)"
                      >
                        <StopCircle class="h-3 w-3" />
                      </button>
                      <button
                        class="btn btn-xs"
                        :class="process.blocked ? 'btn-success' : 'btn-warning'"
                        @click="toggleProcessBlock(process)"
                      >
                        <component :is="process.blocked ? Unlock : Lock" class="h-3 w-3" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'tasks'" class="space-y-3">
          <div class="card bg-base-200 rounded-box p-4">
            <h4 class="mb-3 flex items-center gap-2 text-base font-bold">
              <Zap class="h-4 w-4" />
              Быстрые действия
            </h4>

            <div class="grid grid-cols-2 gap-2 md:grid-cols-3">
              <button
                v-for="(action, index) in quickActions"
                :key="index"
                class="btn btn-sm gap-2"
                :class="`btn-${action.color}`"
                @click="runQuickAction(action)"
              >
                <component :is="action.icon" class="h-4 w-4" />
                {{ action.name }}
              </button>
            </div>
          </div>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-bold">Очередь задач</h3>
          </div>

          <div class="space-y-2">
            <div v-for="task in taskQueue" :key="task.id" class="card bg-base-100 rounded-box p-4">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center justify-between">
                    <h4 class="font-bold">{{ task.title || task.type }}</h4>
                    <span class="badge badge-sm" :class="taskStatusBadge(task.status)">
                      {{ task.status }}
                    </span>
                  </div>
                  <div class="text-base-content/70 mt-2 flex items-center gap-3 text-sm">
                    <div class="flex items-center gap-1">
                      <Calendar class="h-3 w-3" />
                      {{ new Date(task.createdAtTs * 1000).toLocaleString() }}
                    </div>
                    <div class="flex items-center gap-1">
                      <Timer class="h-3 w-3" />
                      Выполнение
                    </div>
                  </div>
                </div>
                <div class="ml-4 flex items-start gap-1">
                  <button
                    class="btn btn-xs btn-ghost"
                    @click="store.removeTaskLocal(computer.id, task.id)"
                  >
                    <Trash2 class="text-error h-3 w-3" />
                  </button>
                </div>
              </div>

              <div class="mt-3">
                <progress
                  class="progress"
                  :class="{
                    'progress-success': task.status === 'completed',
                    'progress-info': task.status === 'running',
                    'progress-warning': task.status === 'pending',
                    'progress-error': task.status === 'failed',
                  }"
                  :value="task.progress"
                  max="100"
                ></progress>
                <div class="text-base-content/70 mt-1 flex justify-between text-xs">
                  <span>{{ task.progress }}%</span>
                  <span v-if="task.status === 'running'">Выполняется...</span>
                  <span v-if="task.status === 'pending'">В ожидании</span>
                  <span v-if="task.status === 'completed'">Завершено</span>
                </div>
              </div>
            </div>
          </div>

          <div class="card bg-base-200 rounded-box p-4">
            <h4 class="mb-3 flex items-center gap-2 text-base font-bold">
              <Plus class="h-4 w-4" />
              Создать новую задачу
            </h4>

            <div class="space-y-3">
              <div class="form-control">
                <label class="label">
                  <span class="label-text">Тип задачи</span>
                </label>

                <select v-model="taskTypeUi" class="select select-bordered select-sm ml-2">
                  <option disabled value="">Выберите тип</option>
                  <option>Выполнить команду</option>
                  <option>Перезагрузка</option>
                  <option>Выключение</option>
                </select>
              </div>

              <div class="form-control">
                <label class="label">
                  <span class="label-text">Параметры</span>
                </label>
                <textarea
                  v-model="taskParams"
                  class="textarea textarea-bordered textarea-sm ml-2 w-150"
                  placeholder="Например: powershell kill all"
                ></textarea>
              </div>

              <button
                class="btn btn-primary btn-sm w-full"
                :disabled="creatingTask || !taskTypeUi"
                @click="submitTask"
              >
                <Zap class="mr-2 h-4 w-4" />
                {{ creatingTask ? 'Создаю...' : 'Поставить в очередь' }}
              </button>
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'system'" class="space-y-3">
          <div class="card bg-base-200 rounded-box p-4">
            <h4 class="mb-3 flex items-center gap-2 text-base font-bold">
              <Settings class="h-4 w-4" />
              Информация о системе
            </h4>
            <div class="space-y-2">
              <div class="bg-base-100 flex justify-between rounded-lg p-3">
                <span class="text-sm">Операционная система</span>
                <span class="font-medium">{{ computer.system?.osName || '—' }}</span>
              </div>
              <div class="bg-base-100 flex justify-between rounded-lg p-3">
                <span class="text-sm">Версия</span>
                <span class="font-medium">
                  {{ computer.system?.osVersion || '—' }}
                  <template v-if="computer.system?.osBuild">
                    (Build {{ computer.system.osBuild }})</template
                  >
                </span>
              </div>
              <div class="bg-base-100 flex justify-between rounded-lg p-3">
                <span class="text-sm">Последняя активность</span>
                <span class="font-medium">{{ computer.lastTimeActive || 'Недавно' }}</span>
              </div>
              <div class="bg-base-100 flex justify-between rounded-lg p-3">
                <span class="text-sm">IP адрес</span>
                <span class="font-medium">{{ computer.system?.ip || '—' }}</span>
              </div>
              <div class="bg-base-100 flex justify-between rounded-lg p-3">
                <span class="text-sm">Пользователь</span>
                <span class="font-medium">{{ computer.system?.username || '—' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
