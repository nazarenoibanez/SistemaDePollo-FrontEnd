<template>
  <q-card style="min-width: 400px">
    <q-card-section>
      <div class="text-h6">{{ editId ? 'Editar Galpón' : 'Nuevo Galpón' }}</div>
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
          v-model="form.tamaño"
          label="Tamaño"
          outlined
          class="q-mb-sm"
          lazy-rules
          :rules="[(v: string) => (!!v && v.trim().length > 0) || 'Ingresa el tamaño']"
        />
        <q-input
          v-model.number="form.cantidadAlmacenado"
          label="Cantidad Almacenada"
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
        :loading="galponStore.loading"
        @click="onSubmit"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { QForm } from 'quasar'
import { useGalponStore } from '@/stores/galpon'
import type { GalponesRequestDto } from '@/models/Galpon/GalponesRequestDto'

const props = defineProps<{ editId: number | null }>()
const emit = defineEmits(['close'])

const galponStore = useGalponStore()
const formRef = ref<QForm | null>(null)

const form = ref<GalponesRequestDto>({
  nombre: '',
  tamaño: '',
  cantidadAlmacenado: 0,
})

onMounted(async () => {
  if (props.editId) {
    const galpon = await galponStore.fetchById(props.editId)
    if (galpon) {
      form.value = {
        nombre: galpon.nombre,
        tamaño: galpon.tamaño,
        cantidadAlmacenado: galpon.cantidadAlmacenado,
      }
    }
  }
})

async function onSubmit() {
  const valido = await formRef.value?.validate()
  if (!valido) return

  if (props.editId) {
    await galponStore.update(props.editId, form.value)
  } else {
    await galponStore.create(form.value)
  }
  emit('close')
}
</script>
