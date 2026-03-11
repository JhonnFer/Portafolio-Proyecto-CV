// assets/js/admin.js
// ─────────────────────────────────────────────
// Entry point del panel de administración.
// Inicializa las vistas admin y maneja
// la navegación entre secciones.
// ─────────────────────────────────────────────
import { initAdminProfile }  from '../../src/views/admin/adminProfile.js'
import { initAdminProjects } from '../../src/views/admin/adminProjects.js'
import { initAdminCv }       from '../../src/views/admin/adminCv.js'

// ── Inicializa todos los módulos admin ────────
initAdminProfile()
initAdminProjects()
initAdminCv()

// ── Navegación por secciones ──────────────────
const navItems = document.querySelectorAll('.admin-nav-item[data-section]')
const sections = document.querySelectorAll('.admin-section')

navItems.forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault()
    const target = item.dataset.section

    navItems.forEach(n => n.classList.remove('active'))
    sections.forEach(s => s.classList.remove('active'))

    item.classList.add('active')
    document.getElementById(`section-${target}`)?.classList.add('active')
  })
})