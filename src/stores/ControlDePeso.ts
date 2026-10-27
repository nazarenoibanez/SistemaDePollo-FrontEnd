import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/boot/axios'
import type { ControlDePesoRequestDto } from '@/models/ControlDePeso/ControlDePesoRequestDto'
import type { ControlDePesoResponseDto } from '@/models/ControlDePeso/ControlDePesoResponseDto'
import { notificarExito, notificarError } from '@/Utils/Notificar'

export const useControlDePesoStore = defineStore('controlDePeso', () => {
  const controles = ref<ControlDePesoResponseDto[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchAll() {
    loading.value = true
    error.value = null
    try {
      const { data } = await api.get<ControlDePesoResponseDto[]>('/ControlDePeso/All')
      controles.value = data
    } catch {
      controles.value = []
      error.value = 'Error al obtener los controles de peso'
      notificarError(error.value)
    } finally {
      loading.value = false
    }
  }

  async function fetchById(id: number): Promise<ControlDePesoResponseDto | null> {
    loading.value = true
    try {
      const { data } = await api.get<ControlDePesoResponseDto>(`/ControlDePeso/ById?Id=${id}`)
      return data
    } catch {
      notificarError('No se pudo cargar el registro de control de peso')
      return null
    } finally {
      loading.value = false
    }
  }

  async function create(dto: ControlDePesoRequestDto) {
    loading.value = true
    try {
      await api.post('/ControlDePeso', dto)
      notificarExito('Control de peso registrado correctamente')
      await fetchAll()
    } catch {
      notificarError('Error al registrar el control de peso')
    } finally {
      loading.value = false
    }
  }

  async function update(id: number, dto: ControlDePesoRequestDto) {
    loading.value = true
    try {
      await api.put(`/ControlDePeso?Id=${id}`, dto)
      notificarExito('Control de peso actualizado correctamente')
      await fetchAll()
    } catch {
      notificarError('No se pudo actualizar el control de peso')
    } finally {
      loading.value = false
    }
  }

  async function borrar(id: number) {
    loading.value = true
    try {
      await api.delete(`/ControlDePeso?Id=${id}`)
      notificarExito('Control de peso eliminado')
      await fetchAll()
    } catch {
      notificarError('No se pudo eliminar el registro')
    } finally {
      loading.value = false
    }
  }

  return {
    controles,
    loading,
    error,
    fetchAll,
    fetchById,
    create,
    update,
    borrar,
  }
})
