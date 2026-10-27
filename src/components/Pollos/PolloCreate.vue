<template>
  <q-card style="min-width: 400px">
    <q-card-section>
      <div class="text-h6">{{ editId ? 'Editar Pollo' : 'Nuevo Pollo' }}</div>
    </q-card-section>
    <q-separator />

    <q-card-section>
      <q-form ref="formRef" greedy @submit.prevent="onSubmit">
        <q-input
          v-model="form.nombre"
          label="Nombre"
          outlined
          class="q-mb-sm"
          :maxlength="30"
          counter
          lazy-rules
          :rules="[(v: string) => (!!v && v.trim().length > 0) || 'Ingresa el nombre']"
        />
        <q-input
          v-model.number="form.tipoPollo"
          label="Tipo de Pollo (Número/Enum)"
          type="number"
          outlined
          class="q-mb-sm"
          lazy-rules
          :rules="[(v: number) => v >= 0 || 'Ingresa un tipo válido']"
        />
        <q-input
          v-model.number="form.tipoAlimento"
          label="Tipo de Alimento (Número/Enum)"
          type="number"
          outlined
          class="q-mb-sm"
          lazy-rules
          :rules="[(v: number) => v >= 0 || 'Ingresa un tipo de alimento válido']"
        />
      </q-form>
    </q-card-section>

    <q-card-actions align="right">
      <q-btn label="Cancelar" flat v-close-popup />
      <q-btn
        :label="editId ? 'Guardar' : 'Crear'"
        color="primary"
        :loading="polloStore.loading"
        @click="onSubmit"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { QForm } from 'quasar'
import { usePolloStore } from '@/stores/Pollos'
import type { PollosRequestDto } from '@/models/Pollos/PollosRequestDto'

const props = defineProps<{ editId: number | null }>()
const emit = defineEmits(['close'])

const polloStore = usePolloStore()
const formRef = ref<QForm | null>(null)

const form = ref<PollosRequestDto>({
  nombre: '',
  tipoPollo: 0,
  tipoAlimento: 0,
})

onMounted(async () => {
  if (props.editId) {
    const pollo = await polloStore.fetchById(props.editId)
    if (pollo) {
      // Ajusta si manejas strings o enums numéricos en tu backend
      form.value = {
        nombre: pollo.nombre,
        tipoPollo: 0,
        tipoAlimento: 0,
      }
    }
  }
})

async function onSubmit() {
  const valido = await formRef.value?.validate()
  if (!valido) return

  if (props.editId) {
    await polloStore.update(props.editId, form.value)
  } else {
    await polloStore.create(form.value)
  }
  emit('close')
}
</script>
