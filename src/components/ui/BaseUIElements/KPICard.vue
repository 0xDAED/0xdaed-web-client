<template>
  <v-sheet class="pa-4 rounded" elevation="6">
    <div class="text-caption text-grey-lighten-1">
      {{ title }}
    </div>

    <div class="text-h4 font-weight-bold mb-1">
      {{ currentValue }}
    </div>

    <v-sparkline
      :model-value="dynamicValues"
      :line-width="2"
      :smooth="10"
      :gradient="['#1feaea', '#ffd200', '#f72047']"
      auto-draw
      class="mt-2"
    />

    <div class="text-body-2" :class="delta > 0 ? 'text-success' : 'text-error'">
      {{ delta > 0 ? '+' : '' }}{{ delta }}%
    </div>
  </v-sheet>
</template>

<script setup>
  defineProps({
    title: {
      type: String,
      required: true,
    },
    currentValue: {
      type: Number,
      required: true,
    },
    dynamicValues: {
      type: Array,
      required: true,
    },
    delta: {
      type: Number,
      required: true,
    },
  });
</script>
