import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/boot/axios'
import type { MantenimientoYEmergenciasResponseDto } from '@/models/MantenimientoYEmergencia/MantenimientoYEmergenciasResponseDto'
import type { MantenimientoYEmergenciasRequestDto } from '@/models/MantenimientoYEmergencia/MantenimientoYEmergenciasRequestDto'
import { notificarExito, notificarError } from '@/Utils/Notificar'

export const useMantenimientoYEmergenciasStore = defineStore('mantenimientoYEmergencias', () => {
  const mantenimientos = ref<MantenimientoYEmergenciasResponseDto[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchAll() {
    loading.value = true
    error.value = null
    try {
      const { data } = await api.get<MantenimientoYEmergenciasResponseDto[]>(
        '/MantenimientoYEmergencias/All',
      )
      mantenimientos.value = data
    } catch {
      mantenimientos.value = []
      error.value = 'Error al obtener los registros de mantenimiento'
      notificarError(error.value)
    } finally {
      loading.value = false
    }
  }

  async function fetchById(id: number): Promise<MantenimientoYEmergenciasResponseDto | null> {
    loading.value = true
    try {
      const { data } = await api.get<MantenimientoYEmergenciasResponseDto>(
        `/MantenimientoYEmergencias/ById?Id=${id}`,
      )
      return data
    } catch {
      notificarError('No se pudo cargar el registro')
      return null
    } finally {
      loading.value = false
    }
  }

  async function create(dto: MantenimientoYEmergenciasRequestDto) {
    loading.value = true
    try {
      await api.post('/MantenimientoYEmergencias', dto)
      notificarExito('Registro de mantenimiento creado correctamente')
      await fetchAll()
    } catch {
      notificarError('Error al crear el registro')
    } finally {
      loading.value = false
    }
  }

  async function update(id: number, dto: MantenimientoYEmergenciasRequestDto) {
    loading.value = true
    try {
      await api.put(`/MantenimientoYEmergencias?Id=${id}`, dto)
      notificarExito('Registro actualizado correctamente')
      await fetchAll()
    } catch {
      notificarError('No se pudo actualizar el registro')
    } finally {
      loading.value = false
    }
  }

  async function borrar(id: number) {
    loading.value = true
    try {
      await api.delete(`/MantenimientoYEmergencias?Id=${id}`)
      notificarExito('Registro eliminado')
      await fetchAll()
    } catch {
      notificarError('No se pudo eliminar el registro')
    } finally {
      loading.value = false
    }
  }

  return {
    mantenimientos,
    loading,
    error,
    fetchAll,
    fetchById,
    create,
    update,
    borrar,
  }
})
