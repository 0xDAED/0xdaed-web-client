<template>
  <div class="bg-base-200 flex h-screen flex-col">
    <!-- ================= DASHBOARD ================= -->
    <div class="bg-base-100 grid grid-cols-5 gap-4 border-b px-6 py-3">
      <Stat title="Дисциплины" :value="disciplines.length" />
      <Stat title="Темы" :value="totalTopics" />
      <Stat title="Всего пар" :value="totalLessons" />
      <Stat title="Проведено" :value="completedLessons" />
      <Stat title="Прогресс" :value="globalProgress + '%'" />
    </div>

    <div class="flex flex-1 overflow-hidden">
      <!-- ================= SIDEBAR (оставлен) ================= -->
      <aside class="bg-base-100 w-80 overflow-auto border-r p-6">
        <h2 class="mb-4 text-lg font-semibold">Фильтры</h2>

        <input
          v-model="filters.search"
          placeholder="Поиск дисциплины..."
          class="input input-bordered mb-6 w-full"
        />

        <FilterSelect title="Семестр" v-model="filters.semester" :options="['Все', 1, 2, 3, 4]" />
      </aside>

      <!-- ================= MAIN ================= -->
      <main class="flex flex-1 flex-col">
        <!-- TOPBAR -->
        <div class="bg-base-100 flex items-center border-b px-6 py-3">
          <h1 class="text-xl font-semibold">Дисциплины</h1>

          <div class="ml-auto flex gap-2">
            <button class="btn btn-primary btn-sm" @click="addDiscipline">+ Добавить</button>
          </div>
        </div>

        <div class="flex flex-1 overflow-hidden">
          <!-- TABLE -->
          <div class="flex-1 overflow-auto p-6">
            <table class="table">
              <thead>
                <tr>
                  <th>Дисциплина</th>
                  <th>Семестр</th>
                  <th>Часы</th>
                  <th>Прогресс</th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="d in filtered"
                  :key="d.id"
                  class="hover cursor-pointer"
                  @click="selected = d"
                >
                  <td class="font-medium">{{ d.name }}</td>
                  <td>{{ d.semester }}</td>
                  <td>{{ d.hours }}</td>

                  <td>
                    <progress
                      class="progress progress-primary w-24"
                      :value="disciplineProgress(d)"
                      max="100"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- ================= RIGHT PANEL ================= -->
          <aside v-if="selected" class="bg-base-100 w-[420px] overflow-auto border-l p-6">
            <h3 class="mb-4 text-lg font-semibold">
              {{ selected.name }}
            </h3>

            <!-- ADD TOPIC -->
            <div class="mb-6 flex gap-2">
              <input
                v-model="selected.newTopicName"
                class="input input-bordered flex-1"
                placeholder="Тема"
              />

              <input
                type="number"
                v-model.number="selected.newTopicLessons"
                class="input input-bordered w-20"
                placeholder="Пар"
              />

              <button class="btn btn-primary btn-sm" @click="addTopic(selected)">+</button>
            </div>

            <!-- TOPICS -->
            <div class="space-y-4">
              <div
                v-for="topic in selected.topics"
                :key="topic.id"
                class="bg-base-200 rounded-xl p-4"
                :class="topicDone(topic) && 'ring-success/40 ring'"
              >
                <div class="flex justify-between">
                  <span class="font-medium">{{ topic.name }}</span>
                  <span class="text-xs opacity-60"> {{ topicProgress(topic) }}% </span>
                </div>

                <!-- LESSONS -->
                <div class="mt-3 flex flex-wrap gap-3">
                  <label
                    v-for="(lesson, i) in topic.lessons"
                    :key="i"
                    class="flex items-center gap-2"
                  >
                    <input
                      type="checkbox"
                      class="checkbox checkbox-primary checkbox-sm"
                      :checked="lesson.completed"
                      @change="toggleLesson(selected.id, topic.id, i)"
                    />

                    <span class="text-sm" :class="lesson.completed && 'line-through opacity-50'">
                      {{ i + 1 }}
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed, defineComponent } from 'vue'

  /* ================= DATA ================= */

  const disciplines = ref([])
  const selected = ref(null)

  const filters = ref({
    search: '',
    semester: 'Все',
  })

  /* ================= ADD DISCIPLINE ================= */

  function addDiscipline() {
    disciplines.value.push({
      id: Date.now(),
      name: 'Новая дисциплина',
      semester: 1,
      hours: 72,
      topics: [],
      newTopicName: '',
      newTopicLessons: null,
    })
  }

  /* ================= TOPICS ================= */

  function addTopic(d) {
    if (!d.newTopicName || !d.newTopicLessons) return

    d.topics.push({
      id: Date.now(),
      name: d.newTopicName,
      lessons: Array.from({ length: d.newTopicLessons }, () => ({ completed: false, date: null })),
    })

    d.newTopicName = ''
    d.newTopicLessons = null
  }

  /* ================= LESSON ================= */

  function toggleLesson(dId, tId, index) {
    const d = disciplines.value.find(d => d.id === dId)
    const t = d.topics.find(t => t.id === tId)

    const lesson = t.lessons[index]
    lesson.completed = !lesson.completed
    lesson.date = lesson.completed ? new Date().toLocaleDateString() : null
  }

  /* ================= PROGRESS ================= */

  function topicProgress(t) {
    const done = t.lessons.filter(l => l.completed).length
    return Math.round((done / t.lessons.length) * 100)
  }

  function topicDone(t) {
    return t.lessons.every(l => l.completed)
  }

  function disciplineProgress(d) {
    const lessons = d.topics.flatMap(t => t.lessons)
    if (!lessons.length) return 0
    return Math.round((lessons.filter(l => l.completed).length / lessons.length) * 100)
  }

  /* ================= DASHBOARD ================= */

  const totalTopics = computed(() => disciplines.value.reduce((a, d) => a + d.topics.length, 0))

  const totalLessons = computed(() =>
    disciplines.value.reduce((a, d) => a + d.topics.reduce((b, t) => b + t.lessons.length, 0), 0)
  )

  const completedLessons = computed(() =>
    disciplines.value.reduce(
      (a, d) => a + d.topics.reduce((b, t) => b + t.lessons.filter(l => l.completed).length, 0),
      0
    )
  )

  const globalProgress = computed(() => {
    if (!totalLessons.value) return 0
    return Math.round((completedLessons.value / totalLessons.value) * 100)
  })

  /* ================= FILTER ================= */

  const filtered = computed(() => {
    return disciplines.value.filter(d => {
      if (
        filters.value.search &&
        !d.name.toLowerCase().includes(filters.value.search.toLowerCase())
      )
        return false
      if (filters.value.semester !== 'Все' && d.semester !== filters.value.semester) return false
      return true
    })
  })

  /* ================= COMPONENTS ================= */

  const FilterSelect = defineComponent({
    props: ['title', 'modelValue', 'options'],
    emits: ['update:modelValue'],
    template: `
<div class="mb-6">
<p class="text-sm opacity-60 mb-2">{{title}}</p>
<select class="select select-bordered w-full"
:value="modelValue"
@change="$emit('update:modelValue',$event.target.value)">
<option v-for="o in options">{{o}}</option>
</select>
</div>`,
  })

  const Stat = defineComponent({
    props: ['title', 'value'],
    template: `
<div class="bg-base-200 rounded-xl p-3 text-center">
<p class="text-xs opacity-60">{{title}}</p>
<p class="font-semibold text-lg">{{value}}</p>
</div>`,
  })
</script>
