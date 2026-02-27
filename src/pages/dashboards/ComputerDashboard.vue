<script setup>
  import '@/assets/styles/computerDashboard.css'

  import { useComputer } from '@/composables/useComputer'
  import VComputerCard from '@/components/blocks/computers/VComputerCard.vue'
  import VCumputerFilters from '@/components/ui/computers/VCumputerFilters.vue'

  import { useComputersStore } from '@/stores/computersStore'
  const store = useComputersStore()
  const { filteredComputers, loading, error, refresh } = useComputer()

  const handleSaveComputer = computer => {
    console.log('Сохранить компьютер:', computer)
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

        <VCumputerFilters></VCumputerFilters>
      </form>
    </div>

    <template v-if="loading">
      <div class="mt-30 flex min-h-50 flex-col items-center justify-center">
        <div class="border-primary h-12 w-12 animate-spin rounded-full border-t-2 border-b-2"></div>
        <p class="mt-4 text-gray-500">Загрузка данных...</p>
      </div>
    </template>

    <!-- Ошибка -->
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

    <template v-else>
      <div
        class="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
      >
        <VComputerCard
          v-for="comp in filteredComputers"
          :key="comp.id"
          :computer="comp"
          @save="handleSaveComputer"
        />
      </div>
    </template>
  </div>
</template>
