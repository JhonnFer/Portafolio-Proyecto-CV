// src/views/admin/adminProjects.js
// ─────────────────────────────────────────────
// VIEW Admin: CRUD de proyectos
// ─────────────────────────────────────────────
import { ProjectsController } from '../../controllers/projectsController.js'

let allProjects = []

export function initAdminProjects() {
  loadProjects()
  setupModal()
}

// ── Carga y renderiza la tabla de proyectos ──
function loadProjects() {
  ProjectsController.loadAll((projects, err) => {
    allProjects = projects
    if (err) return showToast('Error cargando proyectos', 'error')
    renderTable(projects)
  })
}

function renderTable(projects) {
  const tbody = document.getElementById('projects-tbody')
  if (!tbody) return

  if (!projects.length) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--muted)">Sin proyectos. Crea el primero.</td></tr>'
    return
  }

  tbody.innerHTML = projects.map(p => `
    <tr data-id="${p.id}">
      <td>${p.emoji || '💻'} ${p.title}</td>
      <td><span class="badge badge-${p.category}">${p.category}</span></td>
      <td>${(p.stack || []).join(', ')}</td>
      <td>${p.featured ? '⭐' : '—'}</td>
      <td class="actions-cell">
        <button class="btn-icon btn-edit"   data-id="${p.id}">✏️</button>
        <button class="btn-icon btn-delete" data-id="${p.id}">🗑️</button>
      </td>
    </tr>`
  ).join('')

  // Eventos de la tabla
  tbody.querySelectorAll('.btn-edit').forEach(btn => {
    btn.addEventListener('click', () => openModal(Number(btn.dataset.id)))
  })
  tbody.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', () => confirmDelete(Number(btn.dataset.id)))
  })
}

// ── Modal (crear / editar) ───────────────────
function setupModal() {
  // Botón "Nuevo proyecto"
  document.getElementById('btn-new-project')?.addEventListener('click', () => openModal(null))

  // Cerrar modal
  document.getElementById('modal-close')?.addEventListener('click', closeModal)
  document.getElementById('project-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'project-modal') closeModal()
  })

  // Submit del formulario
  document.getElementById('form-project')?.addEventListener('submit', handleSubmit)
}

function openModal(id) {
  const modal   = document.getElementById('project-modal')
  const form    = document.getElementById('form-project')
  const title   = document.getElementById('modal-title')
  if (!modal || !form) return

  form.reset()
  document.getElementById('project-id').value = ''
  title.textContent = 'Nuevo proyecto'

  if (id) {
    const project = allProjects.find(p => p.id === id)
    if (!project) return

    title.textContent = 'Editar proyecto'
    document.getElementById('project-id').value             = project.id
    form.querySelector('[name=title]').value                 = project.title        || ''
    form.querySelector('[name=description]').value           = project.description  || ''
    form.querySelector('[name=category]').value              = project.category     || 'frontend'
    form.querySelector('[name=emoji]').value                 = project.emoji        || ''
    form.querySelector('[name=stack]').value                 = (project.stack || []).join(', ')
    form.querySelector('[name=repo_url]').value              = project.repo_url     || ''
    form.querySelector('[name=demo_url]').value              = project.demo_url     || ''
    form.querySelector('[name=featured]').checked            = project.featured     || false
  }

  modal.classList.add('open')
}

function closeModal() {
  document.getElementById('project-modal')?.classList.remove('open')
}

function handleSubmit(e) {
  e.preventDefault()
  const form = e.target
  const id   = document.getElementById('project-id').value

  const data = {
    title:       form.querySelector('[name=title]').value.trim(),
    description: form.querySelector('[name=description]').value.trim(),
    category:    form.querySelector('[name=category]').value,
    emoji:       form.querySelector('[name=emoji]').value.trim(),
    stack:       form.querySelector('[name=stack]').value.split(',').map(s => s.trim()).filter(Boolean),
    repo_url:    form.querySelector('[name=repo_url]').value.trim(),
    demo_url:    form.querySelector('[name=demo_url]').value.trim(),
    featured:    form.querySelector('[name=featured]').checked,
  }

  const imageFile = form.querySelector('[name=image]')?.files[0] || null
  const btn       = form.querySelector('button[type=submit]')
  btn.textContent = 'Guardando...'
  btn.disabled    = true

  const done = (project) => {
    showToast(id ? '✓ Proyecto actualizado' : '✓ Proyecto creado', 'success')
    btn.textContent = 'Guardar'
    btn.disabled    = false
    closeModal()
    loadProjects()
  }
  const fail = () => {
    showToast('Error al guardar', 'error')
    btn.textContent = 'Guardar'
    btn.disabled    = false
  }

  if (id) {
    ProjectsController.update(Number(id), data, imageFile, done, fail)
  } else {
    ProjectsController.create(data, imageFile, done, fail)
  }
}

function confirmDelete(id) {
  const project = allProjects.find(p => p.id === id)
  if (!confirm(`¿Eliminar "${project?.title}"? Esta acción no se puede deshacer.`)) return

  ProjectsController.delete(
    id,
    () => { showToast('✓ Proyecto eliminado', 'success'); loadProjects() },
    () => showToast('Error al eliminar', 'error')
  )
}

// ── Toast ────────────────────────────────────
function showToast(msg, type = 'success') {
  let toast = document.getElementById('admin-toast')
  if (!toast) { toast = document.createElement('div'); toast.id = 'admin-toast'; document.body.appendChild(toast) }
  toast.textContent = msg
  toast.className   = `admin-toast admin-toast--${type} admin-toast--show`
  setTimeout(() => toast.classList.remove('admin-toast--show'), 3000)
}