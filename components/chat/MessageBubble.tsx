'use client'

import { useState } from 'react'
import { Copy, Check, Zap, User } from 'lucide-react'
import MarkdownRenderer from './MarkdownRenderer'

interface MessageBubbleProps {
  role: 'user' | 'assistant'
  content: string
  isStreaming?: boolean
}

export default function MessageBubble({ role, content, isStreaming }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false)
  const isUser = role === 'user'

  async function copyToClipboard() {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={`flex gap-3 px-6 py-3 group ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>

      {/* Avatar */}
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border ${
        isUser
          ? 'bg-zinc-700 border-zinc-600'
          : 'bg-cyan-500/10 border-cyan-500/30'
      }`}>
        {isUser
          ? <User className="w-3.5 h-3.5 text-zinc-300" />
          : <Zap className="w-3.5 h-3.5 text-cyan-400" />
        }
      </div>

      {/* Content */}
      <div className={`flex flex-col max-w-[72%] ${isUser ? 'items-end' : 'items-start'}`}>
        <span className={`text-[10px] font-semibold uppercase tracking-widest mb-1.5 ${
          isUser ? 'text-zinc-500' : 'text-cyan-500'
        }`}>
          {isUser ? 'You' : 'NexusAI'}
        </span>

        <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? 'bg-zinc-800 text-zinc-100 rounded-tr-sm border border-zinc-700'
            : 'bg-zinc-900 text-zinc-200 rounded-tl-sm border border-zinc-800'
        }`}>
          {isUser ? (
            <p className="whitespace-pre-wrap break-words">{content}</p>
          ) : (
            <div className="prose-sm max-w-none">
              <MarkdownRenderer content={content} />
              {isStreaming && (
                <span className="inline-block w-1.5 h-4 bg-cyan-400 ml-0.5 animate-pulse rounded-sm" />
              )}
            </div>
          )}
        </div>

        {!isUser && !isStreaming && content && (
          <button
            onClick={copyToClipboard}
            className="mt-1.5 flex items-center gap-1 text-[11px] text-zinc-600 hover:text-zinc-400 opacity-0 group-hover:opacity-100 transition-all duration-150"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        )}
      </div>
    </div>
  )
}