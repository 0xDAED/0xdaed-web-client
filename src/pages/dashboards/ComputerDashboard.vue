<script setup>
  import '@/assets/styles/computerDashboard.css'

  import { Bug, X, Send, CheckSquare, Square, Wand2 } from 'lucide-vue-next'

  import { useComputer } from '@/composables/computers/useComputer'
  import { useCommands } from '@/composables/computers/useCommands'
  import { useComputersStore } from '@/stores/computersStore'

  import VComputerCard from '@/components/blocks/computers/VComputerCard.vue'
  import VCumputerFilters from '@/components/ui/computers/VCumputerFilters.vue'

  import { BULK_UI_OPTIONS, BULK_TYPE_MAP } from '@/composables/computers/bulk/bulkConstants'
  import { useBulkSelection } from '@/composables/computers/bulk/useBulkSelection'
  import { useBulkSender } from '@/composables/computers/bulk/useBulkSender'

  const store = useComputersStore()
  const { filteredComputers, loading, error, refresh } = useComputer()
  const { createCommand } = useCommands()

  const handleSaveComputer = computer => {
    console.log('Сохранить компьютер:', computer)
  }

  const {
    bulkMode,
    selectedPcIds,
    selectedCount,
    allVisibleSelected,
    toggleBulkMode,
    toggleSelected,
    clearSelection,
    toggleSelectAllVisible,
  } = useBulkSelection(filteredComputers)

  const { bulkTypeUi, bulkParams, bulkSending, bulkError, bulkDone, canSendBulk, sendBulk } =
    useBulkSender({ selectedPcIds, createCommand })
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
            type="button"
            class="btn btn-success btn-xs btn-classroom"
            :class="{ 'btn-active': store.filters.iconColor === 'green' }"
            @click="store.filters.iconColor = store.filters.iconColor === 'green' ? null : 'green'"
          ></button>

          <button
            type="button"
            class="btn btn-orange btn-xs btn-classroom"
            :class="{ 'btn-active': store.filters.iconColor === 'orange' }"
            @click="
              store.filters.iconColor = store.filters.iconColor === 'orange' ? null : 'orange'
            "
          ></button>

          <button
            type="button"
            class="btn btn-info btn-xs btn-classroom"
            :class="{ 'btn-active': store.filters.iconColor === 'blue' }"
            @click="store.filters.iconColor = store.filters.iconColor === 'blue' ? null : 'blue'"
          ></button>

          <button
            type="button"
            class="btn btn-purpur btn-xs btn-classroom"
            :class="{ 'btn-active': store.filters.iconColor === 'purple' }"
            @click="
              store.filters.iconColor = store.filters.iconColor === 'purple' ? null : 'purple'
            "
          ></button>
        </div>
      </div>

      <form class="mt-1" @submit.prevent>
        <legend class="fieldset-legend" style="font-size: 14px !important">Фильтры</legend>
        <VCumputerFilters />
      </form>
    </div>

    <div class="mt-4 mb-4 flex flex-wrap items-center justify-between gap-2 px-2 sm:px-0">
      <div class="flex items-center gap-2">
        <button
          type="button"
          class="btn btn-sm"
          :class="bulkMode ? 'btn-warning' : 'btn-ghost'"
          @click="toggleBulkMode"
        >
          <Wand2 class="h-4 w-4" />
          Массовый режим
        </button>

        <template v-if="bulkMode">
          <button type="button" class="btn btn-sm btn-ghost" @click="toggleSelectAllVisible">
            <component :is="allVisibleSelected ? CheckSquare : Square" class="h-4 w-4" />
            {{ allVisibleSelected ? 'Снять со всех (на экране)' : 'Выбрать всех (на экране)' }}
          </button>

          <button
            type="button"
            class="btn btn-sm btn-ghost"
            :disabled="!selectedCount"
            @click="clearSelection"
          >
            <X class="h-4 w-4" />
            Сбросить
          </button>

          <span class="badge badge-primary">Выбрано: {{ selectedCount }}</span>
        </template>
      </div>

      <div v-if="bulkMode" class="flex flex-wrap items-center gap-2">
        <select v-model="bulkTypeUi" class="select select-bordered select-sm">
          <option v-for="opt in BULK_UI_OPTIONS" :key="opt">{{ opt }}</option>
        </select>

        <input
          v-if="BULK_TYPE_MAP[bulkTypeUi] === 'RUN_SHELL'"
          v-model="bulkParams"
          type="text"
          class="input input-bordered input-sm w-80 max-w-full"
          placeholder="PowerShell команда (например: Get-Process | Select -First 10)"
        />

        <button
          type="button"
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

    <template v-if="loading">
      <div class="mt-30 flex min-h-50 flex-col items-center justify-center">
        <div class="border-primary h-12 w-12 animate-spin rounded-full border-t-2 border-b-2"></div>
        <p class="mt-4 text-gray-500">Загрузка данных...</p>
      </div>
    </template>

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
                type="button"
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
