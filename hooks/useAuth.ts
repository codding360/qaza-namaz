"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, User } from '@/lib/supabase'
import { Session, User as SupabaseUser } from '@supabase/supabase-js'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [shouldRedirect, setShouldRedirect] = useState<string | null>(null)
  const router = useRouter()

  // Handle navigation in useEffect to avoid render-time navigation
  useEffect(() => {
    if (shouldRedirect) {
      router.push(shouldRedirect)
      setShouldRedirect(null)
    }
  }, [shouldRedirect, router])

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      
      if (session?.user) {
        await fetchUserProfile(session.user)
      }
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        
        if (session?.user) {
          await fetchUserProfile(session.user)
        } else {
          setUser(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', supabaseUser.id)
        .single()

      if (error) {
        console.error('Error fetching user profile:', error)
        return
      }

      setUser(data)
    } catch (error) {
      console.error('Error fetching user profile:', error)
    }
  }

  const signUp = async (userData: {
    email: string
    password: string
    firstName: string
    lastName: string
    birthYear: number
    gender: 'male' | 'female'
  }) => {
    try {
      // Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
      })

      if (authError) throw authError

      if (authData.user) {
        // Use the database function to create user profile and prayer stats
        const { error: signupError } = await supabase.rpc('handle_user_signup', {
          user_id: authData.user.id,
          user_email: userData.email,
          user_first_name: userData.firstName,
          user_last_name: userData.lastName,
          user_birth_year: userData.birthYear,
          user_gender: userData.gender
        })

        if (signupError) throw signupError

        setShouldRedirect('/')
      }
    } catch (error) {
      console.error('Error during sign up:', error)
      throw error
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      if (data.user) {
        await fetchUserProfile(data.user)
        setShouldRedirect('/')
      }
    } catch (error) {
      console.error('Error during sign in:', error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      setUser(null)
      setSession(null)
      setShouldRedirect('/login')
    } catch (error) {
      console.error('Error during sign out:', error)
      throw error
    }
  }

  return {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    isAuthenticated: !!session,
  }
}
