"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, AlertTriangle, Edit, Users, Clock, Hash, GraduationCap } from "lucide-react"

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

interface ModificarProyectoPuestoCarreraProps {
  carrera: ProyectoPuestoCarrera
  onSave: (carrera: ProyectoPuestoCarrera) => void
  onCancel: () => void
}

export function ModificarProyectoPuestoCarrera({ carrera, onSave, onCancel }: ModificarProyectoPuestoCarreraProps) {
  const [formData, setFormData] = useState({
    codigoPPC: carrera.codPPC.toString(),
    materiasAprobadas: carrera.materiasAprobadas.toString(),
    materiasRegulares: carrera.materiasRegulares.toString(),
    planEstudios: carrera.planEstudios.toString(),
  })
  const [errors, setErrors] = useState<string[]>([])
  const [showConfirmation, setShowConfirmation] = useState(false)

  const validateForm = () => {
    const newErrors: string[] = []

    // Validar campos requeridos
    if (
      !formData.codigoPPC.trim() ||
      !formData.materiasAprobadas.trim() ||
      !formData.materiasRegulares.trim() ||
      !formData.planEstudios.trim()
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

    if (Number.parseInt(formData.planEstudios) <= 0) {
      newErrors.push("El plan de estudios debe ser mayor a 0")
    }

    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      setShowConfirmation(true)
    }
  }

  const handleConfirm = () => {
    const updatedCarrera: ProyectoPuestoCarrera = {
      ...carrera,
      codPPC: Number.parseInt(formData.codigoPPC),
      materiasAprobadas: Number.parseInt(formData.materiasAprobadas),
      materiasRegulares: Number.parseInt(formData.materiasRegulares),
      planEstudios: Number.parseInt(formData.planEstudios),
    }
    onSave(updatedCarrera)
  }

  const handleCancelConfirmation = () => {
    setShowConfirmation(false)
  }

  // Pantalla de confirmación
  if (showConfirmation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Sistema de Prácticas Profesionales</h1>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Button variant="outline" onClick={handleCancelConfirmation} className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </div>

          <Card>
            <CardContent className="p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">¿Desea modificar la carrera?</h2>
                <p className="text-gray-600">Revise la información de la carrera antes de confirmar los cambios</p>
              </div>

              {/* Título de la carrera */}
              <div className="mb-8">
                <div className="flex items-center mb-2">
                  <GraduationCap className="h-6 w-6 text-gray-600 mr-2" />
                  <span className="text-gray-600 text-sm">Carrera</span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-1">{carrera.carrera.nombreCarrera}</h3>
                <p className="text-gray-600">Código: {carrera.carrera.codCarrera}</p>
              </div>

              {/* Información en recuadros grises */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <Hash className="h-5 w-5 text-gray-600 mr-2" />
                  <span className="font-medium text-gray-900">Datos de la carrera</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Hash className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-sm text-gray-600">Código PPC</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{formData.codigoPPC}</p>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Users className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-sm text-gray-600">Materias Aprobadas</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{formData.materiasAprobadas}</p>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Users className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-sm text-gray-600">Materias Regulares</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{formData.materiasRegulares}</p>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Clock className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-sm text-gray-600">Plan de Estudios</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{formData.planEstudios}</p>
                  </div>
                </div>
              </div>

              {/* Botones */}
              <div className="flex justify-between items-center pt-6 border-t">
                <Button variant="outline" onClick={handleCancelConfirmation}>
                  Volver
                </Button>
                <div className="space-x-4">
                  <Button variant="outline" onClick={handleCancelConfirmation}>
                    Cancelar
                  </Button>
                  <Button onClick={handleConfirm} className="bg-black hover:bg-gray-800 text-white">
                    Confirmar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Pantalla principal de modificación
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Sistema de Prácticas Profesionales</h1>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Button variant="outline" onClick={onCancel} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Modificar datos de la carrera</h2>
            <p className="text-gray-600 mt-1">Modifique los siguientes datos:</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Información de la Carrera</CardTitle>
            <CardDescription>
              Modificando: {carrera.carrera.nombreCarrera} ({carrera.carrera.codCarrera})
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Primera columna */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="codigoPPC">
                    Código PPC <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="codigoPPC"
                    type="text"
                    placeholder="Ingresar código PPC"
                    value={formData.codigoPPC}
                    onChange={(e) => setFormData({ ...formData, codigoPPC: e.target.value })}
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
              </div>

              {/* Segunda columna */}
              <div className="space-y-6">
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
                  <Label htmlFor="planEstudios">
                    Plan de Estudios <span className="text-red-500">*</span>
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

            <div className="flex justify-center space-x-4 pt-6">
              <Button variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              <Button onClick={handleSubmit}>
                <Edit className="h-4 w-4 mr-2" />
                Modificar
              </Button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-bold text-blue-800 mb-2">Ejemplos para prueba:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Ingrese datos válidos para simular la modificación exitosa.</li>
                <li>• Ingrese datos incompletos para simular datos no válidos.</li>
                <li>• Ingrese valores negativos para simular errores de validación.</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
