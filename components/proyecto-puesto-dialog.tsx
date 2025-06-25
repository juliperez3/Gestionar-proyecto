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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Users } from "lucide-react"
import { PuestoForm } from "@/components/puesto-form"
import { CarreraForm } from "@/components/carrera-form"

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
  carreras: ProyectoPuestoCarrera[]
}

interface ProyectoPuestoCarrera {
  codPPC: number
  cantMateriasAprobadasReq: number
  cantMateriasRegularesReq: number
  fechaBajaPPC?: string
  carrera: {
    codCarrera: string
    nombreCarrera: string
  }
  planEstudios: {
    codPlanEstudios: string
    nombrePlan: string
  }
}

interface ProyectoPuestoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  proyecto: Proyecto | null
}

const mockPuestos: ProyectoPuesto[] = [
  {
    codPP: 1,
    cantidadVacantes: 2,
    cantidadSuPostulaciones: 5,
    horasDedicadas: 20,
    puesto: {
      codPuesto: "DEV001",
      nombrePuesto: "Desarrollador Full Stack",
    },
    carreras: [
      {
        codPPC: 1,
        cantMateriasAprobadasReq: 25,
        cantMateriasRegularesReq: 30,
        carrera: {
          codCarrera: "ING001",
          nombreCarrera: "Ingeniería en Sistemas",
        },
        planEstudios: {
          codPlanEstudios: "2020",
          nombrePlan: "Plan 2020",
        },
      },
    ],
  },
  {
    codPP: 2,
    cantidadVacantes: 1,
    cantidadSuPostulaciones: 3,
    horasDedicadas: 15,
    puesto: {
      codPuesto: "DES001",
      nombrePuesto: "Diseñador UX/UI",
    },
    carreras: [
      {
        codPPC: 2,
        cantMateriasAprobadasReq: 20,
        cantMateriasRegularesReq: 25,
        carrera: {
          codCarrera: "DIS001",
          nombreCarrera: "Diseño Gráfico",
        },
        planEstudios: {
          codPlanEstudios: "2019",
          nombrePlan: "Plan 2019",
        },
      },
    ],
  },
]

export function ProyectoPuestoDialog({ open, onOpenChange, proyecto }: ProyectoPuestoDialogProps) {
  const [puestos, setPuestos] = useState<ProyectoPuesto[]>(mockPuestos)
  const [selectedPuesto, setSelectedPuesto] = useState<ProyectoPuesto | null>(null)
  const [showPuestoForm, setShowPuestoForm] = useState(false)
  const [showCarreraForm, setShowCarreraForm] = useState(false)
  const [puestoFormMode, setPuestoFormMode] = useState<"create" | "edit">("create")

  if (!proyecto) return null

  const canModify = proyecto.nombreEstadoProyecto === "Creado"

  const handleCreatePuesto = () => {
    setPuestoFormMode("create")
    setSelectedPuesto(null)
    setShowPuestoForm(true)
  }

  const handleEditPuesto = (puesto: ProyectoPuesto) => {
    setPuestoFormMode("edit")
    setSelectedPuesto(puesto)
    setShowPuestoForm(true)
  }

  const handleManageCarreras = (puesto: ProyectoPuesto) => {
    setSelectedPuesto(puesto)
    setShowCarreraForm(true)
  }

  const handleDeletePuesto = (puesto: ProyectoPuesto) => {
    if (confirm(`¿Está seguro que desea eliminar el puesto "${puesto.puesto.nombrePuesto}"?`)) {
      setPuestos(puestos.filter((p) => p.codPP !== puesto.codPP))
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Gestión de Puestos</DialogTitle>
            <DialogDescription>
              Proyecto: {proyecto.nombreProyecto}
              {!canModify && (
                <Badge variant="outline" className="ml-2">
                  Solo lectura - Estado: {proyecto.nombreEstadoProyecto}
                </Badge>
              )}
            </DialogDescription>
          </DialogHeader>

          {/* Sistema title */}
          <div className="text-center mb-4 border-b pb-4">
            <h2 className="text-2xl font-bold text-gray-900">Sistema de Prácticas Profesionales</h2>
          </div>

          <div className="space-y-4">
            {canModify && (
              <div className="flex justify-end">
                <Button onClick={handleCreatePuesto}>
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Puesto
                </Button>
              </div>
            )}

            {puestos.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No hay puestos definidos</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Agregue puestos para completar la configuración del proyecto
                  </p>
                  {canModify && (
                    <Button onClick={handleCreatePuesto}>
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar Primer Puesto
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {puestos.map((puesto) => (
                  <Card key={puesto.codPP}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {puesto.puesto.nombrePuesto}
                            <Badge variant="outline">{puesto.puesto.codPuesto}</Badge>
                          </CardTitle>
                          <CardDescription>
                            {puesto.cantidadVacantes} vacantes • {puesto.horasDedicadas} horas semanales
                          </CardDescription>
                        </div>
                        {canModify && (
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleEditPuesto(puesto)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleDeletePuesto(puesto)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Postulaciones:</span>
                            <p className="text-muted-foreground">{puesto.cantidadSuPostulaciones}</p>
                          </div>
                          <div>
                            <span className="font-medium">Vacantes:</span>
                            <p className="text-muted-foreground">{puesto.cantidadVacantes}</p>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-medium">Carreras Requeridas</h4>
                            {canModify && (
                              <Button variant="outline" size="sm" onClick={() => handleManageCarreras(puesto)}>
                                Gestionar Carreras
                              </Button>
                            )}
                          </div>

                          {puesto.carreras.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No hay carreras definidas para este puesto</p>
                          ) : (
                            <div className="space-y-2">
                              {puesto.carreras.map((carrera) => (
                                <div key={carrera.codPPC} className="border rounded-lg p-3">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <p className="font-medium">{carrera.carrera.nombreCarrera}</p>
                                      <p className="text-sm text-muted-foreground">
                                        Plan: {carrera.planEstudios.nombrePlan} ({carrera.planEstudios.codPlanEstudios})
                                      </p>
                                    </div>
                                    <div className="text-right text-sm">
                                      <p>Aprobadas: {carrera.cantMateriasAprobadasReq}</p>
                                      <p>Regulares: {carrera.cantMateriasRegularesReq}</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
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

      <PuestoForm
        open={showPuestoForm}
        onOpenChange={setShowPuestoForm}
        mode={puestoFormMode}
        puesto={selectedPuesto}
        onSave={(puesto) => {
          if (puestoFormMode === "create") {
            setPuestos([...puestos, { ...puesto, codPP: puestos.length + 1 }])
          } else {
            setPuestos(puestos.map((p) => (p.codPP === puesto.codPP ? puesto : p)))
          }
          setShowPuestoForm(false)
        }}
      />

      <CarreraForm
        open={showCarreraForm}
        onOpenChange={setShowCarreraForm}
        puesto={selectedPuesto}
        onSave={(carreras) => {
          if (selectedPuesto) {
            setPuestos(puestos.map((p) => (p.codPP === selectedPuesto.codPP ? { ...p, carreras } : p)))
          }
          setShowCarreraForm(false)
        }}
      />
    </>
  )
}
