<template>
  <q-card style="min-width: 450px">
    <q-card-section>
      <div class="text-h6">{{ editId ? 'Editar Control de Peso' : 'Nuevo Control de Peso' }}</div>
    </q-card-section>
    <q-separator />

    <q-card-section>
      <q-form ref="formRef" greedy @submit.prevent="onSubmit">
        <q-input
          v-model.number="form.conteoId"
          label="ID Conteo de Pollos"
          type="number"
          outlined
          class="q-mb-sm"
          lazy-rules
          :rules="[(v: number) => v > 0 || 'Ingresa un ID de conteo válido']"
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
          v-model.number="form.semana"
          label="Semana"
          type="number"
          outlined
          class="q-mb-sm"
          lazy-rules
          :rules="[(v: number) => v >= 1 || 'Ingresa un número de semana válido']"
        />
        <q-input
          v-model.number="form.pesoPromedioGr"
          label="Peso Promedio (Gramos)"
          type="number"
          step="0.01"
          outlined
          class="q-mb-sm"
          lazy-rules
          :rules="[(v: number) => v > 0 || 'Debe ser mayor a 0']"
        />
        <q-input
          v-model.number="form.gananciaPesoDiariaGr"
          label="Ganancia Diaria (Gramos)"
          type="number"
          step="0.01"
          outlined
          class="q-mb-sm"
          lazy-rules
          :rules="[(v: number) => v >= 0 || 'Debe ser mayor o igual a 0']"
        />
        <q-input
          v-model.number="form.alimentoConsumidoKg"
          label="Alimento Consumido (KG)"
          type="number"
          step="0.01"
          outlined
          class="q-mb-sm"
          lazy-rules
          :rules="[(v: number) => v >= 0 || 'Debe ser mayor o igual a 0']"
        />
        <q-input
          v-model="form.fechaControl"
          label="Fecha de Control"
          type="date"
          outlined
          class="q-mb-sm"
          stack-label
        />
      </q-form>
    </q-card-section>

    <q-card-actions align="right">
      <q-btn label="Cancelar" flat v-close-popup />
      <q-btn
        :label="editId ? 'Guardar' : 'Crear'"
        color="primary"
        :loading="controlStore.loading"
        @click="onSubmit"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { QForm } from 'quasar'
import { useControlDePesoStore } from '@/stores/ControlDePeso'
import type { ControlDePesoRequestDto } from '@/models/ControlDePeso/ControlDePesoRequestDto'

const props = defineProps<{ editId: number | null }>()
const emit = defineEmits(['close'])

const controlStore = useControlDePesoStore()
const formRef = ref<QForm | null>(null)

const form = ref<ControlDePesoRequestDto>({
  conteoId: 0,
  trabajadorId: 0,
  semana: 1,
  pesoPromedioGr: 0,
  gananciaPesoDiariaGr: 0,
  alimentoConsumidoKg: 0,
  fechaControl: new Date().toISOString().split('T')[0]!,
})

onMounted(async () => {
  if (props.editId) {
    const c = await controlStore.fetchById(props.editId)
    if (c) {
      form.value = {
        conteoId: c.conteoId,
        trabajadorId: c.trabajadorId,
        semana: c.semana,
        pesoPromedioGr: c.pesoPromedioGr,
        gananciaPesoDiariaGr: c.gananciaPesoDiariaGr,
        alimentoConsumidoKg: c.alimentoConsumidoKg,
        fechaControl: c.fechaControl ? c.fechaControl.split('T')[0]! : '',
      }
    }
  }
})

async function onSubmit() {
  const valido = await formRef.value?.validate()
  if (!valido) return

  if (props.editId) {
    await controlStore.update(props.editId, form.value)
  } else {
    await controlStore.create(form.value)
  }
  emit('close')
}
</script>
