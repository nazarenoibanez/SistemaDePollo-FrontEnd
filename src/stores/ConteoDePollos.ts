import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/boot/axios'
import type { ConteoDePollosRequestDto } from '@/models/ConteoDePollos/ConteoDePollosRequestDto'
import type { ConteoDePollosResponseDto } from '@/models/ConteoDePollos/ConteoDePollosResponseDto'
import { notificarExito, notificarError } from '@/Utils/Notificar'

export const useConteoDePollosStore = defineStore('conteoDePollos', () => {
  const conteos = ref<ConteoDePollosResponseDto[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchAll() {
    loading.value = true
    error.value = null
    try {
      const { data } = await api.get<ConteoDePollosResponseDto[]>('/ConteoDePollos/All')
      conteos.value = data
    } catch {
      conteos.value = []
      error.value = 'Error al obtener los conteos de pollos'
      notificarError(error.value)
    } finally {
      loading.value = false
    }
  }

  async function fetchById(id: number): Promise<ConteoDePollosResponseDto | null> {
    loading.value = true
    try {
      const { data } = await api.get<ConteoDePollosResponseDto>(`/ConteoDePollos/ById?Id=${id}`)
      return data
    } catch {
      notificarError('No se pudo cargar el registro de conteo')
      return null
    } finally {
      loading.value = false
    }
  }

  async function create(dto: ConteoDePollosRequestDto) {
    loading.value = true
    try {
      await api.post('/ConteoDePollos', dto)
      notificarExito('Conteo de pollos registrado correctamente')
      await fetchAll()
    } catch {
      notificarError('Error al registrar el conteo')
    } finally {
      loading.value = false
    }
  }

  async function update(id: number, dto: ConteoDePollosRequestDto) {
    loading.value = true
    try {
      await api.put(`/ConteoDePollos?Id=${id}`, dto)
      notificarExito('Conteo actualizado correctamente')
      await fetchAll()
    } catch {
      notificarError('No se pudo actualizar el conteo')
    } finally {
      loading.value = false
    }
  }

  async function borrar(id: number) {
    loading.value = true
    try {
      await api.delete(`/ConteoDePollos?Id=${id}`)
      notificarExito('Conteo eliminado')
      await fetchAll()
    } catch {
      notificarError('No se pudo eliminar el conteo')
    } finally {
      loading.value = false
    }
  }

  return {
    conteos,
    loading,
    error,
    fetchAll,
    fetchById,
    create,
    update,
    borrar,
  }
})
