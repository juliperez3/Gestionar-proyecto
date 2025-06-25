"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Eye, Edit, Play, Pause, Square, CheckCircle, Settings, Briefcase, GraduationCap } from "lucide-react"
import { EstadoProyectoDialog } from "@/components/estado-proyecto-dialog"
import { ProyectoPuestoDialog } from "@/components/proyecto-puesto-dialog"
import { PreviewDialog } from "@/components/preview-dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { AlertTriangle } from "lucide-react"

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

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
    nombreUniversidad: "Universidad de Cuyo",
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

const getEstadoBadgeVariant = (estado: string) => {
  switch (estado) {
    case "Creado":
      return "default"
    case "Iniciado":
      return "default"
    case "En evaluación":
      return "default"
    case "Suspendido":
      return "destructive"
    case "Finalizado":
      return "default"
    case "Cancelado":
      return "destructive"
    default:
      return "secondary"
  }
}

const getEstadoBadgeClass = (estado: string) => {
  switch (estado) {
    case "Creado":
      return "bg-green-500 hover:bg-green-600 text-white"
    case "Iniciado":
      return "bg-yellow-500 hover:bg-yellow-600 text-white"
    case "En evaluación":
      return "bg-orange-500 hover:bg-orange-600 text-white"
    case "Suspendido":
      return "bg-red-500 hover:bg-red-600 text-white"
    case "Finalizado":
      return "bg-blue-500 hover:bg-blue-600 text-white"
    case "Cancelado":
      return "bg-gray-500 hover:bg-gray-600 text-white"
    default:
      return ""
  }
}

const getEstadoIcon = (estado: string) => {
  switch (estado) {
    case "Creado":
      return <Plus className="h-4 w-4 mr-1" />
    case "Iniciado":
      return <Play className="h-4 w-4 mr-1" />
    case "En evaluación":
      return <Eye className="h-4 w-4 mr-1" />
    case "Suspendido":
      return <Pause className="h-4 w-4 mr-1" />
    case "Finalizado":
      return <CheckCircle className="h-4 w-4 mr-1" />
    case "Cancelado":
      return <Square className="h-4 w-4 mr-1" />
    default:
      return <Plus className="h-4 w-4 mr-1" />
  }
}

export default function GestionarProyectos() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [proyectos, setProyectos] = useState<Proyecto[]>(() => {
    const nuevoProyectoParam = searchParams?.get("nuevoProyecto")
    if (nuevoProyectoParam) {
      try {
        const nuevoProyecto = JSON.parse(decodeURIComponent(nuevoProyectoParam))
        return [nuevoProyecto, ...mockProyectos]
      } catch (error) {
        console.error("Error parsing nuevo proyecto:", error)
        return mockProyectos
      }
    }
    return mockProyectos
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProyecto, setSelectedProyecto] = useState<Proyecto | null>(null)
  const [showEstadoDialog, setShowEstadoDialog] = useState(false)
  const [showPuestoDialog, setShowPuestoDialog] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [showWarningDialog, setShowWarningDialog] = useState(false)

  const filteredProyectos = proyectos.filter(
    (proyecto) =>
      proyecto.nombreProyecto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proyecto.nombreEmpresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proyecto.nombreUniversidad.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleCreateProject = () => {
    router.push("/crear-proyecto")
  }

  const handleEditProject = (proyectoId: number) => {
    const proyecto = mockProyectos.find((p) => p.numeroProyecto === proyectoId)
    if (proyecto) {
      const estadosNoEditables = ["En evaluación", "Cancelado", "Finalizado"]
      if (estadosNoEditables.includes(proyecto.nombreEstadoProyecto)) {
        setShowWarningDialog(true)
        return
      }
    }
    router.push(`/editar-proyecto/${proyectoId}`)
  }

  const handleChangeEstado = (proyecto: Proyecto) => {
    setSelectedProyecto(proyecto)
    setShowEstadoDialog(true)
  }

  const handleManageProyectoPuestos = (proyecto: Proyecto) => {
    router.push(`/gestion-proyecto-puesto/${proyecto.numeroProyecto}`)
  }

  const handleManageProyectoPuestoCarreras = (proyecto: Proyecto) => {
    router.push(`/gestion-proyecto-puesto-carrera/${proyecto.numeroProyecto}`)
  }

  const handlePreview = (proyecto: Proyecto) => {
    setSelectedProyecto(proyecto)
    setShowPreview(true)
  }

  // Remove or comment out this useEffect since we're handling the dialog directly now
  // useEffect(() => {
  //   const fromEdit = searchParams?.get("fromEdit")
  //   if (fromEdit) {
  //     setShowWarningDialog(true)
  //     // Clean up the URL
  //     window.history.replaceState({}, "", "/")
  //   }
  // }, [searchParams])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      {/* Sistema title - appears on all screens */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Sistema de Prácticas Profesionales</h1>
      </div>

      <div className="container mx-auto p-6 space-y-6">
        {/* The rest of the content remains the same */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Gestión de Proyectos</h1>
            <p className="text-muted-foreground">Administra proyectos de prácticas profesionales</p>
          </div>
          <Button onClick={handleCreateProject} size="lg">
            <Plus className="h-4 w-4 mr-2" />
            Agregar Proyecto
          </Button>
        </div>

        <div className="grid gap-4">
          {filteredProyectos.map((proyecto) => (
            <Card key={proyecto.numeroProyecto} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">{proyecto.nombreProyecto}</CardTitle>
                    <CardDescription>
                      Proyecto #{proyecto.numeroProyecto.toString().padStart(5, "0")} • {proyecto.nombreEmpresa} •{" "}
                      {proyecto.nombreUniversidad}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditProject(proyecto.numeroProyecto)}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Editar proyecto</span>
                    </Button>
                    {proyecto.nombreEstadoProyecto === "Creado" && (
                      <Button variant="outline" size="sm" onClick={() => handleManageProyectoPuestos(proyecto)}>
                        <Briefcase className="h-4 w-4" />
                        <span className="sr-only">Gestionar Proyecto-Puesto</span>
                      </Button>
                    )}
                    {proyecto.nombreEstadoProyecto === "Creado" && (
                      <Button variant="outline" size="sm" onClick={() => handleManageProyectoPuestoCarreras(proyecto)}>
                        <GraduationCap className="h-4 w-4" />
                        <span className="sr-only">Gestionar Proyecto-Puesto-Carrera</span>
                      </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={() => handlePreview(proyecto)}>
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">Ver detalles</span>
                    </Button>
                    {proyecto.nombreEstadoProyecto !== "Finalizado" &&
                      proyecto.nombreEstadoProyecto !== "Cancelado" && (
                        <Button variant="outline" size="sm" onClick={() => handleChangeEstado(proyecto)}>
                          <Settings className="h-4 w-4" />
                          <span className="sr-only">Cambiar estado</span>
                        </Button>
                      )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
                  {proyecto.fechaInicioPostulaciones ? (
                    <div>
                      <span className="font-medium">Inicio postulaciones:</span>
                      <p className="text-muted-foreground">{formatDate(proyecto.fechaInicioPostulaciones)}</p>
                    </div>
                  ) : (
                    <div>
                      <span className="font-medium">Inicio postulaciones:</span>
                      <p className="text-muted-foreground">-</p>
                    </div>
                  )}
                  <div>
                    <span className="font-medium">Cierre postulaciones:</span>
                    <p className="text-muted-foreground">{formatDate(proyecto.fechaCierrePostulaciones)}</p>
                  </div>
                  <div>
                    <span className="font-medium">Inicio actividades:</span>
                    <p className="text-muted-foreground">{formatDate(proyecto.fechaInicioActividades)}</p>
                  </div>
                  <div>
                    <span className="font-medium">Fin proyecto:</span>
                    <p className="text-muted-foreground">{formatDate(proyecto.fechaFinProyecto)}</p>
                  </div>
                  <div>
                    <span className="font-medium">Estado:</span>
                    <div className="mt-1">
                      <Badge
                        variant={getEstadoBadgeVariant(proyecto.nombreEstadoProyecto)}
                        className={getEstadoBadgeClass(proyecto.nombreEstadoProyecto)}
                      >
                        {getEstadoIcon(proyecto.nombreEstadoProyecto)}
                        {proyecto.nombreEstadoProyecto}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <span className="font-medium">Código Estado:</span>
                    <p className="text-muted-foreground">{proyecto.codEstadoProyecto}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProyectos.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Plus className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No se encontraron proyectos</h3>
              <p className="text-muted-foreground text-center">
                {searchTerm ? "Intenta con otros términos de búsqueda" : "Comienza creando tu primer proyecto"}
              </p>
            </CardContent>
          </Card>
        )}

        <EstadoProyectoDialog
          open={showEstadoDialog}
          onOpenChange={setShowEstadoDialog}
          proyecto={selectedProyecto}
          onSave={(proyecto) => {
            setProyectos(proyectos.map((p) => (p.numeroProyecto === proyecto.numeroProyecto ? proyecto : p)))
            setShowEstadoDialog(false)
          }}
        />

        <ProyectoPuestoDialog open={showPuestoDialog} onOpenChange={setShowPuestoDialog} proyecto={selectedProyecto} />

        <PreviewDialog open={showPreview} onOpenChange={setShowPreview} proyecto={selectedProyecto} />
        <AlertDialog open={showWarningDialog} onOpenChange={setShowWarningDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Modificacion no disponible
              </AlertDialogTitle>
              <AlertDialogDescription>
                No se pueden realizar cambios para el estado actual del proyecto.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => setShowWarningDialog(false)}>Cerrar</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
