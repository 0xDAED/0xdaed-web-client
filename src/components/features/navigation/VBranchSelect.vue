<script setup>
  import { onMounted } from 'vue'
  import { useBranchStore } from '@/stores/branchStore'
  import { useBranches } from '@/composables/useBranches'

  const { loadUserBranchesMock, loading } = useBranches()
  const branchStore = useBranchStore()

  // Временный объект-заглушка
  const loadingBranch = { id: 0, name: 'Загрузка...' }

  onMounted(async () => {
    branchStore.setSelected(loadingBranch)

    const data = await loadUserBranchesMock()
    branchStore.setList(data)

    if (data.length > 0) {
      branchStore.setSelected(data[0])
    }
  })
</script>

<template>
  <select
    class="select select-neutral select-sm w-48"
    v-model="branchStore.selectedBranch"
    :disabled="loading"
    :class="{ skeleton: loading }"
  >
    <!-- Заглушка пока данные не загрузились -->
    <option :value="loadingBranch" disabled>
      {{ loading ? loadingBranch.name : 'Выберите филиал' }}
    </option>

    <!-- Опции филиалов -->
    <option v-for="branch in branchStore.listBranch" :key="branch.id" :value="branch">
      {{ branch.name }}
    </option>
  </select>
</template>
