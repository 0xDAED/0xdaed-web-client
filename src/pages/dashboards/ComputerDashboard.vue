<script setup>
  import '@/assets/styles/computerDashboard.css'

  import { computed, ref } from 'vue'
  import { Bug, X, Send, CheckSquare, Square, Wand2 } from 'lucide-vue-next'

  import { useComputer } from '@/composables/useComputer'
  import { useCommands } from '@/composables/useCommands'
  import { useComputersStore } from '@/stores/computersStore'

  import VComputerCard from '@/components/blocks/computers/VComputerCard.vue'
  import VCumputerFilters from '@/components/ui/computers/VCumputerFilters.vue'

  const store = useComputersStore()
  const { filteredComputers, loading, error, refresh } = useComputer()
  const { createCommand } = useCommands()

  const handleSaveComputer = computer => {
    console.log('Сохранить компьютер:', computer)
  }

  const bulkMode = ref(false)
  const selectedPcIds = ref([])

  const visiblePcIds = computed(() => (filteredComputers.value || []).map(c => c.id))
  const selectedCount = computed(() => selectedPcIds.value.length)
  const allVisibleSelected = computed(() => {
    const vis = visiblePcIds.value
    if (!vis.length) return false
    const sel = new Set(selectedPcIds.value)
    return vis.every(id => sel.has(id))
  })

  const toggleBulkMode = () => {
    bulkMode.value = !bulkMode.value
    if (!bulkMode.value) selectedPcIds.value = []
  }

  const toggleSelected = pcId => {
    const cur = new Set(selectedPcIds.value)
    if (cur.has(pcId)) cur.delete(pcId)
    else cur.add(pcId)
    selectedPcIds.value = Array.from(cur)
  }

  const selectAllVisible = () => {
    selectedPcIds.value = [...visiblePcIds.value]
  }

  const clearSelection = () => {
    selectedPcIds.value = []
  }

  const toggleSelectAllVisible = () => {
    if (allVisibleSelected.value) clearSelection()
    else selectAllVisible()
  }

  const bulkTypeUi = ref('Выполнить команду')
  const bulkParams = ref('')
  const bulkSending = ref(false)
  const bulkError = ref(null)
  const bulkDone = ref(false)

  const BULK_TYPE_MAP = {
    'Выполнить команду': 'RUN_SHELL',
    Перезагрузка: 'REBOOT',
    Выключение: 'SHUTDOWN',
    Сон: 'SLEEP',
    'Обновить процессы': 'REQUEST_PROCESSES',
    // Можно расширить:
    // 'Получить список блокировок': 'GET_BLOCKED_LIST',
  }

  const canSendBulk = computed(() => {
    if (!selectedPcIds.value.length) return false
    const type = BULK_TYPE_MAP[bulkTypeUi.value]
    if (!type) return false
    if (type === 'RUN_SHELL') return Boolean((bulkParams.value || '').trim())
    return true
  })

  const sendBulk = async () => {
    bulkError.value = null
    bulkDone.value = false

    if (!canSendBulk.value) return

    const type = BULK_TYPE_MAP[bulkTypeUi.value]
    const payload = {}

    if (type === 'RUN_SHELL') payload.params = (bulkParams.value || '').trim()

    bulkSending.value = true
    try {
      await Promise.allSettled(selectedPcIds.value.map(pcId => createCommand(pcId, type, payload)))

      bulkDone.value = true

      if (type === 'RUN_SHELL') bulkParams.value = ''
    } catch (e) {
      bulkError.value = e?.message || String(e)
    } finally {
      bulkSending.value = false
      setTimeout(() => (bulkDone.value = false), 1200)
    }
  }
</script>

<template>
  <div class="container mx-auto">
    <div class="mx-auto mt-5 grid grid-cols-[9fr_1fr_9fr] gap-4 align-middle">
      <fieldset class="fieldset ml-2 sm:ml-0">
        <legend class="fieldset-legend ml-1" style="font-size: 14px !important">Найти пк</legend>
        <input
          v-model="store.filters.q"
          type="text"
          class="input w-full"
          placeholder="Название / Процесс"
        />
      </fieldset>

      <div class="classroom-container flex items-center justify-center">
        <div class="classroom-group p-3">
          <button
            class="btn btn-success btn-xs btn-classroom"
            :class="{ 'btn-active': store.filters.iconColor === 'green' }"
            @click="store.filters.iconColor = store.filters.iconColor === 'green' ? null : 'green'"
          ></button>

          <button
            class="btn btn-orange btn-xs btn-classroom"
            :class="{ 'btn-active': store.filters.iconColor === 'orange' }"
            @click="
              store.filters.iconColor = store.filters.iconColor === 'orange' ? null : 'orange'
            "
          ></button>

          <button
            class="btn btn-info btn-xs btn-classroom"
            :class="{ 'btn-active': store.filters.iconColor === 'blue' }"
            @click="store.filters.iconColor = store.filters.iconColor === 'blue' ? null : 'blue'"
          ></button>

          <button
            class="btn btn-purpur btn-xs btn-classroom"
            :class="{ 'btn-active': store.filters.iconColor === 'purple' }"
            @click="
              store.filters.iconColor = store.filters.iconColor === 'purple' ? null : 'purple'
            "
          ></button>
        </div>
      </div>

      <form class="mt-1">
        <legend class="fieldset-legend" style="font-size: 14px !important">Фильтры</legend>
        <VCumputerFilters />
      </form>
    </div>

    <div class="mt-4 mb-4 flex flex-wrap items-center justify-between gap-2 px-2 sm:px-0">
      <div class="flex items-center gap-2">
        <button
          class="btn btn-sm"
          :class="bulkMode ? 'btn-warning' : 'btn-ghost'"
          @click="toggleBulkMode"
        >
          <Wand2 class="h-4 w-4" />
          Массовый режим
        </button>

        <template v-if="bulkMode">
          <button class="btn btn-sm btn-ghost" @click="toggleSelectAllVisible">
            <component :is="allVisibleSelected ? CheckSquare : Square" class="h-4 w-4" />
            {{ allVisibleSelected ? 'Снять со всех (на экране)' : 'Выбрать всех (на экране)' }}
          </button>

          <button class="btn btn-sm btn-ghost" :disabled="!selectedCount" @click="clearSelection">
            <X class="h-4 w-4" />
            Сбросить
          </button>

          <span class="badge badge-primary"> Выбрано: {{ selectedCount }} </span>
        </template>
      </div>

      <div v-if="bulkMode" class="flex flex-wrap items-center gap-2">
        <select v-model="bulkTypeUi" class="select select-bordered select-sm">
          <option>Выполнить команду</option>
          <option>Перезагрузка</option>
          <option>Выключение</option>
          <option>Сон</option>
          <option>Обновить процессы</option>
        </select>

        <input
          v-if="BULK_TYPE_MAP[bulkTypeUi] === 'RUN_SHELL'"
          v-model="bulkParams"
          type="text"
          class="input input-bordered input-sm w-80 max-w-full"
          placeholder="PowerShell команда (например: Get-Process | Select -First 10)"
        />

        <button
          class="btn btn-sm btn-primary"
          :disabled="bulkSending || !canSendBulk"
          @click="sendBulk"
        >
          <Send class="h-4 w-4" />
          {{ bulkSending ? 'Отправляю...' : 'Отправить' }}
        </button>

        <span v-if="bulkDone" class="badge badge-success">Готово</span>
        <span v-if="bulkError" class="badge badge-error">{{ bulkError }}</span>
      </div>
    </div>

    <!-- Loading -->
    <template v-if="loading">
      <div class="mt-30 flex min-h-50 flex-col items-center justify-center">
        <div class="border-primary h-12 w-12 animate-spin rounded-full border-t-2 border-b-2"></div>
        <p class="mt-4 text-gray-500">Загрузка данных...</p>
      </div>
    </template>

    <!-- Error -->
    <template v-else-if="error">
      <div class="flex min-h-50 flex-col items-center justify-center">
        <div
          class="w-full max-w-md rounded-lg border border-red-200 bg-red-50 px-6 py-4 text-red-700"
        >
          <div class="flex items-start">
            <div class="shrink-0 pt-0.5"><Bug /></div>
            <div class="ml-3 flex-1">
              <p class="text-sm font-medium">{{ error }}</p>
              <button
                @click="refresh"
                class="mt-3 inline-flex items-center rounded border border-transparent bg-red-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition-colors hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none"
              >
                Повторить
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Grid -->
    <template v-else>
      <div
        class="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
      >
        <VComputerCard
          v-for="comp in filteredComputers"
          :key="comp.id"
          :computer="comp"
          :bulkMode="bulkMode"
          :selected="selectedPcIds.includes(comp.id)"
          @toggleSelected="toggleSelected"
          @save="handleSaveComputer"
        />
      </div>
    </template>
  </div>
</template>
