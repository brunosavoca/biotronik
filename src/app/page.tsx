"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { Building, Heart, Cog, Message } from "@mynaui/icons-react";

export default function Home() {
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
                <Button variant="outline" size="sm" className="flex items-center space-x-2 bg-red-50 border-red-200 text-red-700 hover:bg-red-100">
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
                <Button variant="outline" size="sm" className="flex items-center space-x-2">
                  <Heart className="w-4 h-4" />
                  <span>Formulario</span>
                </Button>
              </Link>
              
              {session && (
                <Link href="/formularios">
                  <Button variant="outline" size="sm" className="flex items-center space-x-2">
                    <Heart className="w-4 h-4" />
                    <span>Historial</span>
                  </Button>
                </Link>
              )}
              
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
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            {/* Hero Logo */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-red-500/25">
                <Heart className="w-10 h-10 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 dark:text-white mb-4 tracking-tight">
              <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">Biotronik</span>
              <br />
              Asistente IA para Cardiólogos
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-lg mx-auto">
              Soporte avanzado de IA para medicina cardiovascular. Obtén información sobre diagnósticos, protocolos de tratamiento y guías clínicas basadas en evidencia.
            </p>
          </div>

          <div className="flex justify-center space-y-4">
            <Link href="/chat">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl shadow-red-500/25 hover:shadow-red-500/40 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 flex items-center justify-center space-x-3 mx-auto"
              >
                <Heart className="w-5 h-5" />
                <span>Iniciar Consulta Médica</span>
              </Button>
            </Link>
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