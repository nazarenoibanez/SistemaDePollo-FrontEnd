export interface ControlDePesoResponseDto {
  id: number
  conteoId: number
  trabajadorId: number
  semana: number
  pesoPromedioGr: number
  gananciaPesoDiariaGr: number
  alimentoConsumidoKg: number
  conversionAlimenticia: number
  fechaControl: string
}
