<template>
  <div class="container mx-auto space-y-10 px-4 py-6">
    <!-- ===== DASHBOARD ===== -->
    <section class="grid grid-cols-1 gap-4 md:grid-cols-4">
      <div class="stat bg-base-200 rounded-xl shadow-sm">
        <div class="stat-title">Всего студентов</div>
        <div class="stat-value">128</div>
        <div class="stat-desc text-success">+6 за месяц</div>
      </div>

      <div class="stat bg-base-200 rounded-xl shadow-sm">
        <div class="stat-title">Средняя успеваемость</div>
        <div class="stat-value">82%</div>
        <div class="stat-desc">📈 стабильный рост</div>
      </div>

      <div class="stat bg-base-200 rounded-xl shadow-sm">
        <div class="stat-title">Посещаемость</div>
        <div class="stat-value">91%</div>
        <div class="stat-desc text-warning">−3% за неделю</div>
      </div>

      <div class="stat bg-base-200 rounded-xl shadow-sm">
        <div class="stat-title">Активные</div>
        <div class="stat-value text-primary">103</div>
        <div class="stat-desc">онлайн сегодня</div>
      </div>
    </section>

    <!-- ===== CHARTS ===== -->
    <section class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div class="card bg-base-200 shadow-sm">
        <div class="card-body">
          <h2 class="card-title">Успеваемость по группам</h2>
          <div class="text-base-content/50 flex h-48 items-center justify-center">
            📊 Chart.js / ECharts placeholder
          </div>
        </div>
      </div>

      <div class="card bg-base-200 shadow-sm">
        <div class="card-body">
          <h2 class="card-title">Посещаемость по дням</h2>
          <div class="text-base-content/50 flex h-48 items-center justify-center">
            📈 Chart placeholder
          </div>
        </div>
      </div>
    </section>

    <!-- ===== CONTROLS ===== -->
    <section class="flex flex-col items-start gap-4 md:flex-row md:items-center">
      <input
        type="text"
        placeholder="Поиск студента..."
        class="input input-bordered w-full md:max-w-xs"
      />

      <select class="select select-bordered">
        <option>Все группы</option>
        <option>9/1-РПО-25</option>
        <option>9/2-РПО-24</option>
      </select>

      <select class="select select-bordered">
        <option>Все статусы</option>
        <option>Активен</option>
        <option>На паузе</option>
        <option>Отчислен</option>
      </select>

      <button class="btn btn-primary ml-auto">+ Добавить студента</button>
    </section>

    <!-- ===== STUDENT CARDS ===== -->
    <section class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <div
        v-for="student in students"
        :key="student.id"
        class="card bg-base-200 shadow-sm transition hover:shadow-md"
      >
        <div class="card-body items-center text-center">
          <div class="avatar">
            <div class="ring-primary w-20 rounded-full ring ring-offset-2">
              <img :src="student.avatar" />
            </div>
          </div>

          <h3 class="mt-2 font-semibold">{{ student.name }}</h3>
          <p class="text-sm opacity-70">{{ student.group }}</p>

          <progress
            class="progress progress-primary mt-2 w-full"
            :value="student.progress"
            max="100"
          />

          <span
            class="badge mt-2"
            :class="{
              'badge-success': student.status === 'Активен',
              'badge-warning': student.status === 'Пауза',
              'badge-error': student.status === 'Отчислен',
            }"
          >
            {{ student.status }}
          </span>

          <div class="card-actions mt-4">
            <button class="btn btn-sm btn-outline">Профиль</button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
