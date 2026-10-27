import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/boot/axios'
import type { TrabajadorRequestDto } from '@/models/Trabajador/TrabajadorRequestDto'
import type { TrabajadorResponseDto } from '@/models/Trabajador/TrabajadorResponseDto'

import { notificarExito, notificarError } from '@/Utils/Notificar'

export const useTrabajadorStore = defineStore('trabajador', () => {
  const trabajadores = ref<TrabajadorResponseDto[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchAll() {
    loading.value = true
    error.value = null
    try {
      const { data } = await api.get<TrabajadorResponseDto[]>('/Trabajador/All')
      trabajadores.value = data
    } catch {
      trabajadores.value = []
      error.value = 'Error al obtener los trabajadores'
      notificarError(error.value)
    } finally {
      loading.value = false
    }
  }

  async function fetchById(id: number): Promise<TrabajadorResponseDto | null> {
    loading.value = true
    try {
      const { data } = await api.get<TrabajadorResponseDto>(`/Trabajador/ById?Id=${id}`)
      return data
    } catch {
      notificarError('No se pudo cargar el trabajador')
      return null
    } finally {
      loading.value = false
    }
  }

  async function create(dto: TrabajadorRequestDto) {
    loading.value = true
    try {
      await api.post('/Trabajador', dto)
      notificarExito('Trabajador registrado correctamente')
      await fetchAll()
    } catch {
      notificarError('Error al registrar el trabajador')
    } finally {
      loading.value = false
    }
  }

  async function update(id: number, dto: TrabajadorRequestDto) {
    loading.value = true
    try {
      await api.put(`/Trabajador?Id=${id}`, dto)
      notificarExito('Trabajador actualizado correctamente')
      await fetchAll()
    } catch {
      notificarError('No se pudo actualizar el trabajador')
    } finally {
      loading.value = false
    }
  }

  async function borrar(id: number) {
    loading.value = true
    try {
      await api.delete(`/Trabajador?Id=${id}`)
      notificarExito('Trabajador eliminado')
      await fetchAll()
    } catch {
      notificarError('No se pudo eliminar el trabajador')
    } finally {
      loading.value = false
    }
  }

  return {
    trabajadores,
    loading,
    error,
    fetchAll,
    fetchById,
    create,
    update,
    borrar,
  }
})
