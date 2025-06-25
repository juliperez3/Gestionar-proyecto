"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, AlertCircle, Plus, Edit } from "lucide-react"

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

interface PuestoFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "create" | "edit"
  puesto?: ProyectoPuesto | null
  onSave: (puesto: ProyectoPuesto) => void
}

export function PuestoForm({ open, onOpenChange, mode, puesto, onSave }: PuestoFormProps) {
  const [formData, setFormData] = useState({
    codPuesto: "",
    cantidadVacantes: 1,
    horasDedicadas: 20,
    cantidadSuPostulaciones: 0,
  })
  const [errors, setErrors] = useState<string[]>([])

  useEffect(() => {
    if (puesto && mode === "edit") {
      setFormData({
        codPuesto: puesto.puesto.codPuesto,
        cantidadVacantes: puesto.cantidadVacantes,
        horasDedicadas: puesto.horasDedicadas,
        cantidadSuPostulaciones: puesto.cantidadSuPostulaciones,
      })
    } else {
      setFormData({
        codPuesto: "",
        cantidadVacantes: 1,
        horasDedicadas: 20,
        cantidadSuPostulaciones: 0,
      })
    }
    setErrors([])
  }, [puesto, mode, open])

  const validateForm = () => {
    const newErrors: string[] = []

    if (!formData.codPuesto.trim()) {
      newErrors.push("Debe ingresar el código del puesto")
    }

    // Check if numeric fields contain invalid values
    if (isNaN(formData.cantidadVacantes) || formData.cantidadVacantes <= 0) {
      newErrors.push("Los datos ingresados son incorrectos. Intente nuevamente")
      return false
    }

    if (isNaN(formData.horasDedicadas) || formData.horasDedicadas <= 0) {
      newErrors.push("Los datos ingresados son incorrectos. Intente nuevamente")
      return false
    }

    if (isNaN(formData.cantidadSuPostulaciones) || formData.cantidadSuPostulaciones < 0) {
      newErrors.push("Los datos ingresados son incorrectos. Intente nuevamente")
      return false
    }

    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      const puestoData: ProyectoPuesto = {
        codPP: puesto?.codPP || 0,
        cantidadVacantes: formData.cantidadVacantes,
        cantidadSuPostulaciones: formData.cantidadSuPostulaciones,
        horasDedicadas: formData.horasDedicadas,
        puesto: {
          codPuesto: formData.codPuesto,
          nombrePuesto: `Puesto ${formData.codPuesto}`,
        },
      }
      onSave(puestoData)
    }
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  if (!open) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6 text-center">
            <h1 className="text-3xl font-bold text-gray-900">Sistema de Prácticas Profesionales</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button and title */}
        <div className="mb-8">
          <Button variant="outline" onClick={handleCancel} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {mode === "create" ? "Dar Alta Puesto" : "Modificar Puesto"}
            </h2>
            <p className="text-gray-600 mt-1">
              {mode === "create"
                ? "Ingrese los datos para dar alta a un puesto"
                : "Modifique los datos del puesto seleccionado"}
            </p>
          </div>
        </div>

        {/* Form Card */}
        <Card>
          <CardHeader>
            <CardTitle>Información del Puesto</CardTitle>
            <CardDescription>
              {mode === "create"
                ? "Complete los campos requeridos para dar alta el puesto"
                : "Modifique los campos necesarios del puesto"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {errors.length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <ul className="list-disc list-inside space-y-1">
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="codPuesto">
                  Código Puesto <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="codPuesto"
                  placeholder="Ingrese el código del puesto"
                  value={formData.codPuesto}
                  onChange={(e) => setFormData({ ...formData, codPuesto: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cantidadVacantes">
                  Cantidad Vacantes <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="cantidadVacantes"
                  type="number"
                  min="1"
                  placeholder="Número de vacantes"
                  value={formData.cantidadVacantes}
                  onChange={(e) => {
                    const value = e.target.value
                    if (value === "" || /^\d+$/.test(value)) {
                      setFormData({ ...formData, cantidadVacantes: value === "" ? 0 : Number.parseInt(value) })
                    }
                  }}
                  onKeyPress={(e) => {
                    if (!/[0-9]/.test(e.key) && e.key !== "Backspace" && e.key !== "Delete" && e.key !== "Tab") {
                      e.preventDefault()
                    }
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="horasDedicadas">
                  Horas Dedicadas <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="horasDedicadas"
                  type="number"
                  min="1"
                  max="40"
                  placeholder="Horas semanales"
                  value={formData.horasDedicadas}
                  onChange={(e) => {
                    const value = e.target.value
                    if (value === "" || /^\d+$/.test(value)) {
                      setFormData({ ...formData, horasDedicadas: value === "" ? 0 : Number.parseInt(value) })
                    }
                  }}
                  onKeyPress={(e) => {
                    if (!/[0-9]/.test(e.key) && e.key !== "Backspace" && e.key !== "Delete" && e.key !== "Tab") {
                      e.preventDefault()
                    }
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cantidadSuPostulaciones">
                  Cantidad Máxima de Postulaciones <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="cantidadSuPostulaciones"
                  type="number"
                  min="0"
                  placeholder="Número máximo de postulaciones"
                  value={formData.cantidadSuPostulaciones}
                  onChange={(e) => {
                    const value = e.target.value
                    if (value === "" || /^\d+$/.test(value)) {
                      setFormData({ ...formData, cantidadSuPostulaciones: value === "" ? 0 : Number.parseInt(value) })
                    }
                  }}
                  onKeyPress={(e) => {
                    if (!/[0-9]/.test(e.key) && e.key !== "Backspace" && e.key !== "Delete" && e.key !== "Tab") {
                      e.preventDefault()
                    }
                  }}
                />
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex justify-end space-x-4 pt-6">
              <Button variant="outline" onClick={handleCancel}>
                Cancelar
              </Button>
              <Button onClick={handleSubmit}>
                {mode === "create" ? (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Dar Alta Puesto
                  </>
                ) : (
                  <>
                    <Edit className="h-4 w-4 mr-2" />
                    Guardar Cambios
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
