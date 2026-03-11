// src/controllers/profileController.js
// ─────────────────────────────────────────────
// CONTROLLER: Profile
// Responsabilidad: orquestar la lógica entre la
// View y el Model. Maneja errores y notifica
// a la vista el resultado de cada operación.
// ─────────────────────────────────────────────
import { ProfileModel } from '../models/profile.js'

export const ProfileController = {

  /**
   * Carga el perfil y renderiza la vista pública.
   * @param {Function} renderFn - función de la View que recibe los datos
   */
  async load(renderFn) {
    try {
      const profile = await ProfileModel.get()
      renderFn(profile)
    } catch (err) {
      console.error('[ProfileController.load]', err.message)
      renderFn(null, err)
    }
  },

  /**
   * Guarda los cambios del formulario de admin.
   * @param {Object}   fields     - campos editados
   * @param {Function} onSuccess  - callback con el perfil actualizado
   * @param {Function} onError    - callback con el error
   */
  async save(fields, onSuccess, onError) {
    try {
      const updated = await ProfileModel.update(fields)
      onSuccess(updated)
    } catch (err) {
      console.error('[ProfileController.save]', err.message)
      onError(err)
    }
  },

  /**
   * Maneja la subida del avatar:
   * 1. Sube la imagen al Storage
   * 2. Actualiza el campo avatar_url en la tabla profile
   * @param {File}     file
   * @param {Function} onSuccess
   * @param {Function} onError
   */
  async uploadAvatar(file, onSuccess, onError) {
    try {
      const url     = await ProfileModel.uploadAvatar(file)
      const updated = await ProfileModel.update({ avatar_url: url })
      onSuccess(updated)
    } catch (err) {
      console.error('[ProfileController.uploadAvatar]', err.message)
      onError(err)
    }
  },

  /**
   * Maneja la subida del PDF del CV.
   * @param {File}     file
   * @param {Function} onSuccess
   * @param {Function} onError
   */
  async uploadCvPdf(file, onSuccess, onError) {
    try {
      const url     = await ProfileModel.uploadCvPdf(file)
      const updated = await ProfileModel.update({ cv_pdf_url: url })
      onSuccess(updated)
    } catch (err) {
      console.error('[ProfileController.uploadCvPdf]', err.message)
      onError(err)
    }
  },
}