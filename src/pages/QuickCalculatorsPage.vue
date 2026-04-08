<template>
  <div class="calculators-page">
    <header class="calculators-nav">
      <RouterLink class="brand" to="/">
        <span class="brand__badge">K</span>
        <span>
          <strong>Kevex Build Tools</strong>
          <small>Quick calculators</small>
        </span>
      </RouterLink>

      <nav class="calculators-nav__actions">
        <RouterLink class="nav-link" to="/">Home</RouterLink>
        <RouterLink class="nav-link" to="/login">Login</RouterLink>
        <RouterLink class="btn btn--primary" to="/register">Register</RouterLink>
      </nav>
    </header>

    <main class="calculator-section">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Quick calculators</p>
          <h1>Run simple planning numbers before you create an account</h1>
          <p>
            Guests can run one free basic calculator every 12 hours. Registering unlocks unlimited use and
            saved job-ready workflows.
          </p>
        </div>

        <div class="limit-card card">
          <strong>{{ limitState.canUse ? 'Free use available' : 'Free use consumed' }}</strong>
          <p>
            {{
              limitState.canUse
                ? 'Pick any calculator below and run one quick estimate.'
                : `Next free guest use ${formatNextAvailable(limitState.nextAvailableAt)}.`
            }}
          </p>
        </div>
      </div>

      <div class="calculator-grid">
        <button
          v-for="calculator in quickCalculators"
          :key="calculator.id"
          class="calculator-picker card"
          :class="{ active: calculator.id === selectedCalculatorId }"
          type="button"
          @click="selectCalculator(calculator.id)"
        >
          <strong>{{ calculator.name }}</strong>
          <p>{{ calculator.summary }}</p>
        </button>
      </div>

      <div class="calculator-workspace">
        <section class="calculator-form card">
          <div class="page-header">
            <h2>{{ activeCalculator.name }}</h2>
            <p>{{ activeCalculator.summary }}</p>
          </div>

          <form class="form-grid" @submit.prevent="runCalculator">
            <div class="two-col-grid">
              <BaseInput
                v-for="field in activeCalculator.fields"
                :key="field.key"
                v-model="calculatorValues[field.key]"
                :label="field.label"
                :type="field.type"
                :min="field.min"
                :step="field.step"
              />
            </div>

            <p v-if="limitMessage" class="error-text">{{ limitMessage }}</p>

            <div class="actions-row">
              <BaseButton type="submit" :disabled="!limitState.canUse">Run Free Calculator</BaseButton>
              <RouterLink class="btn btn--outline" to="/register">Unlock Unlimited Access</RouterLink>
            </div>
          </form>
        </section>

        <section class="calculator-result card">
          <div class="page-header">
            <h2>Quick result</h2>
            <p>Fast guidance for early-stage planning before you commit to a full account.</p>
          </div>

          <template v-if="calculatorResult.length">
            <div v-for="item in calculatorResult" :key="item.label" class="summary-row">
              <span>{{ item.label }}</span>
              <strong>{{ item.money ? formatCurrency(item.value) : item.value }}</strong>
            </div>
          </template>

          <p v-else class="empty-state">Run a calculator to see the result here.</p>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseInput from '@/components/BaseInput.vue'
import quickCalculators from '@/config/quickCalculators'
import { useCurrency } from '@/composables/useCurrency'
import { useGuestCalculatorLimit } from '@/composables/useGuestCalculatorLimit'

const { formatCurrency } = useCurrency()
const { getLimitState, consumeUse } = useGuestCalculatorLimit()

const selectedCalculatorId = ref(quickCalculators[0].id)
const calculatorValues = reactive({})
const calculatorResult = ref([])
const limitState = ref(getLimitState())
const limitMessage = ref('')

const activeCalculator = computed(
  () => quickCalculators.find((calculator) => calculator.id === selectedCalculatorId.value) ?? quickCalculators[0]
)

const resetValues = (calculator) => {
  Object.keys(calculatorValues).forEach((key) => {
    delete calculatorValues[key]
  })

  calculator.fields.forEach((field) => {
    calculatorValues[field.key] = calculator.initialValues?.[field.key] ?? ''
  })
}

const selectCalculator = (calculatorId) => {
  selectedCalculatorId.value = calculatorId
  calculatorResult.value = []
  limitMessage.value = ''
  resetValues(activeCalculator.value)
}

const refreshLimitState = () => {
  limitState.value = getLimitState()
}

const runCalculator = () => {
  refreshLimitState()

  if (!limitState.value.canUse) {
    limitMessage.value = `Guest access renews ${formatNextAvailable(limitState.value.nextAvailableAt)}.`
    return
  }

  calculatorResult.value = activeCalculator.value.calculate(calculatorValues)
  consumeUse(activeCalculator.value.id)
  refreshLimitState()
  limitMessage.value = ''
}

const formatNextAvailable = (timestamp) => {
  if (!timestamp) {
    return 'soon'
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(timestamp))
}

resetValues(activeCalculator.value)
</script>

<style scoped lang="scss">
.calculators-page {
  min-height: 100vh;
  padding: 1.25rem;
  background:
    radial-gradient(circle at top left, rgba(21, 94, 117, 0.18), transparent 30%),
    radial-gradient(circle at right center, rgba(245, 158, 11, 0.14), transparent 24%),
    linear-gradient(180deg, #fbfcf6 0%, #eef6f7 46%, #f9fafb 100%);
}

.calculators-nav,
.calculator-section {
  width: min(1180px, 100%);
  margin: 0 auto;
}

.calculators-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 0 1.5rem;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 0.85rem;
  text-decoration: none;
  color: var(--ink);
}

.brand small {
  display: block;
  margin-top: 0.18rem;
  color: var(--muted);
}

.brand__badge {
  width: 3rem;
  height: 3rem;
  border-radius: 1rem;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #1f6f78, #f59e0b);
  color: white;
  font-weight: 800;
  font-size: 1.15rem;
}

.calculators-nav__actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.nav-link {
  color: var(--ink);
  text-decoration: none;
  font-weight: 600;
}

.calculator-section {
  padding-bottom: 2rem;
}

.eyebrow {
  margin: 0 0 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-size: 0.74rem;
  font-weight: 800;
  color: #1f6f78;
}

.section-heading {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 1rem;
  margin-bottom: 1rem;
}

.section-heading h1 {
  margin: 0;
  font-size: clamp(2.2rem, 4.5vw, 4rem);
  line-height: 0.98;
  max-width: 12ch;
}

.section-heading p {
  color: var(--muted);
}

.limit-card,
.calculator-form,
.calculator-result {
  padding: 1.35rem;
}

.limit-card {
  width: min(100%, 360px);
  background: rgba(255, 255, 255, 0.72);
}

.calculator-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

.calculator-picker {
  text-align: left;
  background: rgba(255, 255, 255, 0.72);
  cursor: pointer;
  border: 1px solid var(--line);
  padding: 1.1rem;
  transition: transform 0.16s ease, border-color 0.16s ease;
}

.calculator-picker p {
  color: var(--muted);
}

.calculator-picker.active,
.calculator-picker:hover {
  transform: translateY(-2px);
  border-color: rgba(31, 111, 120, 0.45);
}

.calculator-workspace {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(300px, 0.8fr);
  gap: 1rem;
  margin-top: 1rem;
}

.calculator-result {
  background: rgba(255, 255, 255, 0.78);
}

@media (max-width: 960px) {
  .section-heading,
  .calculators-nav {
    flex-direction: column;
    align-items: flex-start;
  }

  .calculator-grid,
  .calculator-workspace {
    grid-template-columns: 1fr;
  }
}
</style>
