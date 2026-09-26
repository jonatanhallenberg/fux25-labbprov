<template>
  <div>
    <h1>Reservera en bok</h1>
    <form class="card" novalidate @submit.prevent="submit">
      <label for="title" class="hint">Titel</label>
      <input id="title" v-model="title" placeholder="T.ex. Gösta Berlings saga">
      <p v-if="error" role="alert" class="error">{{ error }}</p>
      <p v-if="done" role="status">Reservationen är mottagen. Du får ett meddelande när boken finns att hämta.</p>
      <button class="btn" type="submit" :disabled="busy">{{ busy ? 'Skickar…' : 'Reservera' }}</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { reserve } from '../services/api'

const title = ref('')
const error = ref(null)
const done = ref(false)
const busy = ref(false)

const submit = async () => {
  error.value = null
  done.value = false
  if (!title.value.trim()) {
    error.value = 'Skriv in en titel.'
    return
  }
  busy.value = true
  try {
    await reserve(title.value.trim())
    done.value = true
    title.value = ''
  } catch (e) {
    error.value = 'Reservationen gick inte att skicka. Försök igen.'
  } finally {
    busy.value = false
  }
}
</script>
