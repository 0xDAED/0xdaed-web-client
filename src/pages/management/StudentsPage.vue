<template>
  <v-container fluid>
    <!-- Header -->
    <v-row>
      <v-col cols="12" md="4">
        <HeaderTitle title="Студенты" subTitle="Аналитика обучения студентов" icon="student" />
      </v-col>

      <v-col cols="12" md="8">
        <v-row justify="end" align="center">
          <!-- Экспорт -->
          <ExportSpeedDial />

          <!-- Филиалы, группы -->
          <v-select
            v-for="(s, i) in selects"
            :key="i"
            :items="s.items"
            :style="{ maxWidth: s.maxWidth, height: '40px' }"
            :placeholder="s.placeholder"
            density="compact"
            variant="solo-filled"
            class="me-2"
            chips
            clearable
          />
        </v-row>
      </v-col>
    </v-row>
  </v-container>

  <!-- KPI -->
  <v-container fluid>
    <v-row>
      <v-col v-for="metric in metrics" :key="metric.title" cols="12" sm="4">
        <KPICard
          :title="metric.title"
          :currentValue="metric.current"
          :dynamicValues="metric.values"
          :delta="metric.delta"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
  import KPICard from '@/components/ui/BaseUIElements/KPICard.vue';
  import HeaderTitle from '@/components/ui/BaseUIElements/HeaderTitle.vue';
  import ExportSpeedDial from '@/components/ui/BaseUIElements/ExportSpeedDial.vue';

  const metrics = [
    {
      title: 'Средний балл',
      current: 4.2,
      delta: -87,
      values: [3.6, 2.1, 1.0, 0.4, 1.15, 0.2],
    },
    {
      title: 'Посещаемость, %',
      current: 87,
      delta: 87,
      values: [72, 75, 78, 82, 85, 87],
    },
    {
      title: 'Активность студентов',
      current: 96,
      delta: 12,
      values: [70, 78, 82, 88, 92, 96],
    },
  ];

  const selects = [
    {
      items: ['Новочеркасск - Академия', 'Новочеркасск', 'Химки'],
      placeholder: 'Филиалы',
      maxWidth: '200px',
    },
    {
      items: ['9/1 РПО-25/1', '9/2 РПО-24/2', '9/1 КГиД-25/1'],
      placeholder: 'Группы',
      maxWidth: '200px',
    },
  ];
</script>
