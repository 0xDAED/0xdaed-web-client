<script setup>
  import { computed } from 'vue'
  import '@/assets/styles/computerDashboard.css'

  const props = defineProps({
    progress: {
      type: Object,
      required: true,
      validator: value => {
        return ['value'].every(prop => prop in value)
      },
    },
    active: {
      type: Boolean,
      required: true,
    },
    type: {
      type: String,
    },
  })

  const progressColor = computed(() => {
    if (!props.active) {
      return 'bg-gray-400 border-gray-400'
    }

    const value = props.progress.value || 0
    if (value > 80) {
      return 'bg-red-500 border-red-500'
    } else if (value > 50) {
      return 'bg-yellow-500 border-yellow-500'
    } else {
      return 'bg-green-500 border-green-500'
    }
  })

  const toolTip = computed(() => {
    return !props.type
      ? (props.progress.value || 0) + '%'
      : props.type + ' ' + (props.progress.value || 0) + '%'
  })
</script>

<template>
  <div class="tooltip tooltip-top m-0 ml-3 p-0 sm:ml-0" :data-tip="toolTip">
    <div
      class="radial-progress text-primary-content border-4"
      :class="progressColor"
      style="--size: 3rem"
      :style="'--value:' + (progress.value || 0)"
      aria-valuenow="0"
      role="progressbar"
    >
      <slot name="icon"></slot>
    </div>
  </div>
</template>
