import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import * as api from '../services/api'

// Vem är inloggad? Token i localStorage avgör – storen är det appen tittar på.
export const useAuthStore = defineStore('auth', () => {
  const token = ref(api.getToken())
  const name = ref(localStorage.getItem('name'))

  const isAuthenticated = computed(() => Boolean(token.value))

  const login = async (email, password) => {
    const data = await api.login(email, password)
    token.value = data.token
    name.value = data.name
  }

  const logout = () => {
    api.logout()
    token.value = null
    name.value = null
  }

  return { name, isAuthenticated, login, logout }
})
