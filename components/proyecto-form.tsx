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
import { Textarea } from "@/components/ui/textarea"

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

interface ProyectoFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "create" | "edit"
  proyecto?: Proyecto | null
  onSave: (proyecto: Proyecto) => void
  proyectosExistentes?: Proyecto[]
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
  { cuit: "30-12345678-9", nombre: "Universidad Nacional" },
  { cuit: "30-87654321-0", nombre: "Universidad Tecnológica" },
  { cuit: "30-11111111-1", nombre: "Universidad de Ingeniería" },
  { cuit: "30-22222222-2", nombre: "Universidad del Sur" },
  { cuit: "30-33333333-3", nombre: "Universidad Privada" },
]

export function ProyectoForm({
  open,
  onOpenChange,
  mode,
  proyecto,
  onSave,
  proyectosExistentes = [],
}: ProyectoFormProps) {
  const [formData, setFormData] = useState({
    nombreProyecto: "",
    descripcionProyecto: "",
    fechaCierrePostulaciones: "",
    fechaInicioActividades: "",
    fechaFinProyecto: "",
    cuitEmpresa: "",
    cuitUniversidad: "",
  })
  const [errors, setErrors] = useState<string[]>([])
  const [showConfirmation, setShowConfirmation] = useState(false)

  useEffect(() => {
    if (proyecto && mode === "edit") {
      // Buscar los CUITs basados en los nombres
      const empresa = mockEmpresas.find((e) => e.nombre === proyecto.nombreEmpresa)
      const universidad = mockUniversidades.find((u) => u.nombre === proyecto.nombreUniversidad)

      setFormData({
        nombreProyecto: proyecto.nombreProyecto,
        descripcionProyecto: proyecto.descripcionProyecto,
        fechaCierrePostulaciones: proyecto.fechaCierrePostulaciones,
        fechaInicioActividades: proyecto.fechaInicioActividades,
        fechaFinProyecto: proyecto.fechaFinProyecto,
        cuitEmpresa: empresa?.cuit || "",
        cuitUniversidad: universidad?.cuit || "",
      })
    } else {
      setFormData({
        nombreProyecto: "",
        descripcionProyecto: "",
        fechaCierrePostulaciones: "",
        fechaInicioActividades: "",
        fechaFinProyecto: "",
        cuitEmpresa: "",
        cuitUniversidad: "",
      })
    }
    setErrors([])
    setShowConfirmation(false)
  }, [proyecto, mode, open])

  const validateCUIT = (cuit: string) => {
    // Validar formato CUIT: XX-XXXXXXXX-X
    const cuitRegex = /^\d{2}-\d{8}-\d{1}$/
    return cuitRegex.test(cuit)
  }

  const validateForm = () => {
    const newErrors: string[] = []

    // Validaciones básicas
    if (
      !formData.nombreProyecto.trim() ||
      !formData.descripcionProyecto.trim() ||
      !formData.fechaCierrePostulaciones ||
      !formData.fechaInicioActividades ||
      !formData.fechaFinProyecto ||
      !formData.cuitEmpresa.trim() ||
      !formData.cuitUniversidad.trim()
    ) {
      newErrors.push("Los datos ingresados son incorrectos. Intente nuevamente")
      setErrors(newErrors)
      return false
    }

    // Validar formato de CUIT
    if (!validateCUIT(formData.cuitEmpresa)) {
      newErrors.push("Los datos ingresados son incorrectos. Intente nuevamente")
    }

    if (!validateCUIT(formData.cuitUniversidad)) {
      newErrors.push("Los datos ingresados son incorrectos. Intente nuevamente")
    }

    // Validar existencia de empresa
    const empresaExiste = mockEmpresas.some((e) => e.cuit === formData.cuitEmpresa)
    if (!empresaExiste && validateCUIT(formData.cuitEmpresa)) {
      newErrors.push("La empresa para la que ingresó el código no existe. Intente nuevamente.")
    }

    // Validar existencia de universidad
    const universidadExiste = mockUniversidades.some((u) => u.cuit === formData.cuitUniversidad)
    if (!universidadExiste && validateCUIT(formData.cuitUniversidad)) {
      newErrors.push("La universidad para la que ingresó el código no existe. Intente nuevamente.")
    }

    // Validar nombre de proyecto duplicado
    const nombreDuplicado = proyectosExistentes.some(
      (p) =>
        p.nombreProyecto.toLowerCase() === formData.nombreProyecto.toLowerCase() &&
        p.numeroProyecto !== proyecto?.numeroProyecto,
    )
    if (nombreDuplicado) {
      newErrors.push("El nombre del proyecto ya está en uso. Intente con un nombre distinto")
    }

    // Validar fechas
    if (formData.fechaCierrePostulaciones && formData.fechaInicioActividades) {
      const fechaCierre = new Date(formData.fechaCierrePostulaciones)
      const fechaInicio = new Date(formData.fechaInicioActividades)

      if (fechaCierre >= fechaInicio) {
        newErrors.push("La fecha de cierre de postulaciones debe ser menor a la fecha de inicio del proyecto.")
      }
    }

    if (formData.fechaInicioActividades && formData.fechaFinProyecto) {
      const fechaInicio = new Date(formData.fechaInicioActividades)
      const fechaFin = new Date(formData.fechaFinProyecto)

      if (fechaInicio >= fechaFin) {
        newErrors.push("Los datos ingresados son incorrectos. Intente nuevamente")
      }
    }

    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      setShowConfirmation(true)
    }
  }

  const handleConfirm = () => {
    const empresa = mockEmpresas.find((e) => e.cuit === formData.cuitEmpresa)
    const universidad = mockUniversidades.find((u) => u.cuit === formData.cuitUniversidad)

    const proyectoData: Proyecto = {
      numeroProyecto: proyecto?.numeroProyecto || 0,
      nombreProyecto: formData.nombreProyecto,
      descripcionProyecto: formData.descripcionProyecto,
      fechaCierrePostulaciones: formData.fechaCierrePostulaciones,
      fechaInicioActividades: formData.fechaInicioActividades,
      fechaFinProyecto: formData.fechaFinProyecto,
      nombreEmpresa: empresa?.nombre || "",
      nombreUniversidad: universidad?.nombre || "",
      nombreEstadoProyecto: proyecto?.nombreEstadoProyecto || "Creado",
      codEstadoProyecto: proyecto?.codEstadoProyecto || "EST001",
    }

    onSave(proyectoData)
  }

  const handleCuitChange = (value: string, field: "cuitEmpresa" | "cuitUniversidad") => {
    // Permitir solo números y guiones, y limitar la longitud
    const cleaned = value.replace(/[^\d-]/g, "")
    if (cleaned.length <= 13) {
      // XX-XXXXXXXX-X = 13 caracteres
      setFormData({ ...formData, [field]: cleaned })
    }
  }

  if (showConfirmation) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar {mode === "create" ? "Creación" : "Modificación"}</DialogTitle>
            {/* Sistema title */}
            <div className="text-center mb-4 border-b pb-4">
              <h2 className="text-2xl font-bold text-gray-900">Sistema de Prácticas Profesionales</h2>
            </div>
            <DialogDescription>
              ¿Está seguro que desea {mode === "create" ? "crear" : "modificar"} el proyecto "{formData.nombreProyecto}
              "?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmation(false)}>
              Cancelar
            </Button>
            <Button onClick={handleConfirm}>Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Crear Nuevo Proyecto" : "Modificar Proyecto"}</DialogTitle>
          {/* Sistema title */}
          <div className="text-center mb-4 border-b pb-4">
            <h2 className="text-2xl font-bold text-gray-900">Sistema de Prácticas Profesionales</h2>
          </div>
          <DialogDescription>
            {mode === "create"
              ? "Ingrese los datos para crear un nuevo proyecto de prácticas profesionales"
              : "Modifique los datos del proyecto seleccionado"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <div className="text-sm text-red-800">
                    {errors.map((error, index) => (
                      <div key={index} className="mb-1 last:mb-0">
                        {error}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombreProyecto">
                Nombre del Proyecto <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nombreProyecto"
                value={formData.nombreProyecto}
                onChange={(e) => setFormData({ ...formData, nombreProyecto: e.target.value })}
                placeholder="Ingrese el nombre del proyecto"
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
                placeholder="XX-XXXXXXXX-X"
                maxLength={13}
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
              onChange={(e) => setFormData({ ...formData, descripcionProyecto: e.target.value })}
              placeholder="Describa el proyecto y sus objetivos"
              rows={3}
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
              placeholder="XX-XXXXXXXX-X"
              maxLength={13}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fechaCierrePostulaciones">
                Fecha Cierre Postulaciones <span className="text-red-500">*</span>
              </Label>
              <Input
                id="fechaCierrePostulaciones"
                type="date"
                value={formData.fechaCierrePostulaciones}
                onChange={(e) => setFormData({ ...formData, fechaCierrePostulaciones: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fechaInicioActividades">
                Fecha Inicio Actividades <span className="text-red-500">*</span>
              </Label>
              <Input
                id="fechaInicioActividades"
                type="date"
                value={formData.fechaInicioActividades}
                onChange={(e) => setFormData({ ...formData, fechaInicioActividades: e.target.value })}
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
                onChange={(e) => setFormData({ ...formData, fechaFinProyecto: e.target.value })}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>{mode === "create" ? "Crear Proyecto" : "Guardar Cambios"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
