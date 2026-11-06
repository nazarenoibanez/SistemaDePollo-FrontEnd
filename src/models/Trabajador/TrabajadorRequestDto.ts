export interface TrabajadorRequestDto {
  nombre: string
  apellido: string
  rol: number // 0 = Empleado, 1 = Supervisor, 2 = Jefe
  email: string
  fechaDeNacimiento: string // Formato yyyy-MM-dd
  fechaIngreso: string
  fechaSalida: string | null // Opcional: null si el trabajador sigue en el criadero
}
