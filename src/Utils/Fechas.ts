// La API devuelve 0001-01-01 cuando una fecha opcional no tiene valor.
// Para el <input type="date"> necesitamos yyyy-MM-dd, o null si está vacía.
export function fechaParaInput(v: string | null | undefined): string | null {
  if (!v || v.startsWith('0001')) return null
  return v.split('T')[0] ?? null
}

// Para mostrar en tablas: "—" si no hay fecha.
export function fechaParaTabla(v: string | null | undefined): string {
  return fechaParaInput(v) ?? '—'
}
