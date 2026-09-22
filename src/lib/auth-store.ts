import { create } from 'zustand'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './supabase'

interface AuthState {
  session: Session | null
  loading: boolean
  init: () => void
}

// Store mínimo: solo la sesión de Supabase. Todo lo demás (a qué pareja
// pertenece el usuario, sus datos) vive en React Query, no aquí, para no
// duplicar estado de servidor en dos sitios distintos.
export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  loading: true,
  init: () => {
    supabase.auth.getSession().then(({ data }) => {
      set({ session: data.session, loading: false })
    })
    supabase.auth.onAuthStateChange((_event, session) => {
      set({ session })
    })
  },
}))
