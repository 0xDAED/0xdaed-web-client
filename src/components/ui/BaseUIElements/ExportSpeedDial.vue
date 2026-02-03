<template>
  <v-speed-dial location="left center" transition="slide-y-reverse-transition">
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn
        variant="tonal"
        color="blue-grey-lighten-3"
        icon="mdi-database-export-outline"
        density="comfortable"
        class="me-4"
        v-bind="activatorProps"
        v-tooltip:bottom="'Экспорт данных'"
      ></v-btn>
    </template>

    <v-btn
      variant="tonal"
      color="green-lighten-1"
      icon="mdi-microsoft-excel"
      class="me-2"
      v-tooltip:bottom="'Экспорт в Excel'"
      key="1"
    ></v-btn>
    <v-btn
      variant="tonal"
      color="light-blue-lighten-3"
      icon="mdi-microsoft-word"
      class="me-2"
      v-tooltip:bottom="'Экспорт в Word'"
      key="2"
    ></v-btn>
    <v-btn
      variant="tonal"
      color="cyan-lighten-3"
      icon="mdi-file-delimited-outline"
      class="me-2"
      v-tooltip:bottom="'Экспорт в CSV'"
      key="3"
    ></v-btn>
  </v-speed-dial>
</template>
