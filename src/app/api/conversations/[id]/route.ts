import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

// GET - Obtener conversación específica con sus mensajes
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { id } = await params

    const conversation = await prisma.conversation.findFirst({
      where: { 
        id,
        userId: session.user.id
      },
      include: {
        messages: {
          orderBy: { timestamp: 'asc' }
        }
      }
    })

    if (!conversation) {
      return NextResponse.json({ error: "Conversación no encontrada" }, { status: 404 })
    }

    return NextResponse.json({ conversation })
  } catch (error) {
    console.error("Error al obtener conversación:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

// PUT - Actualizar título de la conversación
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { id } = await params
    const { title } = await request.json()

    const conversation = await prisma.conversation.updateMany({
      where: { 
        id,
        userId: session.user.id
      },
      data: { title }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error al actualizar conversación:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

// DELETE - Eliminar conversación
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { id } = await params

    await prisma.conversation.deleteMany({
      where: { 
        id,
        userId: session.user.id
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error al eliminar conversación:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}