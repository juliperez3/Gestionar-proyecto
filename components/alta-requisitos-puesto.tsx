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
  puestoCreado: {
    codPuesto: string
    nombrePuesto: string
  }
  onSave: (requisito: ProyectoPuestoCarrera) => void
  onCancel: () => void
}

export function AltaRequisitosPuesto({ puestoCreado, onSave, onCancel }: AltaRequisitosPuestoProps) {
  const [formData, setFormData] = useState({
    materiasAprobadas: "",
    materiasRegulares: "",
    planEstudios: "",
    codCarrera: "",
  })
  const [errors, setErrors] = useState<string[]>([])

  const validateForm = () => {
    const newErrors: string[] = []

    // Validar campos requeridos
    if (
      !formData.materiasAprobadas.trim() ||
      !formData.materiasRegulares.trim() ||
      !formData.planEstudios.trim() ||
      !formData.codCarrera.trim()
    ) {
      newErrors.push("Los datos ingresados son incorrectos. Intente nuevamente")
    }

    // Validar valores numéricos
    if (Number.parseInt(formData.materiasAprobadas) < 0) {
      newErrors.push("Las materias aprobadas no pueden ser negativas")
    }

    if (Number.parseInt(formData.materiasRegulares) < 0) {
      newErrors.push("Las materias regulares no pueden ser negativas")
    }

    // Simular búsqueda de carrera no encontrada
    if (formData.codCarrera === "C1111") {
      newErrors.push("No se encontró la carrera con el código ingresado")
    }

    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      const requisitoData: ProyectoPuestoCarrera = {
        codPPC: Date.now(), // ID único temporal
        materiasAprobadas: Number.parseInt(formData.materiasAprobadas),
        materiasRegulares: Number.parseInt(formData.materiasRegulares),
        planEstudios: Number.parseInt(formData.planEstudios),
        carrera: {
          codCarrera: formData.codCarrera,
          nombreCarrera: `Carrera ${formData.codCarrera}`,
        },
        puesto: {
          codPuesto: puestoCreado.codPuesto,
          nombrePuesto: puestoCreado.nombrePuesto,
        },
      }
      onSave(requisitoData)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Sistema de Prácticas Profesionales</h1>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button and title */}
        <div className="mb-8">
          <Button variant="outline" onClick={onCancel} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Información del Puesto</h2>
            <p className="text-gray-600 mt-1">Puesto {puestoCreado.codPuesto}</p>
          </div>
        </div>

        {/* Form Card */}
        <Card>
          <CardHeader>
            <CardTitle>Datos requeridos para el alta de la carrera</CardTitle>
            <CardDescription>Ingrese los siguientes datos:</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Primera columna */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="materiasAprobadas">
                    Materias Aprobadas Requeridas <span className="text-red-500">*</span>
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
                  <Label htmlFor="planEstudios">
                    Código Plan de Estudios <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="planEstudios"
                    type="text"
                    placeholder="Ingresar año del plan de estudios"
                    value={formData.planEstudios}
                    onChange={(e) => setFormData({ ...formData, planEstudios: e.target.value })}
                  />
                </div>
              </div>

              {/* Segunda columna */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="materiasRegulares">
                    Materias Regulares Requeridas <span className="text-red-500">*</span>
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
                  <Label htmlFor="codCarrera">
                    Código Carrera <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="codCarrera"
                    type="text"
                    placeholder="Ingresar código de la carrera"
                    value={formData.codCarrera}
                    onChange={(e) => setFormData({ ...formData, codCarrera: e.target.value })}
                  />
                </div>
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
                <li>• Ingrese datos válidos para simular la creación de una carrera.</li>
                <li>• Ingrese datos incompletos para simular datos no válidos.</li>
                <li>• Ingrese "C1111" como código para simular carrera no encontrada.</li>
                <li>• Ingrese "PE0001" o "PE0002" para simular que ese plan de estudios no se encuentra.</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
