'use client'

import { useRef, useEffect } from 'react'
import { Send } from 'lucide-react'

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
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`
    }
  }, [value])

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (!disabled && value.trim()) onSend()
    }
  }

  return (
    <div className="px-3 pb-4 pt-3 border-t border-zinc-800 bg-zinc-950 shrink-0">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-end gap-3 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 focus-within:border-cyan-500 focus-within:ring-2 focus-within:ring-cyan-500/20 transition-all">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={e => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder="Message NexusAI..."
            rows={1}
            className="flex-1 bg-transparent text-sm text-white placeholder-zinc-600 resize-none focus:outline-none min-h-[24px] max-h-[160px] leading-6"
          />
          <button
            onClick={onSend}
            disabled={disabled || !value.trim()}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-cyan-500 hover:bg-cyan-400 text-zinc-950 disabled:opacity-30 disabled:cursor-not-allowed transition-colors shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[11px] text-zinc-600 font-medium text-center mt-2">
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  )
}