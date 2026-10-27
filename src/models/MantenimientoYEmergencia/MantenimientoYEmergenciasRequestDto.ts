export interface MantenimientoYEmergenciasRequestDto {
  galponId: number
  trabajadorId: number
  tipoRegistro: number // Enum: Mantenimiento, Emergencia, etc.
  descripcion: string
  costo: number
  fechaRegistro: string // Formato yyyy-MM-dd
  resuelto: boolean
}
