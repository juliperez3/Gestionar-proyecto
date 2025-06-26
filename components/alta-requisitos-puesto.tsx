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

    if (
      !formData.materiasAprobadas.trim() ||
      !formData.materiasRegulares.trim() ||
      !formData.planEstudios.trim() ||
      !formData.codCarrera.trim()
    ) {
      newErrors.push("Todos los campos son requeridos")
    }

    if (formData.materiasAprobadas && Number.parseInt(formData.materiasAprobadas) < 0) {
      newErrors.push("Las materias aprobadas no pueden ser negativas")
    }

    if (formData.materiasRegulares && Number.parseInt(formData.materiasRegulares) < 0) {
      newErrors.push("Las materias regulares no pueden ser negativas")
    }

    if (formData.planEstudios && Number.parseInt(formData.planEstudios) < 1990) {
      newErrors.push("El plan de estudios debe ser un año válido")
    }

    if (formData.codCarrera === "C1111") {
      newErrors.push("No se encontró la carrera con el código ingresado")
    }

    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      const requisitoData: ProyectoPuestoCarrera = {
        codPPC: Date.now(),
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
      C0002: "Ingeniería Industrial",
      C0003: "Ingeniería Civil",
      C0004: "Licenciatura en Administración",
      C0005: "Contador Público",
    }
    return carreras[codigo] || `Carrera ${codigo}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold text-gray-900">Sistema de Prácticas Profesionales</h1>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Button variant="outline" onClick={onCancel} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Alta Requisitos del Puesto</h2>
            <p className="text-gray-600 mt-1">
              Puesto: {puestoCreado.nombrePuesto} ({puestoCreado.codPuesto})
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Requisitos Académicos</CardTitle>
            <CardDescription>Complete los requisitos académicos para el puesto seleccionado</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="materiasAprobadas">
                  Materias Aprobadas Requeridas <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="materiasAprobadas"
                  type="number"
                  placeholder="Ej: 25"
                  value={formData.materiasAprobadas}
                  onChange={(e) => setFormData({ ...formData, materiasAprobadas: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="materiasRegulares">
                  Materias Regulares Requeridas <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="materiasRegulares"
                  type="number"
                  placeholder="Ej: 5"
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
                  type="number"
                  placeholder="Ej: 2018"
                  value={formData.planEstudios}
                  onChange={(e) => setFormData({ ...formData, planEstudios: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="codCarrera">
                  Código de Carrera <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="codCarrera"
                  type="text"
                  placeholder="Ej: C0001"
                  value={formData.codCarrera}
                  onChange={(e) => setFormData({ ...formData, codCarrera: e.target.value })}
                />
              </div>
            </div>

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
                <Plus className="h-4 w-4 mr-2" />
                Crear Requisito
              </Button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-bold text-blue-800 mb-2">Ejemplos para prueba:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Códigos de carrera válidos: C0001, C0002, C0003, C0004, C0005</li>
                <li>• Ingrese "C1111" como código para simular carrera no encontrada</li>
                <li>• Materias aprobadas: número entre 0 y 50</li>
                <li>• Plan de estudios: año mayor a 1990</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AltaRequisitosPuesto
