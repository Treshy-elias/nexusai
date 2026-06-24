'use client'

import { useEffect, useRef, useState } from 'react'
import { useChat, Message } from '@/hooks/useChat'
import MessageBubble from './MessageBubble'
import MessageInput from './MessageInput'
import TypingIndicator from './TypingIndicator'
import { Zap } from 'lucide-react'

interface ChatWindowProps {
  conversationId: string
  initialMessages?: {
    id: string
    role: 'user' | 'assistant'
    content: string
    created_at: string
  }[]
}

export default function ChatWindow({ conversationId, initialMessages = [] }: ChatWindowProps) {
  const { messages, isLoading, error, sendMessage, setMessages } = useChat(conversationId)
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const initialized = useRef(false)

  // Load initial messages from DB on mount
  useEffect(() => {
    if (!initialized.current && initialMessages.length > 0) {
      setMessages(initialMessages.map(m => ({
        id: m.id,
        role: m.role as 'user' | 'assistant',
        content: m.content,
        isStreaming: false,
      })))
      initialized.current = true
    }
  }, [initialMessages, setMessages])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  async function handleSend() {
    if (!input.trim() || isLoading) return
    const text = input.trim()
    setInput('')
    await sendMessage(text)
  }

  return (
    <div className="flex flex-col flex-1 h-full overflow-hidden bg-zinc-950">
      {/* Header — desktop only, mobile handled by ChatLayout */}
      <div className="hidden lg:flex px-6 py-4 border-b border-zinc-800 items-center gap-3 bg-zinc-900 shrink-0">
        <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
          <Zap className="w-3.5 h-3.5 text-cyan-400" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-white tracking-tight">NexusAI</h1>
          <p className="text-[11px] text-zinc-600 font-medium">Powered by Gemini 2.5 Flash</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-5 px-4">
            <div className="w-14 h-14 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
              <Zap className="w-7 h-7 text-cyan-400" />
            </div>
            <div className="text-center">
              <h2 className="text-xl font-bold text-white tracking-tight mb-1">
                How can I help you today?
              </h2>
              <p className="text-sm text-zinc-500 max-w-sm leading-relaxed">
                Ask me anything — writing, coding, analysis, math, and more.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 max-w-md w-full mt-2">
              {[
                'Explain quantum computing',
                'Write a Python script',
                'Summarize a topic',
                'Help me brainstorm',
              ].map(suggestion => (
                <button
                  key={suggestion}
                  onClick={() => setInput(suggestion)}
                  className="px-4 py-3 text-sm text-left text-zinc-400 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:text-zinc-300 rounded-xl transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map(message => (
          <MessageBubble
            key={message.id}
            role={message.role}
            content={message.content}
            isStreaming={message.isStreaming}
          />
        ))}

        {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
          <TypingIndicator />
        )}

        {error && (
          <div className="mx-4 my-2 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">
            {error}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <MessageInput
        value={input}
        onChange={setInput}
        onSend={handleSend}
        disabled={isLoading}
      />
    </div>
  )
}