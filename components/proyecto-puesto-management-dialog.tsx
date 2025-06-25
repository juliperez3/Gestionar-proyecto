"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Edit, Trash2, Briefcase, AlertCircle } from "lucide-react"
import { AltaProyectoPuesto } from "./alta-proyecto-puesto"
import { AltaRequisitosPuesto } from "./alta-requisitos-puesto"

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

interface ProyectoPuestoManagementDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  proyecto: Proyecto | null
  onRequisitoCreated?: (requisito: ProyectoPuestoCarrera) => void
}

const mockProyectoPuestos: ProyectoPuesto[] = [
  {
    codPP: 1,
    cantidadVacantes: 2,
    cantidadSuPostulaciones: 5,
    horasDedicadas: 20,
    fechaBajaProyectoPuesto: "2025-06-15",
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

// 1° Pantalla: Confirmar creación Puesto
function ConfirmarCreacionPuesto({
  puesto,
  onConfirm,
  onCancel,
}: {
  puesto: ProyectoPuesto
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Sistema de Prácticas Profesionales</h1>
      </div>

      <div className="container mx-auto p-6 max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Confirmar creación Puesto</CardTitle>
            <p className="text-muted-foreground mt-4">Revise los datos del puesto antes de confirmar su creación</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">Código Puesto:</span>
                  <span>{puesto.puesto.codPuesto}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Nombre Puesto:</span>
                  <span>{puesto.puesto.nombrePuesto}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Cantidad Vacantes:</span>
                  <span>{puesto.cantidadVacantes}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Horas Dedicadas:</span>
                  <span>{puesto.horasDedicadas}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Cantidad Máxima Postulaciones:</span>
                  <span>{puesto.cantidadSuPostulaciones}</span>
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-4 pt-6">
              <Button variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              <Button onClick={onConfirm}>Confirmar</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// 2° Pantalla: Requisitos del Puesto
function RequisitosDelPuestoScreen({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Sistema de Prácticas Profesionales</h1>
      </div>

      <div className="container mx-auto p-6 max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Requisitos del Puesto</CardTitle>
            <p className="text-muted-foreground mt-4">Debe continuar con la creación de los requisitos del puesto</p>
          </CardHeader>
          <CardContent className="flex justify-center gap-4 pt-6">
            <Button variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button onClick={onConfirm}>Confirmar</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// 4° Pantalla: Confirmar creación Requisitos de Carrera
function ConfirmarCreacionRequisitos({
  requisito,
  onConfirm,
  onCancel,
}: {
  requisito: ProyectoPuestoCarrera
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Sistema de Prácticas Profesionales</h1>
      </div>

      <div className="container mx-auto p-6 max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Confirmar creación Requisitos de Carrera</CardTitle>
            <p className="text-muted-foreground mt-4">
              Revise los requisitos académicos antes de confirmar su creación
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">Carrera:</span>
                  <span>{requisito.carrera.nombreCarrera}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Código Carrera:</span>
                  <span>{requisito.carrera.codCarrera}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Plan de Estudios:</span>
                  <span>{requisito.planEstudios}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Materias Aprobadas Requeridas:</span>
                  <span>{requisito.materiasAprobadas}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Materias Regulares Requeridas:</span>
                  <span>{requisito.materiasRegulares}</span>
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-4 pt-6">
              <Button variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              <Button onClick={onConfirm}>Confirmar</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Pantalla para preguntar si quiere agregar más requisitos
function AgregarMasRequisitosScreen({ onSi, onNo }: { onSi: () => void; onNo: () => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Sistema de Prácticas Profesionales</h1>
      </div>

      <div className="container mx-auto p-6 max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Requisitos del Puesto</CardTitle>
            <p className="text-muted-foreground mt-4">¿Desea agregar más requisitos para este puesto?</p>
          </CardHeader>
          <CardContent className="flex justify-center gap-4 pt-6">
            <Button variant="outline" onClick={onNo}>
              No
            </Button>
            <Button onClick={onSi}>Sí</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export function ProyectoPuestoManagementDialog({
  open,
  onOpenChange,
  proyecto,
  onRequisitoCreated,
}: ProyectoPuestoManagementDialogProps) {
  const [proyectoPuestos, setProyectoPuestos] = useState<ProyectoPuesto[]>(mockProyectoPuestos)
  const [selectedPuesto, setSelectedPuesto] = useState<ProyectoPuesto | null>(null)
  const [action, setAction] = useState<"alta" | "modificacion" | "baja" | null>(null)
  const [showActionSelector, setShowActionSelector] = useState(false)
  const [showAltaProyectoPuesto, setShowAltaProyectoPuesto] = useState(false)
  const [showConfirmarCreacionPuesto, setShowConfirmarCreacionPuesto] = useState(false)
  const [showRequisitosDelPuesto, setShowRequisitosDelPuesto] = useState(false)
  const [showAltaRequisitos, setShowAltaRequisitos] = useState(false)
  const [showConfirmarCreacionRequisitos, setShowConfirmarCreacionRequisitos] = useState(false)
  const [showAgregarMasRequisitos, setShowAgregarMasRequisitos] = useState(false)
  const [pendingPuesto, setPendingPuesto] = useState<ProyectoPuesto | null>(null)
  const [pendingRequisito, setPendingRequisito] = useState<ProyectoPuestoCarrera | null>(null)
  const [puestoCreado, setPuestoCreado] = useState<{ codPuesto: string; nombrePuesto: string } | null>(null)

  // Manejar guardado del alta de puesto (desde formulario)
  const handleSaveAltaPuesto = (puestoData: ProyectoPuesto) => {
    const newPuesto = {
      ...puestoData,
      codPP: proyectoPuestos.length + 1,
    }
    setPendingPuesto(newPuesto)
    setShowAltaProyectoPuesto(false)
    setShowConfirmarCreacionPuesto(true) // 1° Pantalla
  }

  const handleCancelAltaPuesto = () => {
    setShowAltaProyectoPuesto(false)
    setAction(null)
    setSelectedPuesto(null)
    onOpenChange(true)
  }

  // 1° → 2°: Confirmar creación puesto → Requisitos del puesto
  const handleConfirmarCreacionPuesto = () => {
    if (pendingPuesto) {
      setProyectoPuestos([...proyectoPuestos, pendingPuesto])
      setPuestoCreado({
        codPuesto: pendingPuesto.puesto.codPuesto,
        nombrePuesto: pendingPuesto.puesto.nombrePuesto,
      })
      setShowConfirmarCreacionPuesto(false)
      setShowRequisitosDelPuesto(true) // 2° Pantalla
    }
  }

  // 2° → 3°: Requisitos del puesto → Alta ProyectoPuestoCarrera
  const handleConfirmarRequisitosDelPuesto = () => {
    setShowRequisitosDelPuesto(false)
    setShowAltaRequisitos(true) // 3° Pantalla
  }

  // 3° → 4°: Alta ProyectoPuestoCarrera → Confirmar creación requisitos
  const handleSaveRequisito = (requisitoData: ProyectoPuestoCarrera) => {
    setPendingRequisito(requisitoData)
    setShowAltaRequisitos(false)
    setShowConfirmarCreacionRequisitos(true) // 4° Pantalla
  }

  const handleCancelRequisito = () => {
    setShowAltaRequisitos(false)
    setShowRequisitosDelPuesto(true)
  }

  // 4° → Pregunta: Confirmar creación requisitos → ¿Agregar más?
  const handleConfirmarCreacionRequisitos = () => {
    if (pendingRequisito && onRequisitoCreated) {
      onRequisitoCreated(pendingRequisito)
    }
    setShowConfirmarCreacionRequisitos(false)
    setShowAgregarMasRequisitos(true)
  }

  const handleAgregarMasRequisitos = (agregar: boolean) => {
    if (agregar) {
      setShowAgregarMasRequisitos(false)
      setShowAltaRequisitos(true) // Volver a 3° Pantalla
    } else {
      resetAllStates()
      onOpenChange(true)
    }
  }

  useEffect(() => {
    if (!open) {
      resetAllStates()
    }
  }, [open])

  const resetAllStates = () => {
    setSelectedPuesto(null)
    setAction(null)
    setShowActionSelector(false)
    setShowAltaProyectoPuesto(false)
    setShowConfirmarCreacionPuesto(false)
    setShowRequisitosDelPuesto(false)
    setShowAltaRequisitos(false)
    setShowConfirmarCreacionRequisitos(false)
    setShowAgregarMasRequisitos(false)
    setPendingPuesto(null)
    setPendingRequisito(null)
    setPuestoCreado(null)
  }

  const handleAltaPuesto = () => {
    setAction("alta")
    setSelectedPuesto(null)
    onOpenChange(false)
    setShowAltaProyectoPuesto(true)
  }

  const handleSelectPuesto = (puesto: ProyectoPuesto) => {
    setSelectedPuesto(puesto)
    setShowActionSelector(true)
  }

  const handleSelectAction = (selectedAction: "alta" | "modificacion" | "baja") => {
    setAction(selectedAction)
    setShowActionSelector(false)

    if (selectedAction === "alta") {
      setSelectedPuesto(null)
      setShowAltaProyectoPuesto(true)
    } else if (selectedAction === "modificacion" && selectedPuesto) {
      console.log("Modificación de puesto")
    } else if (selectedAction === "baja" && selectedPuesto) {
      handleBajaPuesto()
    }
  }

  const handleBajaPuesto = () => {
    if (selectedPuesto) {
      if (confirm(`¿Está seguro que desea dar de baja el puesto "${selectedPuesto.puesto.nombrePuesto}"?`)) {
        setProyectoPuestos(proyectoPuestos.filter((p) => p.codPP !== selectedPuesto.codPP))
        setSelectedPuesto(null)
        setAction(null)
      }
    }
  }

  // Pantalla para agregar más requisitos
  if (showAgregarMasRequisitos) {
    return (
      <AgregarMasRequisitosScreen
        onSi={() => handleAgregarMasRequisitos(true)}
        onNo={() => handleAgregarMasRequisitos(false)}
      />
    )
  }

  // 4° Pantalla: Confirmar creación Requisitos de Carrera
  if (showConfirmarCreacionRequisitos && pendingRequisito) {
    return (
      <ConfirmarCreacionRequisitos
        requisito={pendingRequisito}
        onConfirm={handleConfirmarCreacionRequisitos}
        onCancel={() => {
          setShowConfirmarCreacionRequisitos(false)
          setShowAltaRequisitos(true)
        }}
      />
    )
  }

  // 3° Pantalla: Alta ProyectoPuestoCarrera
  if (showAltaRequisitos && puestoCreado) {
    return (
      <AltaRequisitosPuesto puestoCreado={puestoCreado} onSave={handleSaveRequisito} onCancel={handleCancelRequisito} />
    )
  }

  // 2° Pantalla: Requisitos del Puesto
  if (showRequisitosDelPuesto) {
    return (
      <RequisitosDelPuestoScreen
        onConfirm={handleConfirmarRequisitosDelPuesto}
        onCancel={() => {
          setShowRequisitosDelPuesto(false)
          setShowConfirmarCreacionPuesto(true)
        }}
      />
    )
  }

  // 1° Pantalla: Confirmar creación Puesto
  if (showConfirmarCreacionPuesto && pendingPuesto) {
    return (
      <ConfirmarCreacionPuesto
        puesto={pendingPuesto}
        onConfirm={handleConfirmarCreacionPuesto}
        onCancel={() => {
          setShowConfirmarCreacionPuesto(false)
          setShowAltaProyectoPuesto(true)
        }}
      />
    )
  }

  // Selector de acción
  if (showActionSelector && selectedPuesto) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="text-center mb-4 border-b pb-4">
              <h2 className="text-2xl font-bold text-gray-900">Sistema de Prácticas Profesionales</h2>
            </div>
            <DialogTitle>Seleccionar Acción</DialogTitle>
            <DialogDescription>
              Ingrese selección a realizar con el puesto: {selectedPuesto.puesto.nombrePuesto}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid gap-2">
              <Button variant="outline" className="justify-start" onClick={() => handleSelectAction("alta")}>
                <Plus className="h-4 w-4 mr-2" />
                Alta - Agregar nuevo puesto
              </Button>
              <Button variant="outline" className="justify-start" onClick={() => handleSelectAction("modificacion")}>
                <Edit className="h-4 w-4 mr-2" />
                Modificación - Editar puesto seleccionado
              </Button>
              <Button variant="outline" className="justify-start" onClick={() => handleSelectAction("baja")}>
                <Trash2 className="h-4 w-4 mr-2" />
                Baja - Eliminar puesto seleccionado
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowActionSelector(false)
                setSelectedPuesto(null)
              }}
            >
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  // Pantalla de alta de puesto
  if (showAltaProyectoPuesto) {
    return (
      <AltaProyectoPuesto
        onSave={handleSaveAltaPuesto}
        onCancel={handleCancelAltaPuesto}
        existingPuestos={proyectoPuestos}
      />
    )
  }

  if (!proyecto) return null

  const canManage = proyecto.nombreEstadoProyecto === "Creado"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="text-center mb-4 border-b pb-4">
            <h2 className="text-2xl font-bold text-gray-900">Sistema de Prácticas Profesionales</h2>
          </div>
          <DialogTitle>Gestión de Proyecto-Puesto</DialogTitle>
          <DialogDescription>
            {proyecto.nombreProyecto}
            <br />
            <span className="text-sm text-muted-foreground">
              Proyecto #{proyecto.numeroProyecto.toString().padStart(5, "0")}
            </span>
            {!canManage && (
              <Badge variant="outline" className="ml-2">
                Solo lectura - Estado: {proyecto.nombreEstadoProyecto}
              </Badge>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!canManage && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Solo se pueden gestionar puestos en proyectos con estado "Creado"</AlertDescription>
            </Alert>
          )}

          {canManage && proyectoPuestos.length > 0 && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Haga clic en un puesto para seleccionar la acción a realizar (Alta-Modificación-Baja)
              </AlertDescription>
            </Alert>
          )}

          {proyectoPuestos.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No hay puestos definidos</h3>
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
              {proyectoPuestos.map((puesto) => (
                <Card
                  key={puesto.codPP}
                  className={`cursor-pointer transition-colors ${canManage ? "hover:bg-muted/50" : ""}`}
                  onClick={() => canManage && handleSelectPuesto(puesto)}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {puesto.puesto.nombrePuesto}
                          <Badge variant="outline">{puesto.puesto.codPuesto}</Badge>
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

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
