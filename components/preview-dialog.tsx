"use client"

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
import { Separator } from "@/components/ui/separator"
import { Building, GraduationCap, Calendar, Users } from "lucide-react"

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

interface PreviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  proyecto: Proyecto | null
}

export function PreviewDialog({ open, onOpenChange, proyecto }: PreviewDialogProps) {
  if (!proyecto) return null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const getEstadoBadgeVariant = (estado: string) => {
    switch (estado) {
      case "Creado":
        return "secondary"
      case "Iniciado":
        return "default"
      case "En evaluación":
        return "outline"
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Previsualización del Proyecto
            <Badge variant={getEstadoBadgeVariant(proyecto.nombreEstadoProyecto)}>
              {proyecto.nombreEstadoProyecto}
            </Badge>
          </DialogTitle>
          <DialogDescription>Vista completa de la información del proyecto</DialogDescription>
        </DialogHeader>

        {/* Sistema title */}
        <div className="text-center mb-4 border-b pb-4">
          <h2 className="text-2xl font-bold text-gray-900">Sistema de Prácticas Profesionales</h2>
        </div>

        <div className="space-y-6">
          {/* Información General */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Información General
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{proyecto.nombreProyecto}</h3>
                <p className="text-sm text-muted-foreground">
                  Proyecto #{proyecto.numeroProyecto.toString().padStart(5, "0")}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground leading-relaxed">{proyecto.descripcionProyecto}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <Building className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{proyecto.nombreEmpresa}</p>
                    <p className="text-sm text-muted-foreground">CUIT: 30-12345678-9</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <GraduationCap className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{proyecto.nombreUniversidad}</p>
                    <p className="text-sm text-muted-foreground">CUIT: 30-87654321-0</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cronograma */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Cronograma
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {proyecto.fechaInicioPostulaciones ? (
                  <>
                    <div className="flex justify-between items-center py-2">
                      <div>
                        <p className="font-medium">Inicio de Postulaciones</p>
                        <p className="text-sm text-muted-foreground">Fecha en que se abren las postulaciones</p>
                      </div>
                      <Badge variant="outline">{formatDate(proyecto.fechaInicioPostulaciones)}</Badge>
                    </div>
                    <Separator />
                  </>
                ) : (
                  <>
                    <div className="flex justify-between items-center py-2">
                      <div>
                        <p className="font-medium">Inicio de Postulaciones</p>
                        <p className="text-sm text-muted-foreground">Fecha en que se abren las postulaciones</p>
                      </div>
                      <Badge variant="outline">-</Badge>
                    </div>
                    <Separator />
                  </>
                )}

                <div className="flex justify-between items-center py-2">
                  <div>
                    <p className="font-medium">Cierre de Postulaciones</p>
                    <p className="text-sm text-muted-foreground">Fecha límite para postularse</p>
                  </div>
                  <Badge variant="outline">{formatDate(proyecto.fechaCierrePostulaciones)}</Badge>
                </div>

                <Separator />

                <div className="flex justify-between items-center py-2">
                  <div>
                    <p className="font-medium">Inicio de Actividades</p>
                    <p className="text-sm text-muted-foreground">Fecha de inicio del proyecto</p>
                  </div>
                  <Badge variant="outline">{formatDate(proyecto.fechaInicioActividades)}</Badge>
                </div>

                <Separator />

                <div className="flex justify-between items-center py-2">
                  <div>
                    <p className="font-medium">Finalización del Proyecto</p>
                    <p className="text-sm text-muted-foreground">Fecha estimada de finalización</p>
                  </div>
                  <Badge variant="outline">{formatDate(proyecto.fechaFinProyecto)}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
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
