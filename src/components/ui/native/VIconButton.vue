<template>
  <div v-if="tooltip" class="tooltip tooltip-right m-0 p-0" :data-tip="tooltip">
    <button :class="buttonClasses" :disabled="disabled" @click="handleClick">
      <component v-if="lucideIcon" :is="lucideIcon" />
      <slot v-else />
    </button>
  </div>

  <button v-else :class="buttonClasses" :disabled="disabled" @click="handleClick">
    <component v-if="lucideIcon" :is="lucideIcon" />
    <slot v-else />
  </button>
</template>

<script setup>
  import { computed } from 'vue'
  import { useRouter } from 'vue-router'

  const router = useRouter()
  const props = defineProps({
    lucideIcon: [String, null],
    disabled: { type: Boolean, default: false },
    tooltip: String,
    to: String,

    // DaisyUI props
    color: { type: String, default: '' }, // primary, secondary, accent, info...
    styleType: { type: String, default: '' }, // outline, dash, soft, ghost, link
    size: { type: String, default: 'md' }, // xs, sm, md, lg, xl
    modifier: { type: String, default: '' }, // wide, block, square, circle
  })

  const buttonClasses = computed(() => {
    let classes = ['btn']

    if (props.color) classes.push(`btn-${props.color}`)
    if (props.styleType) classes.push(`btn-${props.styleType}`)
    if (props.size) classes.push(`btn-${props.size}`)
    if (props.modifier) classes.push(`btn-${props.modifier}`)

    return classes.join(' ')
  })

  function handleClick() {
    if (props.to) {
      router.push(props.to)
    }
  }
</script>
