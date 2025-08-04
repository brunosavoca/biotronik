import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

// GET - Obtener todas las conversaciones del usuario
export async function GET() {
  try {
    const session = await auth()
    
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const conversations = await prisma.conversation.findMany({
      where: { userId: session.user.id },
      include: {
        _count: {
          select: { messages: true }
        }
      },
      orderBy: { updatedAt: 'desc' }
    })

    return NextResponse.json({ conversations })
  } catch (error) {
    console.error("Error al obtener conversaciones:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

// POST - Crear nueva conversación
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { title } = await request.json()

    const conversation = await prisma.conversation.create({
      data: {
        title: title || "Nueva conversación",
        userId: session.user.id
      }
    })

    return NextResponse.json({ conversation })
  } catch (error) {
    console.error("Error al crear conversación:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}