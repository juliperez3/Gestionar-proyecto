import type React from "react"

interface PuestoCreado {
  nombrePuesto: string
  codPuesto: string
  // Add other properties as needed
}

interface AltaRequisitosPuestoProps {
  puestoCreado: PuestoCreado | null
}

const AltaRequisitosPuesto: React.FC<AltaRequisitosPuestoProps> = ({ puestoCreado }) => {
  return (
    <div>
      {puestoCreado ? (
        <div>
          <h3>Información del Puesto</h3>
          <p>Puesto {puestoCreado.codPuesto}</p>
          {/* Add other puesto information here if needed */}
        </div>
      ) : (
        <p>No se ha creado ningún puesto aún.</p>
      )}
    </div>
  )
}

export { AltaRequisitosPuesto } // named export (fixes the import error)
export default AltaRequisitosPuesto
