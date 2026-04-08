<template>
  <label class="field">
    <span class="field__label">{{ label }}</span>
    <input
      :value="modelValue"
      class="input"
      :type="type"
      :placeholder="placeholder"
      :min="min"
      :step="step"
      @input="$emit('update:modelValue', type === 'number' ? normalizeNumber($event.target.value) : $event.target.value)"
    />
  </label>
</template>

<script setup>
defineEmits(['update:modelValue'])

defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  label: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'text'
  },
  placeholder: {
    type: String,
    default: ''
  },
  min: {
    type: [String, Number],
    default: undefined
  },
  step: {
    type: [String, Number],
    default: undefined
  }
})

const normalizeNumber = (value) => (value === '' ? '' : Number(value))
</script>
