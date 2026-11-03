export interface ControlDePesoResponseDto {
  id: number
  // El backend devuelve aquí el id del conteo de pollos (así se llama en la API)
  controlID: number
  fechaPasaje: string
  edadDias: number
  pesoPromedioGr: number
  cantidadPollosEnConteo: number
  nombreDelPollo: string | null
  nombreDelGalpon: string | null
}
