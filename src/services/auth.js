// src/services/auth.js
// ─────────────────────────────────────────────
// Servicio de autenticación con Supabase Auth
// ─────────────────────────────────────────────
import supabase from './supabase.js'

export const AuthService = {

  /** Login con email y password */
  async login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  },

  /** Logout */
  async logout() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  /** Obtiene la sesión activa (null si no hay) */
  async getSession() {
    const { data: { session } } = await supabase.auth.getSession()
    return session
  },

  /** Escucha cambios de sesión en tiempo real */
  onAuthChange(callback) {
    return supabase.auth.onAuthStateChange((_event, session) => {
      callback(session)
    })
  },
}