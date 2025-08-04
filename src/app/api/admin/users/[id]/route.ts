import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { UserRole, UserStatus } from "@prisma/client"

// GET - Obtener usuario específico
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session || (session.user.role !== UserRole.SUPERADMIN && session.user.role !== UserRole.ADMIN)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        specialty: true,
        licenseNumber: true,
        hospital: true,
        createdAt: true,
        lastLoginAt: true,
        _count: {
          select: { conversations: true }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error("Error al obtener usuario:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

// PUT - Actualizar usuario (Solo SUPERADMIN)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session || session.user.role !== UserRole.SUPERADMIN) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    const { id } = await params
    const { name, email, password, role, specialty, licenseNumber, hospital, status } = await request.json()

    const updateData: Record<string, unknown> = {}
    if (name) updateData.name = name
    if (email) updateData.email = email
    if (role) updateData.role = role
    if (specialty !== undefined) updateData.specialty = specialty
    if (licenseNumber !== undefined) updateData.licenseNumber = licenseNumber
    if (hospital !== undefined) updateData.hospital = hospital
    if (status) updateData.status = status

    // Si se proporciona una nueva contraseña, hashearla
    if (password) {
      updateData.password = await bcrypt.hash(password, 12)
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        specialty: true,
        licenseNumber: true,
        hospital: true,
        createdAt: true
      }
    })

    return NextResponse.json({ user: updatedUser })
  } catch (error) {
    console.error("Error al actualizar usuario:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

// DELETE - Eliminar usuario (Solo SUPERADMIN)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session || session.user.role !== UserRole.SUPERADMIN) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    const { id } = await params

    // No permitir eliminar el propio usuario
    if (id === session.user.id) {
      return NextResponse.json({ error: "No puedes eliminar tu propia cuenta" }, { status: 400 })
    }

    await prisma.user.delete({
      where: { id }
    })

    return NextResponse.json({ message: "Usuario eliminado correctamente" })
  } catch (error) {
    console.error("Error al eliminar usuario:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}