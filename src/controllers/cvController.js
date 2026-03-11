// src/controllers/cvController.js
// ─────────────────────────────────────────────
// CONTROLLER: CV
// Responsabilidad: orquestar todas las secciones
// del CV (educación, experiencia, certificaciones,
// skills) con un patrón CRUD genérico.
// ─────────────────────────────────────────────
import {
  EducationModel,
  ExperienceModel,
  CertificationsModel,
  SkillsModel,
} from '../models/cv.js'

// Helper genérico para reducir repetición
function makeSection(Model) {
  return {
    async loadAll(renderFn) {
      try {
        const items = await Model.getAll()
        renderFn(items)
      } catch (err) {
        console.error('[CvController.loadAll]', err.message)
        renderFn([], err)
      }
    },

    async create(data, onSuccess, onError) {
      try {
        if (!data.title && !data.name) throw new Error('El nombre/título es obligatorio')
        const item = await Model.create(data)
        onSuccess(item)
      } catch (err) {
        console.error('[CvController.create]', err.message)
        onError(err)
      }
    },

    async update(id, data, onSuccess, onError) {
      try {
        const item = await Model.update(id, data)
        onSuccess(item)
      } catch (err) {
        console.error('[CvController.update]', err.message)
        onError(err)
      }
    },

    async delete(id, onSuccess, onError) {
      try {
        await Model.delete(id)
        onSuccess(id)
      } catch (err) {
        console.error('[CvController.delete]', err.message)
        onError(err)
      }
    },
  }
}

// Exporta un controller por sección del CV
export const EducationController      = makeSection(EducationModel)
export const ExperienceController     = makeSection(ExperienceModel)
export const CertificationsController = makeSection(CertificationsModel)
export const SkillsController         = makeSection(SkillsModel)