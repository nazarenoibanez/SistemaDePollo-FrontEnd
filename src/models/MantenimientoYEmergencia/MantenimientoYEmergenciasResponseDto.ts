export interface MantenimientoYEmergenciasResponseDto {
  id: number
  galponesID: number
  descripcion: string
  costo: number
  fechaRepote: string
  fechaResolucion: string | null
  estado: string
  nombreGalpon: string | null
}
