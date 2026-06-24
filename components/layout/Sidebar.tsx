'use client'

import { useTheme } from '@/components/providers/ThemeProvider'
import { signOut } from '@/app/(auth)/actions'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Sun, Moon, Plus, MessageSquare, Trash2, LogOut, Zap } from 'lucide-react'

interface Conversation {
  id: string
  title: string
  created_at: string
}

interface SidebarProps {
  conversations: Conversation[]
  userEmail: string
  userAvatar?: string | null
  userName?: string | null
}

export default function Sidebar({ conversations, userEmail, userName }: SidebarProps) {
  const { theme, toggleTheme } = useTheme()
  const pathname = usePathname()

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const todayConvos = conversations.filter(c => new Date(c.created_at) >= today)
  const yesterdayConvos = conversations.filter(c => {
    const d = new Date(c.created_at)
    return d >= yesterday && d < today
  })
  const olderConvos = conversations.filter(c => new Date(c.created_at) < yesterday)

  const initials = (userName || userEmail).charAt(0).toUpperCase()

  return (
    <div className="w-60 h-full flex flex-col bg-zinc-900 border-r border-zinc-800 shrink-0">

      {/* Logo */}
      <div className="px-4 py-4 flex items-center gap-3 border-b border-zinc-800">
        <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0">
          <Zap className="w-3.5 h-3.5 text-cyan-400" />
        </div>
        <span className="font-bold text-white text-sm tracking-tight">NexusAI</span>
      </div>

      {/* New Chat */}
      <div className="px-3 pt-3 pb-1">
        <Link
          href="/chat/new"
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-zinc-950 text-xs font-bold transition-all duration-150 shadow-md shadow-cyan-500/20"
        >
          <Plus className="w-3.5 h-3.5" />
          New conversation
        </Link>
      </div>

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-700">
        {conversations.length === 0 && (
          <p className="text-xs text-zinc-600 text-center mt-10 px-4 leading-relaxed">
            No conversations yet.
            <br />Start a new chat above.
          </p>
        )}

        {todayConvos.length > 0 && (
          <div>
            <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest px-2 mb-1.5">Today</p>
            {todayConvos.map(c => (
              <ConversationItem key={c.id} conversation={c} active={pathname === `/chat/${c.id}`} />
            ))}
          </div>
        )}

        {yesterdayConvos.length > 0 && (
          <div>
            <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest px-2 mb-1.5">Yesterday</p>
            {yesterdayConvos.map(c => (
              <ConversationItem key={c.id} conversation={c} active={pathname === `/chat/${c.id}`} />
            ))}
          </div>
        )}

        {olderConvos.length > 0 && (
          <div>
            <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest px-2 mb-1.5">Previous</p>
            {olderConvos.map(c => (
              <ConversationItem key={c.id} conversation={c} active={pathname === `/chat/${c.id}`} />
            ))}
          </div>
        )}
      </div>

      {/* Bottom */}
      <div className="px-2 py-3 border-t border-zinc-800 space-y-0.5">

        <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-zinc-800 transition-all duration-150 group">
          <div className="w-6 h-6 rounded-md bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
            <span className="text-cyan-400 text-[10px] font-bold">{initials}</span>
          </div>
          <span className="text-xs text-zinc-400 truncate flex-1 font-medium">
            {userName || userEmail}
          </span>
          <form action={signOut}>
            <button
              type="submit"
              className="text-zinc-600 hover:text-red-400 transition-colors"
              title="Sign out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

function ConversationItem({ conversation, active }: { conversation: Conversation; active: boolean }) {
  return (
    <Link
      href={`/chat/${conversation.id}`}
      className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-xs transition-all duration-150 group ${
        active
          ? 'bg-zinc-800 text-white border border-zinc-700'
          : 'text-zinc-500 hover:bg-zinc-800/60 hover:text-zinc-300'
      }`}
    >
      <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${active ? 'text-cyan-400' : 'opacity-50'}`} />
      <span className="truncate flex-1 leading-snug">{conversation.title}</span>
      <Trash2 className="w-3 h-3 shrink-0 opacity-0 group-hover:opacity-40 hover:!opacity-100 text-red-400 transition-opacity" />
    </Link>
  )
}