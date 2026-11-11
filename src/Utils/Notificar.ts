import { Notify } from 'quasar'
import { isAxiosError } from 'axios'

export function notificarExito(mensaje: string) {
  Notify.create({ type: 'positive', message: mensaje, position: 'top', timeout: 3000 })
}

export function notificarError(mensaje: string) {
  Notify.create({ type: 'negative', message: mensaje, position: 'top', timeout: 4000 })
}

// Devuelve el mensaje que manda la API (ProblemDetails.detail) o, si no hay, uno por defecto
export function mensajeDeError(e: unknown, porDefecto: string): string {
  if (isAxiosError(e)) {
    const data = e.response?.data as { detail?: unknown } | undefined
    if (typeof data?.detail === 'string' && data.detail) return data.detail
  }
  return porDefecto
}
