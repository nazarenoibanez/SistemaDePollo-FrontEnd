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
          v-model.number="form.galponId"
          label="ID Galpón"
          type="number"
          outlined
          class="q-mb-sm"
          lazy-rules
          :rules="[(v: number) => v > 0 || 'Ingresa un ID de galpón válido']"
        />
        <q-input
          v-model.number="form.trabajadorId"
          label="ID Trabajador"
          type="number"
          outlined
          class="q-mb-sm"
          lazy-rules
          :rules="[(v: number) => v > 0 || 'Ingresa un ID de trabajador válido']"
        />
        <q-input
          v-model.number="form.tipoRegistro"
          label="Tipo de Registro (Número/Enum)"
          type="number"
          outlined
          class="q-mb-sm"
          lazy-rules
          :rules="[(v: number) => v >= 0 || 'Ingresa un tipo válido']"
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
          v-model="form.fechaRegistro"
          label="Fecha de Registro"
          type="date"
          outlined
          class="q-mb-sm"
          stack-label
        />
        <q-toggle v-model="form.resuelto" label="¿Está Resuelto?" class="q-mb-sm" />
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

const form = ref<MantenimientoYEmergenciasRequestDto>({
  galponId: 0,
  trabajadorId: 0,
  tipoRegistro: 0,
  descripcion: '',
  costo: 0,
  fechaRegistro: new Date().toISOString().split('T')[0]!,
  resuelto: false,
})

onMounted(async () => {
  if (props.editId) {
    const m = await mantenimientoStore.fetchById(props.editId)
    if (m) {
      form.value = {
        galponId: m.galponId,
        trabajadorId: m.trabajadorId,
        tipoRegistro: m.tipoRegistro,
        descripcion: m.descripcion,
        costo: m.costo,
        fechaRegistro: m.fechaRegistro ? m.fechaRegistro.split('T')[0]! : '',
        resuelto: m.resuelto,
      }
    }
  }
})

async function onSubmit() {
  const valido = await formRef.value?.validate()
  if (!valido) return

  if (props.editId) {
    await mantenimientoStore.update(props.editId, form.value)
  } else {
    await mantenimientoStore.create(form.value)
  }
  emit('close')
}
</script>
