<template>
  <div>
    <h1>{{ greeting }}</h1>
    <img src="../assets/hero.png" class="hero" alt="">

    <div class="grid">
      <div class="card">
        <div class="stat">{{ activeCount }}</div>
        <div class="stat-label">pågående lån</div>
      </div>
      <div class="card">
        <div class="stat">{{ lateCount }}</div>
        <div class="stat-label">försenade</div>
      </div>
      <div class="card">
        <div class="stat">{{ feeTotal }}</div>
        <div class="stat-label">att betala</div>
      </div>
    </div>

    <div class="card">
      <h2>Lån per månad</h2>
      <p v-if="!loans.history">Laddar…</p>
      <LoansChart v-else :months="loans.history.months" :values="loans.history.values" />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useLoansStore } from '../stores/loans'
import { loanStatus } from '../utils/loan'
import { lateFee, formatAmount } from '../utils/fee'
import LoansChart from '../components/LoansChart.vue'

const auth = useAuthStore()
const loans = useLoansStore()

const greeting = computed(() => (auth.name ? `Hej ${auth.name.split(' ')[0]}!` : 'Hej!'))
const active = computed(() => (loans.loans || []).filter((l) => !l.returned))
const activeCount = computed(() => active.value.length)
const lateCount = computed(() => active.value.filter((l) => loanStatus(l) === 'Försenad').length)
const feeTotal = computed(() => formatAmount(active.value.reduce((sum, l) => sum + lateFee(l.due, new Date()), 0)))

onMounted(() => {
  if (!loans.loans) loans.load()
  if (!loans.history) loans.loadHistory()
})
</script>

<style scoped>
.hero { width: 100%; border-radius: 10px; margin-bottom: 18px; }
</style>
