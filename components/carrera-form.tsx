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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Edit, Trash2, AlertCircle } from "lucide-react"

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

interface CarreraFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  puesto: ProyectoPuesto | null
  onSave: (carreras: ProyectoPuestoCarrera[]) => void
}

const mockCarreras = [
  { codCarrera: "ING001", nombreCarrera: "Ingeniería en Sistemas" },
  { codCarrera: "ING002", nombreCarrera: "Ingeniería en Software" },
  { codCarrera: "ING003", nombreCarrera: "Ingeniería en Computación" },
  { codCarrera: "DIS001", nombreCarrera: "Diseño Gráfico" },
  { codCarrera: "DIS002", nombreCarrera: "Diseño Industrial" },
  { codCarrera: "ADM001", nombreCarrera: "Administración de Empresas" },
]

const mockPlanesEstudio = [
  { codPlanEstudios: "2020", nombrePlan: "Plan 2020" },
  { codPlanEstudios: "2019", nombrePlan: "Plan 2019" },
  { codPlanEstudios: "2018", nombrePlan: "Plan 2018" },
  { codPlanEstudios: "2017", nombrePlan: "Plan 2017" },
]

export function CarreraForm({ open, onOpenChange, puesto, onSave }: CarreraFormProps) {
  const [carreras, setCarreras] = useState<ProyectoPuestoCarrera[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingCarrera, setEditingCarrera] = useState<ProyectoPuestoCarrera | null>(null)
  const [formData, setFormData] = useState({
    cantMateriasAprobadasReq: 20,
    cantMateriasRegularesReq: 25,
    codCarrera: "",
    codPlanEstudios: "",
  })
  const [errors, setErrors] = useState<string[]>([])

  useEffect(() => {
    if (puesto) {
      setCarreras(puesto.carreras || [])
    }
  }, [puesto])

  const resetForm = () => {
    setFormData({
      cantMateriasAprobadasReq: 20,
      cantMateriasRegularesReq: 25,
      codCarrera: "",
      codPlanEstudios: "",
    })
    setErrors([])
    setEditingCarrera(null)
  }

  const validateForm = () => {
    const newErrors: string[] = []

    if (!formData.codCarrera) {
      newErrors.push("Debe seleccionar una carrera")
    }

    if (!formData.codPlanEstudios) {
      newErrors.push("Debe seleccionar un plan de estudios")
    }

    if (formData.cantMateriasAprobadasReq <= 0) {
      newErrors.push("La cantidad de materias aprobadas debe ser mayor a 0")
    }

    if (formData.cantMateriasRegularesReq <= 0) {
      newErrors.push("La cantidad de materias regulares debe ser mayor a 0")
    }

    if (formData.cantMateriasAprobadasReq > formData.cantMateriasRegularesReq) {
      newErrors.push("Las materias aprobadas no pueden ser más que las regulares")
    }

    // Verificar duplicados
    const exists = carreras.some(
      (c) =>
        c.carrera.codCarrera === formData.codCarrera &&
        c.planEstudios.codPlanEstudios === formData.codPlanEstudios &&
        (!editingCarrera || c.codPPC !== editingCarrera.codPPC),
    )

    if (exists) {
      newErrors.push("Ya existe esta combinación de carrera y plan de estudios")
    }

    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleSubmitCarrera = () => {
    if (validateForm()) {
      const carrera = mockCarreras.find((c) => c.codCarrera === formData.codCarrera)
      const plan = mockPlanesEstudio.find((p) => p.codPlanEstudios === formData.codPlanEstudios)

      const nuevaCarrera: ProyectoPuestoCarrera = {
        codPPC: editingCarrera?.codPPC || carreras.length + 1,
        cantMateriasAprobadasReq: formData.cantMateriasAprobadasReq,
        cantMateriasRegularesReq: formData.cantMateriasRegularesReq,
        carrera: {
          codCarrera: formData.codCarrera,
          nombreCarrera: carrera?.nombreCarrera || "",
        },
        planEstudios: {
          codPlanEstudios: formData.codPlanEstudios,
          nombrePlan: plan?.nombrePlan || "",
        },
      }

      if (editingCarrera) {
        setCarreras(carreras.map((c) => (c.codPPC === editingCarrera.codPPC ? nuevaCarrera : c)))
      } else {
        setCarreras([...carreras, nuevaCarrera])
      }

      setShowForm(false)
      resetForm()
    }
  }

  const handleEditCarrera = (carrera: ProyectoPuestoCarrera) => {
    setEditingCarrera(carrera)
    setFormData({
      cantMateriasAprobadasReq: carrera.cantMateriasAprobadasReq,
      cantMateriasRegularesReq: carrera.cantMateriasRegularesReq,
      codCarrera: carrera.carrera.codCarrera,
      codPlanEstudios: carrera.planEstudios.codPlanEstudios,
    })
    setShowForm(true)
  }

  const handleDeleteCarrera = (carrera: ProyectoPuestoCarrera) => {
    if (confirm(`¿Está seguro que desea eliminar los requisitos para "${carrera.carrera.nombreCarrera}"?`)) {
      setCarreras(carreras.filter((c) => c.codPPC !== carrera.codPPC))
    }
  }

  const handleSave = () => {
    onSave(carreras)
  }

  if (!puesto) return null

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Gestión de Carreras</DialogTitle>
            <DialogDescription>
              Puesto: {puesto.puesto.nombrePuesto} - Defina los requisitos por carrera
            </DialogDescription>
          </DialogHeader>

          {/* Sistema title */}
          <div className="text-center mb-4 border-b pb-4">
            <h2 className="text-2xl font-bold text-gray-900">Sistema de Prácticas Profesionales</h2>
          </div>

          <div className="space-y-4">
            <div className="flex justify-end">
              <Button
                onClick={() => {
                  resetForm()
                  setShowForm(true)
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Carrera
              </Button>
            </div>

            {carreras.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No hay carreras definidas</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Agregue al menos una carrera con sus requisitos para completar el puesto
                  </p>
                  <Button
                    onClick={() => {
                      resetForm()
                      setShowForm(true)
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Primera Carrera
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {carreras.map((carrera) => (
                  <Card key={carrera.codPPC}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{carrera.carrera.nombreCarrera}</CardTitle>
                          <CardDescription>
                            Plan: {carrera.planEstudios.nombrePlan} ({carrera.planEstudios.codPlanEstudios})
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEditCarrera(carrera)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDeleteCarrera(carrera)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Materias Aprobadas:</span>
                          <p className="text-muted-foreground">{carrera.cantMateriasAprobadasReq}</p>
                        </div>
                        <div>
                          <span className="font-medium">Materias Regulares:</span>
                          <p className="text-muted-foreground">{carrera.cantMateriasRegularesReq}</p>
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
              Cancelar
            </Button>
            <Button onClick={handleSave}>Guardar Cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingCarrera ? "Modificar Carrera" : "Agregar Carrera"}</DialogTitle>
            <DialogDescription>Defina los requisitos académicos para esta carrera</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {errors.length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <ul className="list-disc list-inside space-y-1">
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="codCarrera">Carrera *</Label>
              <Select
                value={formData.codCarrera}
                onValueChange={(value) => setFormData({ ...formData, codCarrera: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione una carrera" />
                </SelectTrigger>
                <SelectContent>
                  {mockCarreras.map((carrera) => (
                    <SelectItem key={carrera.codCarrera} value={carrera.codCarrera}>
                      {carrera.nombreCarrera} ({carrera.codCarrera})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="codPlanEstudios">Plan de Estudios *</Label>
              <Select
                value={formData.codPlanEstudios}
                onValueChange={(value) => setFormData({ ...formData, codPlanEstudios: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un plan de estudios" />
                </SelectTrigger>
                <SelectContent>
                  {mockPlanesEstudio.map((plan) => (
                    <SelectItem key={plan.codPlanEstudios} value={plan.codPlanEstudios}>
                      {plan.nombrePlan}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cantMateriasAprobadasReq">Materias Aprobadas *</Label>
                <Input
                  id="cantMateriasAprobadasReq"
                  type="number"
                  min="1"
                  value={formData.cantMateriasAprobadasReq}
                  onChange={(e) =>
                    setFormData({ ...formData, cantMateriasAprobadasReq: Number.parseInt(e.target.value) || 0 })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cantMateriasRegularesReq">Materias Regulares *</Label>
                <Input
                  id="cantMateriasRegularesReq"
                  type="number"
                  min="1"
                  value={formData.cantMateriasRegularesReq}
                  onChange={(e) =>
                    setFormData({ ...formData, cantMateriasRegularesReq: Number.parseInt(e.target.value) || 0 })
                  }
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowForm(false)
                resetForm()
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handleSubmitCarrera}>{editingCarrera ? "Guardar Cambios" : "Agregar Carrera"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
