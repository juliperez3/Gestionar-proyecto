"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ArrowLeft,
  AlertTriangle,
  Plus,
  User,
  Users,
  Clock,
  GraduationCap,
  BookOpen,
  FileText,
  Calendar,
} from "lucide-react"
import { AltaRequisitosPuesto } from "./alta-requisitos-puesto"

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

interface AltaProyectoPuestoProps {
  onSave: (puesto: ProyectoPuesto) => void
  onCancel: () => void
  existingPuestos: ProyectoPuesto[]
  proyectoNombre?: string
}

export function AltaProyectoPuesto({
  onSave,
  onCancel,
  existingPuestos,
  proyectoNombre = "Sistema de Gestión",
}: AltaProyectoPuestoProps) {
  const [formData, setFormData] = useState({
    cantidadSuPostulaciones: "",
    cantidadVacantes: "",
    horasDedicadas: "",
    codPuesto: "",
  })
  const [errors, setErrors] = useState<string[]>([])

  // Estados para el flujo de pantallas
  const [showConfirmacion, setShowConfirmacion] = useState(false)
  const [showRequisitos, setShowRequisitos] = useState(false)
  const [showAltaRequisitos, setShowAltaRequisitos] = useState(false)
  const [showConfirmarRequisitos, setShowConfirmarRequisitos] = useState(false)
  const [showAgregarMasRequisitos, setShowAgregarMasRequisitos] = useState(false)
  const [pendingPuesto, setPendingPuesto] = useState<ProyectoPuesto | null>(null)
  const [pendingRequisito, setPendingRequisito] = useState<ProyectoPuestoCarrera | null>(null)

  const validateForm = () => {
    const newErrors: string[] = []

    // Validar campos requeridos
    if (
      !formData.cantidadSuPostulaciones.trim() ||
      !formData.cantidadVacantes.trim() ||
      !formData.horasDedicadas.trim() ||
      !formData.codPuesto.trim()
    ) {
      newErrors.push("Todos los campos son requeridos")
    }

    // Validar valores numéricos
    if (Number.parseInt(formData.cantidadVacantes) <= 0) {
      newErrors.push("La cantidad de vacantes debe ser mayor a 0")
    }

    if (Number.parseInt(formData.horasDedicadas) <= 0) {
      newErrors.push("Las horas dedicadas deben ser mayor a 0")
    }

    if (Number.parseInt(formData.cantidadSuPostulaciones) < 0) {
      newErrors.push("La cantidad de postulaciones no puede ser negativa")
    }

    // Simular búsqueda de puesto no encontrado
    if (formData.codPuesto === "P1111") {
      newErrors.push("No se encontró el puesto con el código ingresado")
    }

    // Verificar que no exista ya en el proyecto
    const puestoExistente = existingPuestos.find((p) => p.puesto.codPuesto === formData.codPuesto)
    if (puestoExistente) {
      newErrors.push("Ya existe un puesto con este código en el proyecto")
    }

    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      const puestoData: ProyectoPuesto = {
        codPP: 0,
        cantidadVacantes: Number.parseInt(formData.cantidadVacantes),
        cantidadSuPostulaciones: Number.parseInt(formData.cantidadSuPostulaciones),
        horasDedicadas: Number.parseInt(formData.horasDedicadas),
        puesto: {
          codPuesto: formData.codPuesto,
          nombrePuesto: formData.codPuesto,
        },
      }
      setPendingPuesto(puestoData)
      setShowConfirmacion(true)
    }
  }

  // 1° → 2°: Confirmar creación puesto → Requisitos del puesto
  const handleConfirmarCreacionPuesto = () => {
    setShowConfirmacion(false)
    setShowRequisitos(true)
  }

  // 2° → 3°: Requisitos del puesto → Alta ProyectoPuestoCarrera
  const handleConfirmarRequisitosDelPuesto = () => {
    setShowRequisitos(false)
    setShowAltaRequisitos(true)
  }

  // 3° → 4°: Alta ProyectoPuestoCarrera → Confirmar creación requisitos
  const handleSaveRequisito = (requisitoData: ProyectoPuestoCarrera) => {
    setPendingRequisito(requisitoData)
    setShowAltaRequisitos(false)
    setShowConfirmarRequisitos(true)
  }

  // 4° → Pregunta: Confirmar creación requisitos → ¿Agregar más?
  const handleConfirmarCreacionRequisitos = () => {
    setShowConfirmarRequisitos(false)
    setShowAgregarMasRequisitos(true)
  }

  const handleAgregarMasRequisitos = (agregar: boolean) => {
    if (agregar) {
      // Si quiere agregar más, volver a la pantalla de alta requisitos
      setShowAgregarMasRequisitos(false)
      setShowAltaRequisitos(true)
    } else {
      // Si no quiere agregar más, guardar y volver a gestión
      if (pendingPuesto) {
        onSave(pendingPuesto)
      }
    }
  }

  // Pantalla: ¿Desea agregar más requisitos?
  if (showAgregarMasRequisitos) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold text-gray-900">Sistema de Prácticas Profesionales</h1>
        </div>

        {/* Content */}
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="w-full max-w-lg">
            <Card className="shadow-lg">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-bold text-left">Requisitos del Puesto</CardTitle>
                <CardDescription className="text-gray-600 mt-2 text-left">
                  ¿Desea agregar más requisitos para este puesto?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center space-x-4 pt-4">
                  <Button variant="outline" onClick={() => handleAgregarMasRequisitos(false)}>
                    No
                  </Button>
                  <Button onClick={() => handleAgregarMasRequisitos(true)} className="bg-black hover:bg-gray-800">
                    Sí
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  // 4° Pantalla: Confirmar creación Requisitos de Carrera
  if (showConfirmarRequisitos && pendingRequisito) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold text-gray-900">Sistema de Prácticas Profesionales</h1>
        </div>

        {/* Content */}
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="w-full max-w-2xl">
            <Card className="shadow-lg">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-bold text-left">Confirmar creación Requisitos de Carrera</CardTitle>
                <CardDescription className="text-gray-600 mt-2 text-left">
                  Revise los requisitos académicos antes de confirmar su creación
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Requisitos Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-1 text-left">Requisitos Académicos</h3>
                  <p className="text-sm text-gray-600 mb-6 text-left">ProyectoPuestoCarrera</p>

                  {/* Gray background box */}
                  <div className="bg-gray-50 rounded-lg p-6 border">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <BookOpen className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Materias Aprobadas Requeridas</p>
                          <p className="text-gray-600">{pendingRequisito.materiasAprobadas}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <FileText className="h-5 w-5 text-green-500" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Materias Regulares Requeridas</p>
                          <p className="text-gray-600">{pendingRequisito.materiasRegulares}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <GraduationCap className="h-5 w-5 text-orange-500" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Código de Carrera</p>
                          <p className="text-gray-600">{pendingRequisito.carrera.codCarrera}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <Calendar className="h-5 w-5 text-purple-500" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Código Plan de Estudios</p>
                          <p className="text-gray-600">{pendingRequisito.planEstudios}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-between pt-6">
                  <Button variant="outline" onClick={() => setShowConfirmarRequisitos(false)}>
                    Volver
                  </Button>
                  <div className="space-x-3">
                    <Button variant="outline" onClick={onCancel}>
                      Cancelar
                    </Button>
                    <Button onClick={handleConfirmarCreacionRequisitos} className="bg-black hover:bg-gray-800">
                      Confirmar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  // 3° Pantalla: Alta ProyectoPuestoCarrera
  if (showAltaRequisitos && pendingPuesto) {
    return (
      <AltaRequisitosPuesto
        puestoCreado={{
          codPuesto: pendingPuesto.puesto.codPuesto,
          nombrePuesto: pendingPuesto.puesto.nombrePuesto,
        }}
        onSave={handleSaveRequisito}
        onCancel={() => {
          setShowAltaRequisitos(false)
          setShowRequisitos(true)
        }}
      />
    )
  }

  // 2° Pantalla: Requisitos del Puesto
  if (showRequisitos) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold text-gray-900">Sistema de Prácticas Profesionales</h1>
        </div>

        {/* Back button */}
        <div className="px-4 mb-4 max-w-2xl mx-auto">
          <Button variant="outline" onClick={() => setShowRequisitos(false)} className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="w-full max-w-lg">
            <Card className="shadow-lg">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-bold text-left">Requisitos del Puesto</CardTitle>
                <CardDescription className="text-gray-600 mt-2 text-left">
                  Debe continuar con la creación de los requisitos del puesto
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center space-x-4 pt-4">
                  <Button variant="outline" onClick={() => setShowRequisitos(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleConfirmarRequisitosDelPuesto} className="bg-black hover:bg-gray-800">
                    Confirmar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  // 1° Pantalla: Confirmar creación Puesto
  if (showConfirmacion && pendingPuesto) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold text-gray-900">Sistema de Prácticas Profesionales</h1>
        </div>

        {/* Content */}
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="w-full max-w-2xl">
            <Card className="shadow-lg">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-bold text-left">Confirmar creación Puesto</CardTitle>
                <CardDescription className="text-gray-600 mt-2 text-left">
                  Revise los datos del puesto antes de confirmar su creación
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Puesto Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-1 text-left">Puesto Dado de Alta</h3>
                  <p className="text-sm text-gray-600 mb-6 text-left">Código: {pendingPuesto.puesto.codPuesto}</p>

                  {/* Gray background box */}
                  <div className="bg-gray-50 rounded-lg p-6 border">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <User className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Código del Puesto</p>
                          <p className="text-gray-600">{pendingPuesto.puesto.codPuesto}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <Users className="h-5 w-5 text-green-500" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Cantidad de Vacantes</p>
                          <p className="text-gray-600">{pendingPuesto.cantidadVacantes}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <Clock className="h-5 w-5 text-orange-500" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Horas Dedicadas</p>
                          <p className="text-gray-600">{pendingPuesto.horasDedicadas} horas semanales</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <Users className="h-5 w-5 text-purple-500" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Máximo de Postulaciones</p>
                          <p className="text-gray-600">{pendingPuesto.cantidadSuPostulaciones}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-between pt-6">
                  <Button variant="outline" onClick={() => setShowConfirmacion(false)}>
                    Volver
                  </Button>
                  <div className="space-x-3">
                    <Button variant="outline" onClick={onCancel}>
                      Cancelar
                    </Button>
                    <Button onClick={handleConfirmarCreacionPuesto} className="bg-black hover:bg-gray-800">
                      Confirmar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  // Formulario original - Pantalla inicial
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Sistema de Prácticas Profesionales</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center space-x-4">
          <Button variant="outline" onClick={onCancel}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Alta Puesto</h2>
            <p className="text-gray-600 mt-1">Proyecto: {proyectoNombre}</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Información del Puesto</CardTitle>
            <CardDescription>Complete los campos requeridos para dar alta el puesto</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="cantidadSuPostulaciones">
                  Cantidad Máxima Postulaciones <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="cantidadSuPostulaciones"
                  type="text"
                  placeholder="Ingresar cantidad máxima de postulaciones"
                  value={formData.cantidadSuPostulaciones}
                  onChange={(e) => setFormData({ ...formData, cantidadSuPostulaciones: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cantidadVacantes">
                  Cantidad Vacantes <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="cantidadVacantes"
                  type="text"
                  placeholder="Ingresar cantidad de vacantes"
                  value={formData.cantidadVacantes}
                  onChange={(e) => setFormData({ ...formData, cantidadVacantes: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, horasDedicadas: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="codPuesto">
                  Código Puesto <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="codPuesto"
                  type="text"
                  placeholder="Ingresar código del puesto"
                  value={formData.codPuesto}
                  onChange={(e) => setFormData({ ...formData, codPuesto: e.target.value })}
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
                Confirmar
              </Button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-bold text-blue-800 mb-2">Ejemplos para prueba:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Ingrese datos válidos para simular la creación de un puesto.</li>
                <li>• Ingrese datos incompletos para simular datos no válidos.</li>
                <li>• Ingrese "P1111" como código para simular puesto no encontrado.</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
