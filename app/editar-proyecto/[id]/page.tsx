"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, X, Building, GraduationCap, Calendar, AlertTriangle, Edit } from "lucide-react"

interface Proyecto {
  numeroProyecto: number
  nombreProyecto: string
  descripcionProyecto: string
  fechaInicioPostulaciones?: string | null
  fechaCierrePostulaciones: string
  fechaInicioActividades: string
  fechaFinProyecto: string
  nombreEmpresa: string
  nombreUniversidad: string
  nombreEstadoProyecto: string
  codEstadoProyecto: string
}

// Mock data para empresas y universidades con sus CUITs
const mockEmpresas = [
  { cuit: "20-12345678-9", nombre: "TechCorp SA" },
  { cuit: "20-87654321-0", nombre: "Digital Solutions" },
  { cuit: "20-11111111-1", nombre: "DataTech Inc" },
  { cuit: "20-22222222-2", nombre: "Innovation Labs" },
  { cuit: "20-33333333-3", nombre: "Software Factory" },
  { cuit: "20-44444444-4", nombre: "HR Solutions" },
  { cuit: "20-55555555-5", nombre: "HealthTech Solutions" },
]

const mockUniversidades = [
  { cuit: "30-87654321-0", nombre: "Universidad de Cuyo" },
  { cuit: "30-12345678-9", nombre: "Universidad de Mendoza" },
  { cuit: "30-11111111-1", nombre: "Universidad Aconcagua" },
  { cuit: "30-22222222-2", nombre: "Universidad de Congreso" },
  { cuit: "30-33333333-3", nombre: "Universidad Tecnológica Nacional" },
  { cuit: "30-44444444-4", nombre: "Universidad del Sur" },
  { cuit: "30-55555555-5", nombre: "Universidad Champagnat" },
  { cuit: "30-66666666-6", nombre: "Universidad del Aconcagua" },
]

const mockProyectos: Proyecto[] = [
  {
    numeroProyecto: 1,
    nombreProyecto: "Sistema de Gestión Académica",
    descripcionProyecto: "Desarrollo de sistema para gestión de estudiantes y materias",
    fechaInicioPostulaciones: "2024-12-15",
    fechaCierrePostulaciones: "2025-02-15",
    fechaInicioActividades: "2025-03-15",
    fechaFinProyecto: "2025-12-15",
    nombreEmpresa: "TechCorp SA",
    nombreUniversidad: "Universidad Tecnológica Nacional",
    nombreEstadoProyecto: "Creado",
    codEstadoProyecto: "EST001",
  },
  {
    numeroProyecto: 8,
    nombreProyecto: "Sistema de Gestión Hospitalaria",
    descripcionProyecto: "Desarrollo de sistema integral para gestión de pacientes y recursos hospitalarios",
    fechaInicioPostulaciones: null,
    fechaCierrePostulaciones: "2025-03-10",
    fechaInicioActividades: "2025-04-10",
    fechaFinProyecto: "2025-11-15",
    nombreEmpresa: "HealthTech Solutions",
    nombreUniversidad: "Universidad de Cuyo",
    nombreEstadoProyecto: "Creado",
    codEstadoProyecto: "EST001",
  },
  {
    numeroProyecto: 6,
    nombreProyecto: "Sistema de Recursos Humanos",
    descripcionProyecto: "Plataforma integral para gestión de recursos humanos y nóminas",
    fechaInicioPostulaciones: "2024-12-01",
    fechaCierrePostulaciones: "2025-01-31",
    fechaInicioActividades: "2025-02-28",
    fechaFinProyecto: "2025-09-30",
    nombreEmpresa: "HR Solutions",
    nombreUniversidad: "Universidad de Congreso",
    nombreEstadoProyecto: "Iniciado",
    codEstadoProyecto: "EST002",
  },
  {
    numeroProyecto: 3,
    nombreProyecto: "Plataforma de Análisis de Datos",
    descripcionProyecto: "Sistema de análisis y visualización de datos empresariales",
    fechaInicioPostulaciones: "2024-12-28",
    fechaCierrePostulaciones: "2025-02-28",
    fechaInicioActividades: "2025-03-28",
    fechaFinProyecto: "2025-10-30",
    nombreEmpresa: "DataTech Inc",
    nombreUniversidad: "Universidad de Congreso",
    nombreEstadoProyecto: "En evaluación",
    codEstadoProyecto: "EST003",
  },
  {
    numeroProyecto: 2,
    nombreProyecto: "App Mobile E-commerce",
    descripcionProyecto: "Aplicación móvil para comercio electrónico",
    fechaInicioPostulaciones: "2024-11-01",
    fechaCierrePostulaciones: "2025-03-01",
    fechaInicioActividades: "2025-04-01",
    fechaFinProyecto: "2025-11-30",
    nombreEmpresa: "Digital Solutions",
    nombreUniversidad: "Universidad Champagnat",
    nombreEstadoProyecto: "Suspendido",
    codEstadoProyecto: "EST004",
  },
  {
    numeroProyecto: 5,
    nombreProyecto: "Portal de Servicios Ciudadanos",
    descripcionProyecto: "Plataforma web para trámites y servicios municipales online",
    fechaInicioPostulaciones: "2024-09-15",
    fechaCierrePostulaciones: "2024-11-15",
    fechaInicioActividades: "2024-12-15",
    fechaFinProyecto: "2025-06-30",
    nombreEmpresa: "Software Factory",
    nombreUniversidad: "Universidad del Aconcagua",
    nombreEstadoProyecto: "Cancelado",
    codEstadoProyecto: "EST005",
  },
  {
    numeroProyecto: 4,
    nombreProyecto: "Sistema de Inventario Inteligente",
    descripcionProyecto: "Desarrollo de sistema automatizado para gestión de inventarios con IA",
    fechaInicioPostulaciones: "2024-08-01",
    fechaCierrePostulaciones: "2024-10-01",
    fechaInicioActividades: "2024-11-01",
    fechaFinProyecto: "2024-12-20",
    nombreEmpresa: "Innovation Labs",
    nombreUniversidad: "Universidad de Mendoza",
    nombreEstadoProyecto: "Finalizado",
    codEstadoProyecto: "EST006",
  },
]

export default function EditarProyecto() {
  const router = useRouter()
  const params = useParams()
  const proyectoId = Number(params?.id)

  const [proyecto, setProyecto] = useState<Proyecto | null>(() => {
    // Initialize proyecto immediately
    return mockProyectos.find((p) => p.numeroProyecto === proyectoId) || null
  })

  const [isLoading, setIsLoading] = useState(false)
  const [originalData, setOriginalData] = useState<any>(null)
  const [formData, setFormData] = useState(() => {
    // Initialize formData immediately
    const proyectoEncontrado = mockProyectos.find((p) => p.numeroProyecto === proyectoId)
    if (proyectoEncontrado) {
      const empresa = mockEmpresas.find((e) => e.nombre === proyectoEncontrado.nombreEmpresa)
      const universidad = mockUniversidades.find((u) => u.nombre === proyectoEncontrado.nombreUniversidad)

      return {
        nombreProyecto: proyectoEncontrado.nombreProyecto,
        descripcionProyecto: proyectoEncontrado.descripcionProyecto,
        fechaCierrePostulaciones: proyectoEncontrado.fechaCierrePostulaciones,
        fechaInicioActividades: proyectoEncontrado.fechaInicioActividades,
        fechaFinProyecto: proyectoEncontrado.fechaFinProyecto,
        cuitEmpresa: empresa?.cuit || "",
        cuitUniversidad: universidad?.cuit || "",
      }
    }
    return {
      nombreProyecto: "",
      descripcionProyecto: "",
      fechaCierrePostulaciones: "",
      fechaInicioActividades: "",
      fechaFinProyecto: "",
      cuitEmpresa: "",
      cuitUniversidad: "",
    }
  })

  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({})
  const [generalErrors, setGeneralErrors] = useState<string[]>([])
  const [showErrors, setShowErrors] = useState(true)
  const [showProjectSummary, setShowProjectSummary] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Set originalData on mount
  useEffect(() => {
    if (proyecto && !originalData) {
      const empresa = mockEmpresas.find((e) => e.nombre === proyecto.nombreEmpresa)
      const universidad = mockUniversidades.find((u) => u.nombre === proyecto.nombreUniversidad)

      const initialData = {
        nombreProyecto: proyecto.nombreProyecto,
        descripcionProyecto: proyecto.descripcionProyecto,
        fechaCierrePostulaciones: proyecto.fechaCierrePostulaciones,
        fechaInicioActividades: proyecto.fechaInicioActividades,
        fechaFinProyecto: proyecto.fechaFinProyecto,
        cuitEmpresa: empresa?.cuit || "",
        cuitUniversidad: universidad?.cuit || "",
      }

      setOriginalData(initialData)
    }
  }, [proyecto, originalData])

  // Check if project state allows editing and redirect if not
  useEffect(() => {
    if (proyecto) {
      const estadosNoEditables = ["En evaluación", "Cancelado", "Finalizado"]
      if (estadosNoEditables.includes(proyecto.nombreEstadoProyecto)) {
        // Redirect back to main page immediately
        router.push("/")
        return
      }
    }
  }, [proyecto, router])

  // Auto-hide errors after 5 seconds
  useEffect(() => {
    if ((Object.keys(fieldErrors).length > 0 || generalErrors.length > 0) && showErrors) {
      const timer = setTimeout(() => {
        setShowErrors(false)
        // Clear field errors when hiding errors
        setFieldErrors({})
        setGeneralErrors([])
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [fieldErrors, generalErrors, showErrors])

  // Función para determinar si un campo es editable según el estado
  const isFieldEditable = (field: string) => {
    if (!proyecto) return false

    const estado = proyecto.nombreEstadoProyecto

    switch (estado) {
      case "Creado":
        // En estado "Creado" NO se pueden editar nombre ni CUITs, solo descripción y fechas
        return !["nombreProyecto", "cuitEmpresa", "cuitUniversidad"].includes(field)

      case "Suspendido":
        // Pueden editar descripción y fechas, NO nombre ni CUITs
        return !["nombreProyecto", "cuitEmpresa", "cuitUniversidad"].includes(field)

      case "Iniciado":
        // Solo pueden editar fechas
        return ["fechaCierrePostulaciones", "fechaInicioActividades", "fechaFinProyecto"].includes(field)

      default:
        return false
    }
  }

  const validateCUIT = (cuit: string) => {
    const cuitRegex = /^\d{2}-\d{8}-\d{1}$/
    return cuitRegex.test(cuit)
  }

  const formatCUIT = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 2) {
      return numbers
    } else if (numbers.length <= 10) {
      return `${numbers.slice(0, 2)}-${numbers.slice(2)}`
    } else {
      return `${numbers.slice(0, 2)}-${numbers.slice(2, 10)}-${numbers.slice(10, 11)}`
    }
  }

  const validateForm = () => {
    const newGeneralErrors: string[] = []
    const newFieldErrors: { [key: string]: string } = {}

    // Validar campos obligatorios
    if (
      !formData.nombreProyecto.trim() ||
      !formData.descripcionProyecto.trim() ||
      !formData.fechaCierrePostulaciones ||
      !formData.fechaInicioActividades ||
      !formData.fechaFinProyecto ||
      !formData.cuitEmpresa.trim() ||
      !formData.cuitUniversidad.trim() ||
      !validateCUIT(formData.cuitEmpresa) ||
      !validateCUIT(formData.cuitUniversidad)
    ) {
      newGeneralErrors.push("Los datos ingresados son incorrectos. Intente nuevamente")
      setGeneralErrors(newGeneralErrors)
      setFieldErrors({})
      setShowErrors(true)
      return false
    }

    // Validar CUIT empresa específico
    if (formData.cuitEmpresa === "11-11111111-1") {
      newFieldErrors.cuitEmpresa = "La empresa para la que ingresó el código no existe. Intente nuevamente."
    }

    // Validar CUIT universidad específico
    if (formData.cuitUniversidad === "22-22222222-2") {
      newFieldErrors.cuitUniversidad = "La universidad para la que ingresó el código no existe. Intente nuevamente."
    }

    // Validar nombre de proyecto duplicado (excluyendo el proyecto actual)
    const nombreDuplicado =
      mockProyectos.some(
        (p) =>
          p.nombreProyecto.toLowerCase() === formData.nombreProyecto.toLowerCase() && p.numeroProyecto !== proyectoId,
      ) || formData.nombreProyecto === "TCodeNova"
    if (nombreDuplicado) {
      newFieldErrors.nombreProyecto = "El nombre del proyecto ya está en uso. Intente con un nombre distinto"
    }

    // Validaciones de fechas
    if (proyecto && Object.keys(newFieldErrors).length === 0) {
      const fechaCierre = new Date(formData.fechaCierrePostulaciones)
      const fechaInicio = new Date(formData.fechaInicioActividades)
      const fechaFin = new Date(formData.fechaFinProyecto)

      // Validar que fechaCierrePostulaciones + 1 mes <= fechaInicioActividades
      const fechaCierreMasUnMes = new Date(fechaCierre)
      fechaCierreMasUnMes.setMonth(fechaCierreMasUnMes.getMonth() + 1)

      if (fechaCierreMasUnMes > fechaInicio) {
        // Solo un error para ambos campos relacionados con fechas
        newGeneralErrors.push(
          "La fecha de inicio de actividades debe ser al menos un mes mayor a la fecha de cierre de postulaciones",
        )
        newFieldErrors.fechaInicioActividades = "error"
        newFieldErrors.fechaCierrePostulaciones = "error"
      }

      // Validar fecha fin proyecto
      if (fechaInicio >= fechaFin) {
        newGeneralErrors.push("La fecha de fin del proyecto debe ser mayor a la fecha de inicio de actividades.")
        newFieldErrors.fechaFinProyecto = "error"
        newFieldErrors.fechaInicioActividades = "error"
      }
    }

    setFieldErrors(newFieldErrors)
    setGeneralErrors(newGeneralErrors)
    setShowErrors(true)
    return Object.keys(newFieldErrors).length === 0 && newGeneralErrors.length === 0
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1500))

    if (validateForm()) {
      // Don't set isSubmitting to false here to prevent glitch
      setShowProjectSummary(true)
    } else {
      // Only set to false if validation failed
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push("/")
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const getEmpresaNombre = () => {
    const empresa = mockEmpresas.find((e) => e.cuit === formData.cuitEmpresa)
    return empresa ? empresa.nombre : "Nombre Empresa"
  }

  const getUniversidadNombre = () => {
    const universidad = mockUniversidades.find((u) => u.cuit === formData.cuitUniversidad)
    return universidad ? universidad.nombre : "Nombre Universidad"
  }

  const handleCuitChange = (value: string, field: "cuitEmpresa" | "cuitUniversidad") => {
    if (!isFieldEditable(field)) return

    const formattedValue = formatCUIT(value)
    setFormData({ ...formData, [field]: formattedValue })

    if (fieldErrors[field]) {
      setFieldErrors({ ...fieldErrors, [field]: "" })
    }
    if (!showErrors) {
      setShowErrors(true)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    if (!isFieldEditable(field)) return

    setFormData({ ...formData, [field]: value })

    if (fieldErrors[field]) {
      setFieldErrors({ ...fieldErrors, [field]: "" })
    }
    if (!showErrors) {
      setShowErrors(true)
    }
  }

  const handleFieldFocus = (field: string) => {
    if (!isFieldEditable(field)) return

    if (fieldErrors[field]) {
      setFormData({ ...formData, [field]: "" })
      setFieldErrors({ ...fieldErrors, [field]: "" })
    }
  }

  const handleCuitFocus = (field: "cuitEmpresa" | "cuitUniversidad") => {
    if (!isFieldEditable(field)) return

    if (fieldErrors[field]) {
      setFormData({ ...formData, [field]: "" })
      setFieldErrors({ ...fieldErrors, [field]: "" })
    }
  }

  const handleConfirmarModificacion = () => {
    // Aquí se guardarían los cambios
    console.log("Proyecto modificado:", { proyecto, formData })
    router.push("/")
  }

  // Función para detectar cambios
  const getChanges = () => {
    if (!originalData) return []

    const changes = []

    if (originalData.nombreProyecto !== formData.nombreProyecto) {
      changes.push({
        field: "Nombre del Proyecto",
        original: originalData.nombreProyecto,
        new: formData.nombreProyecto,
      })
    }

    if (originalData.descripcionProyecto !== formData.descripcionProyecto) {
      changes.push({
        field: "Descripción",
        original: originalData.descripcionProyecto,
        new: formData.descripcionProyecto,
      })
    }

    if (originalData.fechaCierrePostulaciones !== formData.fechaCierrePostulaciones) {
      changes.push({
        field: "Fecha Cierre Postulaciones",
        original: formatDate(originalData.fechaCierrePostulaciones),
        new: formatDate(formData.fechaCierrePostulaciones),
      })
    }

    if (originalData.fechaInicioActividades !== formData.fechaInicioActividades) {
      changes.push({
        field: "Fecha Inicio Actividades",
        original: formatDate(originalData.fechaInicioActividades),
        new: formatDate(formData.fechaInicioActividades),
      })
    }

    if (originalData.fechaFinProyecto !== formData.fechaFinProyecto) {
      changes.push({
        field: "Fecha Fin Proyecto",
        original: formatDate(originalData.fechaFinProyecto),
        new: formatDate(formData.fechaFinProyecto),
      })
    }

    return changes
  }

  // Pantalla de resumen de modificación
  if (showProjectSummary) {
    // Reset submitting state when showing summary (do this once)
    if (isSubmitting) {
      setIsSubmitting(false)
    }

    const changes = getChanges()

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Sistema de Prácticas Profesionales</h1>
        </div>
        <div className="container mx-auto p-6 max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle>Confirmar Modificación del Proyecto</CardTitle>
              <CardDescription>Revise los cambios realizados antes de confirmar la modificación</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Mostrar cambios realizados */}
              {changes.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-yellow-800 mb-3">
                    <strong>Cambios realizados:</strong>
                  </h4>
                  <div className="space-y-2">
                    {changes.map((change, index) => (
                      <div key={index} className="text-sm text-yellow-700">
                        <span className="font-medium">{change.field}:</span>
                        <div className="ml-4">
                          <span className="text-red-600">Anterior: {change.original}</span>
                          <br />
                          <span className="text-green-600">Nuevo: {change.new}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-white border rounded-lg p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{formData.nombreProyecto}</h3>
                  <p className="text-sm text-gray-500">
                    Proyecto #{proyecto!.numeroProyecto.toString().padStart(5, "0")} • Estado:{" "}
                    {proyecto!.nombreEstadoProyecto}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Descripción</h4>
                  <p className="text-gray-600 leading-relaxed">{formData.descripcionProyecto}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <Building className="h-6 w-6 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-700">Empresa</p>
                      <p className="text-sm text-gray-600">{getEmpresaNombre()}</p>
                      <p className="text-xs text-gray-500">CUIT: {formData.cuitEmpresa}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <GraduationCap className="h-6 w-6 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-700">Universidad</p>
                      <p className="text-sm text-gray-600">{getUniversidadNombre()}</p>
                      <p className="text-xs text-gray-500">CUIT: {formData.cuitUniversidad}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Cronograma Actualizado
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3 border rounded-lg">
                      <p className="text-sm font-medium text-gray-700">Cierre Postulaciones</p>
                      <p className="text-sm text-gray-600">{formatDate(formData.fechaCierrePostulaciones)}</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <p className="text-sm font-medium text-gray-700">Inicio Actividades</p>
                      <p className="text-sm text-gray-600">{formatDate(formData.fechaInicioActividades)}</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <p className="text-sm font-medium text-gray-700">Fin Proyecto</p>
                      <p className="text-sm text-gray-600">{formatDate(formData.fechaFinProyecto)}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 justify-between pt-4">
                <Button variant="outline" onClick={() => setShowProjectSummary(false)}>
                  Volver
                </Button>
                <div className="flex gap-4">
                  <Button variant="outline" onClick={() => router.push("/")}>
                    Cancelar
                  </Button>
                  <Button onClick={handleConfirmarModificacion} size="lg" className="px-8">
                    Confirmar Modificación
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // If no project found, redirect to home
  if (!proyecto) {
    router.push("/")
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Sistema de Prácticas Profesionales</h1>
      </div>
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={handleCancel}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Modificar Proyecto</h1>
              <p className="text-muted-foreground">
                Proyecto #{proyecto.numeroProyecto.toString().padStart(5, "0")} • Estado:{" "}
                {proyecto.nombreEstadoProyecto}
              </p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Información del Proyecto</CardTitle>
            <CardDescription>Modifique los campos que desee actualizar</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="nombreProyecto">
                  Nombre del Proyecto <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="nombreProyecto"
                  value={formData.nombreProyecto}
                  onChange={(e) => handleInputChange("nombreProyecto", e.target.value)}
                  onFocus={() => handleFieldFocus("nombreProyecto")}
                  placeholder="Ingrese el nombre del proyecto"
                  readOnly={!isFieldEditable("nombreProyecto")}
                  className={`h-12 ${
                    !isFieldEditable("nombreProyecto") ? "bg-gray-100 cursor-not-allowed" : ""
                  } ${showErrors && fieldErrors.nombreProyecto ? "border-red-500" : ""}`}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cuitEmpresa">
                  CUIT Empresa <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="cuitEmpresa"
                  value={formData.cuitEmpresa}
                  onChange={(e) => handleCuitChange(e.target.value, "cuitEmpresa")}
                  onFocus={() => handleCuitFocus("cuitEmpresa")}
                  placeholder="XX-XXXXXXXX-X"
                  maxLength={13}
                  readOnly={!isFieldEditable("cuitEmpresa")}
                  className={`h-12 ${
                    !isFieldEditable("cuitEmpresa") ? "bg-gray-100 cursor-not-allowed" : ""
                  } ${showErrors && fieldErrors.cuitEmpresa ? "border-red-500" : ""}`}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descripcionProyecto">
                Descripción del Proyecto <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="descripcionProyecto"
                value={formData.descripcionProyecto}
                onChange={(e) => handleInputChange("descripcionProyecto", e.target.value)}
                onFocus={() => handleFieldFocus("descripcionProyecto")}
                placeholder="Describa el proyecto y sus objetivos"
                rows={4}
                readOnly={!isFieldEditable("descripcionProyecto")}
                className={`resize-none ${
                  !isFieldEditable("descripcionProyecto") ? "bg-gray-100 cursor-not-allowed" : ""
                } ${showErrors && fieldErrors.descripcionProyecto ? "border-red-500" : ""}`}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cuitUniversidad">
                CUIT Universidad <span className="text-red-500">*</span>
              </Label>
              <Input
                id="cuitUniversidad"
                value={formData.cuitUniversidad}
                onChange={(e) => handleCuitChange(e.target.value, "cuitUniversidad")}
                onFocus={() => handleCuitFocus("cuitUniversidad")}
                placeholder="XX-XXXXXXXX-X"
                maxLength={13}
                readOnly={!isFieldEditable("cuitUniversidad")}
                className={`h-12 ${
                  !isFieldEditable("cuitUniversidad") ? "bg-gray-100 cursor-not-allowed" : ""
                } ${showErrors && fieldErrors.cuitUniversidad ? "border-red-500" : ""}`}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Cronograma del Proyecto</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fechaCierrePostulaciones">
                    Fecha Cierre Postulaciones <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="fechaCierrePostulaciones"
                    type="date"
                    value={formData.fechaCierrePostulaciones}
                    onChange={(e) => handleInputChange("fechaCierrePostulaciones", e.target.value)}
                    onFocus={() => handleFieldFocus("fechaCierrePostulaciones")}
                    readOnly={!isFieldEditable("fechaCierrePostulaciones")}
                    className={`h-12 ${
                      !isFieldEditable("fechaCierrePostulaciones") ? "bg-gray-100 cursor-not-allowed" : ""
                    } ${showErrors && fieldErrors.fechaCierrePostulaciones ? "border-red-500" : ""}`}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fechaInicioActividades">
                    Fecha Inicio Actividades <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="fechaInicioActividades"
                    type="date"
                    value={formData.fechaInicioActividades}
                    onChange={(e) => handleInputChange("fechaInicioActividades", e.target.value)}
                    onFocus={() => handleFieldFocus("fechaInicioActividades")}
                    readOnly={!isFieldEditable("fechaInicioActividades")}
                    className={`h-12 ${
                      !isFieldEditable("fechaInicioActividades") ? "bg-gray-100 cursor-not-allowed" : ""
                    } ${showErrors && fieldErrors.fechaInicioActividades ? "border-red-500" : ""}`}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fechaFinProyecto">
                    Fecha Fin Proyecto <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="fechaFinProyecto"
                    type="date"
                    value={formData.fechaFinProyecto}
                    onChange={(e) => handleInputChange("fechaFinProyecto", e.target.value)}
                    onFocus={() => handleFieldFocus("fechaFinProyecto")}
                    readOnly={!isFieldEditable("fechaFinProyecto")}
                    className={`h-12 ${
                      !isFieldEditable("fechaFinProyecto") ? "bg-gray-100 cursor-not-allowed" : ""
                    } ${showErrors && fieldErrors.fechaFinProyecto ? "border-red-500" : ""}`}
                  />
                </div>
              </div>
            </div>

            {showErrors && (Object.keys(fieldErrors).length > 0 || generalErrors.length > 0) && (
              <div className="space-y-3">
                {generalErrors.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <AlertTriangle className="h-5 w-5 text-red-400" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm text-red-800">
                          {generalErrors.map((error, index) => (
                            <div key={index} className="mb-1 last:mb-0">
                              {error}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {Object.entries(fieldErrors)
                  .filter(([field, error]) => error && error !== "error")
                  .map(([field, error]) => (
                    <div key={field} className="bg-red-50 border border-red-200 rounded-lg p-3">
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

            <div className="flex gap-4 justify-center mt-6 mb-4">
              <Button variant="outline" onClick={handleCancel} size="lg" className="w-40">
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button onClick={handleSubmit} size="lg" disabled={isSubmitting} className="w-40">
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <>
                    <Edit className="h-4 w-4 mr-2" />
                    Modificar Proyecto
                  </>
                )}
              </Button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div>
                <h4 className="text-sm font-medium text-blue-800 mb-2">
                  <strong>Permisos de edición por estado:</strong>
                </h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>
                      <strong>Creado:</strong> Puede modificar descripción y fechas (NO nombre ni CUITs)
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>
                      <strong>Suspendido:</strong> Puede modificar descripción y fechas
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>
                      <strong>Iniciado:</strong> Solo puede modificar fechas
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Los campos no editables aparecen en gris y son de solo lectura</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
