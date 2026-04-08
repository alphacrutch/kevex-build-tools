<template>
  <article class="card stat-card">
    <p>{{ label }}</p>
    <h3>{{ value }}</h3>
  </article>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  }
})
</script>

<style scoped lang="scss">
.stat-card p {
  margin: 0 0 0.5rem;
  color: var(--muted);
  font-size: 0.95rem;
}

.stat-card h3 {
  margin: 0;
  font-size: 2rem;
}
</style>
