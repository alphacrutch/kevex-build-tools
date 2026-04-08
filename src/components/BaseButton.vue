<template>
  <button
    class="btn"
    :class="[`btn--${variant}`, { 'btn--full': fullWidth }]"
    :type="type"
    :disabled="disabled || loading"
  >
    <span v-if="loading">Working...</span>
    <span v-else><slot /></span>
  </button>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    default: 'button'
  },
  variant: {
    type: String,
    default: 'primary'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  fullWidth: {
    type: Boolean,
    default: false
  }
})
</script>
