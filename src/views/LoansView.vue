<template>
  <div>
    <h1>Mina lån</h1>
    <div class="card">
      <label for="search" class="hint">Sök titel eller författare</label>
      <input id="search" type="search" @input="onSearch" placeholder="T.ex. Lagerlöf">
      <p v-if="loans.loading">Laddar…</p>
      <p v-else-if="loans.error" role="alert" class="error">{{ loans.error }}</p>
      <table v-else-if="loans.loans">
        <thead>
          <tr><th>Titel</th><th>Författare</th><th>Åter senast</th><th>Status</th><th>Avgift</th></tr>
        </thead>
        <tbody>
          <tr v-for="loan in filtered" :key="loan.id">
            <td>{{ loan.title }}</td>
            <td>{{ loan.author }}</td>
            <td>{{ formatDate(loan.due) }}</td>
            <td><StatusChip :loan="loan" /></td>
            <td>{{ loan.returned ? '–' : formatAmount(lateFee(loan.due, today)) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useLoansStore } from '../stores/loans'
import { formatDate } from '../utils/date'
import { lateFee, formatAmount } from '../utils/fee'
import _ from 'lodash'
import StatusChip from '../components/StatusChip.vue'

const loans = useLoansStore()
const query = ref('')
const today = new Date()

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  return (loans.loans || []).filter((l) => !q || `${l.title} ${l.author}`.toLowerCase().includes(q))
})

const onSearch = _.debounce((event) => {
  query.value = event.target.value
}, 250)

onMounted(() => {
  if (!loans.loans) loans.load()
})
</script>
