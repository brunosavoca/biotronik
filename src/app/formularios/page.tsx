"use client"

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import { Building, Heart, Cog, Message, Search, Calendar, User, FileText } from "@mynaui/icons-react";

interface MedicalForm {
  id: string;
  patientName: string;
  patientAge: number;
  symptoms: string;
  bloodPressure?: string;
  heartRate?: string;
  medicalHistory?: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
    specialty?: string;
    hospital?: string;
  };
}

export default function FormulariosPage() {
  const { data: session } = useSession();
  
  const [medicalForms, setMedicalForms] = useState<MedicalForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadMedicalForms();
  }, []);

  const loadMedicalForms = async () => {
    try {
      const response = await fetch("/api/medical-forms");
      const data = await response.json();
      
      if (response.ok) {
        setMedicalForms(data.medicalForms || []);
      }
    } catch (error) {
      console.error("Error cargando formularios:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredForms = medicalForms.filter(form =>
    form.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    form.symptoms.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Formularios Médicos
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Historial de formularios guardados
                </p>
              </div>
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
                <Button variant="outline" size="sm" className="flex items-center space-x-2">
                  <Heart className="w-4 h-4" />
                  <span>Nuevo Formulario</span>
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

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Formularios</h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{medicalForms.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mr-4">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Pacientes Únicos</h3>
                <p className="text-2xl font-bold text-green-600">
                  {new Set(medicalForms.map(f => f.patientName)).size}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Este Mes</h3>
                <p className="text-2xl font-bold text-purple-600">
                  {medicalForms.filter(f => {
                    const formDate = new Date(f.createdAt);
                    const now = new Date();
                    return formDate.getMonth() === now.getMonth() && formDate.getFullYear() === now.getFullYear();
                  }).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Búsqueda */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Buscar por paciente o síntomas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
          <Link href="/formulario">
            <Button className="ml-4 bg-red-500 hover:bg-red-600 text-white">
              <Heart className="w-4 h-4 mr-2" />
              Nuevo Formulario
            </Button>
          </Link>
        </div>

        {/* Lista de formularios */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse shadow-2xl">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <p className="text-gray-600 dark:text-gray-400">Cargando formularios...</p>
          </div>
        ) : filteredForms.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {searchTerm ? 'No se encontraron formularios' : 'No hay formularios aún'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchTerm 
                ? 'Intenta con otros términos de búsqueda' 
                : 'Comienza creando tu primer formulario médico'
              }
            </p>
            <Link href="/formulario">
              <Button className="bg-red-500 hover:bg-red-600 text-white">
                Crear Primer Formulario
              </Button>
            </Link>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 shadow rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Paciente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Síntomas
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Signos Vitales
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Fecha
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredForms.map((form) => (
                    <tr key={form.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {form.patientName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {form.patientAge} años
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 dark:text-white max-w-xs">
                          {form.symptoms.length > 100 
                            ? `${form.symptoms.substring(0, 100)}...` 
                            : form.symptoms
                          }
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {form.bloodPressure && (
                            <div><strong>PA:</strong> {form.bloodPressure}</div>
                          )}
                          {form.heartRate && (
                            <div><strong>FC:</strong> {form.heartRate}</div>
                          )}
                          {!form.bloodPressure && !form.heartRate && (
                            <span className="text-gray-400">No registrado</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(form.createdAt).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}