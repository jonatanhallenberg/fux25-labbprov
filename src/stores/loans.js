import { ref } from 'vue'
import { defineStore } from 'pinia'
import * as api from '../services/api'

export const useLoansStore = defineStore('loans', () => {
  const loans = ref(null)
  const history = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const load = async () => {
    loading.value = true
    error.value = null
    try {
      loans.value = await api.fetchLoans()
    } catch (e) {
      error.value = 'Kunde inte hämta dina lån just nu.'
    } finally {
      loading.value = false
    }
  }

  const loadHistory = async () => {
    try {
      history.value = await api.fetchHistory()
    } catch (e) {
      history.value = null
    }
  }

  return { loans, history, loading, error, load, loadHistory }
})
