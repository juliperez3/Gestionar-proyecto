"use client"

import { useState } from "react"

const CrearProyectoPage = () => {
  const [nombreProyecto, setNombreProyecto] = useState("")
  const [descripcionProyecto, setDescripcionProyecto] = useState("")
  const [requisitosPuesto, setRequisitosPuesto] = useState([
    {
      puesto: "",
      cantidad: 1,
      planEstudios: "PE1",
    },
  ])

  const handleNombreProyectoChange = (e: any) => {
    setNombreProyecto(e.target.value)
  }

  const handleDescripcionProyectoChange = (e: any) => {
    setDescripcionProyecto(e.target.value)
  }

  const handleRequisitoPuestoChange = (index: number, field: string, value: any) => {
    const updatedRequisitosPuesto = [...requisitosPuesto]
    if (field === "cantidad") {
      updatedRequisitosPuesto[index][field] = Number.parseInt(value)
    } else if (field === "planEstudios") {
      updatedRequisitosPuesto[index][field] = value
    } else {
      updatedRequisitosPuesto[index][field] = value
    }
    setRequisitosPuesto(updatedRequisitosPuesto)
  }

  const handleAddRequisitoPuesto = () => {
    setRequisitosPuesto([
      ...requisitosPuesto,
      {
        puesto: "",
        cantidad: 1,
        planEstudios: "PE1",
      },
    ])
  }

  const handleRemoveRequisitoPuesto = (index: number) => {
    const updatedRequisitosPuesto = [...requisitosPuesto]
    updatedRequisitosPuesto.splice(index, 1)
    setRequisitosPuesto(updatedRequisitosPuesto)
  }

  const handleSaveRequisitosPuesto = async () => {
    // Aquí puedes guardar los requisitos del puesto en tu base de datos o donde sea necesario
    console.log("Requisitos del puesto a guardar:", requisitosPuesto)

    const dataToSave = requisitosPuesto.map((requisito) => ({
      puesto: requisito.puesto,
      cantidad: requisito.cantidad,
      planEstudios: Number.parseInt(requisito.planEstudios.replace("PE", "")), // Guardar solo el número
    }))

    console.log("Data to save:", dataToSave)

    // Example of sending data to an API endpoint
    try {
      const response = await fetch("/api/requisitos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSave),
      })

      if (response.ok) {
        console.log("Requisitos guardados exitosamente!")
      } else {
        console.error("Error al guardar los requisitos:", response.statusText)
      }
    } catch (error) {
      console.error("Error al enviar la solicitud:", error)
    }
  }

  return (
    <div>
      <h1>Crear Proyecto</h1>
      <div>
        <label>Nombre del Proyecto:</label>
        <input type="text" value={nombreProyecto} onChange={handleNombreProyectoChange} />
      </div>
      <div>
        <label>Descripción del Proyecto:</label>
        <textarea value={descripcionProyecto} onChange={handleDescripcionProyectoChange} />
      </div>

      <h2>Requisitos del Puesto</h2>
      {requisitosPuesto.map((requisito, index) => (
        <div key={index}>
          <div>
            <label>Puesto:</label>
            <input
              type="text"
              value={requisito.puesto}
              onChange={(e) => handleRequisitoPuestoChange(index, "puesto", e.target.value)}
            />
          </div>
          <div>
            <label>Cantidad:</label>
            <input
              type="number"
              value={requisito.cantidad}
              onChange={(e) => handleRequisitoPuestoChange(index, "cantidad", e.target.value)}
            />
          </div>
          <div>
            <label>Plan de Estudios:</label>
            <input
              type="text"
              value={requisito.planEstudios}
              onChange={(e) => handleRequisitoPuestoChange(index, "planEstudios", e.target.value)}
            />
          </div>
          <button onClick={() => handleRemoveRequisitoPuesto(index)}>Eliminar</button>
        </div>
      ))}
      <button onClick={handleAddRequisitoPuesto}>Agregar Requisito</button>

      <button onClick={handleSaveRequisitosPuesto}>Guardar Requisitos</button>
    </div>
  )
}

export default CrearProyectoPage
