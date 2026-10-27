<template>
  <q-page class="flex flex-center">
    <div class="column items-center">
      <div class="text-h5 q-mb-md">Sistema de Criadero de Pollos</div>
      <q-btn v-if="auth.isAuthenticated" color="primary" to="/galpones" label="Ir a Galpones" no-caps />
      <q-btn v-else color="primary" to="/login" label="Iniciar sesión" no-caps />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
</script>
