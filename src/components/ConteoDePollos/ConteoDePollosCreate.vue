<template>
  <q-card style="min-width: 450px">
    <q-card-section>
      <div class="text-h6">{{ editId ? 'Editar Conteo de Pollos' : 'Nuevo Conteo de Pollos' }}</div>
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
          v-model.number="form.pollosID"
          label="ID Pollo"
          type="number"
          outlined
          class="q-mb-sm"
          lazy-rules
          :rules="[(v: number) => v > 0 || 'Ingresa un ID de pollo válido']"
        />
        <q-input
          v-model.number="form.cantidadPollos"
          label="Cantidad de Pollos"
          type="number"
          outlined
          class="q-mb-sm"
          lazy-rules
          :rules="[(v: number) => v >= 0 || 'Debe ser mayor o igual a 0']"
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
  galponesID: 0,
  pollosID: 0,
  cantidadPollos: 0,
})

onMounted(async () => {
  if (props.editId) {
    const c = await conteoStore.fetchById(props.editId)
    if (c) {
      form.value = {
        galponesID: c.galponesID,
        pollosID: c.pollosID,
        cantidadPollos: c.cantidadPollos,
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
