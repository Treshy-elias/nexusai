'use client'

import { useState } from 'react'
import Sidebar from './Sidebar'
import MobileSidebar from './MobileSidebar'
import { Menu } from 'lucide-react'

interface Conversation {
  id: string
  title: string
  created_at: string
  updated_at: string
}

interface ChatLayoutProps {
  conversations: Conversation[]
  userEmail: string
  userName?: string | null
  userAvatar?: string | null
  children: React.ReactNode
}

export default function ChatLayout({
  conversations,
  userEmail,
  userName,
  userAvatar,
  children,
}: ChatLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex h-screen w-full overflow-hidden bg-zinc-950">
      {/* Desktop sidebar — hidden on mobile */}
      <div className="hidden lg:flex h-full">
        <Sidebar
          conversations={conversations}
          userEmail={userEmail}
          userName={userName}
          userAvatar={userAvatar}
        />
      </div>

      {/* Mobile sidebar drawer */}
      <MobileSidebar
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        conversations={conversations}
        userEmail={userEmail}
        userName={userName}
        userAvatar={userAvatar}
      />

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
        {/* Mobile header bar */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-zinc-800 bg-zinc-900 shrink-0">
          <button
            onClick={() => setMobileOpen(true)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-bold text-white tracking-tight text-sm">NexusAI</span>
        </div>

        {/* Chat content */}
        {children}
      </div>
    </div>
  )
}