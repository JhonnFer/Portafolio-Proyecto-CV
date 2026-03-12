// assets/js/admin.js
import { AuthService }       from '../../src/services/auth.js'
import { initAdminProfile }  from '../../src/views/admin/adminProfile.js'
import { initAdminProjects } from '../../src/views/admin/adminProjects.js'
import { initAdminCv }       from '../../src/views/admin/adminCv.js'

async function init() {
  // ── 1. Bloquea caché del navegador ───────────
  // Impide que el botón "atrás" muestre la página cacheada
  window.history.pushState(null, '', window.location.href)
  window.addEventListener('popstate', () => {
    window.history.pushState(null, '', window.location.href)
  })

  // ── 2. Verifica sesión en CADA carga ─────────
  const session = await AuthService.getSession()

  if (!session) {
    // Reemplaza el historial para que "atrás" no regrese al admin
    window.location.replace('/admin/login.html')
    return
  }

  // ── 3. Escucha cambios de sesión en tiempo real ──
  // Si el token expira o se cierra sesión en otra pestaña,
  // redirige automáticamente al login
  AuthService.onAuthChange((session) => {
    if (!session) {
      window.location.replace('/admin/login.html')
    }
  })

  // ── 4. Muestra el panel ───────────────────────
  const wrapper = document.getElementById('admin-wrapper')
  if (wrapper) {
    wrapper.classList.add('visible')
  }

  // ── 5. Botón cerrar sesión ────────────────────
  document.getElementById('btn-logout')?.addEventListener('click', async () => {
    await AuthService.logout()
    // replace() en lugar de href para borrar el historial
    window.location.replace('/admin/login.html')
  })

  // ── 6. Inicializa módulos ─────────────────────
  initAdminProfile()
  initAdminProjects()
  initAdminCv()

  // ── 7. Navegación entre secciones ────────────
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
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}