// src/controllers/projectsController.js
// ─────────────────────────────────────────────
// CONTROLLER: Projects
// Responsabilidad: CRUD de proyectos con lógica
// de validación antes de llamar al Model.
// ─────────────────────────────────────────────
import { ProjectsModel } from '../models/projects.js'

export const ProjectsController = {

  /** Carga todos los proyectos y los entrega a la View */
  async loadAll(renderFn) {
    try {
      const projects = await ProjectsModel.getAll()
      renderFn(projects)
    } catch (err) {
      console.error('[ProjectsController.loadAll]', err.message)
      renderFn([], err)
    }
  },

  /**
   * Crea un proyecto, opcionalmente con imagen.
   * @param {Object}    data       - campos del proyecto
   * @param {File|null} imageFile  - imagen de portada (opcional)
   * @param {Function}  onSuccess
   * @param {Function}  onError
   */
  async create(data, imageFile, onSuccess, onError) {
    try {
      // Validación mínima
      if (!data.title?.trim()) throw new Error('El título es obligatorio')

      // Primero inserta el proyecto para obtener su ID
      const project = await ProjectsModel.create(data)

      // Si hay imagen, la sube y actualiza el campo image_url
      if (imageFile) {
        const imageUrl = await ProjectsModel.uploadImage(imageFile, project.id)
        const updated  = await ProjectsModel.update(project.id, { image_url: imageUrl })
        return onSuccess(updated)
      }

      onSuccess(project)
    } catch (err) {
      console.error('[ProjectsController.create]', err.message)
      onError(err)
    }
  },

  /**
   * Actualiza un proyecto existente.
   * @param {number}    id
   * @param {Object}    data
   * @param {File|null} imageFile  - nueva imagen (opcional)
   * @param {Function}  onSuccess
   * @param {Function}  onError
   */
  async update(id, data, imageFile, onSuccess, onError) {
    try {
      if (!data.title?.trim()) throw new Error('El título es obligatorio')

      let fields = { ...data }

      if (imageFile) {
        const imageUrl = await ProjectsModel.uploadImage(imageFile, id)
        fields.image_url = imageUrl
      }

      const updated = await ProjectsModel.update(id, fields)
      onSuccess(updated)
    } catch (err) {
      console.error('[ProjectsController.update]', err.message)
      onError(err)
    }
  },

  /**
   * Elimina un proyecto después de confirmación.
   * @param {number}   id
   * @param {Function} onSuccess
   * @param {Function} onError
   */
  async delete(id, onSuccess, onError) {
    try {
      await ProjectsModel.delete(id)
      onSuccess(id)
    } catch (err) {
      console.error('[ProjectsController.delete]', err.message)
      onError(err)
    }
  },
}