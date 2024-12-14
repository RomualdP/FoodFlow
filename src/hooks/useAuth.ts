import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'

export const useAuth = () => {
  const router = useRouter()
  const supabase = createClient()

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (!error) {
      router.refresh()
    }
    return { error }
  }, [router, supabase.auth])

  const signInWithGoogle = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    return { error }
  }, [supabase.auth])

  const signUp = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    return { error }
  }, [supabase.auth])

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut()
    if (!error) {
      router.refresh()
    }
    return { error }
  }, [router, supabase.auth])

  const resetPassword = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    })
    return { error }
  }, [supabase.auth])

  return {
    signIn,
    signInWithGoogle,
    signUp,
    signOut,
    resetPassword,
  }
} 