<script setup>
  import { computed } from 'vue'
  import { useComputersStore } from '@/stores/computersStore'

  const store = useComputersStore()

  const activeChecked = computed({
    get: () => store.filters.online !== 'offline', // all/online => активные “как бы включены”
    set: v => {
      // если выключили "Активные" — значит хотим только offline
      store.filters.online = v ? 'all' : 'offline'
    },
  })

  const offlineChecked = computed({
    get: () => store.filters.online !== 'online',
    set: v => {
      store.filters.online = v ? 'all' : 'online'
    },
  })

  // удобный reset
  const reset = () => {
    store.resetFilters?.()
    // если resetFilters нет — минимум:
    // store.filters.online = 'all'
    // store.filters.overloaded = false
  }
</script>

<template>
  <div
    class="mx-auto hidden grid-cols-2 gap-2 align-middle sm:grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-[1fr_1fr_1fr_1fr_1fr]"
  >
    <!-- Активные -->
    <input
      class="btn btn-filter text-xs"
      type="checkbox"
      aria-label="Активные"
      v-model="activeChecked"
    />

    <!-- Выключены -->
    <input
      class="btn btn-filter hidden text-xs sm:inline-flex"
      type="checkbox"
      aria-label="Выключены"
      v-model="offlineChecked"
    />

    <!-- Перегруженные -->
    <input
      class="btn btn-filter hidden text-xs sm:hidden lg:inline-flex"
      type="checkbox"
      aria-label="Перегруженные"
      v-model="store.filters.overloaded"
    />

    <input class="btn btn-square" type="button" value="×" @click="reset" />
  </div>

  <!-- mobile -->
  <details class="dropdown dropdown-end relative sm:hidden">
    <summary class="btn btn-filter w-30">Фильтры</summary>
    <ul class="menu dropdown-content bg-base-100 rounded-box z-1 p-2 shadow-sm">
      <li>
        <label class="label cursor-pointer">
          <span class="label-text">Активные</span>
          <input type="checkbox" class="toggle" v-model="activeChecked" />
        </label>
      </li>
      <li>
        <label class="label cursor-pointer">
          <span class="label-text">Выключены</span>
          <input type="checkbox" class="toggle" v-model="offlineChecked" />
        </label>
      </li>
      <li>
        <label class="label cursor-pointer">
          <span class="label-text">Перегруженные</span>
          <input type="checkbox" class="toggle" v-model="store.filters.overloaded" />
        </label>
      </li>

      <li class="mt-2">
        <button class="btn btn-sm w-full" @click="reset">Сбросить</button>
      </li>
    </ul>
  </details>
</template>
