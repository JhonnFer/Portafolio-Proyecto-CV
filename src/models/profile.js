// src/models/profile.js
// ─────────────────────────────────────────────
// MODEL: Profile
// Responsabilidad: todas las operaciones de datos
// sobre la tabla `profile` en Supabase.
// El controller llama a estos métodos; nunca
// accede a supabase directamente.
// ─────────────────────────────────────────────
import supabase from '../services/supabase.js'

const TABLE = 'profile'

export const ProfileModel = {

  /** Obtiene el perfil (siempre hay una sola fila) */
  async get() {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .single()

    if (error) throw error
    return data
  },

  /** Actualiza campos del perfil */
  async update(fields) {
    const { data, error } = await supabase
      .from(TABLE)
      .update(fields)
      .eq('id', 1)       // fila única
      .select()
      .single()

    if (error) throw error
    return data
  },

  /**
   * Sube la foto de avatar al Storage de Supabase.
   * Devuelve la URL pública del archivo subido.
   * @param {File} file  - objeto File del input[type=file]
   */
  async uploadAvatar(file) {
    const ext      = file.name.split('.').pop()
    const path     = `avatar/avatar.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('portfolio-assets')
      .upload(path, file, { upsert: true })

    if (uploadError) throw uploadError

    const { data } = supabase.storage
      .from('portfolio-assets')
      .getPublicUrl(path)

    return data.publicUrl
  },

  /**
   * Sube el PDF del CV al Storage de Supabase.
   * Devuelve la URL pública.
   * @param {File} file
   */
  async uploadCvPdf(file) {
    const path = 'cv/cv.pdf'

    const { error: uploadError } = await supabase.storage
      .from('portfolio-assets')
      .upload(path, file, { upsert: true, contentType: 'application/pdf' })

    if (uploadError) throw uploadError

    const { data } = supabase.storage
      .from('portfolio-assets')
      .getPublicUrl(path)

    return data.publicUrl
  },
}