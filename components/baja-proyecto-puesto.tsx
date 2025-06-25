"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Trash2, Briefcase, Users, Clock, Calendar } from "lucide-react"

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

interface BajaProyectoPuestoProps {
  puesto: ProyectoPuesto
  onSave: (puesto: ProyectoPuesto) => void
  onCancel: () => void
}

export function BajaProyectoPuesto({ puesto, onSave, onCancel }: BajaProyectoPuestoProps) {
  const handleConfirm = () => {
    // Establecer fecha de baja actual en formato DD/MM/AAAA
    const today = new Date()
    const formattedDate = today.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })

    const updatedPuesto: ProyectoPuesto = {
      ...puesto,
      fechaBajaProyectoPuesto: formattedDate,
    }
    onSave(updatedPuesto)
  }

  const todayFormatted = new Date().toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Sistema de Prácticas Profesionales</h1>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Button variant="outline" onClick={onCancel} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </div>

        <Card>
          <CardContent className="p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">¿Desea dar de baja el puesto?</h2>
              <p className="text-gray-600">Revise la información del puesto antes de confirmar la baja</p>
            </div>

            {/* Título del puesto */}
            <div className="mb-8">
              <div className="flex items-center mb-2">
                <Briefcase className="h-6 w-6 text-gray-600 mr-2" />
                <span className="text-gray-600 text-sm">Puesto a dar de baja</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">{puesto.puesto.nombrePuesto}</h3>
              <p className="text-gray-600">Código: {puesto.puesto.codPuesto}</p>
            </div>

            {/* Información en recuadros grises */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <Users className="h-5 w-5 text-gray-600 mr-2" />
                <span className="font-medium text-gray-900">Información del puesto</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Users className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-600">Cantidad Vacantes</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{puesto.cantidadVacantes}</p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Users className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-600">Máx. Postulaciones</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{puesto.cantidadSuPostulaciones}</p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Clock className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-600">Horas Dedicadas</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{puesto.horasDedicadas}</p>
                </div>
              </div>
            </div>

            {/* Información de la baja */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <Calendar className="h-5 w-5 text-gray-600 mr-2" />
                <span className="font-medium text-gray-900">Información de la baja</span>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Trash2 className="h-4 w-4 text-red-500 mr-2" />
                  <span className="text-sm text-red-600">Fecha de Baja</span>
                </div>
                <p className="text-lg font-semibold text-red-700">{todayFormatted}</p>
                <p className="text-sm text-red-600 mt-1">
                  El puesto será marcado como inactivo y no estará disponible para nuevas postulaciones.
                </p>
              </div>
            </div>

            {/* Botones */}
            <div className="flex justify-between items-center pt-6 border-t">
              <Button variant="outline" onClick={onCancel}>
                Volver
              </Button>
              <div className="space-x-4">
                <Button variant="outline" onClick={onCancel}>
                  Cancelar
                </Button>
                <Button onClick={handleConfirm} className="bg-black hover:bg-gray-800 text-white">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Confirmar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
