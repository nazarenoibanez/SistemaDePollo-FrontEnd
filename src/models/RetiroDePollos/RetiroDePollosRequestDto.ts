export interface RetiroDePollosRequestDto {
  controlDePesoId: number
  fechaRetiro: string // Formato yyyy-MM-dd
  cantidadRetirada: number
  pesoTotalKG: number
  destino: string
  mortalidadCarga: number
}
