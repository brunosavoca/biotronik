import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

// POST - Crear nuevo formulario médico
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { 
      patientName, 
      patientAge, 
      symptoms, 
      bloodPressure, 
      heartRate, 
      medicalHistory 
    } = await request.json()

    // Validaciones básicas
    if (!patientName || !patientAge || !symptoms) {
      return NextResponse.json({ 
        error: "Nombre del paciente, edad y síntomas son requeridos" 
      }, { status: 400 })
    }

    // Crear el formulario médico en la base de datos
    const medicalForm = await prisma.medicalForm.create({
      data: {
        patientName,
        patientAge: parseInt(patientAge),
        symptoms,
        bloodPressure: bloodPressure || null,
        heartRate: heartRate || null,
        medicalHistory: medicalHistory || null,
        userId: session.user.id
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            specialty: true,
            hospital: true
          }
        }
      }
    })

    return NextResponse.json({ 
      success: true, 
      medicalForm,
      message: "Formulario médico guardado exitosamente" 
    })
  } catch (error) {
    console.error("Error guardando formulario médico:", error)
    return NextResponse.json({ 
      error: "Error interno del servidor" 
    }, { status: 500 })
  }
}

// GET - Obtener formularios médicos del usuario
export async function GET() {
  try {
    const session = await auth()
    
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const medicalForms = await prisma.medicalForm.findMany({
      where: { userId: session.user.id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            specialty: true,
            hospital: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ medicalForms })
  } catch (error) {
    console.error("Error obteniendo formularios médicos:", error)
    return NextResponse.json({ 
      error: "Error interno del servidor" 
    }, { status: 500 })
  }
}