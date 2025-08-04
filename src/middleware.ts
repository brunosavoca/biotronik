import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "@/auth"

export async function middleware(request: NextRequest) {
  const session = await auth()
  const { pathname } = request.nextUrl

  // Proteger rutas de administración
  if (pathname.startsWith("/admin")) {
    if (!session || (session.user.role !== "SUPERADMIN" && session.user.role !== "ADMIN")) {
      return NextResponse.redirect(new URL("/auth/signin", request.url))
    }
  }

  // Proteger rutas de chat
  if (pathname.startsWith("/chat")) {
    if (!session) {
      return NextResponse.redirect(new URL("/auth/signin", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/chat/:path*"]
}