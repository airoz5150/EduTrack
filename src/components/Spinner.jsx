// Indicador de carga.
export default function Spinner({ full = false }) {
  return (
    <div className={full ? 'spinner-wrap full' : 'spinner-wrap'}>
      <div className="spinner" />
    </div>
  )
}
