export interface MantenimientoYEmergenciasRequestDto {
  galponesID: number
  descripcion: string
  costo: number
  fechaRepote: string // Formato yyyy-MM-dd (fecha en que se reporta)
  fechaResolucion: string | null // Formato yyyy-MM-dd; null mientras no se resuelva
  estado: string
}
