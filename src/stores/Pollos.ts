import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/boot/axios'
import type { PollosRequestDto } from '@/models/Pollos/PollosRequestDto'
import type { PollosResponseDto } from '@/models/Pollos/PollosResponseDto'
import { notificarExito, notificarError } from '@/Utils/Notificar'

export const usePolloStore = defineStore('pollo', () => {
  const pollos = ref<PollosResponseDto[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchAll() {
    loading.value = true
    error.value = null
    try {
      const { data } = await api.get<PollosResponseDto[]>('/Pollos/All')
      pollos.value = data
    } catch {
      pollos.value = []
      error.value = 'Error al obtener los pollos'
      notificarError(error.value)
    } finally {
      loading.value = false
    }
  }

  async function fetchById(id: number): Promise<PollosResponseDto | null> {
    loading.value = true
    try {
      const { data } = await api.get<PollosResponseDto>(`/Pollos/ById?Id=${id}`)
      return data
    } catch {
      notificarError('No se pudo cargar el pollo')
      return null
    } finally {
      loading.value = false
    }
  }

  async function create(dto: PollosRequestDto) {
    loading.value = true
    try {
      await api.post('/Pollos', dto)
      notificarExito('Pollo creado correctamente')
      await fetchAll()
    } catch {
      notificarError('Error al crear el pollo')
    } finally {
      loading.value = false
    }
  }

  async function update(id: number, dto: PollosRequestDto) {
    loading.value = true
    try {
      await api.put(`/Pollos?Id=${id}`, dto)
      notificarExito('Pollo actualizado correctamente')
      await fetchAll()
    } catch {
      notificarError('No se pudo actualizar el pollo')
    } finally {
      loading.value = false
    }
  }

  async function borrar(id: number) {
    loading.value = true
    try {
      await api.delete(`/Pollos?Id=${id}`)
      notificarExito('Pollo eliminado')
      await fetchAll()
    } catch {
      notificarError('No se pudo eliminar el pollo')
    } finally {
      loading.value = false
    }
  }

  return {
    pollos,
    loading,
    error,
    fetchAll,
    fetchById,
    create,
    update,
    borrar,
  }
})
