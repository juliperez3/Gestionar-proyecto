"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, AlertTriangle, Edit, Users, Clock, Hash, Briefcase } from "lucide-react"

interface ProyectoPuesto {
  codPP: number
  cantidadVacantes: number
  cantidadSuPostulaciones: number
  horasDedicadas: number
  fechaBajaProyectoPuesto?: string
  puesto: {
    codPuesto: string
    nombrePuesto: string
  }
}

interface ModificarProyectoPuestoProps {
  puesto: ProyectoPuesto
  onSave: (puesto: ProyectoPuesto) => void
  onCancel: () => void
}

export function ModificarProyectoPuesto({ puesto, onSave, onCancel }: ModificarProyectoPuestoProps) {
  const [formData, setFormData] = useState({
    cantidadSuPostulaciones: puesto.cantidadSuPostulaciones.toString(),
    cantidadVacantes: puesto.cantidadVacantes.toString(),
    horasDedicadas: puesto.horasDedicadas.toString(),
  })
  const [errors, setErrors] = useState<string[]>([])
  const [showConfirmation, setShowConfirmation] = useState(false)

  const validateForm = () => {
    const newErrors: string[] = []

    // Validar si hay texto o caracteres no numéricos en los campos
    const hasInvalidChars =
      /[^0-9]/.test(formData.cantidadSuPostulaciones) ||
      /[^0-9]/.test(formData.cantidadVacantes) ||
      /[^0-9]/.test(formData.horasDedicadas)

    if (hasInvalidChars) {
      newErrors.push("Los datos ingresados no son válidos. Intente nuevamente")
    }

    // Validar campos requeridos
    if (
      !formData.cantidadSuPostulaciones.trim() ||
      !formData.cantidadVacantes.trim() ||
      !formData.horasDedicadas.trim()
    ) {
      newErrors.push("Los datos ingresados no son válidos. Intente nuevamente")
    }

    // Solo validar valores numéricos si son números válidos
    if (!hasInvalidChars) {
      if (Number.parseInt(formData.cantidadVacantes) <= 0) {
        newErrors.push("La cantidad de vacantes debe ser mayor a 0")
      }

      if (Number.parseInt(formData.horasDedicadas) <= 0) {
        newErrors.push("Las horas dedicadas deben ser mayor a 0")
      }

      if (Number.parseInt(formData.cantidadSuPostulaciones) < 0) {
        newErrors.push("La cantidad de postulaciones no puede ser negativa")
      }
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
    const updatedPuesto: ProyectoPuesto = {
      ...puesto,
      cantidadVacantes: Number.parseInt(formData.cantidadVacantes),
      cantidadSuPostulaciones: Number.parseInt(formData.cantidadSuPostulaciones),
      horasDedicadas: Number.parseInt(formData.horasDedicadas),
    }
    onSave(updatedPuesto)
  }

  const handleCancelConfirmation = () => {
    setShowConfirmation(false)
  }

  // Pantalla de confirmación - estilo "Confirmar creación del Proyecto"
  if (showConfirmation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6 text-center">
            <h1 className="text-3xl font-bold text-gray-900">Sistema de Prácticas Profesionales</h1>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Confirmar modificación del puesto</h2>
                <p className="text-gray-600">Revise los datos del puesto antes de la modificación final</p>
              </div>

              {/* Título del puesto */}
              <div className="mb-8">
                <div className="flex items-center mb-2">
                  <Briefcase className="h-6 w-6 text-gray-600 mr-2" />
                  <span className="text-gray-600 text-sm">Puesto</span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-1">{puesto.puesto.nombrePuesto}</h3>
                <p className="text-gray-600">Código: {puesto.puesto.codPuesto}</p>
              </div>

              {/* Información en recuadros grises */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <Hash className="h-5 w-5 text-gray-600 mr-2" />
                  <span className="font-medium text-gray-900">Datos del puesto</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Users className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-sm text-gray-600">Cantidad Máxima Postulaciones</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">{formData.cantidadSuPostulaciones}</p>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Users className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-sm text-gray-600">Cantidad Vacantes</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">{formData.cantidadVacantes}</p>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Clock className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-sm text-gray-600">Horas Dedicadas</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">{formData.horasDedicadas}</p>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Sistema de Prácticas Profesionales</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Button variant="outline" onClick={onCancel} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Modificar datos del puesto</h2>
            <p className="text-gray-600 mt-1">Modifique los siguientes datos:</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Información del Puesto</CardTitle>
            <CardDescription>
              Modificando: {puesto.puesto.nombrePuesto} ({puesto.puesto.codPuesto})
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Primera columna */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="cantidadSuPostulaciones">
                    Cantidad Máxima Postulaciones <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="cantidadSuPostulaciones"
                    type="text"
                    placeholder="Ingresar cantidad máxima de postulaciones"
                    value={formData.cantidadSuPostulaciones}
                    onChange={(e) => setFormData({ ...formData, cantidadSuPostulaciones: e.target.value.slice(0, 2) })}
                    maxLength={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="horasDedicadas">
                    Horas Dedicadas <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="horasDedicadas"
                    type="text"
                    placeholder="Ingresar horas dedicadas"
                    value={formData.horasDedicadas}
                    onChange={(e) => setFormData({ ...formData, horasDedicadas: e.target.value.slice(0, 2) })}
                    maxLength={2}
                  />
                </div>
              </div>

              {/* Segunda columna */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="cantidadVacantes">
                    Cantidad Vacantes <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="cantidadVacantes"
                    type="text"
                    placeholder="Ingresar cantidad de vacantes"
                    value={formData.cantidadVacantes}
                    onChange={(e) => setFormData({ ...formData, cantidadVacantes: e.target.value.slice(0, 2) })}
                    maxLength={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="codigoPuesto">Código del Puesto</Label>
                  <Input
                    id="codigoPuesto"
                    type="text"
                    value={puesto.puesto.codPuesto}
                    readOnly
                    className="bg-gray-50 cursor-not-allowed"
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
                <li>• Ingrese texto para simular datos no válidos.</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
