<template>
  <q-card style="min-width: 450px">
    <q-card-section>
      <div class="text-h6">
        {{ editId ? 'Editar Mantenimiento/Emergencia' : 'Nuevo Mantenimiento/Emergencia' }}
      </div>
    </q-card-section>
    <q-separator />

    <q-card-section>
      <q-form ref="formRef" greedy @submit.prevent="onSubmit">
        <q-input
          v-model.number="form.galponesID"
          label="ID Galpón"
          type="number"
          outlined
          class="q-mb-sm"
          lazy-rules
          :rules="[(v: number) => v > 0 || 'Ingresa un ID de galpón válido']"
        />
        <q-input
          v-model="form.descripcion"
          label="Descripción"
          type="textarea"
          outlined
          rows="3"
          class="q-mb-sm"
          lazy-rules
          :rules="[(v: string) => (!!v && v.trim().length > 0) || 'Ingresa una descripción']"
        />
        <q-input
          v-model.number="form.costo"
          label="Costo ($)"
          type="number"
          step="0.01"
          outlined
          class="q-mb-sm"
          lazy-rules
          :rules="[(v: number) => v >= 0 || 'Debe ser mayor o igual a 0']"
        />
        <q-input
          v-model="form.fechaRepote"
          label="Fecha de Reporte"
          type="date"
          outlined
          class="q-mb-sm"
          stack-label
          lazy-rules
          :rules="[(v: string) => !!v || 'Ingresa la fecha de reporte']"
        />
        <q-input
          v-model="form.fechaResolucion"
          label="Fecha de Resolución (opcional)"
          type="date"
          outlined
          clearable
          class="q-mb-sm"
          stack-label
        />
        <q-select
          v-model="form.estado"
          :options="estados"
          label="Estado"
          outlined
          class="q-mb-sm"
        />
      </q-form>
    </q-card-section>

    <q-card-actions align="right">
      <q-btn label="Cancelar" flat v-close-popup />
      <q-btn
        :label="editId ? 'Guardar' : 'Crear'"
        color="primary"
        :loading="mantenimientoStore.loading"
        @click="onSubmit"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { QForm } from 'quasar'
import { useMantenimientoYEmergenciasStore } from '@/stores/MantenimientoYEmergencia'
import type { MantenimientoYEmergenciasRequestDto } from '@/models/MantenimientoYEmergencia/MantenimientoYEmergenciasRequestDto'

const props = defineProps<{ editId: number | null }>()
const emit = defineEmits(['close'])

const mantenimientoStore = useMantenimientoYEmergenciasStore()
const formRef = ref<QForm | null>(null)

const estados = ['Pendiente', 'En proceso', 'Resuelto']

const form = ref<MantenimientoYEmergenciasRequestDto>({
  galponesID: 0,
  descripcion: '',
  costo: 0,
  fechaRepote: new Date().toISOString().split('T')[0]!,
  fechaResolucion: null,
  estado: 'Pendiente',
})

function soloFecha(v: string | null): string | null {
  if (!v || v.startsWith('0001')) return null
  return v.split('T')[0] ?? null
}

onMounted(async () => {
  if (props.editId) {
    const m = await mantenimientoStore.fetchById(props.editId)
    if (m) {
      form.value = {
        galponesID: m.galponesID,
        descripcion: m.descripcion,
        costo: m.costo,
        fechaRepote: soloFecha(m.fechaRepote) ?? '',
        fechaResolucion: soloFecha(m.fechaResolucion),
        estado: m.estado || 'Pendiente',
      }
    }
  }
})

async function onSubmit() {
  const valido = await formRef.value?.validate()
  if (!valido) return

  if (props.editId) {
    await mantenimientoStore.update(props.editId, {
      ...form.value,
      fechaResolucion: form.value.fechaResolucion || null,
    })
  } else {
    await mantenimientoStore.create({
      ...form.value,
      fechaResolucion: form.value.fechaResolucion || null,
    })
  }
  emit('close')
}
</script>
