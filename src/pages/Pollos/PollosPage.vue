<template>
  <q-page padding>
    <q-card class="q-pa-md">
      <div class="row items-center q-gutter-sm">
        <div class="text-h6">Gestión de Pollos</div>
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
          <q-tooltip>Nuevo Pollo</q-tooltip>
        </q-btn>
        <q-btn flat round icon="refresh" :loading="polloStore.loading" @click="recargar">
          <q-tooltip>Actualizar</q-tooltip>
        </q-btn>
      </div>

      <q-card-section>
        <q-table
          :rows="polloStore.pollos"
          :columns="columns"
          row-key="id"
          :filter="filtro"
          :loading="polloStore.loading"
          no-data-label="No hay pollos registrados"
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
      <PolloCreate :edit-id="editId" @close="cerrarFormulario" />
    </q-dialog>

    <q-dialog v-model="confirmandoBaja">
      <q-card>
        <q-card-section class="row items-center">
          <q-icon name="warning" color="warning" size="sm" class="q-mr-sm" />
          <span class="text-h6">Confirmar Eliminación</span>
        </q-card-section>
        <q-card-section>¿Estás seguro de que deseas eliminar este pollo?</q-card-section>
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
import { usePolloStore } from '@/stores/Pollos'
import type { PollosResponseDto } from '@/models/Pollos/PollosResponseDto'
import PolloCreate from '@/components/Pollos/PolloCreate.vue'

const polloStore = usePolloStore()
const filtro = ref('')
const mostrarFormulario = ref(false)
const editId = ref<number | null>(null)
const confirmandoBaja = ref(false)
const idABorrar = ref<number | null>(null)

const columns: QTableColumn<PollosResponseDto>[] = [
  { name: 'id', label: 'ID', field: 'id', align: 'left', sortable: true },
  { name: 'nombre', label: 'Nombre', field: 'nombre', align: 'left', sortable: true },
  { name: 'tipoPollo', label: 'Tipo de Pollo', field: 'tipoPollo', align: 'left', sortable: true },
  {
    name: 'tipoAlimento',
    label: 'Tipo de Alimento',
    field: 'tipoAlimento',
    align: 'left',
    sortable: true,
  },
  { name: 'acciones', label: 'Acciones', field: 'id', align: 'right' },
]

function recargar() {
  void polloStore.fetchAll()
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
    await polloStore.borrar(idABorrar.value)
  }
  confirmandoBaja.value = false
  recargar()
}

onMounted(() => {
  recargar()
})
</script>
