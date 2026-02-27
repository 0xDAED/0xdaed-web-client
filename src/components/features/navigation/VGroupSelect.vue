<script setup>
  import { onMounted } from 'vue'
  import { useStudentGroupsStore } from '@/stores/groupStore'
  import { useStudentGroups } from '@/composables/useStudentGroups'

  const groupsStore = useStudentGroupsStore()
  const { loadStudentGroupsMock, loading } = useStudentGroups()

  // Временный объект-заглушка
  const loadingGroup = { id: 0, name: 'Загрузка...' }

  onMounted(async () => {
    groupsStore.setSelected(loadingGroup)

    const data = await loadStudentGroupsMock()
    groupsStore.setList(data)

    if (data.length > 0) {
      groupsStore.setSelected(data[0])
    }
  })
</script>

<template>
  <select
    class="select select-neutral select-sm w-48"
    v-model="groupsStore.selectedGroup"
    :class="{ skeleton: loading }"
    :disabled="loading"
  >
    <!-- Заглушка пока данные не загрузились -->
    <option :value="loadingGroup" disabled>
      {{ loading ? loadingGroup.name : 'Выберите группу' }}
    </option>

    <!-- Опции групп -->
    <option v-for="group in groupsStore.listGroups" :key="group.id" :value="group">
      {{ group.name }}
    </option>
  </select>
</template>
