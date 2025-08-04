"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import { Building, Heart, Cog, Message } from "@mynaui/icons-react";

export default function FormularioPage() {
  const { data: session } = useSession();
  
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg">
                <Building className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-medium text-gray-900 dark:text-white">
                Biotronik
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <Link href="/">
                <Button variant="outline" size="sm" className="flex items-center space-x-2">
                  <Building className="w-4 h-4" />
                  <span>Biotronik</span>
                </Button>
              </Link>
              
              <Link href="/chat">
                <Button variant="outline" size="sm" className="flex items-center space-x-2">
                  <Message className="w-4 h-4" />
                  <span>Chat</span>
                </Button>
              </Link>
              
              <Link href="/formulario">
                <Button variant="outline" size="sm" className="flex items-center space-x-2 bg-red-50 border-red-200 text-red-700 hover:bg-red-100">
                  <Heart className="w-4 h-4" />
                  <span>Formulario</span>
                </Button>
              </Link>
              
              {session && (session.user.role === "ADMIN" || session.user.role === "SUPERADMIN") && (
                <Link href="/admin">
                  <Button variant="outline" size="sm" className="flex items-center space-x-2">
                    <Cog className="w-4 h-4" />
                    <span>Admin</span>
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-red-500/25">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-2">
              Formulario Médico
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Completa la información para una consulta personalizada
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nombre del Paciente
                  </label>
                  <Input
                    type="text"
                    placeholder="Nombre completo"
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Edad
                  </label>
                  <Input
                    type="number"
                    placeholder="Edad en años"
                    className="w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Síntomas Principales
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  rows={4}
                  placeholder="Describe los síntomas principales del paciente..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Presión Arterial
                  </label>
                  <Input
                    type="text"
                    placeholder="ej. 120/80 mmHg"
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Frecuencia Cardíaca
                  </label>
                  <Input
                    type="text"
                    placeholder="ej. 75 bpm"
                    className="w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Antecedentes Médicos
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  rows={3}
                  placeholder="Antecedentes cardiovasculares, medicamentos actuales, etc..."
                />
              </div>

              <div className="flex justify-end space-x-4 pt-6">
                <Button variant="outline">
                  Cancelar
                </Button>
                <Button className="bg-red-500 hover:bg-red-600 text-white">
                  Generar Consulta IA
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 dark:border-gray-800 py-6">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Para uso profesional de cardiólogos licenciados. No para diagnóstico de pacientes.
          </p>
        </div>
      </footer>
    </div>
  );
}