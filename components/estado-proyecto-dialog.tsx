"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Play, Pause, CheckCircle, X } from "lucide-react"

interface Proyecto {
  numeroProyecto: number
  nombreProyecto: string
  descripcionProyecto: string
  fechaInicioPostulaciones?: string
  fechaCierrePostulaciones: string
  fechaInicioActividades: string
  fechaFinProyecto: string
  nombreEmpresa: string
  nombreUniversidad: string
  nombreEstadoProyecto: string
  codEstadoProyecto: string
}

interface EstadoProyectoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  proyecto: Proyecto | null
  onSave: (proyecto: Proyecto) => void
  onFinalizarProyecto?: (proyecto: Proyecto) => boolean
}

const getAvailableActions = (estado: string) => {
  switch (estado) {
    case "Creado":
      return [
        {
          action: "iniciar",
          label: "Iniciar Proyecto",
          icon: <Play className="h-4 w-4" />,
          variant: "default" as const,
        },
        {
          action: "cancelar",
          label: "Cancelar Proyecto",
          icon: <X className="h-4 w-4" />,
          variant: "destructive" as const,
        },
      ]
    case "Iniciado":
      return [
        {
          action: "suspender",
          label: "Suspender Proyecto",
          icon: <Pause className="h-4 w-4" />,
          variant: "outline" as const,
        },
        {
          action: "cancelar",
          label: "Cancelar Proyecto",
          icon: <X className="h-4 w-4" />,
          variant: "destructive" as const,
        },
      ]
    case "En evaluación":
      return [
        {
          action: "finalizar",
          label: "Finalizar Proyecto",
          icon: <CheckCircle className="h-4 w-4" />,
          variant: "default" as const,
        },
        {
          action: "cancelar",
          label: "Cancelar Proyecto",
          icon: <X className="h-4 w-4" />,
          variant: "destructive" as const,
        },
      ]
    case "Suspendido":
      return [
        {
          action: "iniciar",
          label: "Iniciar Proyecto",
          icon: <Play className="h-4 w-4" />,
          variant: "default" as const,
        },
        {
          action: "cancelar",
          label: "Cancelar Proyecto",
          icon: <X className="h-4 w-4" />,
          variant: "destructive" as const,
        },
      ]
    default:
      return []
  }
}

const getNewEstado = (action: string) => {
  switch (action) {
    case "iniciar":
      return { nombre: "Iniciado", codigo: "INI" }
    case "evaluar":
      return { nombre: "En evaluación", codigo: "EVA" }
    case "suspender":
      return { nombre: "Suspendido", codigo: "SUS" }
    case "finalizar":
      return { nombre: "Finalizado", codigo: "FIN" }
    case "cancelar":
      return { nombre: "Cancelado", codigo: "CAN" }
    default:
      return { nombre: "", codigo: "" }
  }
}

const getActionMessage = (action: string, nombreProyecto: string) => {
  switch (action) {
    case "iniciar":
      return `¿Está seguro que desea iniciar el proyecto "${nombreProyecto}"? Se habilitarán las postulaciones.`
    case "evaluar":
      return `¿Está seguro que desea poner en evaluación el proyecto "${nombreProyecto}"? Se cerrarán las postulaciones.`
    case "suspender":
      return `¿Está seguro que desea suspender el proyecto "${nombreProyecto}"? Si suspende el proyecto deberá iniciarlo nuevamente.`
    case "finalizar":
      return `¿Está seguro que desea finalizar el proyecto "${nombreProyecto}"? Esta acción es irreversible.`
    case "cancelar":
      return `¿Está seguro que desea cancelar el proyecto "${nombreProyecto}"? No se puede volver atrás.`
    default:
      return ""
  }
}

export function EstadoProyectoDialog({
  open,
  onOpenChange,
  proyecto,
  onSave,
  onFinalizarProyecto,
}: EstadoProyectoDialogProps) {
  const [selectedAction, setSelectedAction] = useState<string | null>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)

  if (!proyecto) return null

  const availableActions = getAvailableActions(proyecto.nombreEstadoProyecto)

  const handleActionSelect = (action: string) => {
    console.log("Acción seleccionada:", action, "Proyecto:", proyecto.numeroProyecto)

    // Si es finalizar y hay callback de validación, verificar primero
    if (action === "finalizar" && onFinalizarProyecto) {
      const puedeFinalizarse = onFinalizarProyecto(proyecto)
      if (!puedeFinalizarse) {
        // La validación falló, cerrar el dialog y mostrar la pantalla de advertencia
        onOpenChange(false)
        return
      }
    }

    setSelectedAction(action)
    setShowConfirmation(true)
  }

  const handleConfirm = () => {
    if (!selectedAction) return

    const newEstado = getNewEstado(selectedAction)
    const updatedProyecto = {
      ...proyecto,
      nombreEstadoProyecto: newEstado.nombre,
      codEstadoProyecto: newEstado.codigo,
      fechaInicioPostulaciones:
        selectedAction === "iniciar" ? new Date().toISOString().split("T")[0] : proyecto.fechaInicioPostulaciones,
    }

    onSave(updatedProyecto)
    setShowConfirmation(false)
    setSelectedAction(null)
  }

  const handleCancel = () => {
    setShowConfirmation(false)
    setSelectedAction(null)
  }

  if (showConfirmation && selectedAction) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Cambio de Estado</DialogTitle>
            <DialogDescription>{getActionMessage(selectedAction, proyecto.nombreProyecto)}</DialogDescription>
          </DialogHeader>
          {/* Sistema title */}
          <div className="text-center mb-4 border-b pb-4">
            <h2 className="text-2xl font-bold text-gray-900">Sistema de Prácticas Profesionales</h2>
          </div>

          {selectedAction === "iniciar" && proyecto.nombreEstadoProyecto === "Creado" && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Asegúrese de que el proyecto tenga puestos asignados antes de iniciarlo.
              </AlertDescription>
            </Alert>
          )}

          {selectedAction === "finalizar" && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Verifique que todos los contratos estén emitidos antes de finalizar el proyecto.
              </AlertDescription>
            </Alert>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button onClick={handleConfirm} variant={selectedAction === "cancelar" ? "destructive" : "default"}>
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cambiar Estado del Proyecto</DialogTitle>
          <DialogDescription>Proyecto: {proyecto.nombreProyecto}</DialogDescription>
        </DialogHeader>
        {/* Sistema title */}
        <div className="text-center mb-4 border-b pb-4">
          <h2 className="text-2xl font-bold text-gray-900">Sistema de Prácticas Profesionales</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Estado actual:</span>
            <Badge variant="outline">{proyecto.nombreEstadoProyecto}</Badge>
          </div>

          {availableActions.length > 0 ? (
            <div className="space-y-2">
              <p className="text-sm font-medium">Seleccione la operación que desea realizar:</p>
              <div className="grid gap-2">
                {availableActions.map((action) => (
                  <Button
                    key={action.action}
                    variant={action.variant}
                    className="justify-start"
                    onClick={() => handleActionSelect(action.action)}
                  >
                    {action.icon}
                    {action.label}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No hay cambios de estado disponibles para el estado actual del proyecto.
              </AlertDescription>
            </Alert>
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
