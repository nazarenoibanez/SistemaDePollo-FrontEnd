<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated :class="{ 'fondo-bloqueado': !auth.isAuthenticated }">
      <q-toolbar>
        <q-btn
          v-if="auth.isAuthenticated"
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> Criadero de Pollos </q-toolbar-title>

        <template v-if="auth.isAuthenticated">
          <q-icon name="person" class="q-mr-xs" />
          <span class="q-mr-md">{{ auth.userName }}</span>
          <q-btn flat dense label="Salir" icon="logout" @click="onLogout" />
        </template>
      </q-toolbar>
    </q-header>

    <q-drawer v-if="auth.isAuthenticated" v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Menú Principal </q-item-label>

        <q-item v-for="link in linksList" :key="link.label" clickable v-ripple :to="link.link">
          <q-item-section avatar>
            <q-icon :name="link.icon" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ link.label }}</q-item-label>
            <q-item-label caption>{{ link.caption }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container :class="{ 'fondo-bloqueado': !auth.isAuthenticated }">
      <router-view />
    </q-page-container>

    <LoginModal />
  </q-layout>
</template>

<style scoped>
.fondo-bloqueado {
  filter: blur(4px);
  pointer-events: none;
  user-select: none;
}
</style>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import LoginModal from '@/components/Auth/LoginModal.vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()

async function onLogout() {
  auth.logout()
  await router.push('/')
}

const linksList = [
  { label: 'Galpones', caption: 'Gestión de galpones', icon: 'warehouse', link: '/galpones' },
  { label: 'Pollos', caption: 'Tipos y lotes de pollos', icon: 'pets', link: '/pollos' },
  { label: 'Trabajadores', caption: 'Personal del criadero', icon: 'badge', link: '/trabajadores' },
  { label: 'Retiro de Pollos', caption: 'Salidas y ventas', icon: 'local_shipping', link: '/retiro-de-pollos' },
  { label: 'Mantenimiento', caption: 'Incidencias y reparaciones', icon: 'build', link: '/mantenimiento-y-emergencias' },
  { label: 'Conteo de Pollos', caption: 'Inventario diario', icon: 'calculate', link: '/conteo-de-pollos' },
  { label: 'Control de Peso', caption: 'Seguimiento y crecimiento', icon: 'scale', link: '/control-de-peso' },
]

const leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
