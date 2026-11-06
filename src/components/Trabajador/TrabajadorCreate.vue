<template>
  <q-card style="min-width: 450px">
    <q-card-section>
      <div class="text-h6">{{ editId ? 'Editar Trabajador' : 'Nuevo Trabajador' }}</div>
    </q-card-section>
    <q-separator />

    <q-card-section>
      <q-form ref="formRef" greedy @submit.prevent="onSubmit">
        <q-input
          v-model="form.nombre"
          label="Nombre"
          outlined
          class="q-mb-sm"
          lazy-rules
          :rules="[(v: string) => (!!v && v.trim().length > 0) || 'Ingresa el nombre']"
        />
        <q-input
          v-model="form.apellido"
          label="Apellido"
          outlined
          class="q-mb-sm"
          lazy-rules
          :rules="[(v: string) => (!!v && v.trim().length > 0) || 'Ingresa el apellido']"
        />
        <q-select
          v-model="form.rol"
          :options="roles"
          label="Rol"
          outlined
          emit-value
          map-options
          class="q-mb-sm"
        />
        <q-input
          v-model="form.email"
          label="Correo Electrónico"
          type="email"
          outlined
          class="q-mb-sm"
          lazy-rules
          :rules="[(v: string) => (!!v && v.includes('@')) || 'Ingresa un email válido']"
        />
        <q-input
          v-model="form.fechaDeNacimiento"
          label="Fecha de Nacimiento"
          type="date"
          outlined
          class="q-mb-sm"
          stack-label
          lazy-rules
          :rules="[(v: string) => !!v || 'Ingresa la fecha de nacimiento']"
        />
        <q-input
          v-model="form.fechaIngreso"
          label="Fecha de Ingreso"
          type="date"
          outlined
          class="q-mb-sm"
          stack-label
          lazy-rules
          :rules="[(v: string) => !!v || 'Ingresa la fecha de ingreso']"
        />
        <q-input
          v-model="form.fechaSalida"
          label="Fecha de Salida (opcional)"
          type="date"
          outlined
          clearable
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
        :loading="trabajadorStore.loading"
        @click="onSubmit"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { QForm } from 'quasar'
import { useTrabajadorStore } from '@/stores/Trabajador'
import type { TrabajadorRequestDto } from '@/models/Trabajador/TrabajadorRequestDto'
import { roles } from '@/Utils/Opciones'
import { fechaParaInput } from '@/Utils/Fechas'

const emit = defineEmits(['close'])
const props = defineProps<{ editId: number | null }>()

const trabajadorStore = useTrabajadorStore()
const formRef = ref<QForm | null>(null)

const form = ref<TrabajadorRequestDto>({
  nombre: '',
  apellido: '',
  rol: 0,
  email: '',
  fechaDeNacimiento: '',
  fechaIngreso: '',
  fechaSalida: null,
})

onMounted(async () => {
  if (props.editId) {
    const t = await trabajadorStore.fetchById(props.editId)
    if (t) {
      form.value = {
        nombre: t.nombre,
        apellido: t.apellido,
        rol: t.rol,
        email: t.email,
        fechaDeNacimiento: fechaParaInput(t.fechaDeNacimiento) ?? '',
        fechaIngreso: fechaParaInput(t.fechaIngreso) ?? '',
        fechaSalida: fechaParaInput(t.fechaSalida),
      }
    }
  }
})

async function onSubmit() {
  const valido = await formRef.value?.validate()
  if (!valido) return

  // Si no se carga fecha de salida, se envía null (el trabajador sigue activo)
  const dto: TrabajadorRequestDto = { ...form.value, fechaSalida: form.value.fechaSalida || null }

  if (props.editId) {
    await trabajadorStore.update(props.editId, dto)
  } else {
    await trabajadorStore.create(dto)
  }
  emit('close')
}
</script>
