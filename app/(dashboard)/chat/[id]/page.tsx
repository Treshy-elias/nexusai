import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/layout/Sidebar'
import ChatWindow from '@/components/chat/ChatWindow'

export default async function ChatPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: conversations } = await supabase
    .from('conversations')
    .select('id, title, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar
        conversations={conversations || []}
        userEmail={user.email || ''}
        userName={profile?.display_name}
        userAvatar={profile?.avatar_url}
      />
      <ChatWindow conversationId={params.id} />
    </div>
  )
}