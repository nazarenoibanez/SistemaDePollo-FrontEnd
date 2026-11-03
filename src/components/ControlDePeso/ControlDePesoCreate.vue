<template>
  <q-card style="min-width: 450px">
    <q-card-section>
      <div class="text-h6">{{ editId ? 'Editar Control de Peso' : 'Nuevo Control de Peso' }}</div>
    </q-card-section>
    <q-separator />

    <q-card-section>
      <q-form ref="formRef" greedy @submit.prevent="onSubmit">
        <q-input
          v-model.number="form.conteodepollosId"
          label="ID Conteo de Pollos"
          type="number"
          outlined
          class="q-mb-sm"
          lazy-rules
          :rules="[(v: number) => v > 0 || 'Ingresa un ID de conteo válido']"
        />
        <q-input
          v-model="form.fechaPasaje"
          label="Fecha de Pesaje"
          type="date"
          outlined
          class="q-mb-sm"
          stack-label
          lazy-rules
          :rules="[(v: string) => !!v || 'Ingresa la fecha']"
        />
        <q-input
          v-model.number="form.edadDias"
          label="Edad (días)"
          type="number"
          outlined
          class="q-mb-sm"
          lazy-rules
          :rules="[(v: number) => v >= 0 || 'Debe ser mayor o igual a 0']"
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
  conteodepollosId: 0,
  fechaPasaje: new Date().toISOString().split('T')[0]!,
  edadDias: 0,
  pesoPromedioGr: 0,
})

onMounted(async () => {
  if (props.editId) {
    const c = await controlStore.fetchById(props.editId)
    if (c) {
      form.value = {
        conteodepollosId: c.controlID,
        fechaPasaje: c.fechaPasaje ? c.fechaPasaje.split('T')[0]! : '',
        edadDias: c.edadDias,
        pesoPromedioGr: c.pesoPromedioGr,
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
