import { useState, useCallback } from 'react'
import { createConversation, saveMessage } from '@/app/(dashboard)/actions'
import { useRouter } from 'next/navigation'

export interface Message {
    id: string
    role: 'user' | 'assistant'
    content: string
    isStreaming?: boolean
}

export function useChat(conversationId: string) {
    const [messages, setMessages] = useState<Message[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const sendMessage = useCallback(async (content: string) => {
        if (!content.trim() || isLoading) return

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: content.trim(),
        }

        const updatedMessages = [...messages, userMessage]
        setMessages(updatedMessages)
        setIsLoading(true)
        setError(null)

        const assistantId = (Date.now() + 1).toString()

        setMessages(prev => [...prev, {
            id: assistantId,
            role: 'assistant',
            content: '',
            isStreaming: true,
        }])

        try {
            let activeConversationId = conversationId

            if (conversationId === 'new') {
                activeConversationId = await createConversation(content.trim())
            }

            await saveMessage(activeConversationId, 'user', content.trim())

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: updatedMessages.map(m => ({
                        role: m.role,
                        content: m.content,
                    })),
                    conversationId: activeConversationId,
                }),
            })

            if (!response.ok) {
                if (response.status === 429) {
                    const data = await response.json()
                    throw new Error(data.error)
                }
                if (response.status === 401) {
                    throw new Error('You must be signed in to send messages.')
                }
                throw new Error('Failed to get response')
            }

            if (!response.body) throw new Error('No response body')

            const reader = response.body.getReader()
            const decoder = new TextDecoder()
            let fullContent = ''

            while (true) {
                const { done, value } = await reader.read()
                if (done) break
                const chunk = decoder.decode(value, { stream: true })
                fullContent += chunk
                setMessages(prev =>
                    prev.map(m =>
                        m.id === assistantId
                            ? { ...m, content: fullContent, isStreaming: true }
                            : m
                    )
                )
            }

            setMessages(prev =>
                prev.map(m =>
                    m.id === assistantId
                        ? { ...m, content: fullContent, isStreaming: false }
                        : m
                )
            )

            await saveMessage(activeConversationId, 'assistant', fullContent)

            if (conversationId === 'new') {
                router.push(`/chat/${activeConversationId}`)
            }

            router.refresh()

        } catch (err) {
            console.error(err)
            const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.'
            setError(message)
            setMessages(prev => prev.filter(m => m.id !== assistantId))
        } finally {
            setIsLoading(false)
        }
    }, [messages, isLoading, conversationId, router])

    const clearMessages = useCallback(() => {
        setMessages([])
        setError(null)
    }, [])

    return { messages, isLoading, error, sendMessage, clearMessages, setMessages }
}