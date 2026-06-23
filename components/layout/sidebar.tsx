'use client'

import { useTheme } from '@/components/providers/ThemeProvider'
import { signOut } from '@/app/(auth)/actions'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Sun, Moon, Plus, MessageSquare, Trash2, LogOut, Bot
} from 'lucide-react'

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

export default function Sidebar({
  conversations,
  userEmail,
  userName,
}: SidebarProps) {
  const { theme, toggleTheme } = useTheme()
  const pathname = usePathname()

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const sevenDaysAgo = new Date(today)
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const todayConvos = conversations.filter(c => new Date(c.created_at) >= today)
  const yesterdayConvos = conversations.filter(c => {
    const d = new Date(c.created_at)
    return d >= yesterday && d < today
  })
  const olderConvos = conversations.filter(c => new Date(c.created_at) < yesterday)

  return (
    <div className="w-64 h-full flex flex-col bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shrink-0">

      {/* Logo */}
      <div className="p-4 flex items-center gap-2.5 border-b border-gray-200 dark:border-gray-800">
        <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center shrink-0">
          <Bot className="w-4 h-4 text-white" />
        </div>
        <span className="font-semibold text-gray-900 dark:text-white text-sm">NexusAI</span>
      </div>

      {/* New Chat Button */}
      <div className="p-3">
        <Link
          href="/chat/new"
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Chat
        </Link>
      </div>

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-4">
        {conversations.length === 0 && (
          <p className="text-xs text-gray-400 dark:text-gray-600 text-center mt-8 px-4">
            No conversations yet. Start a new chat!
          </p>
        )}

        {todayConvos.length > 0 && (
          <div>
            <p className="text-xs font-medium text-gray-400 dark:text-gray-500 px-2 mb-1 mt-2">Today</p>
            {todayConvos.map(c => (
              <ConversationItem key={c.id} conversation={c} active={pathname === `/chat/${c.id}`} />
            ))}
          </div>
        )}

        {yesterdayConvos.length > 0 && (
          <div>
            <p className="text-xs font-medium text-gray-400 dark:text-gray-500 px-2 mb-1">Yesterday</p>
            {yesterdayConvos.map(c => (
              <ConversationItem key={c.id} conversation={c} active={pathname === `/chat/${c.id}`} />
            ))}
          </div>
        )}

        {olderConvos.length > 0 && (
          <div>
            <p className="text-xs font-medium text-gray-400 dark:text-gray-500 px-2 mb-1">Previous 7 days</p>
            {olderConvos.map(c => (
              <ConversationItem key={c.id} conversation={c} active={pathname === `/chat/${c.id}`} />
            ))}
          </div>
        )}
      </div>

      {/* Bottom bar */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-800 space-y-1">
        <button
          onClick={toggleTheme}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          {theme === 'dark' ? 'Light mode' : 'Dark mode'}
        </button>

        <div className="flex items-center gap-2 px-3 py-2">
          <div className="w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-medium">
              {(userName || userEmail).charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="text-xs text-gray-600 dark:text-gray-400 truncate flex-1">
            {userName || userEmail}
          </span>
          <form action={signOut}>
            <button type="submit" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

function ConversationItem({ conversation, active }: { conversation: Conversation, active: boolean }) {
  return (
    <Link
      href={`/chat/${conversation.id}`}
      className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm transition-colors group ${
        active
          ? 'bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white'
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
      }`}
    >
      <MessageSquare className="w-3.5 h-3.5 shrink-0 opacity-60" />
      <span className="truncate flex-1">{conversation.title}</span>
      <Trash2 className="w-3.5 h-3.5 shrink-0 opacity-0 group-hover:opacity-60 hover:opacity-100 transition-opacity" />
    </Link>
  )
}