<template>
  <q-card style="min-width: 450px">
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

        <div class="row q-col-gutter-sm">
          <div class="col-6">
            <q-input
              v-model.number="ancho"
              label="Ancho (m)"
              type="number"
              step="0.01"
              min="0"
              outlined
              lazy-rules
              :rules="[(v: number | null) => (v !== null && v > 0) || 'Ingresa el ancho']"
            />
          </div>
          <div class="col-6">
            <q-input
              v-model.number="largo"
              label="Largo (m)"
              type="number"
              step="0.01"
              min="0"
              outlined
              lazy-rules
              :rules="[(v: number | null) => (v !== null && v > 0) || 'Ingresa el largo']"
            />
          </div>
        </div>
        <div class="text-caption text-grey-7 q-mb-sm q-mt-xs">
          Superficie: <b>{{ superficie }} m²</b>
        </div>

        <q-banner v-if="tamanoAnterior" dense rounded class="bg-orange-1 text-orange-9 q-mb-sm">
          Tamaño guardado anteriormente: «{{ tamanoAnterior }}». Ingresa el ancho y el largo para
          reemplazarlo.
        </q-banner>

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
import { computed, onMounted, ref } from 'vue'
import { QForm } from 'quasar'
import { useGalponStore } from '@/stores/galpon'
import type { GalponesRequestDto } from '@/models/Galpon/GalponesRequestDto'

const props = defineProps<{ editId: number | null }>()
const emit = defineEmits(['close'])

const galponStore = useGalponStore()
const formRef = ref<QForm | null>(null)

const form = ref({ nombre: '', cantidadAlmacenado: 0 })
const ancho = ref<number | null>(null)
const largo = ref<number | null>(null)
const tamanoAnterior = ref('')

const superficie = computed(() => {
  const a = ancho.value ?? 0
  const l = largo.value ?? 0
  return Math.round(a * l * 100) / 100
})

function armarTamano(): string {
  return `${ancho.value} x ${largo.value} m (${superficie.value} m²)`
}

function leerTamano(texto: string) {
  const m = /^\s*(\d+(?:[.,]\d+)?)\s*[xX×]\s*(\d+(?:[.,]\d+)?)/.exec(texto ?? '')
  if (m && m[1] && m[2]) {
    ancho.value = Number(m[1].replace(',', '.'))
    largo.value = Number(m[2].replace(',', '.'))
  } else if (texto) {
    tamanoAnterior.value = texto
  }
}

onMounted(async () => {
  if (props.editId) {
    const g = await galponStore.fetchById(props.editId)
    if (g) {
      form.value = { nombre: g.nombre, cantidadAlmacenado: g.cantidadAlmacenado }
      leerTamano(g.tamaño)
    }
  }
})

async function onSubmit() {
  const valido = await formRef.value?.validate()
  if (!valido) return

  const dto: GalponesRequestDto = {
    nombre: form.value.nombre,
    tamaño: armarTamano(),
    cantidadAlmacenado: form.value.cantidadAlmacenado,
  }

  if (props.editId) {
    await galponStore.update(props.editId, dto)
  } else {
    await galponStore.create(dto)
  }
  emit('close')
}
</script>
