import { GoogleGenAI } from '@google/genai'
import { createClient } from '@/lib/supabase/server'

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })

// In-memory rate limiter — resets when server restarts
// Good enough for a portfolio project
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

const RATE_LIMIT = 20        // max requests
const RATE_WINDOW = 60 * 60 * 1000  // per hour (ms)

function checkRateLimit(identifier: string): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const record = rateLimitMap.get(identifier)

  if (!record || now > record.resetAt) {
    rateLimitMap.set(identifier, { count: 1, resetAt: now + RATE_WINDOW })
    return { allowed: true, remaining: RATE_LIMIT - 1 }
  }

  if (record.count >= RATE_LIMIT) {
    return { allowed: false, remaining: 0 }
  }

  record.count++
  return { allowed: true, remaining: RATE_LIMIT - record.count }
}

export async function POST(request: Request) {
  try {
    // Auth check — only signed in users can call this
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Rate limit by user ID
    const { allowed, remaining } = checkRateLimit(user.id)

    if (!allowed) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. You have used your 20 messages per hour. Please wait before sending more.' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const { messages } = await request.json()

    const history = messages.slice(0, -1).map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }))

    const lastMessage = messages[messages.length - 1].content

    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: `You are NexusAI, a helpful, smart, and friendly AI assistant.
You give clear, accurate, and well-structured responses.
When writing code, always specify the language for syntax highlighting.
Be concise but thorough.`,
      },
      history,
    })

    const stream = await chat.sendMessageStream({ message: lastMessage })

    const readableStream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder()
        try {
          for await (const chunk of stream) {
            const text = chunk.text
            if (text) {
              controller.enqueue(encoder.encode(text))
            }
          }
        } catch (error) {
          controller.error(error)
        } finally {
          controller.close()
        }
      },
    })

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'X-RateLimit-Remaining': remaining.toString(),
      },
    })
  } catch (error: any) {
    console.error('Gemini API error:', error?.message)
    return new Response(
      JSON.stringify({ error: 'Failed to generate response' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}