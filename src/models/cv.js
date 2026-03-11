// src/models/cv.js
// ─────────────────────────────────────────────
// MODEL: CV
// Responsabilidad: CRUD sobre las tablas
// `education`, `experience`, `certifications`
// y `skills` en Supabase.
// ─────────────────────────────────────────────
import supabase from '../services/supabase.js'

// ── EDUCATION ────────────────────────────────
export const EducationModel = {

  async getAll() {
    const { data, error } = await supabase
      .from('education')
      .select('*')
      .order('order', { ascending: true })
    if (error) throw error
    return data
  },

  async create(item) {
    const { data, error } = await supabase
      .from('education')
      .insert(item)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async update(id, fields) {
    const { data, error } = await supabase
      .from('education')
      .update(fields)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async delete(id) {
    const { error } = await supabase.from('education').delete().eq('id', id)
    if (error) throw error
    return true
  },
}

// ── EXPERIENCE ───────────────────────────────
export const ExperienceModel = {

  async getAll() {
    const { data, error } = await supabase
      .from('experience')
      .select('*')
      .order('order', { ascending: true })
    if (error) throw error
    return data
  },

  async create(item) {
    const { data, error } = await supabase
      .from('experience')
      .insert(item)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async update(id, fields) {
    const { data, error } = await supabase
      .from('experience')
      .update(fields)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async delete(id) {
    const { error } = await supabase.from('experience').delete().eq('id', id)
    if (error) throw error
    return true
  },
}

// ── CERTIFICATIONS ───────────────────────────
export const CertificationsModel = {

  async getAll() {
    const { data, error } = await supabase
      .from('certifications')
      .select('*')
      .order('year', { ascending: false })
    if (error) throw error
    return data
  },

  async create(item) {
    const { data, error } = await supabase
      .from('certifications')
      .insert(item)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async update(id, fields) {
    const { data, error } = await supabase
      .from('certifications')
      .update(fields)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async delete(id) {
    const { error } = await supabase.from('certifications').delete().eq('id', id)
    if (error) throw error
    return true
  },
}

// ── SKILLS ───────────────────────────────────
export const SkillsModel = {

  async getAll() {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('order', { ascending: true })
    if (error) throw error
    return data
  },

  async create(item) {
    const { data, error } = await supabase
      .from('skills')
      .insert(item)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async update(id, fields) {
    const { data, error } = await supabase
      .from('skills')
      .update(fields)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async delete(id) {
    const { error } = await supabase.from('skills').delete().eq('id', id)
    if (error) throw error
    return true
  },
}