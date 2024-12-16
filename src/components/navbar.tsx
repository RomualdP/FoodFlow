'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { User } from '@supabase/supabase-js'
import { useState, useEffect } from 'react'

export function Navbar() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <nav className="border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-primary">
              FoodFlow
            </Link>
          </div>
          
          <div className="hidden sm:flex items-center space-x-4">
            {user ? (
              <>
                <Link href="/recipes" className="text-foreground hover:text-primary transition-colors">
                  Mes recettes
                </Link>
                <Link href="/recipes/new" className="text-foreground hover:text-primary transition-colors">
                  Nouvelle recette
                </Link>
                <Button variant="ghost" onClick={handleSignOut}>
                  Déconnexion
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-foreground hover:text-primary transition-colors">
                  Connexion
                </Link>
                <Link href="/register">
                  <Button>S&apos;inscrire</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
} 