export interface TrabajadorRequestDto {
  nombre: string
  apellido: string
  rol: number // Enum de rol de empleado
  email: string
  fechaDeNacimiento: string // Formato yyyy-MM-dd
  fechaIngreso: string
  fechaSalida: string
}
