<template>
  <canvas ref="canvas" aria-label="Lån per månad" role="img"></canvas>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import Chart from 'chart.js/auto'

const props = defineProps({
  months: { type: Array, required: true },
  values: { type: Array, required: true }
})

const canvas = ref(null)
let chart

onMounted(() => {
  chart = new Chart(canvas.value, {
    type: 'bar',
    data: {
      labels: props.months,
      datasets: [{ label: 'Lån', data: props.values, backgroundColor: '#2e7d5b' }]
    },
    options: { responsive: true, plugins: { legend: { display: false } } }
  })
})

onBeforeUnmount(() => chart?.destroy())
</script>
