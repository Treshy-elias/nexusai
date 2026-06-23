import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import 'global.css'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/chat/new')
  } else {
    redirect('/login')
  }
}