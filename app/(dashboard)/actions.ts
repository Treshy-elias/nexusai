'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function createConversation(firstMessage: string): Promise<string> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const title = firstMessage.length > 40
    ? firstMessage.slice(0, 40).trimEnd() + '...'
    : firstMessage

  const { data, error } = await supabase
    .from('conversations')
    .insert({ user_id: user.id, title })
    .select('id')
    .single()

  if (error || !data) throw new Error('Failed to create conversation')

  return data.id
}

export async function saveMessage(
  conversationId: string,
  role: 'user' | 'assistant',
  content: string
) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('messages')
    .insert({ conversation_id: conversationId, role, content })

  if (error) throw new Error('Failed to save message')
}

export async function deleteConversation(conversationId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase
    .from('conversations')
    .delete()
    .eq('id', conversationId)
    .eq('user_id', user.id)

  redirect('/chat/new')
}

export async function getConversationMessages(conversationId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })

  if (error) return []
  return data
}