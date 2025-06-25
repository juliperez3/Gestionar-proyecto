"use client"

import { useState } from "react"
import { EstadoList, type EstadoEstudianteCarrera } from "./components/estado-list"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

// Sample data to demonstrate the interface
const sampleEstados: EstadoEstudianteCarrera[] = [
  {
    codEstadoEstCarrera: "ACT001",
    nombreEstadoEstCarrera: "Activo",
    estadoFechaHoraBajaEC: null,
  },
  {
    codEstadoEstCarrera: "SUS002",
    nombreEstadoEstCarrera: "Suspendido",
    estadoFechaHoraBajaEC: null,
  },
  {
    codEstadoEstCarrera: "GRA003",
    nombreEstadoEstCarrera: "Graduado",
    estadoFechaHoraBajaEC: null,
  },
  {
    codEstadoEstCarrera: "RET004",
    nombreEstadoEstCarrera: "Retirado",
    estadoFechaHoraBajaEC: new Date("2024-01-15"),
  },
  {
    codEstadoEstCarrera: "TRA005",
    nombreEstadoEstCarrera: "Transferido",
    estadoFechaHoraBajaEC: null,
  },
]

export default function Demo() {
  const [estados, setEstados] = useState<EstadoEstudianteCarrera[]>(sampleEstados)

  const handleEdit = (estado: EstadoEstudianteCarrera) => {
    console.log("Editando estado:", estado)
    // Aquí iría la lógica para editar
  }

  const handleDelete = (estado: EstadoEstudianteCarrera) => {
    console.log("Dando de baja estado:", estado)
    // Aquí iría la lógica para dar de baja
    const updatedEstados = estados.map((e) =>
      e.codEstadoEstCarrera === estado.codEstadoEstCarrera ? { ...e, estadoFechaHoraBajaEC: new Date() } : e,
    )
    setEstados(updatedEstados)
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Sistema title - appears on all screens */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Sistema de Prácticas Profesionales</h1>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">Estados de Estudiante-Carrera</CardTitle>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Agregar Estado
          </Button>
        </CardHeader>
        <CardContent>
          <EstadoList estados={estados} onEdit={handleEdit} onDelete={handleDelete} />
        </CardContent>
      </Card>

      {/* Demo with empty state */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-xl">Estado Vacío (Demo)</CardTitle>
        </CardHeader>
        <CardContent>
          <EstadoList estados={[]} onEdit={handleEdit} onDelete={handleDelete} />
        </CardContent>
      </Card>
    </div>
  )
}
