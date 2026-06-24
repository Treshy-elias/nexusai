'use client'

import { useEffect, useRef, useState } from 'react'
import { useChat } from '@/hooks/useChat'
import MessageBubble from './MessageBubble'
import MessageInput from './MessageInput'
import TypingIndicator from './TypingIndicator'
import { Zap, Code2, FileText, Lightbulb, PenLine } from 'lucide-react'

const SUGGESTIONS = [
  { icon: Code2,     label: 'Write a Python script' },
  { icon: FileText,  label: 'Summarize a topic' },
  { icon: Lightbulb, label: 'Explain quantum computing' },
  { icon: PenLine,   label: 'Help me brainstorm' },
]

export default function ChatWindow({ conversationId }: { conversationId: string }) {
  const { messages, isLoading, error, sendMessage } = useChat(conversationId)
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

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

      {/* Header */}
      <div className="px-6 py-3.5 border-b border-zinc-800/80 flex items-center gap-3 bg-zinc-900/60 backdrop-blur-sm">
        <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
          <Zap className="w-3.5 h-3.5 text-cyan-400" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-white tracking-tight">NexusAI</h1>
          <p className="text-[11px] text-zinc-500 font-medium">Gemini 2.5 Flash</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] text-zinc-500 font-medium">Online</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-6 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-800">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-6 px-4">
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                <Zap className="w-6 h-6 text-cyan-400" />
              </div>
              <div className="text-center">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  What can I help you with?
                </h2>
                <p className="text-sm text-zinc-500 mt-1.5 max-w-xs leading-relaxed">
                  Ask anything — code, analysis, writing, math, or just a conversation.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 max-w-lg w-full">
              {SUGGESTIONS.map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  onClick={() => setInput(label)}
                  className="flex items-center gap-2.5 px-4 py-3 text-left text-xs text-zinc-400 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-xl transition-all duration-150 group"
                >
                  <Icon className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                  <span className="font-medium group-hover:text-zinc-200 transition-colors">{label}</span>
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
          <div className="mx-6 my-2 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">
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