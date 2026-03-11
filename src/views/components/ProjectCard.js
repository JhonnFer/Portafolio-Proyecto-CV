// src/views/components/ProjectCard.js
// ─────────────────────────────────────────────
// VIEW Component: Projects
// Renderiza la grilla de proyectos con filtros.
// ─────────────────────────────────────────────

const BADGE_CLASSES = {
  frontend: 'badge-frontend',
  backend:  'badge-backend',
  mobile:   'badge-mobile',
  data:     'badge-data',
}

/** Genera el HTML de una tarjeta de proyecto */
function projectCardHTML(project) {
  const badge = BADGE_CLASSES[project.category] || 'badge-frontend'
  const stack = (project.stack || []).map(t => `<span class="stack-tag">${t}</span>`).join('')
  const img   = project.image_url
    ? `<img src="${project.image_url}" alt="${project.title}" style="width:100%;height:100%;object-fit:cover"/>`
    : `<span style="font-size:3.5rem">${project.emoji || '💻'}</span>`

  return `
    <div class="project-card" data-category="${project.category}" data-id="${project.id}">
      <div class="card-img">
        ${img}
        <span class="card-badge ${badge}">${project.category}</span>
      </div>
      <div class="card-body">
        <h3 class="card-title">${project.title}</h3>
        <p class="card-desc">${project.description || ''}</p>
        <div class="card-stack">${stack}</div>
        <div class="card-actions">
          <a href="${project.repo_url || '#'}" target="_blank" class="card-link card-link-repo">⬡ Repo</a>
          <a href="${project.demo_url || '#'}" target="_blank" class="card-link card-link-demo">↗ Demo</a>
        </div>
      </div>
    </div>`
}

/** Renderiza todos los proyectos en el grid */
export function renderProjects(projects) {
  const grid = document.getElementById('projectsGrid')
  if (!grid) return

  if (!projects || projects.length === 0) {
    grid.innerHTML = '<p style="color:var(--muted);grid-column:1/-1">No hay proyectos aún.</p>'
    return
  }

  grid.innerHTML = projects.map(projectCardHTML).join('')
}

/** Filtra proyectos por categoría (sin re-fetch) */
export function setupProjectFilters() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'))
      btn.classList.add('active')

      const cat = btn.dataset.filter
      document.querySelectorAll('.project-card').forEach(card => {
        card.style.display = (cat === 'all' || card.dataset.category === cat) ? 'flex' : 'none'
      })
    })
  })
}