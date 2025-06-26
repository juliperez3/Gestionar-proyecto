"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ArrowLeft,
  X,
  Building,
  GraduationCap,
  Calendar,
  UserPlus,
  Plus,
  AlertTriangle,
  User,
  Clock,
  Users,
  BookOpen,
  FileText,
} from "lucide-react"

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
]

const mockUniversidades = [
  { cuit: "30-12345678-9", nombre: "Universidad Tecnológica Nacional" },
  { cuit: "30-87654321-0", nombre: "Universidad de Cuyo" },
  { cuit: "30-11111111-1", nombre: "Universidad Congreso" },
  { cuit: "30-22222222-2", nombre: "Universidad del Sur" },
  { cuit: "30-33333333-3", nombre: "Universidad Privada" },
]

const mockProyectosExistentes: Proyecto[] = [
  {
    numeroProyecto: 1,
    nombreProyecto: "Sistema de Gestión Académica",
    descripcionProyecto: "Desarrollo de sistema para gestión de estudiantes y materias",
    fechaInicioPostulaciones: "2025-01-15",
    fechaCierrePostulaciones: "2025-02-15",
    fechaInicioActividades: "2025-03-01",
    fechaFinProyecto: "2025-12-15",
    nombreEmpresa: "TechCorp SA",
    nombreUniversidad: "Universidad Tecnológica Nacional",
    nombreEstadoProyecto: "Iniciado",
    codEstadoProyecto: "EST001",
  },
  {
    numeroProyecto: 2,
    nombreProyecto: "TCodeNova",
    descripcionProyecto: "Aplicación móvil para comercio electrónico",
    fechaInicioPostulaciones: "2025-02-15",
    fechaCierrePostulaciones: "2025-03-01",
    fechaInicioActividades: "2025-04-01",
    fechaFinProyecto: "2025-11-30",
    nombreEmpresa: "Digital Solutions",
    nombreUniversidad: "Universidad de Cuyo",
    nombreEstadoProyecto: "Creado",
    codEstadoProyecto: "EST002",
  },
]

export default function CrearProyecto() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    nombreProyecto: "",
    descripcionProyecto: "",
    fechaCierrePostulaciones: "",
    fechaInicioActividades: "",
    fechaFinProyecto: "",
    cuitEmpresa: "",
    cuitUniversidad: "",
  })
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({})
  const [generalErrors, setGeneralErrors] = useState<string[]>([])
  const [showErrors, setShowErrors] = useState(true)
  const [showProjectSummary, setShowProjectSummary] = useState(false)
  const [showPositionManagement, setShowPositionManagement] = useState(false)
  const [selectedAction, setSelectedAction] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPositionConfirmation, setShowPositionConfirmation] = useState(false)
  const [showPuestoForm, setShowPuestoForm] = useState(false)
  const [puestoFormData, setPuestoFormData] = useState({
    cantidadMaximaPostulaciones: "",
    cantidadVacantes: "",
    horasDedicadas: "",
    codPuesto: "",
  })
  const [puestoFieldErrors, setPuestoFieldErrors] = useState<{ [key: string]: string }>({})
  const [puestoGeneralErrors, setPuestoGeneralErrors] = useState<string[]>([])
  const [showPuestoErrors, setShowPuestoErrors] = useState(true)
  const [showPuestoSummary, setShowPuestoSummary] = useState(false)
  const [showRequisitosConfirmation, setShowRequisitosConfirmation] = useState(false)

  // Estados para ProyectoPuestoCarrera
  const [showCarreraForm, setShowCarreraForm] = useState(false)
  const [carreraFormData, setCarreraFormData] = useState({
    cantMateriasAprobadasReq: "",
    cantMateriasRegularesReq: "",
    codCarrera: "",
    codPlanEstudios: "",
  })
  const [carreraFieldErrors, setCarreraFieldErrors] = useState<{ [key: string]: string }>({})
  const [carreraGeneralErrors, setCarreraGeneralErrors] = useState<string[]>([])
  const [showCarreraErrors, setShowCarreraErrors] = useState(true)
  const [showCarreraSummary, setShowCarreraSummary] = useState(false)

  // NUEVO: Estados para almacenar puestos y requisitos creados
  const [puestosCreados, setPuestosCreados] = useState<
    Array<{
      codPuesto: string
      nombrePuesto: string
      cantidadVacantes: number
      horasDedicadas: number
      cantidadMaximaPostulaciones: number
      requisitos: Array<{
        codCarrera: string
        nombreCarrera: string
        cantMateriasAprobadasReq: number
        cantMateriasRegularesReq: number
        codPlanEstudios: string
      }>
    }>
  >([])
  const [puestoActual, setPuestoActual] = useState<{
    codPuesto: string
    nombrePuesto: string
    cantidadVacantes: number
    horasDedicadas: number
    cantidadMaximaPostulaciones: number
  } | null>(null)

  // NUEVO: Estado para la pantalla de agregar más requisitos
  const [showAgregarMasRequisitos, setShowAgregarMasRequisitos] = useState(false)
  // NUEVO: Estado para la pantalla de agregar más puestos
  const [showAgregarMasPuestos, setShowAgregarMasPuestos] = useState(false)

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

  // Auto-hide puesto errors after 5 seconds
  useEffect(() => {
    if ((Object.keys(puestoFieldErrors).length > 0 || puestoGeneralErrors.length > 0) && showPuestoErrors) {
      const timer = setTimeout(() => {
        setShowPuestoErrors(false)
        setPuestoFieldErrors({})
        setPuestoGeneralErrors([])
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [puestoFieldErrors, puestoGeneralErrors, showPuestoErrors])

  // Auto-hide carrera errors after 5 seconds
  useEffect(() => {
    if ((Object.keys(carreraFieldErrors).length > 0 || carreraGeneralErrors.length > 0) && showCarreraErrors) {
      const timer = setTimeout(() => {
        setShowCarreraErrors(false)
        setCarreraFieldErrors({})
        setCarreraGeneralErrors([])
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [carreraFieldErrors, carreraGeneralErrors, showCarreraErrors])

  const validateCUIT = (cuit: string) => {
    // Validar formato CUIT: XX-XXXXXXXX-X
    const cuitRegex = /^\d{2}-\d{8}-\d{1}$/
    return cuitRegex.test(cuit)
  }

  const formatCUIT = (value: string) => {
    // Remover todo lo que no sea número
    const numbers = value.replace(/\D/g, "")

    // Aplicar formato XX-XXXXXXXX-X
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

    // 1. Validar campos obligatorios vacíos o mal formateados
    if (
      !formData.nombreProyecto.trim() ||
      !formData.descripcionProyecto.trim() ||
      !formData.fechaCierrePostulaciones ||
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

    // 2. Validar casos específicos y asignar errores a campos específicos

    // CUIT empresa específico
    if (formData.cuitEmpresa === "11-11111111-1") {
      newFieldErrors.cuitEmpresa = "La empresa para la que ingresó el código no existe. Intente nuevamente."
    }

    // CUIT universidad específico
    if (formData.cuitUniversidad === "22-22222222-2") {
      newFieldErrors.cuitUniversidad = "La universidad para la que ingresó el código no existe. Intente nuevamente."
    }

    // Nombre de proyecto específico
    if (formData.nombreProyecto === "TCodeNova") {
      newFieldErrors.nombreProyecto = "El nombre del proyecto ya está en uso. Intente con un nombre distinto"
    }

    // Validaciones adicionales solo si no hay errores específicos
    if (Object.keys(newFieldErrors).length === 0) {
      // Calcular fecha de inicio si no se proporcionó
      let fechaInicioCalculada = formData.fechaInicioActividades
      if (!fechaInicioCalculada && formData.fechaCierrePostulaciones) {
        const fechaCierre = new Date(formData.fechaCierrePostulaciones)
        fechaCierre.setMonth(fechaCierre.getMonth() + 1)
        fechaInicioCalculada = fechaCierre.toISOString().split("T")[0]
        // Actualizar el estado con la fecha calculada
        setFormData((prev) => ({ ...prev, fechaInicioActividades: fechaInicioCalculada }))
      }

      // Validar fechas - verificar que inicio sea al menos 1 mes mayor que cierre
      if (formData.fechaCierrePostulaciones && fechaInicioCalculada) {
        const fechaCierre = new Date(formData.fechaCierrePostulaciones)
        const fechaInicio = new Date(fechaInicioCalculada)

        // Calcular fecha mínima (cierre + 1 mes)
        const fechaMinimaInicio = new Date(fechaCierre)
        fechaMinimaInicio.setMonth(fechaMinimaInicio.getMonth() + 1)

        if (fechaInicio < fechaMinimaInicio) {
          newGeneralErrors.push(
            "La fecha de inicio de actividades debe ser al menos un mes mayor a la fecha de cierre de postulaciones",
          )
          newFieldErrors.fechaInicioActividades = "error"
          newFieldErrors.fechaCierrePostulaciones = "error"
        }
      }

      // Validar nombre de proyecto duplicado (para otros nombres)
      const nombreDuplicado = mockProyectosExistentes.some(
        (p) => p.nombreProyecto.toLowerCase() === formData.nombreProyecto.toLowerCase(),
      )
      if (nombreDuplicado) {
        newFieldErrors.nombreProyecto = "El nombre del proyecto ya está en uso. Intente con un nombre distinto"
      }

      // Validar fecha fin proyecto
      if (fechaInicioCalculada && formData.fechaFinProyecto) {
        const fechaInicio = new Date(fechaInicioCalculada)
        const fechaFin = new Date(formData.fechaFinProyecto)

        if (fechaInicio >= fechaFin) {
          newGeneralErrors.push("La fecha de fin del proyecto debe ser mayor a la fecha de inicio de actividades.")
          newFieldErrors.fechaFinProyecto = "error"
          newFieldErrors.fechaInicioActividades = "error"
        }
      }
    }

    setFieldErrors(newFieldErrors)
    setGeneralErrors(newGeneralErrors)
    setShowErrors(true)
    return Object.keys(newFieldErrors).length === 0 && newGeneralErrors.length === 0
  }

  const validatePuestoForm = () => {
    const newGeneralErrors: string[] = []
    const newFieldErrors: { [key: string]: string } = {}

    // 1. Validar campos obligatorios vacíos
    if (
      !puestoFormData.codPuesto.trim() ||
      !puestoFormData.cantidadVacantes.trim() ||
      !puestoFormData.horasDedicadas.trim() ||
      !puestoFormData.cantidadMaximaPostulaciones.trim() ||
      Number.parseInt(puestoFormData.cantidadVacantes) <= 0 ||
      Number.parseInt(puestoFormData.horasDedicadas) <= 0 ||
      Number.parseInt(puestoFormData.cantidadMaximaPostulaciones) < 0
    ) {
      newGeneralErrors.push("Los datos ingresados son incorrectos. Intente nuevamente")
      setPuestoGeneralErrors(newGeneralErrors)
      setPuestoFieldErrors({})
      setShowPuestoErrors(true)
      return false
    }

    // 2. Validar código de puesto específico
    if (puestoFormData.codPuesto === "P0001") {
      newFieldErrors.codPuesto = "No se ha encontrado el puesto del codigo ingresado."
    }

    setPuestoFieldErrors(newFieldErrors)
    setPuestoGeneralErrors(newGeneralErrors)
    setShowPuestoErrors(true)
    return Object.keys(newFieldErrors).length === 0 && newGeneralErrors.length === 0
  }

  const validateCarreraForm = () => {
    const newGeneralErrors: string[] = []
    const newFieldErrors: { [key: string]: string } = {}

    // 1. Validar campos obligatorios vacíos
    if (
      !carreraFormData.cantMateriasAprobadasReq.trim() ||
      !carreraFormData.cantMateriasRegularesReq.trim() ||
      !carreraFormData.codCarrera.trim() ||
      !carreraFormData.codPlanEstudios.trim() ||
      Number.parseInt(carreraFormData.cantMateriasAprobadasReq) <= 0 ||
      Number.parseInt(carreraFormData.cantMateriasRegularesReq) <= 0
    ) {
      newGeneralErrors.push("Los datos ingresados son incorrectos. Intente nuevamente")
      setCarreraGeneralErrors(newGeneralErrors)
      setCarreraFieldErrors({})
      setShowCarreraErrors(true)
      return false
    }

    // 2. Validar códigos específicos
    if (carreraFormData.codCarrera === "C0001") {
      newFieldErrors.codCarrera = "No se ha encontrado la carrera con el código ingresado."
    }

    if (carreraFormData.codPlanEstudios === "PE0001" || carreraFormData.codPlanEstudios === "PE0002") {
      newFieldErrors.codPlanEstudios = "No se ha encontrado el plan de estudios con el código ingresado."
    }

    setCarreraFieldErrors(newFieldErrors)
    setCarreraGeneralErrors(newGeneralErrors)
    setShowCarreraErrors(true)
    return Object.keys(newFieldErrors).length === 0 && newGeneralErrors.length === 0
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    // Simulate loading time
    await new Promise((resolve) => setTimeout(resolve, 1500))

    if (validateForm()) {
      setShowProjectSummary(true) // Ir directamente al resumen del proyecto
    }
    setIsSubmitting(false)
  }

  const handlePuestoSubmit = () => {
    if (validatePuestoForm()) {
      setShowPuestoForm(false) // Ocultar el formulario
      setShowPuestoSummary(true) // Mostrar resumen del puesto directamente
    }
  }

  const handleCarreraSubmit = () => {
    if (validateCarreraForm()) {
      setShowCarreraForm(false) // Ocultar el formulario
      setShowCarreraSummary(true) // Mostrar resumen de carrera directamente
    }
  }

  const handleFinalConfirm = () => {
    // Aquí normalmente guardarías el proyecto
    console.log("Proyecto creado:", formData)
    router.push("/")
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
    const formattedValue = formatCUIT(value)
    setFormData({ ...formData, [field]: formattedValue })

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (fieldErrors[field]) {
      setFieldErrors({ ...fieldErrors, [field]: "" })
    }
    // Reset error visibility when user starts typing
    if (!showErrors) {
      setShowErrors(true)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (fieldErrors[field]) {
      setFieldErrors({ ...fieldErrors, [field]: "" })
    }
    // Reset error visibility when user starts typing
    if (!showErrors) {
      setShowErrors(true)
    }
  }

  const handlePuestoInputChange = (field: string, value: string) => {
    setPuestoFormData({ ...puestoFormData, [field]: value })

    // Limpiar errores cuando el usuario empiece a escribir
    if (puestoFieldErrors[field]) {
      setPuestoFieldErrors({ ...puestoFieldErrors, [field]: "" })
    }
    if (puestoGeneralErrors.length > 0) {
      setPuestoGeneralErrors([])
    }
    // Reset error visibility when user starts typing
    if (!showPuestoErrors) {
      setShowPuestoErrors(true)
    }
  }

  const handleCarreraInputChange = (field: string, value: string) => {
    setCarreraFormData({ ...carreraFormData, [field]: value })

    // Limpiar errores cuando el usuario empiece a escribir
    if (carreraFieldErrors[field]) {
      setCarreraFieldErrors({ ...carreraFieldErrors, [field]: "" })
    }
    if (carreraGeneralErrors.length > 0) {
      setCarreraGeneralErrors([])
    }
    // Reset error visibility when user starts typing
    if (!showCarreraErrors) {
      setShowCarreraErrors(true)
    }
  }

  // Función para manejar el focus en campos con errores
  const handleFieldFocus = (field: string) => {
    // Si el campo tiene error, limpiar su contenido cuando se hace focus
    if (fieldErrors[field]) {
      setFormData({ ...formData, [field]: "" })
      setFieldErrors({ ...fieldErrors, [field]: "" })
    }
  }

  // Función específica para campos CUIT con focus
  const handleCuitFocus = (field: "cuitEmpresa" | "cuitUniversidad") => {
    // Si el campo tiene error, limpiar su contenido cuando se hace focus
    if (fieldErrors[field]) {
      setFormData({ ...formData, [field]: "" })
      setFieldErrors({ ...fieldErrors, [field]: "" })
    }
  }

  const handleContinuarPuesto = () => {
    // Establecer el puesto actual
    setPuestoActual({
      codPuesto: puestoFormData.codPuesto,
      nombrePuesto: `Puesto ${puestoFormData.codPuesto}`,
      cantidadVacantes: Number.parseInt(puestoFormData.cantidadVacantes),
      horasDedicadas: Number.parseInt(puestoFormData.horasDedicadas),
      cantidadMaximaPostulaciones: Number.parseInt(puestoFormData.cantidadMaximaPostulaciones),
    })

    setShowPuestoSummary(false)
    setShowRequisitosConfirmation(true) // Mostrar pantalla de requisitos
  }

  const handleConfirmarRequisitos = () => {
    setShowRequisitosConfirmation(false)
    setShowCarreraForm(true) // Mostrar formulario de carrera
  }

  // NUEVO: Manejar confirmación de carrera → Mostrar pantalla de agregar más requisitos
  const handleContinuarCarrera = () => {
    // Guardar el requisito actual
    if (puestoActual) {
      const nuevoRequisito = {
        codCarrera: carreraFormData.codCarrera,
        nombreCarrera: getCarreraNombre(carreraFormData.codCarrera),
        cantMateriasAprobadasReq: Number.parseInt(carreraFormData.cantMateriasAprobadasReq),
        cantMateriasRegularesReq: Number.parseInt(carreraFormData.cantMateriasRegularesReq),
        codPlanEstudios: carreraFormData.codPlanEstudios,
      }

      // Actualizar puestos creados con el nuevo requisito
      setPuestosCreados((prev) => {
        const existingIndex = prev.findIndex((p) => p.codPuesto === puestoActual.codPuesto)
        if (existingIndex >= 0) {
          const updated = [...prev]
          updated[existingIndex] = {
            ...updated[existingIndex],
            requisitos: [...updated[existingIndex].requisitos, nuevoRequisito],
          }
          return updated
        } else {
          return [
            ...prev,
            {
              ...puestoActual,
              requisitos: [nuevoRequisito],
            },
          ]
        }
      })
    }

    setShowCarreraSummary(false)
    setShowAgregarMasRequisitos(true) // Mostrar pantalla de agregar más requisitos
  }

  // NUEVO: Manejar la decisión de agregar más requisitos
  const handleAgregarMasRequisitos = (agregar: boolean) => {
    if (agregar) {
      // Si quiere agregar más, limpiar campos y volver al formulario de carrera
      setCarreraFormData({
        cantMateriasAprobadasReq: "",
        cantMateriasRegularesReq: "",
        codCarrera: "",
        codPlanEstudios: "",
      })
      setShowAgregarMasRequisitos(false)
      setShowCarreraForm(true)
    } else {
      // Si no quiere agregar más requisitos, solo continuar con los puestos ya guardados
      // No necesitamos agregar el requisito aquí porque ya se agregó en handleContinuarCarrera
      setShowAgregarMasRequisitos(false)
      setShowAgregarMasPuestos(true)
    }
  }

  // NUEVO: Manejar la decisión de agregar más puestos
  const handleAgregarMasPuestos = (agregar: boolean) => {
    if (agregar) {
      // Si quiere agregar más puestos, limpiar campos de puesto Y carrera
      setPuestoFormData({
        cantidadMaximaPostulaciones: "",
        cantidadVacantes: "",
        horasDedicadas: "",
        codPuesto: "",
      })
      // NUEVO: También limpiar los campos de carrera para el nuevo puesto
      setCarreraFormData({
        cantMateriasAprobadasReq: "",
        cantMateriasRegularesReq: "",
        codCarrera: "",
        codPlanEstudios: "",
      })
      // Limpiar puesto actual
      setPuestoActual(null)
      setShowAgregarMasPuestos(false)
      setShowPuestoForm(true)
    } else {
      // Si no quiere agregar más puestos, crear el proyecto y volver a la pantalla principal
      const nuevoProyecto = {
        numeroProyecto: Math.max(...mockProyectosExistentes.map((p) => p.numeroProyecto)) + 1,
        nombreProyecto: formData.nombreProyecto,
        descripcionProyecto: formData.descripcionProyecto,
        fechaInicioPostulaciones: null, // Null para proyectos en estado "Creado"
        fechaCierrePostulaciones: formData.fechaCierrePostulaciones,
        fechaInicioActividades: formData.fechaInicioActividades,
        fechaFinProyecto: formData.fechaFinProyecto,
        nombreEmpresa: getEmpresaNombre(),
        nombreUniversidad: getUniversidadNombre(),
        nombreEstadoProyecto: "Creado",
        codEstadoProyecto: "EST001",
      }

      console.log("Proyecto, puesto(s) y carrera(s) creados:", {
        formData,
        nuevoProyecto,
        puestosCreados,
      })

      // Redirigir a la pantalla principal
      router.push(`/?nuevoProyecto=${encodeURIComponent(JSON.stringify(nuevoProyecto))}`)
    }
  }

  const getCarreraNombre = (codigo: string) => {
    const carreras: { [key: string]: string } = {
      C0001: "Ingeniería en Sistemas",
      C0002: "Diseño Gráfico",
      C0003: "Administración de Empresas",
      C0004: "Contaduría Pública",
      C0005: "Ingeniería Industrial",
    }
    return carreras[codigo] || `Carrera ${codigo}`
  }

  // NUEVA PANTALLA: ¿Desea agregar más puestos?
  if (showAgregarMasPuestos) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold text-gray-900">Sistema de Prácticas Profesionales</h1>
        </div>

        {/* Content */}
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="w-full max-w-4xl">
            <Card className="shadow-lg">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-bold text-left">Puestos del Proyecto</CardTitle>
                <CardDescription className="text-gray-600 mt-2 text-left">
                  ¿Desea agregar más puestos para este proyecto?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Mostrar puestos creados */}
                {puestosCreados.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Puestos Creados:</h3>
                    {puestosCreados.map((puesto, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4 border">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-medium text-gray-900">{puesto.nombrePuesto}</h4>
                            <p className="text-sm text-gray-600">Código: {puesto.codPuesto}</p>
                          </div>
                          <div className="text-right text-sm text-gray-600">
                            <p>Vacantes: {puesto.cantidadVacantes}</p>
                            <p>Horas: {puesto.horasDedicadas}</p>
                          </div>
                        </div>

                        {/* Mostrar requisitos del puesto */}
                        {puesto.requisitos.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <p className="text-sm font-medium text-gray-700 mb-2">Requisitos:</p>
                            <div className="space-y-2">
                              {puesto.requisitos.map((req, reqIndex) => (
                                <div key={reqIndex} className="bg-white rounded p-3 text-sm">
                                  <div className="grid grid-cols-2 gap-2">
                                    <span>
                                      <strong>Carrera:</strong> {req.nombreCarrera}
                                    </span>
                                    <span>
                                      <strong>Plan:</strong> {req.codPlanEstudios}
                                    </span>
                                    <span>
                                      <strong>Mat. Aprobadas:</strong> {req.cantMateriasAprobadasReq}
                                    </span>
                                    <span>
                                      <strong>Mat. Regulares:</strong> {req.cantMateriasRegularesReq}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex justify-center space-x-4 pt-4">
                  <Button variant="outline" onClick={() => handleAgregarMasPuestos(false)}>
                    No
                  </Button>
                  <Button onClick={() => handleAgregarMasPuestos(true)} className="bg-black hover:bg-gray-800">
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

  // NUEVA PANTALLA: ¿Desea agregar más requisitos?
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

  // Pantalla de resumen del proyecto con confirmación integrada
  if (showProjectSummary) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        {/* Sistema title - appears on all screens */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Sistema de Prácticas Profesionales</h1>
        </div>
        <div className="container mx-auto p-6 max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle>Confirmar creación del Proyecto</CardTitle>
              <CardDescription>Revise los datos del proyecto antes de la creación final</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Información del proyecto */}
              <div className="bg-white border rounded-lg p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{formData.nombreProyecto}</h3>
                  <p className="text-sm text-gray-500">Proyecto de Prácticas Profesionales</p>
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
                    Cronograma
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

              {/* Botones de confirmación */}
              <div className="flex gap-4 justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowProjectSummary(false)
                    // Volver al formulario principal
                  }}
                >
                  Volver
                </Button>
                <div className="flex gap-4">
                  <Button variant="outline" onClick={() => router.push("/")}>
                    Cancelar
                  </Button>
                  <Button
                    onClick={() => {
                      setShowProjectSummary(false)
                      setShowPositionConfirmation(true) // Mostrar confirmación de posición
                    }}
                    size="lg"
                    className="px-8"
                  >
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

  // Pantalla de confirmación para dar de alta puesto
  if (showPositionConfirmation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        {/* Sistema title - appears on all screens */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Sistema de Prácticas Profesionales</h1>
        </div>
        <div className="container mx-auto p-6 max-w-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowPositionConfirmation(false)
                  setShowProjectSummary(true)
                }}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Agregar Puesto</CardTitle>
              <CardDescription>
                Usted debe dar de alta un puesto y sus requisitos para finalizar la creación del proyecto.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 justify-end">
                <Button variant="outline" onClick={() => router.push("/")}>
                  Cancelar
                </Button>
                <Button
                  onClick={() => {
                    setShowPositionConfirmation(false)
                    setShowPuestoForm(true) // Mostrar formulario de puesto
                  }}
                >
                  Confirmar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (showPuestoForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        {/* Sistema title - appears on all screens */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Sistema de Prácticas Profesionales</h1>
        </div>
        <div className="container mx-auto p-6 max-w-4xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowPuestoForm(false)
                  // Volver al formulario principal del proyecto
                }}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
              <div>
                <h1 className="text-3xl font-bold">Alta Puesto</h1>
                <p className="text-muted-foreground">Proyecto: {formData.nombreProyecto}</p>
              </div>
            </div>
          </div>

          {/* Formulario */}
          <Card>
            <CardHeader>
              <CardTitle>Información del Puesto</CardTitle>
              <CardDescription>Complete los campos requeridos para dar alta el puesto</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="codPuesto">
                    Código Puesto <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="codPuesto"
                    value={puestoFormData.codPuesto}
                    onChange={(e) => handlePuestoInputChange("codPuesto", e.target.value)}
                    placeholder="Ingrese el código del puesto"
                    className={`h-12 ${showPuestoErrors && puestoFieldErrors.codPuesto ? "border-red-500" : ""}`}
                    maxLength={5}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cantidadVacantes">
                    Cantidad Vacantes <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="cantidadVacantes"
                    value={puestoFormData.cantidadVacantes}
                    onChange={(e) => handlePuestoInputChange("cantidadVacantes", e.target.value)}
                    placeholder="Número de vacantes"
                    className="h-12"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="horasDedicadas">
                    Horas Dedicadas <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="horasDedicadas"
                    value={puestoFormData.horasDedicadas}
                    onChange={(e) => handlePuestoInputChange("horasDedicadas", e.target.value)}
                    placeholder="Horas semanales"
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cantidadMaximaPostulaciones">
                    Cantidad Máxima de Postulaciones <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="cantidadMaximaPostulaciones"
                    value={puestoFormData.cantidadMaximaPostulaciones}
                    onChange={(e) => handlePuestoInputChange("cantidadMaximaPostulaciones", e.target.value)}
                    placeholder="Número máximo de postulaciones"
                    className="h-12"
                  />
                </div>
              </div>

              {/* Puesto error messages above buttons */}
              {showPuestoErrors && (Object.keys(puestoFieldErrors).length > 0 || puestoGeneralErrors.length > 0) && (
                <div className="space-y-2">
                  {/* General errors */}
                  {puestoGeneralErrors.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <AlertTriangle className="h-5 w-5 text-red-400" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm text-red-800">
                            {puestoGeneralErrors.map((error, index) => (
                              <div key={index} className="mb-1 last:mb-0">
                                {error}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Field-specific errors */}
                  {Object.entries(puestoFieldErrors)
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

              {/* Botones de acción - centrados y mismo tamaño */}
              <div className="flex gap-4 justify-center mt-6 mb-4">
                <Button variant="outline" onClick={() => router.push("/")} size="lg" className="w-40">
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
                <Button onClick={handlePuestoSubmit} size="lg" className="w-40">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Dar Alta Puesto
                </Button>
              </div>

              {/* Ejemplos para prueba */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div>
                  <h4 className="text-sm font-medium text-blue-800 mb-2">
                    <strong>Ejemplos para prueba:</strong>
                  </h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Ingrese datos válidos para simular el alta de un puesto.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Ingrese datos incompletos para simular datos no válidos.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Ingrese "P0001" para simular que ese puesto no se encuentra.</span>
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

  // Nueva pantalla de resumen del puesto
  if (showPuestoSummary) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        {/* Sistema title - appears on all screens */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Sistema de Prácticas Profesionales</h1>
        </div>
        <div className="container mx-auto p-6 max-w-4xl">
          <Card>
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl font-bold text-left">Confirmar creación Puesto</CardTitle>
              <CardDescription className="text-gray-600 mt-2 text-left">
                Revise los datos del puesto antes de confirmar su creación
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Información del puesto */}
              <div>
                <h3 className="text-lg font-semibold mb-1 text-left">Puesto Dado de Alta</h3>
                <p className="text-sm text-gray-600 mb-6 text-left">Código: {puestoFormData.codPuesto}</p>

                {/* Gray background box */}
                <div className="bg-gray-50 rounded-lg p-6 border">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <User className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Código del Puesto</p>
                        <p className="text-gray-600">{puestoFormData.codPuesto}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <Users className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Cantidad de Vacantes</p>
                        <p className="text-gray-600">{puestoFormData.cantidadVacantes}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <Clock className="h-5 w-5 text-orange-500" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Horas Dedicadas</p>
                        <p className="text-gray-600">{puestoFormData.horasDedicadas} horas semanales</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <Users className="h-5 w-5 text-purple-500" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Máximo de Postulaciones</p>
                        <p className="text-gray-600">{puestoFormData.cantidadMaximaPostulaciones}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex gap-4 justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowPuestoSummary(false)
                    setShowPuestoForm(true)
                  }}
                >
                  Volver
                </Button>
                <div className="flex gap-4">
                  <Button variant="outline" onClick={() => router.push("/")}>
                    Cancelar
                  </Button>
                  <Button onClick={handleContinuarPuesto} className="bg-black hover:bg-gray-800">
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

  // Nueva pantalla de confirmación de requisitos
  if (showRequisitosConfirmation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        {/* Sistema title - appears on all screens */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Sistema de Prácticas Profesionales</h1>
        </div>
        <div className="container mx-auto p-6 max-w-lg">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowRequisitosConfirmation(false)
                  setShowPuestoSummary(true)
                }}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </div>
          </div>

          <Card className="bg-white">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl font-bold text-left">Requisitos del Puesto</CardTitle>
              <CardDescription className="text-gray-600 mt-2 text-left">
                Debe continuar con la creación de los requisitos del puesto
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 justify-center pt-4">
                <Button variant="outline" onClick={() => router.push("/")}>
                  Cancelar
                </Button>
                <Button onClick={handleConfirmarRequisitos} className="bg-black hover:bg-gray-800">
                  Confirmar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Nueva pantalla de formulario de carrera
  if (showCarreraForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        {/* Sistema title - appears on all screens */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Sistema de Prácticas Profesionales</h1>
        </div>
        <div className="container mx-auto p-6 max-w-4xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowCarreraForm(false)
                  setShowRequisitosConfirmation(true)
                }}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
              <div>
                <h1 className="text-3xl font-bold">Alta ProyectoPuestoCarrera</h1>
                <p className="text-muted-foreground">Puesto: {puestoActual?.nombrePuesto || "Puesto"}</p>
              </div>
            </div>
          </div>

          {/* Formulario */}
          <Card>
            <CardHeader>
              <CardTitle>Requisitos de Carrera</CardTitle>
              <CardDescription>Complete los campos requeridos para los requisitos académicos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="cantMateriasAprobadasReq">
                    Cantidad Materias Aprobadas Requeridas <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="cantMateriasAprobadasReq"
                    value={carreraFormData.cantMateriasAprobadasReq}
                    onChange={(e) => handleCarreraInputChange("cantMateriasAprobadasReq", e.target.value)}
                    placeholder="Número de materias aprobadas"
                    className={`h-12 ${showCarreraErrors && carreraFieldErrors.cantMateriasAprobadasReq ? "border-red-500" : ""}`}
                    maxLength={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cantMateriasRegularesReq">
                    Cantidad Materias Regulares Requeridas <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="cantMateriasRegularesReq"
                    value={carreraFormData.cantMateriasRegularesReq}
                    onChange={(e) => handleCarreraInputChange("cantMateriasRegularesReq", e.target.value)}
                    placeholder="Número de materias regulares"
                    className={`h-12 ${showCarreraErrors && carreraFieldErrors.cantMateriasRegularesReq ? "border-red-500" : ""}`}
                    maxLength={2}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="codCarrera">
                    Código de Carrera <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="codCarrera"
                    value={carreraFormData.codCarrera}
                    onChange={(e) => handleCarreraInputChange("codCarrera", e.target.value)}
                    placeholder="Código de la carrera"
                    className={`h-12 ${showCarreraErrors && carreraFieldErrors.codCarrera ? "border-red-500" : ""}`}
                    maxLength={5}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="codPlanEstudios">
                    Código Plan de Estudios <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="codPlanEstudios"
                    value={carreraFormData.codPlanEstudios}
                    onChange={(e) => handleCarreraInputChange("codPlanEstudios", e.target.value)}
                    placeholder="Código del plan de estudios"
                    className={`h-12 ${showCarreraErrors && carreraFieldErrors.codPlanEstudios ? "border-red-500" : ""}`}
                    maxLength={6}
                  />
                </div>
              </div>

              {/* Carrera error messages above buttons */}
              {showCarreraErrors && (Object.keys(carreraFieldErrors).length > 0 || carreraGeneralErrors.length > 0) && (
                <div className="space-y-2">
                  {/* General errors */}
                  {carreraGeneralErrors.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <AlertTriangle className="h-5 w-5 text-red-400" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm text-red-800">
                            {carreraGeneralErrors.map((error, index) => (
                              <div key={index} className="mb-1 last:mb-0">
                                {error}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Field-specific errors */}
                  {Object.entries(carreraFieldErrors)
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

              {/* Botones de acción - centrados y mismo tamaño */}
              <div className="flex gap-4 justify-center mt-6 mb-4">
                <Button variant="outline" onClick={() => router.push("/")} size="lg" className="w-40">
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
                <Button onClick={handleCarreraSubmit} size="lg" className="w-40">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Dar Alta Requisitos
                </Button>
              </div>

              {/* Ejemplos para prueba */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div>
                  <h4 className="text-sm font-medium text-blue-800 mb-2">
                    <strong>Ejemplos para prueba:</strong>
                  </h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Ingrese datos válidos para simular el alta de requisitos de carrera.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Ingrese datos incompletos para simular datos no válidos.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Ingrese "C0001" para simular que esa carrera no se encuentra.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Ingrese "PE0001" o "PE0002" para simular que ese plan de estudios no se encuentra.</span>
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

  // Nueva pantalla de resumen de carrera
  if (showCarreraSummary) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        {/* Sistema title - appears on all screens */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Sistema de Prácticas Profesionales</h1>
        </div>
        <div className="container mx-auto p-6 max-w-4xl">
          <Card>
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl font-bold text-left">Confirmar creación Requisitos de Carrera</CardTitle>
              <CardDescription className="text-gray-600 mt-2 text-left">
                Revise los requisitos académicos antes de confirmar su creación
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Información de los requisitos */}
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
                        <p className="text-gray-600">{carreraFormData.cantMateriasAprobadasReq}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <FileText className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Materias Regulares Requeridas</p>
                        <p className="text-gray-600">{carreraFormData.cantMateriasRegularesReq}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <GraduationCap className="h-5 w-5 text-orange-500" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Código de Carrera</p>
                        <p className="text-gray-600">{carreraFormData.codCarrera}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <Calendar className="h-5 w-5 text-purple-500" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Código Plan de Estudios</p>
                        <p className="text-gray-600">{carreraFormData.codPlanEstudios}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex gap-4 justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCarreraSummary(false)
                    setShowCarreraForm(true)
                  }}
                >
                  Volver
                </Button>
                <div className="flex gap-4">
                  <Button variant="outline" onClick={() => router.push("/")}>
                    Cancelar
                  </Button>
                  <Button onClick={handleContinuarCarrera} className="bg-black hover:bg-gray-800">
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      {/* Sistema title - appears on all screens */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Sistema de Prácticas Profesionales</h1>
      </div>
      <div className="container mx-auto p-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={handleCancel}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Crear Nuevo Proyecto</h1>
              <p className="text-muted-foreground">
                Ingrese los datos para crear un nuevo proyecto de prácticas profesionales
              </p>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <Card>
          <CardHeader>
            <CardTitle>Información del Proyecto</CardTitle>
            <CardDescription>Complete todos los campos requeridos para crear el proyecto</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Información básica */}
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
                  className={`h-12 ${showErrors && fieldErrors.nombreProyecto ? "border-red-500" : ""}`}
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
                  className={`h-12 ${showErrors && fieldErrors.cuitEmpresa ? "border-red-500" : ""}`}
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
                className="resize-none"
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
                className={`h-12 ${showErrors && fieldErrors.cuitUniversidad ? "border-red-500" : ""}`}
              />
            </div>

            {/* Fechas */}
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
                    className={`h-12 ${showErrors && fieldErrors.fechaCierrePostulaciones ? "border-red-500" : ""}`}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fechaInicioActividades">Fecha Inicio Actividades</Label>
                  <Input
                    id="fechaInicioActividades"
                    type="date"
                    value={formData.fechaInicioActividades}
                    onChange={(e) => handleInputChange("fechaInicioActividades", e.target.value)}
                    onFocus={() => handleFieldFocus("fechaInicioActividades")}
                    className={`h-12 ${showErrors && fieldErrors.fechaInicioActividades ? "border-red-500" : ""}`}
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
                    className={`h-12 ${showErrors && fieldErrors.fechaFinProyecto ? "border-red-500" : ""}`}
                  />
                </div>
              </div>
            </div>

            {/* All error messages consolidated above buttons - only show if showErrors is true */}
            {showErrors && (Object.keys(fieldErrors).length > 0 || generalErrors.length > 0) && (
              <div className="space-y-3">
                {/* General errors */}
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

                {/* Field-specific errors */}
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

            {/* Botones de acción - centrados y mismo tamaño */}
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
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Proyecto
                  </>
                )}
              </Button>
            </div>

            {/* Ejemplos para prueba */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div>
                <h4 className="text-sm font-medium text-blue-800 mb-2">
                  <strong>Ejemplos para prueba:</strong>
                </h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Ingrese datos válidos para simular la creación de un proyecto nuevo.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Ingrese datos incompletos para simular datos no válidos.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Ingrese "TCodeNova" para simular nombre de proyecto existente.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Ingrese "11-11111111-1" para simular empresa no encontrada.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Ingrese "22-22222222-2" para simular universidad no encontrada.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>
                      Ingrese una fecha de inicio de actividades que no sea un mes mayor a la fecha de cierre para
                      simular fecha no válida.
                    </span>
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
