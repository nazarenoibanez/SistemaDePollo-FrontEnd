import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/boot/axios'
import type { RetiroDePollosRequestDto } from '@/models/RetiroDePollos/RetiroDePollosRequestDto'
import type { RetiroDePollosResponseDto } from '@/models/RetiroDePollos/RetiroDePollosResponseDto'

import { notificarExito, notificarError } from '@/Utils/Notificar'

export const useRetiroDePollosStore = defineStore('retiroDePollos', () => {
  const retiros = ref<RetiroDePollosResponseDto[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchAll() {
    loading.value = true
    error.value = null
    try {
      const { data } = await api.get<RetiroDePollosResponseDto[]>('/RetiroDePollos/All')
      retiros.value = data
    } catch {
      retiros.value = []
      error.value = 'Error al obtener los retiros de pollos'
      notificarError(error.value)
    } finally {
      loading.value = false
    }
  }

  async function fetchById(id: number): Promise<RetiroDePollosResponseDto | null> {
    loading.value = true
    try {
      const { data } = await api.get<RetiroDePollosResponseDto>(`/RetiroDePollos/ById?Id=${id}`)
      return data
    } catch {
      notificarError('No se pudo cargar el registro de retiro')
      return null
    } finally {
      loading.value = false
    }
  }

  async function create(dto: RetiroDePollosRequestDto) {
    loading.value = true
    try {
      await api.post('/RetiroDePollos', dto)
      notificarExito('Retiro de pollos registrado correctamente')
      await fetchAll()
    } catch {
      notificarError('Error al registrar el retiro')
    } finally {
      loading.value = false
    }
  }

  async function update(id: number, dto: RetiroDePollosRequestDto) {
    loading.value = true
    try {
      await api.put(`/RetiroDePollos?Id=${id}`, dto)
      notificarExito('Retiro actualizado correctamente')
      await fetchAll()
    } catch {
      notificarError('No se pudo actualizar el retiro')
    } finally {
      loading.value = false
    }
  }

  async function borrar(id: number) {
    loading.value = true
    try {
      await api.delete(`/RetiroDePollos?Id=${id}`)
      notificarExito('Retiro eliminado')
      await fetchAll()
    } catch {
      notificarError('No se pudo eliminar el retiro')
    } finally {
      loading.value = false
    }
  }

  return {
    retiros,
    loading,
    error,
    fetchAll,
    fetchById,
    create,
    update,
    borrar,
  }
})
