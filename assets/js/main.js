// assets/js/main.js
// ─────────────────────────────────────────────
// Entry point de la vista pública.
// Orquesta la carga de todos los controllers
// y conecta con las funciones de cada View.
// ─────────────────────────────────────────────
import { ProfileController }  from '/src/controllers/profileController.js'
import { ProjectsController } from '/src/controllers/projectsController.js'
import {
  EducationController,
  ExperienceController,
  CertificationsController,
  SkillsController,
} from '/src/controllers/cvController.js'

import { renderHero }                                   from '/src/views/components/Hero.js'
import { renderProjects, setupProjectFilters }          from '/src/views/components/ProjectCard.js'
import { renderEducation, renderExperience,
         renderCertifications, renderSkills }           from '/src/views/components/Timeline.js'

// ── Cursor animado ────────────────────────────
const cursor = document.getElementById('cursor')
const ring   = document.getElementById('cursorRing')
let mx = 0, my = 0, rx = 0, ry = 0
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY })
;(function animCursor() {
  if (cursor) { cursor.style.left = mx - 5 + 'px'; cursor.style.top = my - 5 + 'px' }
  if (ring)   { rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12; ring.style.left = rx - 18 + 'px'; ring.style.top = ry - 18 + 'px' }
  requestAnimationFrame(animCursor)
})()

// ── Scroll reveal ─────────────────────────────
const observer = new IntersectionObserver(
  entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
  { threshold: 0.1 }
)
document.querySelectorAll('.reveal').forEach(el => observer.observe(el))

// ── Carga de datos ────────────────────────────
ProfileController.load((profile) => {
  if (!profile) return

  renderHero(profile)

  // Rellena sidebar del CV
  document.getElementById('cv-name')?.setAttribute('data-val', profile.name || '')
  document.getElementById('cv-name').textContent     = profile.name     || '—'
  document.getElementById('cv-location').textContent = profile.location || '—'
  const emailEl = document.getElementById('cv-email')
  if (emailEl) { emailEl.textContent = profile.email || '—'; emailEl.href = `mailto:${profile.email}` }
  const phoneEl = document.getElementById('cv-phone')
  if (phoneEl) { phoneEl.textContent = profile.phone || '—'; phoneEl.href = `tel:${profile.phone}` }

  // Links redes sociales sección contact
  const sGh = document.getElementById('social-github');   if (sGh && profile.github_url)   sGh.href = profile.github_url
  const sLi = document.getElementById('social-linkedin'); if (sLi && profile.linkedin_url) sLi.href = profile.linkedin_url
  const sEm = document.getElementById('social-email');    if (sEm && profile.email)        sEm.href = `mailto:${profile.email}`

  // Botón CV PDF
  const cvBtn = document.getElementById('btn-cv-pdf')
  if (cvBtn && profile.cv_pdf_url) { cvBtn.href = profile.cv_pdf_url; cvBtn.style.display = 'inline-flex' }

  // Footer
  const footerName = document.getElementById('footer-name')
  if (footerName) footerName.textContent = profile.name || 'M. Paredes'
})

ProjectsController.loadAll((projects) => {
  renderProjects(projects)
  setupProjectFilters()
  animCount('counter-projects', projects.length)
})

SkillsController.loadAll((skills) => {
  renderSkills(skills)
  animCount('counter-skills', skills.length, '+')
})

EducationController.loadAll(renderEducation)
ExperienceController.loadAll(renderExperience)
CertificationsController.loadAll(renderCertifications)

// ── Counter animado ───────────────────────────
function animCount(id, target, suffix = '') {
  const el = document.getElementById(id)
  if (!el) return
  let n = 0
  const step = Math.max(1, Math.ceil(target / 40))
  const t = setInterval(() => {
    n = Math.min(n + step, target)
    el.textContent = n + suffix
    if (n >= target) clearInterval(t)
  }, 40)
}

// ── Navbar activa ─────────────────────────────
const sections  = document.querySelectorAll('section[id]')
const navLinks  = document.querySelectorAll('.nav-links a')
window.addEventListener('scroll', () => {
  let current = ''
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 100) current = s.id })
  navLinks.forEach(a => { a.style.color = a.getAttribute('href') === '#' + current ? 'var(--accent)' : '' })
})

// ── Formulario de contacto ────────────────────
document.getElementById('contact-form')?.addEventListener('submit', (e) => {
  e.preventDefault()
  const status = document.getElementById('form-status')
  // 🔌 Conecta aquí con EmailJS, Formspree o tu propia Edge Function de Supabase
  status.className   = 'form-status success'
  status.textContent = '✓ ¡Mensaje enviado! Te responderé pronto.'
  e.target.reset()
  setTimeout(() => { status.className = 'form-status' }, 5000)
})