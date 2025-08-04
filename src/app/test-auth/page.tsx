import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function TestAuthPage() {
  const session = await auth()
  
  if (!session) {
    redirect("/auth/signin")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Auth Test - NextAuth v5
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Server-side authentication working!
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Session Data
          </h3>
          <div className="space-y-2 text-sm">
            <p><strong>Name:</strong> {session.user.name}</p>
            <p><strong>Email:</strong> {session.user.email}</p>
            <p><strong>Role:</strong> {session.user.role}</p>
            <p><strong>Specialty:</strong> {session.user.specialty || "N/A"}</p>
            <p><strong>Hospital:</strong> {session.user.hospital || "N/A"}</p>
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            NextAuth v5 implementation successful! ✅
          </p>
        </div>
      </div>
    </div>
  )
} 