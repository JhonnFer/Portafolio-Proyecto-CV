// src/views/admin/adminCv.js
// ─────────────────────────────────────────────
// VIEW Admin: CRUD secciones del CV
// Reutiliza el mismo patrón para las 4 secciones
// ─────────────────────────────────────────────
import {
  EducationController,
  ExperienceController,
  CertificationsController,
  SkillsController,
} from '../../controllers/cvController.js'

export function initAdminCv() {
  initSection('education',      EducationController,      educationFields)
  initSection('experience',     ExperienceController,     experienceFields)
  initSection('certifications', CertificationsController, certFields)
  initSection('skills',         SkillsController,         skillFields)
}

// ── Configuración de campos por sección ──────
function educationFields(item = {}) {
  return [
    { name: 'title',       label: 'Título / Grado',    value: item.title       || '' },
    { name: 'institution', label: 'Institución',        value: item.institution || '' },
    { name: 'period',      label: 'Período (ej: 2021–Presente)', value: item.period || '' },
    { name: 'description', label: 'Descripción',        value: item.description || '', textarea: true },
    { name: 'order',       label: 'Orden',              value: item.order       || 0, type: 'number' },
  ]
}

function experienceFields(item = {}) {
  return [
    { name: 'title',       label: 'Cargo / Rol',        value: item.title       || '' },
    { name: 'company',     label: 'Empresa / Institución', value: item.company  || '' },
    { name: 'period',      label: 'Período',            value: item.period      || '' },
    { name: 'description', label: 'Descripción',        value: item.description || '', textarea: true },
    { name: 'order',       label: 'Orden',              value: item.order       || 0, type: 'number' },
  ]
}

function certFields(item = {}) {
  return [
    { name: 'name',   label: 'Nombre del certificado', value: item.name   || '' },
    { name: 'issuer', label: 'Emisor (Platzi, Udemy…)', value: item.issuer || '' },
    { name: 'year',   label: 'Año',  value: item.year  || '', type: 'number' },
    { name: 'url',    label: 'URL del certificado',     value: item.url    || '' },
  ]
}

function skillFields(item = {}) {
  return [
    { name: 'name',  label: 'Tecnología',  value: item.name  || '' },
    { name: 'icon',  label: 'Emoji/Ícono', value: item.icon  || '' },
    { name: 'level', label: 'Nivel',       value: item.level || '' },
    { name: 'order', label: 'Orden',       value: item.order || 0, type: 'number' },
  ]
}

// ── Fábrica de sección editable ───────────────
function initSection(sectionId, controller, fieldsFn) {
  const listEl   = document.getElementById(`${sectionId}-list`)
  const addBtn   = document.getElementById(`btn-add-${sectionId}`)
  if (!listEl) return

  let items = []

  // Carga inicial
  controller.loadAll((data, err) => {
    items = data
    if (err) return
    renderList(items)
  })

  function renderList(data) {
    listEl.innerHTML = ''
    if (!data.length) {
      listEl.innerHTML = `<p class="empty-msg">Sin registros. Agrega el primero.</p>`
      return
    }
    data.forEach(item => {
      const card = document.createElement('div')
      card.className = 'cv-admin-card'
      card.dataset.id = item.id
      card.innerHTML = `
        <div class="cv-admin-card__info">
          <strong>${item.title || item.name || '–'}</strong>
          <span>${item.institution || item.company || item.issuer || item.level || ''}</span>
          <small>${item.period || item.year || ''}</small>
        </div>
        <div class="cv-admin-card__actions">
          <button class="btn-icon btn-edit">✏️</button>
          <button class="btn-icon btn-delete">🗑️</button>
        </div>`

      card.querySelector('.btn-edit').addEventListener('click', () => openInlineForm(item))
      card.querySelector('.btn-delete').addEventListener('click', () => {
        if (!confirm('¿Eliminar este registro?')) return
        controller.delete(
          item.id,
          () => { items = items.filter(i => i.id !== item.id); renderList(items) },
          () => alert('Error al eliminar')
        )
      })
      listEl.appendChild(card)
    })
  }

  // Formulario inline
  function openInlineForm(item = null) {
    // Cierra cualquier form abierto en esta sección
    listEl.querySelectorAll('.inline-form').forEach(f => f.remove())

    const fields   = fieldsFn(item || {})
    const formEl   = document.createElement('div')
    formEl.className = 'inline-form'
    formEl.innerHTML = `
      <form>
        ${fields.map(f => `
          <div class="form-group">
            <label>${f.label}</label>
            ${f.textarea
              ? `<textarea name="${f.name}" rows="3">${f.value}</textarea>`
              : `<input type="${f.type || 'text'}" name="${f.name}" value="${f.value}" />`
            }
          </div>`).join('')}
        <div class="inline-form__actions">
          <button type="submit" class="btn btn-primary">Guardar</button>
          <button type="button" class="btn btn-outline btn-cancel">Cancelar</button>
        </div>
      </form>`

    formEl.querySelector('.btn-cancel').addEventListener('click', () => formEl.remove())

    formEl.querySelector('form').addEventListener('submit', (e) => {
      e.preventDefault()
      const data = {}
      fields.forEach(f => {
        const el = formEl.querySelector(`[name=${f.name}]`)
        data[f.name] = f.type === 'number' ? Number(el.value) : el.value.trim()
      })

      const saveBtn = formEl.querySelector('button[type=submit]')
      saveBtn.textContent = 'Guardando...'
      saveBtn.disabled = true

      const done = (saved) => {
        if (item) {
          items = items.map(i => i.id === saved.id ? saved : i)
        } else {
          items = [saved, ...items]
        }
        renderList(items)
        formEl.remove()
      }
      const fail = () => { alert('Error al guardar'); saveBtn.textContent = 'Guardar'; saveBtn.disabled = false }

      if (item) {
        controller.update(item.id, data, done, fail)
      } else {
        controller.create(data, done, fail)
      }
    })

    listEl.prepend(formEl)
  }

  // Botón "Agregar"
  addBtn?.addEventListener('click', () => openInlineForm(null))
}