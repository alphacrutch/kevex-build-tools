<template>
  <label class="field">
    <span class="field__label">{{ label }}</span>
    <select :value="modelValue" class="select" @change="$emit('update:modelValue', $event.target.value)">
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
  </label>
</template>

<script setup>
defineEmits(['update:modelValue'])

defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    required: true
  },
  options: {
    type: Array,
    default: () => []
  }
})
</script>
