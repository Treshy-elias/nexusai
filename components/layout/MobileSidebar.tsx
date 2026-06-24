'use client'

import { useEffect } from 'react'
import Sidebar from './Sidebar'
import { X } from 'lucide-react'

interface MobileSidebarProps {
  isOpen: boolean
  onClose: () => void
  conversations: any[]
  userEmail: string
  userName?: string | null
  userAvatar?: string | null
}

export default function MobileSidebar({
  isOpen,
  onClose,
  conversations,
  userEmail,
  userName,
  userAvatar,
}: MobileSidebarProps) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer — positioned absolutely, full height, fixed width */}
      <div className="absolute left-0 top-0 h-full w-72 shadow-2xl shadow-black/50">
        {/* Close button overlaid in top-right corner of drawer */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3 z-10 w-7 h-7 flex items-center justify-center rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Sidebar fills the drawer completely */}
        <div className="h-full w-full">
          <Sidebar
            conversations={conversations}
            userEmail={userEmail}
            userName={userName}
            userAvatar={userAvatar}
            onNavigate={onClose}
          />
        </div>
      </div>
    </div>
  )
}