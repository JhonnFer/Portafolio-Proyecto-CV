// src/models/projects.js
// ─────────────────────────────────────────────
// MODEL: Projects
// Responsabilidad: CRUD completo sobre la tabla
// `projects` en Supabase + upload de imagen.
// ─────────────────────────────────────────────
import supabase from '../services/supabase.js'

const TABLE = 'projects'

export const ProjectsModel = {

  /** Lista todos los proyectos ordenados por fecha */
  async getAll() {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  /** Obtiene un proyecto por ID */
  async getById(id) {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  /**
   * Crea un nuevo proyecto.
   * @param {Object} project - { title, description, category, emoji,
   *                             stack, repo_url, demo_url, featured }
   */
  async create(project) {
    const { data, error } = await supabase
      .from(TABLE)
      .insert(project)
      .select()
      .single()

    if (error) throw error
    return data
  },

  /**
   * Actualiza un proyecto existente.
   * @param {number} id
   * @param {Object} fields - campos a actualizar
   */
  async update(id, fields) {
    const { data, error } = await supabase
      .from(TABLE)
      .update(fields)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  /** Elimina un proyecto por ID */
  async delete(id) {
    const { error } = await supabase
      .from(TABLE)
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  },

  /**
   * Sube la imagen de portada del proyecto.
   * @param {File}   file
   * @param {number} projectId
   * @returns {string} URL pública
   */
  async uploadImage(file, projectId) {
    const ext  = file.name.split('.').pop()
    const path = `projects/${projectId}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('portfolio-assets')
      .upload(path, file, { upsert: true })

    if (uploadError) throw uploadError

    const { data } = supabase.storage
      .from('portfolio-assets')
      .getPublicUrl(path)

    return data.publicUrl
  },
}