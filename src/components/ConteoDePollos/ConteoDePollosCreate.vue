<template>
  <q-card style="min-width: 450px">
    <q-card-section>
      <div class="text-h6">{{ editId ? 'Editar Conteo de Pollos' : 'Nuevo Conteo de Pollos' }}</div>
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
          v-model.number="form.polloId"
          label="ID Pollo"
          type="number"
          outlined
          class="q-mb-sm"
          lazy-rules
          :rules="[(v: number) => v > 0 || 'Ingresa un ID de pollo válido']"
        />
        <q-input
          v-model.number="form.cantidadActual"
          label="Cantidad Actual"
          type="number"
          outlined
          class="q-mb-sm"
          lazy-rules
          :rules="[(v: number) => v >= 0 || 'Debe ser mayor o igual a 0']"
        />
        <q-input
          v-model.number="form.mortalidadDiaria"
          label="Mortalidad Diaria"
          type="number"
          outlined
          class="q-mb-sm"
          lazy-rules
          :rules="[(v: number) => v >= 0 || 'Debe ser mayor o igual a 0']"
        />
        <q-input
          v-model="form.fechaConteo"
          label="Fecha de Conteo"
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
        :loading="conteoStore.loading"
        @click="onSubmit"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { QForm } from 'quasar'
import { useConteoDePollosStore } from '@/stores/ConteoDePollos'
import type { ConteoDePollosRequestDto } from '@/models/ConteoDePollos/ConteoDePollosRequestDto'

const props = defineProps<{ editId: number | null }>()
const emit = defineEmits(['close'])

const conteoStore = useConteoDePollosStore()
const formRef = ref<QForm | null>(null)

const form = ref<ConteoDePollosRequestDto>({
  galponId: 0,
  polloId: 0,
  cantidadActual: 0,
  mortalidadDiaria: 0,
  fechaConteo: new Date().toISOString().split('T')[0]!,
})

onMounted(async () => {
  if (props.editId) {
    const c = await conteoStore.fetchById(props.editId)
    if (c) {
      form.value = {
        galponId: c.galponId,
        polloId: c.polloId,
        cantidadActual: c.cantidadActual,
        mortalidadDiaria: c.mortalidadDiaria,
        fechaConteo: c.fechaConteo ? c.fechaConteo.split('T')[0]! : '',
      }
    }
  }
})

async function onSubmit() {
  const valido = await formRef.value?.validate()
  if (!valido) return

  if (props.editId) {
    await conteoStore.update(props.editId, form.value)
  } else {
    await conteoStore.create(form.value)
  }
  emit('close')
}
</script>
