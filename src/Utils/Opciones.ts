// Listas desplegables. Los números (value) son los mismos que usan los enums del backend:
//   TipoDePollo    -> PolloPicaton=0, PolloEstanda=1, PolloPesado=2
//   TiposDeAlimento-> Maiz=0, soya=1, trigo=2, cebada=3
//   RolEmpleado    -> Empelado=0, Supervisor=1, Jefe=2
export interface Opcion {
  value: number
  label: string
  nombre: string // nombre exacto del enum en el backend
}

export const tiposDePollo: Opcion[] = [
  { value: 0, nombre: 'PolloPicaton', label: 'Pollo Picatón' },
  { value: 1, nombre: 'PolloEstanda', label: 'Pollo Estándar' },
  { value: 2, nombre: 'PolloPesado', label: 'Pollo Pesado' },
]

export const tiposDeAlimento: Opcion[] = [
  { value: 0, nombre: 'Maiz', label: 'Maíz' },
  { value: 1, nombre: 'soya', label: 'Soya' },
  { value: 2, nombre: 'trigo', label: 'Trigo' },
  { value: 3, nombre: 'cebada', label: 'Cebada' },
]

export const roles: Opcion[] = [
  { value: 0, nombre: 'Empelado', label: 'Empleado' },
  { value: 1, nombre: 'Supervisor', label: 'Supervisor' },
  { value: 2, nombre: 'Jefe', label: 'Jefe' },
]

// "PolloPicaton" (texto que devuelve la API) -> 0
export function valorPorNombre(opciones: Opcion[], nombre: string | null | undefined): number {
  const o = opciones.find((x) => x.nombre.toLowerCase() === (nombre ?? '').toLowerCase())
  return o ? o.value : 0
}

// Número o nombre del enum -> texto para mostrar en tablas
export function etiqueta(opciones: Opcion[], valor: number | string | null | undefined): string {
  const o = opciones.find(
    (x) => x.value === valor || x.nombre.toLowerCase() === String(valor ?? '').toLowerCase(),
  )
  return o ? o.label : String(valor ?? '')
}
