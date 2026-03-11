// src/services/supabase.js
// ─────────────────────────────────────────────
// Único punto de contacto con Supabase.
// Las credenciales vienen del .env (nunca hardcodeadas).
// ─────────────────────────────────────────────
import { createClient } from '@supabase/supabase-js'

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL
const supabaseKey  = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    '❌ Faltan variables de entorno.\n' +
    'Copia .env.example a .env y rellena VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY'
  )
}

const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase