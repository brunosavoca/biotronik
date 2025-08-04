import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import OpenAI from "openai"
import { prisma } from "@/lib/prisma"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { messages, conversationId } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Mensajes requeridos" }, { status: 400 })
    }

    // Preparar mensajes para OpenAI
    const openaiMessages = messages.map((msg: { role: string; content: string; images?: string[] }) => {
      if (msg.images && msg.images.length > 0) {
        // Si hay imágenes, usar el formato de contenido múltiple
        return {
          role: msg.role,
          content: [
            { type: "text", text: msg.content },
            ...msg.images.map((img: string) => ({
              type: "image_url",
              image_url: { url: img }
            }))
          ]
        }
      }
      return {
        role: msg.role,
        content: msg.content
      }
    })

    // Agregar el contexto médico al sistema
    const systemMessage = {
      role: "system" as const,
      content: `Eres Biotronik, un asistente de IA especializado en cardiología y medicina cardiovascular. Tu función es:

1. **Proporcionar información médica precisa** basada en evidencia científica y guías clínicas actuales (AHA, ESC, ACC)
2. **Ayudar con diagnósticos** analizando síntomas, signos y resultados de pruebas
3. **Recomendar protocolos de tratamiento** según las mejores prácticas médicas
4. **Interpretar resultados de pruebas** como ECGs, ecocardiogramas, etc.
5. **Explicar conceptos médicos** de manera clara y comprensible

**IMPORTANTE:**
- Siempre aclara que eres un asistente de IA y no reemplazas la evaluación médica profesional
- Recomienda consultar con un médico para diagnósticos definitivos
- Cita fuentes y guías clínicas cuando sea apropiado
- Mantén un tono profesional pero accesible
- Si se te proporcionan imágenes médicas, analízalas detalladamente

**Áreas de especialización:**
- Cardiología general
- Electrocardiografía
- Insuficiencia cardíaca
- Arritmias
- Cardiopatía isquémica
- Hipertensión arterial
- Valvulopatías
- Cardiología pediátrica

Responde en español y mantén un enfoque clínico riguroso.`
    }

    const messagesWithSystem = [systemMessage, ...openaiMessages]

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messagesWithSystem,
      max_tokens: 2000,
      temperature: 0.7,
    })

    const assistantMessage = completion.choices[0]?.message?.content

    if (!assistantMessage) {
      return NextResponse.json({ error: "Error al generar respuesta" }, { status: 500 })
    }

    // Guardar mensaje del asistente en la base de datos
    if (conversationId) {
      await prisma.message.create({
        data: {
          role: "assistant",
          content: assistantMessage,
          conversationId: conversationId
        }
      })
    }

    return NextResponse.json({ message: assistantMessage })
  } catch (error) {
    console.error("Error en chat API:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}