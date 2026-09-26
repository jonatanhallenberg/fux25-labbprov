<template>
  <div>
    <header class="topbar" v-if="$route.path !== '/login'">
      <div class="topbar-inner container">
        <span class="brand">Lånekortet</span>
        <nav>
          <RouterLink to="/">Översikt</RouterLink>
          <RouterLink to="/lan">Mina lån</RouterLink>
          <RouterLink to="/reservera">Reservera</RouterLink>
          <RouterLink to="/meddelanden">Meddelanden</RouterLink>
          <span class="logout" @click="logout">Logga ut</span>
        </nav>
      </div>
    </header>
    <main class="container">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'

const router = useRouter()
const auth = useAuthStore()

const logout = () => {
  auth.logout()
  router.push('/login')
}
</script>

<style>
.topbar { background: #1f3a2e; }
.topbar-inner { display: flex; align-items: center; justify-content: space-between; padding-top: 14px; padding-bottom: 14px; }
.brand { color: #fff; font-weight: 700; font-size: 18px; letter-spacing: 0.02em; }
.topbar nav a, .logout {
  color: #cfe3d8;
  text-decoration: none;
  margin-left: 22px;
  font-size: 14.5px;
  cursor: pointer;
}
.topbar nav a.router-link-active { color: #fff; font-weight: 600; }
</style>
