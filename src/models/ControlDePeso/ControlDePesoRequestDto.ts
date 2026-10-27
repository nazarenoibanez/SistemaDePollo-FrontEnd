export interface ControlDePesoRequestDto {
  conteoId: number
  trabajadorId: number
  semana: number
  pesoPromedioGr: number
  gananciaPesoDiariaGr: number
  alimentoConsumidoKg: number
  fechaControl: string // Formato yyyy-MM-dd
}
