"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, ArrowLeft, Trash2, Edit, Calendar } from "lucide-react"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ProyectoPuesto {
  codPP: number
  cantidadVacantes: number
  cantidadSuPostulaciones: number
  horasDedicadas: number
  contPostulaciones: number
  fechaBajaProyectoPuesto?: string
  puesto: {
    codPuesto: string
    nombrePuesto: string
  }
}

const mockPuestosProyecto7: ProyectoPuesto[] = [
  {
    codPP: 1,
    cantidadVacantes: 5,
    cantidadSuPostulaciones: 2,
    horasDedicadas: 20,
    contPostulaciones: 3, // Less than cantidadVacantes to show warning
    puesto: {
      codPuesto: "DEV001",
      nombrePuesto: "Desarrollador Full Stack",
    },
  },
]

export default function GestionProyectoSuspendido() {
  const router = useRouter()
  const params = useParams()
  const proyectoId = Number(params?.id)

  const [puestos, setPuestos] = useState<ProyectoPuesto[]>([])
  const [selectedPuesto, setSelectedPuesto] = useState<ProyectoPuesto | null>(null)
  const [showBajaDialog, setShowBajaDialog] = useState(false)
  const [showModificarDialog, setShowModificarDialog] = useState(false)
  const [showFechasDialog, setShowFechasDialog] = useState(false)
  const [showErrorDialog, setShowErrorDialog] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  // Estados para modificar fechas
  const [fechaCierrePostulaciones, setFechaCierrePostulaciones] = useState("")
  const [fechaInicioActividades, setFechaInicioActividades] = useState("")
  const [fechaFinActividades, setFechaFinActividades] = useState("")

  useEffect(() => {
    if (proyectoId === 7) {
      const saved = localStorage.getItem(`proyectoPuestos_${proyectoId}`)
      if (!saved) {
        // Initialize with mock data
        localStorage.setItem(`proyectoPuestos_${proyectoId}`, JSON.stringify(mockPuestosProyecto7))
        setPuestos(mockPuestosProyecto7)
      } else {
        const allPuestos = JSON.parse(saved)
        const activePuestos = allPuestos.filter((p: ProyectoPuesto) => !p.fechaBajaProyectoPuesto)
        setPuestos(activePuestos)
      }
    } else {
      // For other projects, load from localStorage
      const saved = localStorage.getItem(`proyectoPuestos_${proyectoId}`)
      if (saved) {
        const allPuestos = JSON.parse(saved)
        const activePuestos = allPuestos.filter((p: ProyectoPuesto) => !p.fechaBajaProyectoPuesto)
        setPuestos(activePuestos)
      }
    }
  }, [proyectoId])

  const handleDarDeBaja = (puesto: ProyectoPuesto) => {
    setSelectedPuesto(puesto)
    setShowBajaDialog(true)
  }

  const confirmDarDeBaja = () => {
    if (!selectedPuesto) return

    // CA 29: 13.1.1 - SI contPostulaciones = 0
    if (selectedPuesto.contPostulaciones === 0) {
      // Dar de baja el puesto
      const saved = localStorage.getItem(`proyectoPuestos_${proyectoId}`)
      if (saved) {
        const allPuestos = JSON.parse(saved)
        const updatedPuestos = allPuestos.map((p: ProyectoPuesto) =>
          p.codPP === selectedPuesto.codPP ? { ...p, fechaBajaProyectoPuesto: new Date().toISOString() } : p,
        )
        localStorage.setItem(`proyectoPuestos_${proyectoId}`, JSON.stringify(updatedPuestos))

        // Actualizar estado local
        setPuestos(puestos.filter((p) => p.codPP !== selectedPuesto.codPP))

        setSuccessMessage("Puesto dado de baja con éxito.")
        setShowSuccessDialog(true)
      }
    } else {
      // CA 29: 13.1.3.1 - Mostrar error
      setErrorMessage("No se puede dar de baja al ProyectoPuesto con postulaciones")
      setShowErrorDialog(true)
    }

    setShowBajaDialog(false)
    setSelectedPuesto(null)
  }

  const handleModificar = (puesto: ProyectoPuesto) => {
    setSelectedPuesto(puesto)
    setShowModificarDialog(true)
  }

  const confirmModificar = (ajustar: boolean) => {
    if (!selectedPuesto) return

    if (ajustar) {
      // CA 29: 13.1.5.1.4 - Modificar cantVacantes igual a contPostulaciones
      const saved = localStorage.getItem(`proyectoPuestos_${proyectoId}`)
      if (saved) {
        const allPuestos = JSON.parse(saved)
        const updatedPuestos = allPuestos.map((p: ProyectoPuesto) =>
          p.codPP === selectedPuesto.codPP ? { ...p, cantidadVacantes: selectedPuesto.contPostulaciones } : p,
        )
        localStorage.setItem(`proyectoPuestos_${proyectoId}`, JSON.stringify(updatedPuestos))

        // Actualizar estado local
        setPuestos(
          puestos.map((p) =>
            p.codPP === selectedPuesto.codPP ? { ...p, cantidadVacantes: selectedPuesto.contPostulaciones } : p,
          ),
        )

        // Cambiar estado del proyecto a "En evaluación"
        setSuccessMessage(
          `Las vacantes del puesto han sido ajustadas a ${selectedPuesto.contPostulaciones}. El proyecto ahora está en estado "En evaluación".`,
        )
        setShowSuccessDialog(true)

        // Redirigir a la página principal después de cerrar el diálogo
        setTimeout(() => {
          router.push("/")
        }, 2000)
      }
    } else {
      // Si selecciona NO, volver a la página principal
      router.push("/")
    }

    setShowModificarDialog(false)
    setSelectedPuesto(null)
  }

  const handleModificarFechas = (puesto: ProyectoPuesto) => {
    setSelectedPuesto(puesto)
    setShowFechasDialog(true)
  }

  const confirmModificarFechas = () => {
    // CA 29: 13.1.5.3.3 - Controlar consistencia de datos
    if (!fechaCierrePostulaciones || !fechaInicioActividades || !fechaFinActividades) {
      setErrorMessage("Los datos ingresados no son válidos. Intente nuevamente")
      setShowErrorDialog(true)
      return
    }

    const fechaCierre = new Date(fechaCierrePostulaciones)
    const fechaInicio = new Date(fechaInicioActividades)
    const fechaFin = new Date(fechaFinActividades)

    // CA 29: 13.1.5.3.4 - Comprobar que fechaHoraCierrePostulaciones + 1 mes <= fechaInicioActividades
    const fechaCierreMasUnMes = new Date(fechaCierre)
    fechaCierreMasUnMes.setMonth(fechaCierreMasUnMes.getMonth() + 1)

    if (fechaCierreMasUnMes > fechaInicio) {
      setErrorMessage("La fecha de cierre de postulaciones debe ser menor a la fecha de inicio del proyecto.")
      setShowErrorDialog(true)
      return
    }

    // CA 29: 13.1.5.4.5 - Comprobar que fechaInicioActividades sea menor a fechaFinActividades
    if (fechaInicio >= fechaFin) {
      setErrorMessage("La fecha de inicio de actividades debe ser menor a la fecha de fin de actividades.")
      setShowErrorDialog(true)
      return
    }

    // Guardar las fechas modificadas
    const proyectoData = {
      fechaCierrePostulaciones,
      fechaInicioActividades,
      fechaFinActividades,
    }
    localStorage.setItem(`proyecto_${proyectoId}_fechas`, JSON.stringify(proyectoData))

    setSuccessMessage("Las fechas del proyecto han sido modificadas exitosamente.")
    setShowSuccessDialog(true)
    setShowFechasDialog(false)

    // Limpiar campos
    setFechaCierrePostulaciones("")
    setFechaInicioActividades("")
    setFechaFinActividades("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Sistema de Prácticas Profesionales</h1>
      </div>

      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={() => router.push("/")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Gestión de Proyecto Suspendido</h1>
            <p className="text-muted-foreground">Proyecto #{proyectoId} - Estado: Suspendido</p>
          </div>
        </div>

        <Alert className="bg-orange-50 border-orange-200">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            Este proyecto está suspendido y tiene puestos con postulaciones insuficientes. Seleccione una acción para
            cada puesto.
          </AlertDescription>
        </Alert>

        <div className="grid gap-4">
          {puestos.map((puesto) => (
            <Card key={puesto.codPP} className="border-orange-200">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {puesto.puesto.nombrePuesto}
                      {puesto.contPostulaciones < puesto.cantidadVacantes && (
                        <Badge variant="destructive" className="bg-orange-500">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Postulaciones insuficientes
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription>Código: {puesto.puesto.codPuesto}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                  <div>
                    <span className="font-medium">Vacantes:</span>
                    <p className="text-muted-foreground">{puesto.cantidadVacantes}</p>
                  </div>
                  <div>
                    <span className="font-medium">Postulaciones:</span>
                    <p className="text-muted-foreground">{puesto.contPostulaciones}</p>
                  </div>
                  <div>
                    <span className="font-medium">Suplentes:</span>
                    <p className="text-muted-foreground">{puesto.cantidadSuPostulaciones}</p>
                  </div>
                  <div>
                    <span className="font-medium">Horas:</span>
                    <p className="text-muted-foreground">{puesto.horasDedicadas}h</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleDarDeBaja(puesto)} className="flex-1">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Dar de baja puesto
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleModificar(puesto)} className="flex-1">
                    <Edit className="h-4 w-4 mr-2" />
                    Modificar ProyectoPuesto
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleModificarFechas(puesto)} className="flex-1">
                    <Calendar className="h-4 w-4 mr-2" />
                    Modificar fechas proyecto
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {puestos.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No hay puestos activos</h3>
              <p className="text-muted-foreground text-center">
                Todos los puestos han sido dados de baja o no existen puestos para este proyecto.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Dialog: Dar de baja */}
        <AlertDialog open={showBajaDialog} onOpenChange={setShowBajaDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar baja de puesto</AlertDialogTitle>
              <AlertDialogDescription>
                ¿Está seguro que desea dar de baja el puesto "{selectedPuesto?.puesto.nombrePuesto}"?
                {selectedPuesto && selectedPuesto.contPostulaciones > 0 && (
                  <span className="block mt-2 text-orange-600 font-medium">
                    Advertencia: Este puesto tiene {selectedPuesto.contPostulaciones} postulaciones activas.
                  </span>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDarDeBaja}>Confirmar</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Dialog: Modificar ProyectoPuesto */}
        <AlertDialog open={showModificarDialog} onOpenChange={setShowModificarDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Modificar ProyectoPuesto</AlertDialogTitle>
              <AlertDialogDescription>
                La cantidad de postulaciones es {selectedPuesto?.contPostulaciones}. ¿Desea modificar la cantidad de
                vacantes a la cantidad de postulaciones?
                <div className="mt-4 p-4 bg-blue-50 rounded-md">
                  <p className="text-sm text-blue-900">
                    <strong>Vacantes actuales:</strong> {selectedPuesto?.cantidadVacantes}
                  </p>
                  <p className="text-sm text-blue-900">
                    <strong>Postulaciones recibidas:</strong> {selectedPuesto?.contPostulaciones}
                  </p>
                  <p className="text-sm text-blue-900 mt-2">
                    Las vacantes se ajustarán a {selectedPuesto?.contPostulaciones} y el proyecto pasará a estado "En
                    evaluación".
                  </p>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => confirmModificar(false)}>NO</AlertDialogCancel>
              <AlertDialogAction onClick={() => confirmModificar(true)}>SÍ</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Dialog: Modificar fechas */}
        <AlertDialog open={showFechasDialog} onOpenChange={setShowFechasDialog}>
          <AlertDialogContent className="max-w-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Modificar fechas del proyecto</AlertDialogTitle>
              <AlertDialogDescription>
                Ingrese las nuevas fechas para el proyecto. Las fechas deben cumplir con las validaciones requeridas.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="fechaCierre">Fecha de cierre de postulaciones</Label>
                <Input
                  id="fechaCierre"
                  type="date"
                  value={fechaCierrePostulaciones}
                  onChange={(e) => setFechaCierrePostulaciones(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="fechaInicio">Fecha de inicio de actividades</Label>
                <Input
                  id="fechaInicio"
                  type="date"
                  value={fechaInicioActividades}
                  onChange={(e) => setFechaInicioActividades(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="fechaFin">Fecha de fin de actividades</Label>
                <Input
                  id="fechaFin"
                  type="date"
                  value={fechaFinActividades}
                  onChange={(e) => setFechaFinActividades(e.target.value)}
                />
              </div>
              <Alert>
                <AlertDescription className="text-sm">
                  <strong>Validaciones:</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>La fecha de cierre + 1 mes debe ser menor o igual a la fecha de inicio</li>
                    <li>La fecha de inicio debe ser menor a la fecha de fin</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={confirmModificarFechas}>Confirmar</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Dialog: Error */}
        <AlertDialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Error
              </AlertDialogTitle>
              <AlertDialogDescription>{errorMessage}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => setShowErrorDialog(false)}>Entendido</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Dialog: Success */}
        <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-green-600">Operación exitosa</AlertDialogTitle>
              <AlertDialogDescription>{successMessage}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => setShowSuccessDialog(false)}>Aceptar</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
