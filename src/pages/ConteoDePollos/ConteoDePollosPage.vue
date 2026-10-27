<template>
  <q-page padding>
    <q-card class="q-pa-md">
      <div class="row items-center q-gutter-sm">
        <div class="text-h6">Gestión de Conteo de Pollos</div>
        <q-space />
        <q-input
          v-model="filtro"
          dense
          outlined
          placeholder="Buscar"
          debounce="300"
          style="width: 220px"
        >
          <template #append>
            <q-icon v-if="filtro === ''" name="search" />
            <q-icon v-else name="close" class="cursor-pointer" @click="filtro = ''" />
          </template>
        </q-input>
        <q-btn round unelevated color="primary" icon="add" @click="abrirAlta">
          <q-tooltip>Nuevo Conteo</q-tooltip>
        </q-btn>
        <q-btn flat round icon="refresh" :loading="conteoStore.loading" @click="recargar">
          <q-tooltip>Actualizar</q-tooltip>
        </q-btn>
      </div>

      <q-card-section>
        <q-table
          :rows="conteoStore.conteos"
          :columns="columns"
          row-key="id"
          :filter="filtro"
          :loading="conteoStore.loading"
          no-data-label="No hay conteos registrados"
        >
          <template #body-cell-acciones="props">
            <q-td class="text-right">
              <q-btn dense flat color="primary" icon="edit" @click="abrirEdicion(props.row.id)">
                <q-tooltip>Editar</q-tooltip>
              </q-btn>
              <q-btn dense flat color="negative" icon="delete" @click="confirmarBaja(props.row.id)">
                <q-tooltip>Eliminar</q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <q-dialog v-model="mostrarFormulario">
      <ConteoDePollosCreate :edit-id="editId" @close="cerrarFormulario" />
    </q-dialog>

    <q-dialog v-model="confirmandoBaja">
      <q-card>
        <q-card-section class="row items-center">
          <q-icon name="warning" color="warning" size="sm" class="q-mr-sm" />
          <span class="text-h6">Confirmar Eliminación</span>
        </q-card-section>
        <q-card-section
          >¿Estás seguro de que deseas eliminar este registro de conteo?</q-card-section
        >
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" v-close-popup />
          <q-btn flat label="Eliminar" color="negative" @click="eliminar" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { QTableColumn } from 'quasar'
import { useConteoDePollosStore } from '@/stores/ConteoDePollos'
import type { ConteoDePollosResponseDto } from '@/models/ConteoDePollos/ConteoDePollosResponseDto'
import ConteoDePollosCreate from '@/components/ConteoDePollos/ConteoDePollosCreate.vue'

const conteoStore = useConteoDePollosStore()
const filtro = ref('')
const mostrarFormulario = ref(false)
const editId = ref<number | null>(null)
const confirmandoBaja = ref(false)
const idABorrar = ref<number | null>(null)

const columns: QTableColumn<ConteoDePollosResponseDto>[] = [
  { name: 'id', label: 'ID', field: 'id', align: 'left', sortable: true },
  { name: 'galponId', label: 'ID Galpón', field: 'galponId', align: 'center', sortable: true },
  { name: 'polloId', label: 'ID Pollo', field: 'polloId', align: 'center', sortable: true },
  {
    name: 'cantidadActual',
    label: 'Cantidad Actual',
    field: 'cantidadActual',
    align: 'center',
    sortable: true,
  },
  {
    name: 'mortalidadDiaria',
    label: 'Mortalidad Diaria',
    field: 'mortalidadDiaria',
    align: 'center',
    sortable: true,
  },
  {
    name: 'fechaConteo',
    label: 'Fecha Conteo',
    field: 'fechaConteo',
    align: 'left',
    sortable: true,
  },
  { name: 'acciones', label: 'Acciones', field: 'id', align: 'right' },
]

function recargar() {
  void conteoStore.fetchAll()
}
function abrirAlta() {
  editId.value = null
  mostrarFormulario.value = true
}
function abrirEdicion(id: number) {
  editId.value = id
  mostrarFormulario.value = true
}
function cerrarFormulario() {
  mostrarFormulario.value = false
  recargar()
}
function confirmarBaja(id: number) {
  idABorrar.value = id
  confirmandoBaja.value = true
}

async function eliminar() {
  if (idABorrar.value !== null) {
    await conteoStore.borrar(idABorrar.value)
  }
  confirmandoBaja.value = false
  recargar()
}

onMounted(() => {
  recargar()
})
</script>
