import { defineStore } from 'pinia'
import { ref } from 'vue'
import { isAxiosError } from 'axios'
import { api } from '@/boot/axios'
import type { GalponesResponseDto } from '@/models/Galpon/GalponesResponseDto'
import type { GalponesRequestDto } from '@/models/Galpon/GalponesRequestDto'
import { notificarExito, notificarError } from '@/Utils/Notificar'

export const useGalponStore = defineStore('galpon', () => {
  const galpones = ref<GalponesResponseDto[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchAll() {
    loading.value = true
    error.value = null
    try {
      const { data } = await api.get<GalponesResponseDto[]>('/Galpones/All')
      galpones.value = data
    } catch (e) {
      galpones.value = []
      error.value = isAxiosError(e) ? 'Error al obtener los galpones' : 'Error de conexión'
      notificarError(error.value)
    } finally {
      loading.value = false
    }
  }

  async function fetchById(id: number): Promise<GalponesResponseDto | null> {
    loading.value = true
    try {
      const { data } = await api.get<GalponesResponseDto>(`/Galpones/ById?Id=${id}`)
      return data
    } catch {
      notificarError('No se pudo cargar el galpón')
      return null
    } finally {
      loading.value = false
    }
  }

  async function create(dto: GalponesRequestDto) {
    loading.value = true
    try {
      await api.post('/Galpones', dto)
      notificarExito('Galpón creado correctamente')
      await fetchAll()
    } catch (e) {
      if (isAxiosError(e) && e.response?.data) {
        notificarError('Error al crear el galpón')
      }
    } finally {
      loading.value = false
    }
  }

  async function update(id: number, dto: GalponesRequestDto) {
    loading.value = true
    try {
      await api.put(`/Galpones?Id=${id}`, dto)
      notificarExito('Galpón actualizado correctamente')
      await fetchAll()
    } catch {
      notificarError('No se pudo actualizar el galpón')
    } finally {
      loading.value = false
    }
  }

  async function borrar(id: number) {
    loading.value = true
    try {
      await api.delete(`/Galpones?Id=${id}`)
      notificarExito('Galpón eliminado')
      await fetchAll()
    } catch {
      notificarError('No se pudo eliminar el galpón')
    } finally {
      loading.value = false
    }
  }

  return {
    galpones,
    loading,
    error,
    fetchAll,
    fetchById,
    create,
    update,
    borrar,
  }
})
