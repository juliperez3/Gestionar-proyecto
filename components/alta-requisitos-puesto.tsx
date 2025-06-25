"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, AlertTriangle, Plus } from "lucide-react"

interface ProyectoPuestoCarrera {
  codPPC: number
  materiasAprobadas: number
  materiasRegulares: number
  planEstudios: number
  fechaBajaProyectoPuestoCarrera?: string
  carrera: {
    codCarrera: string
    nombreCarrera: string
  }
  puesto: {
    codPuesto: string
    nombrePuesto: string
  }
}

interface AltaRequisitosPuestoProps {
  onSave: (requisito: ProyectoPuestoCarrera) => void
  onCancel: () => void
  puestoCreado: {
    codPuesto: string
    nombrePuesto: string
  }
}

export function AltaRequisitosPuesto({ onSave, onCancel, puestoCreado }: AltaRequisitosPuestoProps) {
  const [formData, setFormData] = useState({
    codCarrera: "",
    materiasAprobadas: "",
    materiasRegulares: "",
    planEstudios: "",
  })
  const [errors, setErrors] = useState<string[]>([])

  const validateForm = () => {
    const newErrors: string[] = []

    // Validar campos requeridos
    if (
      !formData.codCarrera.trim() ||
      !formData.materiasAprobadas.trim() ||
      !formData.materiasRegulares.trim() ||
      !formData.planEstudios.trim()
    ) {
      newErrors.push("Los datos ingresados no son válidos. Intente nuevamente")
    }

    // Validar valores numéricos
    if (Number.parseInt(formData.materiasAprobadas) < 0) {
      newErrors.push("Los datos ingresados no son válidos. Intente nuevamente")
    }

    if (Number.parseInt(formData.materiasRegulares) < 0) {
      newErrors.push("Los datos ingresados no son válidos. Intente nuevamente")
    }

    if (Number.parseInt(formData.planEstudios) <= 0) {
      newErrors.push("Los datos ingresados no son válidos. Intente nuevamente")
    }

    // Simular búsqueda de carrera no encontrada
    if (formData.codCarrera === "C9999") {
      newErrors.push("No se encontró la carrera con el código ingresado")
    }

    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      const requisitoData: ProyectoPuestoCarrera = {
        codPPC: 0,
        materiasAprobadas: Number.parseInt(formData.materiasAprobadas),
        materiasRegulares: Number.parseInt(formData.materiasRegulares),
        planEstudios: Number.parseInt(formData.planEstudios),
        carrera: {
          codCarrera: formData.codCarrera,
          nombreCarrera: getCarreraNombre(formData.codCarrera),
        },
        puesto: puestoCreado,
      }
      onSave(requisitoData)
    }
  }

  const getCarreraNombre = (codigo: string) => {
    const carreras: { [key: string]: string } = {
      C0001: "Ingeniería en Sistemas",
      C0002: "Diseño Gráfico",
      C0003: "Administración de Empresas",
      C0004: "Contaduría Pública",
    }
    return carreras[codigo] || `Carrera ${codigo}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Sistema de Prácticas Profesionales</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button and title */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Button variant="outline" onClick={onCancel}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Alta ProyectoPuestoCarrera</h2>
              <p className="text-gray-600 mt-1">
                Puesto: {puestoCreado.nombrePuesto} ({puestoCreado.codPuesto})
              </p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <Card>
          <CardHeader>
            <CardTitle>Requisitos de Carrera</CardTitle>
            <CardDescription>Complete los campos requeridos para dar alta los requisitos del puesto</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="codCarrera">
                  Código Carrera <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="codCarrera"
                  type="text"
                  placeholder="Ingresar código de carrera"
                  value={formData.codCarrera}
                  onChange={(e) => setFormData({ ...formData, codCarrera: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="materiasAprobadas">
                  Materias Aprobadas <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="materiasAprobadas"
                  type="text"
                  placeholder="Ingresar cantidad de materias aprobadas"
                  value={formData.materiasAprobadas}
                  onChange={(e) => setFormData({ ...formData, materiasAprobadas: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="materiasRegulares">
                  Materias Regulares <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="materiasRegulares"
                  type="text"
                  placeholder="Ingresar cantidad de materias regulares"
                  value={formData.materiasRegulares}
                  onChange={(e) => setFormData({ ...formData, materiasRegulares: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="planEstudios">
                  Plan de Estudios <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="planEstudios"
                  type="text"
                  placeholder="Ingresar código del plan de estudios"
                  value={formData.planEstudios}
                  onChange={(e) => setFormData({ ...formData, planEstudios: e.target.value })}
                />
              </div>
            </div>

            {/* Error messages */}
            {errors.length > 0 && (
              <div className="space-y-2">
                {errors.map((error, index) => (
                  <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <AlertTriangle className="h-4 w-4 text-red-400" />
                      </div>
                      <div className="ml-2">
                        <div className="text-sm text-red-800">{error}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex justify-center space-x-4 pt-6">
              <Button variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              <Button onClick={handleSubmit}>
                <Plus className="h-4 w-4 mr-2" />
                Confirmar
              </Button>
            </div>

            {/* Ejemplos para prueba */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-bold text-blue-800 mb-2">Ejemplos para prueba:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Ingrese "C0001", "C0002", "C0003" o "C0004" como código de carrera válido.</li>
                <li>• Ingrese datos válidos para simular la creación exitosa.</li>
                <li>• Ingrese "C9999" como código para simular carrera no encontrada.</li>
                <li>• Ingrese datos incompletos para simular datos no válidos.</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
