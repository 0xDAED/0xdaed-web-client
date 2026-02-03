<template>
  <div class="d-flex align-center">
    <img :src="iconPath" alt="icon" class="me-4" />
    <div>
      <div class="text-h6">{{ title }}</div>
      <div class="text-body-2 text-grey-lighten-1">{{ subTitle }}</div>
    </div>
  </div>
</template>

<script setup>
  import { computed } from 'vue';

  const props = defineProps({
    title: { type: String, required: true },
    subTitle: { type: String, required: true },
    icon: { type: String, required: true },
  });

  const icons = import.meta.glob('@/assets/icons/*.png', {
    eager: true,
    query: '?url',
    import: 'default',
  });

  const iconPath = computed(() => {
    const fileName = `${props.icon}_32px.png`;
    const match = Object.entries(icons).find(([path]) => path.endsWith(fileName));
    return match ? match[1] : '';
  });
</script>
