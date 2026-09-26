<template>
  <span :class="['status-chip', modifier]" role="status">{{ label }}</span>
</template>

<script setup>
import { computed } from 'vue'
import { loanStatus } from '../utils/loan'

const props = defineProps({
  loan: { type: Object, required: true }
})

const label = computed(() => loanStatus(props.loan))
const modifier = computed(() => ({ Pågår: 'status-pagar', Försenad: 'status-forsenad', Återlämnad: 'status-aterlamnad' })[label.value])
</script>
