import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">B</span>
              </div>
              <span className="text-lg font-medium text-gray-900 dark:text-white">
                Biotronik
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 dark:text-white mb-4 tracking-tight">
              <span className="text-red-500">Biotronik</span>
              <br />
              Asistente IA para Cardiólogos
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-lg mx-auto">
              Soporte avanzado de IA para medicina cardiovascular. Obtén información sobre diagnósticos, protocolos de tratamiento y guías clínicas.
            </p>
          </div>

          <div className="space-y-4">
            <Link href="/chat">
              <Button 
                size="lg" 
                className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-xl text-base font-medium shadow-lg hover:shadow-xl transition-all duration-200 button-press"
              >
                Iniciar Consulta
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