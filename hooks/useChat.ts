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
                // Create conversation first, get the real ID back
                activeConversationId = await createConversation(content.trim())
            }

            // Now save user message with the confirmed ID
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

            if (!response.ok) throw new Error('Failed to get response')
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

            // Navigate and refresh after everything is saved
            if (conversationId === 'new') {
                router.push(`/chat/${activeConversationId}`)
            }

            router.refresh()

        } catch (err) {
            console.error(err)
            setError('Something went wrong. Please try again.')
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