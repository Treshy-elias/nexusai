'use client'

import { useRef, useEffect } from 'react'
import { ArrowUp } from 'lucide-react'

interface MessageInputProps {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  disabled?: boolean
}

export default function MessageInput({ value, onChange, onSend, disabled }: MessageInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`
    }
  }, [value])

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (!disabled && value.trim()) onSend()
    }
  }

  return (
    <div className="px-4 py-4 border-t border-zinc-800/80 bg-zinc-900/40 backdrop-blur-sm">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-end gap-3 bg-zinc-900 border border-zinc-700 hover:border-zinc-600 focus-within:border-cyan-500/50 focus-within:ring-2 focus-within:ring-cyan-500/10 rounded-2xl px-4 py-3 transition-all duration-200">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={e => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder="Ask NexusAI anything..."
            rows={1}
            className="flex-1 bg-transparent text-sm text-zinc-200 placeholder-zinc-600 resize-none focus:outline-none min-h-[24px] max-h-[200px] leading-6 font-normal"
          />
          <button
            onClick={onSend}
            disabled={disabled || !value.trim()}
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150 shrink-0 shadow-md shadow-cyan-500/20"
          >
            <ArrowUp className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>
        <p className="text-[11px] text-zinc-700 text-center mt-2 font-medium tracking-wide">
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  )
}