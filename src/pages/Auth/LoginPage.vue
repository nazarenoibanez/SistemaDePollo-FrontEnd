<template>
  <q-page class="row items-center justify-center bg-grey-1">
    <q-card class="q-pa-lg" style="width: min(420px, 90vw)">
      <q-card-section class="text-center">
        <div class="text-h5">Iniciar sesión</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="submitLogin">
          <q-input v-model="email" label="Email" type="email" outlined class="q-mb-md" />
          <q-input v-model="password" label="Contraseña" type="password" outlined class="q-mb-md" />

          <q-banner v-if="auth.error" class="bg-red-1 text-negative q-mb-md">
            {{ auth.error }}
          </q-banner>

          <q-btn
            type="submit"
            color="primary"
            label="Ingresar"
            class="full-width"
            :loading="auth.loading"
          />
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()
const email = ref('')
const password = ref('')

async function submitLogin() {
  const ok = await auth.login({ email: email.value, password: password.value })
  if (ok) {
    const destino = typeof route.query.redirect === 'string' ? route.query.redirect : '/galpones'
    await router.push(destino)
  }
}
</script>
