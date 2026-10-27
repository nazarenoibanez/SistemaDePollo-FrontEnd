<template>
  <q-card style="min-width: 450px">
    <q-card-section>
      <div class="text-h6">{{ editId ? 'Editar Retiro de Pollos' : 'Nuevo Retiro de Pollos' }}</div>
    </q-card-section>
    <q-separator />

    <q-card-section>
      <q-form ref="formRef" greedy @submit.prevent="onSubmit">
        <q-input
          v-model.number="form.controlDePesoId"
          label="ID Control de Peso"
          type="number"
          outlined
          class="q-mb-sm"
          lazy-rules
          :rules="[(v: number) => v > 0 || 'Ingresa un ID de control válido']"
        />
        <q-input
          v-model="form.fechaRetiro"
          label="Fecha de Retiro"
          type="date"
          outlined
          class="q-mb-sm"
          stack-label
        />
        <q-input
          v-model.number="form.cantidadRetirada"
          label="Cantidad Retirada"
          type="number"
          outlined
          class="q-mb-sm"
          lazy-rules
          :rules="[(v: number) => v > 0 || 'Debe ser mayor a 0']"
        />
        <q-input
          v-model.number="form.pesoTotalKG"
          label="Peso Total (KG)"
          type="number"
          step="0.01"
          outlined
          class="q-mb-sm"
          lazy-rules
          :rules="[(v: number) => v >= 0 || 'Ingresa un peso válido']"
        />
        <q-input
          v-model="form.destino"
          label="Destino"
          outlined
          class="q-mb-sm"
          lazy-rules
          :rules="[(v: string) => (!!v && v.trim().length > 0) || 'Ingresa el destino']"
        />
        <q-input
          v-model.number="form.mortalidadCarga"
          label="Mortalidad en Carga"
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
        :loading="retiroStore.loading"
        @click="onSubmit"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { QForm } from 'quasar'
import { useRetiroDePollosStore } from '@/stores/RetiroDePollos'
import type { RetiroDePollosRequestDto } from '@/models/RetiroDePollos/RetiroDePollosRequestDto'

const props = defineProps<{ editId: number | null }>()
const emit = defineEmits(['close'])

const retiroStore = useRetiroDePollosStore()
const formRef = ref<QForm | null>(null)

const form = ref<RetiroDePollosRequestDto>({
  controlDePesoId: 0,
  fechaRetiro: fechaLocalActual(),
  cantidadRetirada: 0,
  pesoTotalKG: 0,
  destino: '',
  mortalidadCarga: 0,
})

onMounted(async () => {
  if (props.editId) {
    const r = await retiroStore.fetchById(props.editId)
    if (r) {
      form.value = {
        controlDePesoId: r.controlID,
        fechaRetiro: r.fechaRetiro ? r.fechaRetiro.slice(0, 10) : '',
        cantidadRetirada: r.cantidadRetirada,
        pesoTotalKG: r.pesoTotalKG,
        destino: r.destino,
        mortalidadCarga: r.mortalidadCarga,
      }
    }
  }
})

async function onSubmit() {
  const valido = await formRef.value?.validate()
  if (!valido) return

  if (props.editId) {
    await retiroStore.update(props.editId, form.value)
  } else {
    await retiroStore.create(form.value)
  }
  emit('close')
}

function fechaLocalActual(): string {
  const hoy = new Date()
  const anio = hoy.getFullYear()
  const mes = String(hoy.getMonth() + 1).padStart(2, '0')
  const dia = String(hoy.getDate()).padStart(2, '0')
  return `${anio}-${mes}-${dia}`
}
</script>
