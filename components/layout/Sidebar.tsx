'use client'

import { usePathname } from 'next/navigation'
import { deleteConversation } from '@/app/(dashboard)/actions'
import { signOut } from '@/app/(auth)/actions'
import Link from 'next/link'
import { Zap, Plus, MessageSquare, Trash2, LogOut } from 'lucide-react'

interface Conversation {
  id: string
  title: string
  created_at: string
  updated_at: string
}

interface SidebarProps {
  conversations: Conversation[]
  userEmail: string
  userAvatar?: string | null
  userName?: string | null
  onNavigate?: () => void
}

export default function Sidebar({
  conversations,
  userEmail,
  userName,
  onNavigate,
}: SidebarProps) {
  const pathname = usePathname()

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const todayConvos = conversations.filter(c => new Date(c.updated_at) >= today)
  const yesterdayConvos = conversations.filter(c => {
    const d = new Date(c.updated_at)
    return d >= yesterday && d < today
  })
  const olderConvos = conversations.filter(c => new Date(c.updated_at) < yesterday)

  return (
    <div className="w-60 h-full flex flex-col bg-zinc-900 border-r border-zinc-800 shrink-0">

      {/* Logo */}
      <div className="p-4 flex items-center gap-2.5 border-b border-zinc-800">
        <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0">
          <Zap className="w-3.5 h-3.5 text-cyan-400" />
        </div>
        <span className="font-bold text-white tracking-tight text-sm">NexusAI</span>
      </div>

      {/* New Chat */}
      <div className="p-3">
        <Link
          href="/chat/new"
          onClick={onNavigate}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-zinc-950 text-sm font-bold transition-colors shadow-md shadow-cyan-500/20"
        >
          <Plus className="w-4 h-4" />
          New Conversation
        </Link>
      </div>

      {/* Conversations list */}
      <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-4">
        {conversations.length === 0 && (
          <p className="text-[11px] text-zinc-600 font-medium text-center mt-8 px-2">
            No conversations yet. Start chatting!
          </p>
        )}

        {todayConvos.length > 0 && (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500 px-2 mb-1 mt-2">Today</p>
            {todayConvos.map(c => (
              <ConversationItem
                key={c.id}
                conversation={c}
                active={pathname === `/chat/${c.id}`}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        )}

        {yesterdayConvos.length > 0 && (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500 px-2 mb-1">Yesterday</p>
            {yesterdayConvos.map(c => (
              <ConversationItem
                key={c.id}
                conversation={c}
                active={pathname === `/chat/${c.id}`}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        )}

        {olderConvos.length > 0 && (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500 px-2 mb-1">Previous 7 days</p>
            {olderConvos.map(c => (
              <ConversationItem
                key={c.id}
                conversation={c}
                active={pathname === `/chat/${c.id}`}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        )}
      </div>

      {/* Bottom user bar */}
      <div className="p-3 border-t border-zinc-800">
        <div className="flex items-center gap-2 px-3 py-2">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0">
            <span className="text-cyan-400 text-xs font-bold">
              {(userName || userEmail).charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="text-sm text-zinc-400 truncate flex-1">
            {userName || userEmail}
          </span>
          <form action={signOut}>
            <button type="submit" className="text-zinc-600 hover:text-red-400 transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

function ConversationItem({
  conversation,
  active,
  onNavigate,
}: {
  conversation: Conversation
  active: boolean
  onNavigate?: () => void
}) {
  return (
    <div className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm transition-colors group ${
      active
        ? 'bg-zinc-800 border border-zinc-700 text-white'
        : 'text-zinc-500 hover:bg-zinc-800/60 hover:text-zinc-300 border border-transparent'
    }`}>
      <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${active ? 'text-cyan-400' : 'text-zinc-600 group-hover:text-zinc-400'}`} />
      <Link
        href={`/chat/${conversation.id}`}
        onClick={onNavigate}
        className="truncate flex-1"
      >
        {conversation.title}
      </Link>
      <form action={deleteConversation.bind(null, conversation.id)}>
        <button
          type="submit"
          className="opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-red-400 transition-all"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  )
}