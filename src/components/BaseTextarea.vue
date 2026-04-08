<template>
  <label class="field">
    <span class="field__label">{{ label }}</span>
    <textarea
      :value="modelValue"
      class="textarea"
      :rows="rows"
      :placeholder="placeholder"
      @input="$emit('update:modelValue', $event.target.value)"
    />
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
  placeholder: {
    type: String,
    default: ''
  },
  rows: {
    type: Number,
    default: 4
  }
})
</script>
