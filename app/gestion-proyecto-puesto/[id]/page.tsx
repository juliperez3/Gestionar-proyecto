"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Plus, Edit, Trash2, Briefcase, AlertCircle, BookOpen, AlertTriangle, Calendar } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

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
  contPostulaciones?: number // Added for special handling
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

const mockProyectos: Proyecto[] = [
  {
    numeroProyecto: 1,
    nombreProyecto: "Sistema de Gestión Académica",
    descripcionProyecto: "Desarrollo de sistema para gestión de estudiantes y materias",
    fechaInicioPostulaciones: null,
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
    numeroProyecto: 7,
    nombreProyecto: "Proyecto Suspendido",
    descripcionProyecto: "Proyecto suspendido debido a insuficientes postulaciones",
    fechaInicioPostulaciones: null,
    fechaCierrePostulaciones: "2025-01-15",
    fechaInicioActividades: "2025-02-15",
    fechaFinProyecto: "2025-08-15",
    nombreEmpresa: "Suspended Inc.",
    nombreUniversidad: "Universidad de Suspendido",
    nombreEstadoProyecto: "Suspendido",
    codEstadoProyecto: "EST003",
  },
]

const mockProyectoPuestos: ProyectoPuesto[] = [
  {
    codPP: 1,
    cantidadVacantes: 2,
    cantidadSuPostulaciones: 5,
    horasDedicadas: 20,
    puesto: {
      codPuesto: "P0001",
      nombrePuesto: "Desarrollador Full Stack",
    },
  },
  {
    codPP: 2,
    cantidadVacantes: 1,
    cantidadSuPostulaciones: 3,
    horasDedicadas: 15,
    puesto: {
      codPuesto: "P0004",
      nombrePuesto: "Diseñador UX/UI",
    },
  },
]

const mockProyectoPuestosProyecto7: ProyectoPuesto[] = [
  {
    codPP: 1,
    cantidadVacantes: 5,
    cantidadSuPostulaciones: 10,
    horasDedicadas: 20,
    contPostulaciones: 2, // Postulaciones insuficientes
    puesto: {
      codPuesto: "P0002",
      nombrePuesto: "Analista de Sistemas",
    },
  },
]

export default function GestionProyectoPuestoPage() {
  const router = useRouter()
  const params = useParams()
  const proyectoId = Number.parseInt(params?.id as string)

  const [proyectoPuestos, setProyectoPuestos] = useState<ProyectoPuesto[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(`proyectoPuestos_${proyectoId}`)
      if (saved) {
        return JSON.parse(saved)
      }
    }
    if (proyectoId === 7) {
      return mockProyectoPuestosProyecto7
    }
    if (proyectoId === 8) {
      return []
    }
    return mockProyectoPuestos
  })

  const [selectedPuesto, setSelectedPuesto] = useState<ProyectoPuesto | null>(null)
  const [action, setAction] = useState<"alta" | "modificacion" | "baja" | "requisito" | null>(null)
  const [showActionSelector, setShowActionSelector] = useState(false)
  const [showAltaProyectoPuesto, setShowAltaProyectoPuesto] = useState(false)
  const [showModificarProyectoPuesto, setShowModificarProyectoPuesto] = useState(false)
  const [showBajaProyectoPuesto, setShowBajaProyectoPuesto] = useState(false)
  const [showAltaRequisitos, setShowAltaRequisitos] = useState(false)
  const [showSuspendidoOptions, setShowSuspendidoOptions] = useState(false)
  const [selectedSuspendidoPuesto, setSelectedSuspendidoPuesto] = useState<ProyectoPuesto | null>(null)
  const [showModificarVacantesDialog, setShowModificarVacantesDialog] = useState(false)
  const [showModificarFechasDialog, setShowModificarFechasDialog] = useState(false)
  const [showBajaExitosaDialog, setShowBajaExitosaDialog] = useState(false)
  const [showBajaErrorDialog, setShowBajaErrorDialog] = useState(false)
  const [fechaCierrePostulaciones, setFechaCierrePostulaciones] = useState("")
  const [fechaInicioActividades, setFechaInicioActividades] = useState("")
  const [fechaFinActividades, setFechaFinActividades] = useState("")
  const [fechaError, setFechaError] = useState("")

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(`proyectoPuestos_${proyectoId}`, JSON.stringify(proyectoPuestos))
    }
  }, [proyectoPuestos, proyectoId])

  const proyecto = mockProyectos.find((p) => p.numeroProyecto === proyectoId)

  const puestosActivos = proyectoPuestos.filter((puesto) => !puesto.fechaBajaProyectoPuesto)

  if (!proyecto) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Sistema de Prácticas Profesionales</h1>
        </div>
        <div className="container mx-auto p-6">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <h3 className="text-lg font-semibold mb-2">Proyecto no encontrado</h3>
              <Button onClick={() => router.push("/")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al inicio
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const canManage = proyecto.nombreEstadoProyecto === "Creado"
  const isSuspendidoWithSpecialFeatures = proyecto.nombreEstadoProyecto === "Suspendido" && proyectoId === 7

  const handleSelectPuesto = (puesto: ProyectoPuesto) => {
    if (isSuspendidoWithSpecialFeatures) {
      setSelectedSuspendidoPuesto(puesto)
      setShowSuspendidoOptions(true)
      return
    }
    setSelectedPuesto(puesto)
    setShowActionSelector(true)
  }

  const handleSelectAction = (selectedAction: "alta" | "modificacion" | "baja" | "requisito") => {
    setAction(selectedAction)
    setShowActionSelector(false)

    if (selectedAction === "alta") {
      setSelectedPuesto(null)
      setShowAltaProyectoPuesto(true)
    } else if (selectedAction === "modificacion" && selectedPuesto) {
      setShowModificarProyectoPuesto(true)
    } else if (selectedAction === "baja" && selectedPuesto) {
      setShowBajaProyectoPuesto(true)
    } else if (selectedAction === "requisito" && selectedPuesto) {
      setShowAltaRequisitos(true)
    }
  }

  const handleAltaPuesto = () => {
    setAction("alta")
    setSelectedPuesto(null)
    setShowAltaProyectoPuesto(true)
  }

  const handleSaveAltaPuesto = (puestoData: ProyectoPuesto) => {
    const newPuesto = {
      ...puestoData,
      codPP: proyectoPuestos.length + 1,
    }
    setProyectoPuestos([...proyectoPuestos, newPuesto])
    setShowAltaProyectoPuesto(false)
    console.log("Puesto creado exitosamente")
  }

  const handleCancelAltaPuesto = () => {
    setShowAltaProyectoPuesto(false)
    setAction(null)
    setSelectedPuesto(null)
  }

  const handleSaveModificarPuesto = (puestoModificado: ProyectoPuesto) => {
    setProyectoPuestos(proyectoPuestos.map((p) => (p.codPP === puestoModificado.codPP ? puestoModificado : p)))
    setShowModificarProyectoPuesto(false)
    setSelectedPuesto(null)
    setAction(null)
    console.log("Puesto modificado exitosamente")
  }

  const handleCancelModificarPuesto = () => {
    setShowModificarProyectoPuesto(false)
    setSelectedPuesto(null)
    setAction(null)
  }

  const handleSaveBajaPuesto = (puestoConBaja: ProyectoPuesto) => {
    const fechaActual = new Date().toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })

    const puestoConFechaActual = {
      ...puestoConBaja,
      fechaBajaProyectoPuesto: fechaActual,
    }

    setProyectoPuestos(proyectoPuestos.map((p) => (p.codPP === puestoConFechaActual.codPP ? puestoConFechaActual : p)))
    setShowBajaProyectoPuesto(false)
    setSelectedPuesto(null)
    setAction(null)
    console.log("Puesto dado de baja exitosamente")
  }

  const handleCancelBajaPuesto = () => {
    setShowBajaProyectoPuesto(false)
    setSelectedPuesto(null)
    setAction(null)
  }

  const handleSaveRequisito = (requisitoData: ProyectoPuestoCarrera) => {
    console.log("Requisito creado exitosamente:", requisitoData)
    setShowAltaRequisitos(false)
    setSelectedPuesto(null)
    setAction(null)
  }

  const handleCancelRequisito = () => {
    setShowAltaRequisitos(false)
    setSelectedPuesto(null)
    setAction(null)
  }

  const handleDarDeBajaPuestoSuspendido = () => {
    if (!selectedSuspendidoPuesto) return

    const contPostulaciones = (selectedSuspendidoPuesto as any).contPostulaciones || 0

    if (contPostulaciones === 0) {
      const fechaActual = new Date().toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })

      const puestoConBaja = {
        ...selectedSuspendidoPuesto,
        fechaBajaProyectoPuesto: fechaActual,
      }

      setProyectoPuestos(proyectoPuestos.map((p) => (p.codPP === puestoConBaja.codPP ? puestoConBaja : p)))
      setShowSuspendidoOptions(false)
      setShowBajaExitosaDialog(true)
    } else {
      setShowSuspendidoOptions(false)
      setShowBajaErrorDialog(true)
    }
  }

  const handleModificarProyectoPuestoSuspendido = () => {
    setShowSuspendidoOptions(false)
    setShowModificarVacantesDialog(true)
  }

  const handleConfirmarModificarVacantes = () => {
    if (!selectedSuspendidoPuesto) return

    const contPostulaciones = (selectedSuspendidoPuesto as any).contPostulaciones || 0

    const puestoModificado = {
      ...selectedSuspendidoPuesto,
      cantidadVacantes: contPostulaciones,
    }

    setProyectoPuestos(proyectoPuestos.map((p) => (p.codPP === puestoModificado.codPP ? puestoModificado : p)))
    console.log("Proyecto cambiado a estado 'En evaluación'")
    setShowModificarVacantesDialog(false)
    setSelectedSuspendidoPuesto(null)
    router.push("/")
  }

  const handleModificarFechasProyecto = () => {
    setShowSuspendidoOptions(false)
    setShowModificarFechasDialog(true)
  }

  const handleConfirmarModificarFechas = () => {
    setFechaError("")

    if (!fechaCierrePostulaciones || !fechaInicioActividades || !fechaFinActividades) {
      setFechaError("Todos los campos son obligatorios")
      return
    }

    const fechaCierre = new Date(fechaCierrePostulaciones)
    const fechaInicio = new Date(fechaInicioActividades)
    const fechaFin = new Date(fechaFinActividades)

    const fechaCierreMasUnMes = new Date(fechaCierre)
    fechaCierreMasUnMes.setMonth(fechaCierreMasUnMes.getMonth() + 1)

    if (fechaCierreMasUnMes > fechaInicio) {
      setFechaError(
        "La fecha de cierre de postulaciones + 1 mes debe ser menor o igual a la fecha de inicio de actividades",
      )
      return
    }

    if (fechaInicio >= fechaFin) {
      setFechaError("La fecha de inicio de actividades debe ser menor a la fecha de fin de actividades")
      return
    }

    console.log("Fechas modificadas exitosamente")
    setShowModificarFechasDialog(false)
    setSelectedSuspendidoPuesto(null)
    router.push("/")
  }

  if (showSuspendidoOptions && selectedSuspendidoPuesto) {
    const contPostulaciones = (selectedSuspendidoPuesto as any).contPostulaciones || 0

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Sistema de Prácticas Profesionales</h1>
        </div>

        <div className="container mx-auto p-6 max-w-md">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setShowSuspendidoOptions(false)
                setSelectedSuspendidoPuesto(null)
              }}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Seleccionar Acción</CardTitle>
              <p className="text-muted-foreground">Puesto: {selectedSuspendidoPuesto.puesto.nombrePuesto}</p>
              <Alert className="mt-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>⚠️ Postulaciones insuficientes</AlertDescription>
              </Alert>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Button
                    variant="outline"
                    className="justify-start bg-transparent"
                    onClick={handleDarDeBajaPuestoSuspendido}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Dar de baja puesto
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start bg-transparent"
                    onClick={handleModificarProyectoPuestoSuspendido}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Modificar ProyectoPuesto
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start bg-transparent"
                    onClick={handleModificarFechasProyecto}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Modificar fechas proyecto
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (showActionSelector && selectedPuesto) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Sistema de Prácticas Profesionales</h1>
        </div>

        <div className="container mx-auto p-6 max-w-md">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setShowActionSelector(false)
                setSelectedPuesto(null)
              }}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Seleccionar Acción</CardTitle>
              <p className="text-muted-foreground">
                Ingrese selección a realizar con el puesto: {selectedPuesto.puesto.nombrePuesto}
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Button
                    variant="outline"
                    className="justify-start bg-transparent"
                    onClick={() => handleSelectAction("alta")}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Alta - Agregar nuevo puesto
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start bg-transparent"
                    onClick={() => handleSelectAction("modificacion")}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Modificación - Editar puesto seleccionado
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start bg-transparent"
                    onClick={() => handleSelectAction("baja")}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Baja - Eliminar puesto seleccionado
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start bg-transparent"
                    onClick={() => handleSelectAction("requisito")}
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Alta - Agregar nuevo Requisito del Puesto
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
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Sistema de Prácticas Profesionales</h1>
      </div>

      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="sm" onClick={() => router.push("/")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Gestión de Proyecto-Puesto</h1>
            <p className="text-muted-foreground mt-2">
              {proyecto.nombreProyecto}
              <br />
              <span className="text-sm">Proyecto #{proyecto.numeroProyecto.toString().padStart(5, "0")}</span>
              {!canManage && (
                <Badge variant="outline" className="ml-2">
                  Solo lectura - Estado: {proyecto.nombreEstadoProyecto}
                </Badge>
              )}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {!canManage && !isSuspendidoWithSpecialFeatures && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Solo se pueden gestionar puestos en proyectos con estado "Creado"</AlertDescription>
            </Alert>
          )}

          {canManage && puestosActivos.length > 0 && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Haga clic en un puesto para seleccionar la acción a realizar (Alta-Modificación-Baja-Requisitos)
              </AlertDescription>
            </Alert>
          )}

          {isSuspendidoWithSpecialFeatures && puestosActivos.length > 0 && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Haga clic en un puesto para ver las opciones disponibles para proyectos suspendidos
              </AlertDescription>
            </Alert>
          )}

          {puestosActivos.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No hay Puestos disponibles</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Agregue puestos para completar la configuración del proyecto
                </p>
                {canManage && (
                  <Button onClick={handleAltaPuesto}>
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Primer Puesto
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {puestosActivos.map((puesto) => (
                <Card
                  key={puesto.codPP}
                  className={`cursor-pointer transition-colors ${canManage || isSuspendidoWithSpecialFeatures ? "hover:bg-muted/50" : ""}`}
                  onClick={() => (canManage || isSuspendidoWithSpecialFeatures) && handleSelectPuesto(puesto)}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {puesto.puesto.nombrePuesto}
                          <Badge variant="outline">{puesto.puesto.codPuesto}</Badge>
                          {isSuspendidoWithSpecialFeatures && (puesto as any).contPostulaciones !== undefined && (
                            <Badge variant="destructive" className="ml-2">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Postulaciones insuficientes
                            </Badge>
                          )}
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Cantidad Vacantes:</span>
                        <p className="text-muted-foreground">{puesto.cantidadVacantes}</p>
                      </div>
                      <div>
                        <span className="font-medium">Cantidad Máxima de Postulaciones:</span>
                        <p className="text-muted-foreground">{puesto.cantidadSuPostulaciones}</p>
                      </div>
                      <div>
                        <span className="font-medium">Horas Dedicadas:</span>
                        <p className="text-muted-foreground">{puesto.horasDedicadas}</p>
                      </div>
                      <div>
                        <span className="font-medium">Fecha de Baja:</span>
                        <p className="text-muted-foreground">{puesto.fechaBajaProyectoPuesto || "-"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <AlertDialog open={showBajaExitosaDialog} onOpenChange={setShowBajaExitosaDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Puesto dado de baja</AlertDialogTitle>
            <AlertDialogDescription>Puesto dado de baja con éxito.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => {
                setShowBajaExitosaDialog(false)
                setSelectedSuspendidoPuesto(null)
                router.push("/")
              }}
            >
              Aceptar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showBajaErrorDialog} onOpenChange={setShowBajaErrorDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>No se puede dar de baja</AlertDialogTitle>
            <AlertDialogDescription>No se puede dar de baja al ProyectoPuesto con postulaciones</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => {
                setShowBajaErrorDialog(false)
                setSelectedSuspendidoPuesto(null)
                router.push("/")
              }}
            >
              Aceptar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showModificarVacantesDialog} onOpenChange={setShowModificarVacantesDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Modificar cantidad de vacantes</AlertDialogTitle>
            <AlertDialogDescription>
              La cantidad de postulaciones es {(selectedSuspendidoPuesto as any)?.contPostulaciones || 0}. ¿Desea
              modificar la cantidad de vacantes a la cantidad de postulaciones?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setShowModificarVacantesDialog(false)
                setSelectedSuspendidoPuesto(null)
                router.push("/")
              }}
            >
              NO
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmarModificarVacantes}>SI</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showModificarFechasDialog} onOpenChange={setShowModificarFechasDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Modificar fechas del proyecto</AlertDialogTitle>
            <AlertDialogDescription>Ingrese las nuevas fechas para el proyecto</AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="fechaCierre">Fecha de Cierre de Postulaciones</Label>
              <Input
                id="fechaCierre"
                type="date"
                value={fechaCierrePostulaciones}
                onChange={(e) => setFechaCierrePostulaciones(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fechaInicio">Fecha de Inicio de Actividades</Label>
              <Input
                id="fechaInicio"
                type="date"
                value={fechaInicioActividades}
                onChange={(e) => setFechaInicioActividades(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fechaFin">Fecha de Fin de Actividades</Label>
              <Input
                id="fechaFin"
                type="date"
                value={fechaFinActividades}
                onChange={(e) => setFechaFinActividades(e.target.value)}
              />
            </div>
            {fechaError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{fechaError}</AlertDescription>
              </Alert>
            )}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setShowModificarFechasDialog(false)
                setSelectedSuspendidoPuesto(null)
                setFechaError("")
                setFechaCierrePostulaciones("")
                setFechaInicioActividades("")
                setFechaFinActividades("")
                router.push("/")
              }}
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmarModificarFechas}>Confirmar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
