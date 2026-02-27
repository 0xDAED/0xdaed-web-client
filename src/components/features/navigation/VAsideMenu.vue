<template>
  <ul class="menu w-full grow">
    <!-- Avatar -->
    <li class="mt-1">
      <VIconButton tooltip="Кузин Владислав" modifier="circle">
        <img
          class="rounded-full p-1"
          src="https://img.daisyui.com/images/profile/demo/distracted3@192.webp"
        />
      </VIconButton>
    </li>

    <div class="divider my-0" />

    <!-- Main menu -->
    <template v-for="item in topMenu" :key="item.id">
      <li class="mt-1">
        <VIconButton
          :lucideIcon="item.icon"
          :tooltip="item.tooltip"
          :to="item.to"
          modifier="circle"
        />
      </li>

      <div v-if="item.dividerAfter" class="divider my-0" />
    </template>

    <!-- Bottom menu -->
    <template v-for="item in bottomMenu" :key="item.id">
      <li :class="item.id === 'settings' ? 'mt-auto' : 'mt-1'">
        <VIconButton
          :lucideIcon="item.icon"
          :tooltip="item.tooltip"
          :to="item.to"
          modifier="circle"
        />
      </li>
    </template>
  </ul>
</template>
<script setup>
  const topMenu = [
    {
      id: 'dashboard',
      tooltip: 'Дашборды',
      icon: 'LayoutDashboard',
      to: '/dashboard',
    },
    {
      id: 'stats',
      tooltip: 'Статистика',
      icon: 'ChartScatter',
      to: '/dashboard/statistic',
      dividerAfter: true,
    },
    {
      id: 'rooms',
      tooltip: 'Аудитории',
      icon: 'Computer',
      to: '/dashboard/computers',
      dividerAfter: true,
    },
    {
      id: 'students',
      tooltip: 'Студенты',
      icon: 'Users',
      to: '/dashboard/students',
    },
    {
      id: 'subjects',
      tooltip: 'Дисциплины',
      icon: 'Baby',
      to: '/disciplines',
      dividerAfter: true,
    },
    {
      id: 'homework',
      tooltip: 'Домашние работы',
      icon: 'Files',
      to: '/homeWorks',
    },
    {
      id: 'tests',
      tooltip: 'Опросы / Тестирование',
      icon: 'Vote',
      to: '/forms',
      dividerAfter: true,
    },
    {
      id: 's3',
      tooltip: 'S3',
      icon: 'DatabaseZap',
      to: 'services/s3',
    },
  ]

  const bottomMenu = [
    {
      id: 'settings',
      tooltip: 'Настройки',
      icon: 'Settings',
      to: 'services/settings',
    },
    {
      id: 'logout',
      tooltip: 'Выход',
      icon: 'LogOut',
    },
  ]
</script>
