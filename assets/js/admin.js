// assets/js/admin.js
import { AuthService }       from '../../src/services/auth.js'
import { initAdminProfile }  from '../../src/views/admin/adminProfile.js'
import { initAdminProjects } from '../../src/views/admin/adminProjects.js'
import { initAdminCv }       from '../../src/views/admin/adminCv.js'

async function init() {
  const session = await AuthService.getSession()

  if (!session) {
    window.location.href = '/admin/login.html'
    return
  }

  // Muestra el panel
  const wrapper = document.getElementById('admin-wrapper')
  if (wrapper) {
    wrapper.classList.remove('admin-wrapper-hidden')
    wrapper.classList.add('visible')
  }

  // Botón cerrar sesión
  document.getElementById('btn-logout')?.addEventListener('click', async () => {
    await AuthService.logout()
    window.location.href = '/admin/login.html'
  })

  // Inicializa módulos
  initAdminProfile()
  initAdminProjects()
  initAdminCv()

  // Navegación entre secciones
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

// Espera que el DOM esté listo antes de correr
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}