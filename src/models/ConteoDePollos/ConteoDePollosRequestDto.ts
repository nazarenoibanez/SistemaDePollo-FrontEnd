export interface ConteoDePollosRequestDto {
  galponId: number
  polloId: number
  cantidadActual: number
  mortalidadDiaria: number
  fechaConteo: string // Formato yyyy-MM-dd
}
