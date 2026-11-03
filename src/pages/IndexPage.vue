<template>
  <q-page class="flex flex-center">
    <q-card class="q-pa-md text-center" style="width: 420px; max-width: 90vw">
      <q-card-section>
        <q-icon name="egg" size="64px" color="primary" />
        <div class="text-h5 q-mt-sm">Criadero de Pollos</div>
      </q-card-section>

      <!-- Con sesión: saludo y acceso a la grilla. Sin sesión: invitación a ingresar -->
      <q-card-section v-if="auth.isAuthenticated">
        <div class="text-subtitle1">Hola, {{ auth.userName }}</div>
        <q-btn label="Ver galpones" icon="warehouse" color="primary" class="q-mt-md" to="/galpones" />
      </q-card-section>

      <q-card-section v-else>
        <div class="text-subtitle1">Inicia sesión para administrar el criadero</div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
</script>
