import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ChatLayout from '@/components/layout/ChatLayout'
import ChatWindow from '@/components/chat/ChatWindow'
import { getConversationMessages } from '@/app/(dashboard)/actions'

export default async function ChatPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

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
    .select('id, title, created_at, updated_at')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })

  const initialMessages = id !== 'new'
    ? await getConversationMessages(id)
    : []

  return (
    <ChatLayout
      conversations={conversations || []}
      userEmail={user.email || ''}
      userName={profile?.display_name}
      userAvatar={profile?.avatar_url}
    >
      <ChatWindow
        conversationId={id}
        initialMessages={initialMessages}
      />
    </ChatLayout>
  )
}