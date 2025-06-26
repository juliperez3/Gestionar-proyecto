"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Edit, Trash2, GraduationCap, AlertCircle } from "lucide-react"
import { AltaProyectoPuestoCarrera } from "@/components/alta-proyecto-puesto-carrera"
import { ModificarProyectoPuestoCarrera } from "@/components/modificar-proyecto-puesto-carrera"
import { BajaProyectoPuestoCarrera } from "@/components/baja-proyecto-puesto-carrera"

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
]

const mockProyectoPuestoCarreras: ProyectoPuestoCarrera[] = [
  {
    codPPC: 1,
    materiasAprobadas: 25,
    materiasRegulares: 30,
    planEstudios: 1,
    carrera: {
      codCarrera: "C0001",
      nombreCarrera: "Ingeniería en Sistemas",
    },
    puesto: {
      codPuesto: "P0001",
      nombrePuesto: "Desarrollador Full Stack",
    },
  },
  {
    codPPC: 2,
    materiasAprobadas: 20,
    materiasRegulares: 25,
    planEstudios: 2,
    carrera: {
      codCarrera: "C0002",
      nombreCarrera: "Diseño Gráfico",
    },
    puesto: {
      codPuesto: "P0004",
      nombrePuesto: "Diseñador UX/UI",
    },
  },
]

// Función para obtener todos los proyectos (mock + localStorage)
const getAllProyectos = (): Proyecto[] => {
  if (typeof window === "undefined") return mockProyectos

  const proyectosGuardados = localStorage.getItem("proyectosCreados")
  const proyectosCreados = proyectosGuardados ? JSON.parse(proyectosGuardados) : []

  const todosLosProyectos = [...proyectosCreados, ...mockProyectos]
  const proyectosUnicos = todosLosProyectos.filter(
    (proyecto, index, self) => index === self.findIndex((p) => p.numeroProyecto === proyecto.numeroProyecto),
  )

  return proyectosUnicos
}

export default function GestionProyectoPuestoCarreraPage() {
  const router = useRouter()
  const params = useParams()
  const proyectoId = Number.parseInt(params?.id as string)

  // Buscar el proyecto en todos los proyectos disponibles
  const [proyecto, setProyecto] = useState<Proyecto | null>(() => {
    const todosLosProyectos = getAllProyectos()
    return todosLosProyectos.find((p) => p.numeroProyecto === proyectoId) || null
  })

  const [proyectoPuestoCarreras, setProyectoPuestoCarreras] = useState<ProyectoPuestoCarrera[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(`proyectoPuestoCarreras_${proyectoId}`)
      if (saved) {
        const parsed = JSON.parse(saved)
        // Asegurar que planEstudios se guarde como número
        return parsed.map((item: ProyectoPuestoCarrera) => ({
          ...item,
          planEstudios: Number(item.planEstudios),
        }))
      }
    }
    // Solo los proyectos mock específicos tienen datos iniciales
    if (proyectoId === 1) {
      return mockProyectoPuestoCarreras
    }
    // Todos los demás proyectos (incluyendo los creados) empiezan vacíos
    return []
  })

  // Actualizar proyecto cuando cambie localStorage
  useEffect(() => {
    const todosLosProyectos = getAllProyectos()
    const proyectoEncontrado = todosLosProyectos.find((p) => p.numeroProyecto === proyectoId)
    setProyecto(proyectoEncontrado || null)
  }, [proyectoId])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(`proyectoPuestoCarreras_${proyectoId}`, JSON.stringify(proyectoPuestoCarreras))
    }
  }, [proyectoPuestoCarreras, proyectoId])

  const [selectedCarrera, setSelectedCarrera] = useState<ProyectoPuestoCarrera | null>(null)
  const [action, setAction] = useState<"alta" | "modificacion" | "baja" | null>(null)
  const [showActionSelector, setShowActionSelector] = useState(false)
  const [showAltaProyectoPuestoCarrera, setShowAltaProyectoPuestoCarrera] = useState(false)
  const [showModificarProyectoPuestoCarrera, setShowModificarProyectoPuestoCarrera] = useState(false)
  const [showBajaProyectoPuestoCarrera, setShowBajaProyectoPuestoCarrera] = useState(false)

  // Filtrar carreras activas (sin fecha de baja)
  const carrerasActivas = proyectoPuestoCarreras.filter((carrera) => !carrera.fechaBajaProyectoPuestoCarrera)

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

  const handleSelectCarrera = (carrera: ProyectoPuestoCarrera) => {
    setSelectedCarrera(carrera)
    setShowActionSelector(true)
  }

  const handleSelectAction = (selectedAction: "alta" | "modificacion" | "baja") => {
    setAction(selectedAction)
    setShowActionSelector(false)

    if (selectedAction === "alta") {
      setSelectedCarrera(null)
      setShowAltaProyectoPuestoCarrera(true)
    } else if (selectedAction === "modificacion" && selectedCarrera) {
      setShowModificarProyectoPuestoCarrera(true)
    } else if (selectedAction === "baja" && selectedCarrera) {
      setShowBajaProyectoPuestoCarrera(true)
    }
  }

  const handleAltaCarrera = () => {
    setAction("alta")
    setSelectedCarrera(null)
    setShowAltaProyectoPuestoCarrera(true)
  }

  const handleSaveAltaCarrera = (carreraData: ProyectoPuestoCarrera) => {
    const newCarrera = {
      ...carreraData,
      codPPC: proyectoPuestoCarreras.length + 1,
      planEstudios: Number(carreraData.planEstudios),
    }
    setProyectoPuestoCarreras([...proyectoPuestoCarreras, newCarrera])
    setShowAltaProyectoPuestoCarrera(false)
    console.log("Carrera creada exitosamente")
  }

  const handleCancelAltaCarrera = () => {
    setShowAltaProyectoPuestoCarrera(false)
    setAction(null)
    setSelectedCarrera(null)
  }

  const handleSaveModificarCarrera = (carreraModificada: ProyectoPuestoCarrera) => {
    setProyectoPuestoCarreras(
      proyectoPuestoCarreras.map((c) =>
        c.codPPC === carreraModificada.codPPC
          ? { ...carreraModificada, planEstudios: Number(carreraModificada.planEstudios) }
          : c,
      ),
    )
    setShowModificarProyectoPuestoCarrera(false)
    setSelectedCarrera(null)
    setAction(null)
    console.log("Carrera modificada exitosamente")
  }

  const handleCancelModificarCarrera = () => {
    setShowModificarProyectoPuestoCarrera(false)
    setSelectedCarrera(null)
    setAction(null)
  }

  const handleSaveBajaCarrera = (carreraConBaja: ProyectoPuestoCarrera) => {
    // Establecer la fecha actual al dar de baja
    const fechaActual = new Date().toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })

    const carreraConFechaActual = {
      ...carreraConBaja,
      fechaBajaProyectoPuestoCarrera: fechaActual,
    }

    setProyectoPuestoCarreras(
      proyectoPuestoCarreras.map((c) => (c.codPPC === carreraConFechaActual.codPPC ? carreraConFechaActual : c)),
    )
    setShowBajaProyectoPuestoCarrera(false)
    setSelectedCarrera(null)
    setAction(null)
    console.log("Carrera dada de baja exitosamente")
  }

  const handleCancelBajaCarrera = () => {
    setShowBajaProyectoPuestoCarrera(false)
    setSelectedCarrera(null)
    setAction(null)
  }

  // Pantalla completa de Alta Proyecto Puesto Carrera
  if (showAltaProyectoPuestoCarrera) {
    return (
      <AltaProyectoPuestoCarrera
        onSave={handleSaveAltaCarrera}
        onCancel={handleCancelAltaCarrera}
        existingCarreras={carrerasActivas}
      />
    )
  }

  // Pantalla completa de Modificar Proyecto Puesto Carrera
  if (showModificarProyectoPuestoCarrera && selectedCarrera) {
    return (
      <ModificarProyectoPuestoCarrera
        carrera={selectedCarrera}
        onSave={handleSaveModificarCarrera}
        onCancel={handleCancelModificarCarrera}
      />
    )
  }

  // Pantalla completa de Baja Proyecto Puesto Carrera
  if (showBajaProyectoPuestoCarrera && selectedCarrera) {
    return (
      <BajaProyectoPuestoCarrera
        carrera={selectedCarrera}
        onSave={handleSaveBajaCarrera}
        onCancel={handleCancelBajaCarrera}
      />
    )
  }

  // Selector de acción
  if (showActionSelector && selectedCarrera) {
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
                setSelectedCarrera(null)
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
                Ingrese selección a realizar con la carrera: {selectedCarrera.carrera.nombreCarrera}
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => handleSelectAction("modificacion")}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Modificación - Editar carrera seleccionada
                  </Button>
                  <Button variant="outline" className="justify-start" onClick={() => handleSelectAction("baja")}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Baja - Eliminar carrera seleccionada
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Pantalla principal de gestión
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
            <h1 className="text-3xl font-bold">Gestión de Proyecto-Puesto-Carrera</h1>
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
          {!canManage && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Solo se pueden gestionar carreras en proyectos con estado "Creado"</AlertDescription>
            </Alert>
          )}

          {canManage && carrerasActivas.length > 0 && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Haga clic en una carrera para seleccionar la acción a realizar (Alta-Modificación-Baja)
              </AlertDescription>
            </Alert>
          )}

          {carrerasActivas.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <GraduationCap className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No hay requisitos disponibles</h3>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {carrerasActivas.map((carrera) => (
                <Card
                  key={carrera.codPPC}
                  className={`cursor-pointer transition-colors ${canManage ? "hover:bg-muted/50" : ""}`}
                  onClick={() => canManage && handleSelectCarrera(carrera)}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">{carrera.carrera.nombreCarrera}</CardTitle>
                        <p className="text-muted-foreground text-sm mt-1">Puesto {carrera.puesto.codPuesto}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Materias Aprobadas:</span>
                        <p className="text-muted-foreground">{carrera.materiasAprobadas}</p>
                      </div>
                      <div>
                        <span className="font-medium">Materias Regulares:</span>
                        <p className="text-muted-foreground">{carrera.materiasRegulares}</p>
                      </div>
                      <div>
                        <span className="font-medium">Código Plan de Estudios:</span>
                        <p className="text-muted-foreground">PE{carrera.planEstudios.toString().padStart(4, "0")}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
