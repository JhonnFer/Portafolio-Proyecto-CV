// src/views/components/Hero.js
// ─────────────────────────────────────────────
// VIEW Component: Hero
// Recibe el objeto `profile` del controller y
// renderiza la sección hero del portafolio.
// ─────────────────────────────────────────────

export function renderHero(profile) {
  const section = document.getElementById('hero')
  if (!section || !profile) return

  // Nombre y título
  document.getElementById('hero-name').textContent  = profile.name  || 'Tu Nombre'
  document.getElementById('hero-title').textContent = profile.title || 'Desarrollador Web'
  document.getElementById('hero-bio').textContent   = profile.bio   || ''

  // Avatar
  const avatarEl = document.getElementById('hero-avatar')
  if (avatarEl && profile.avatar_url) {
    avatarEl.innerHTML = `<img src="${profile.avatar_url}" alt="${profile.name}" 
      style="width:100%;height:100%;object-fit:cover;border-radius:50%"/>`
  }

  // Botón CV
  const cvBtn = document.getElementById('btn-download-cv')
  if (cvBtn && profile.cv_pdf_url) {
    cvBtn.href = profile.cv_pdf_url
    cvBtn.style.display = 'inline-flex'
  }

  // Links sociales
  const ghLink = document.getElementById('link-github')
  const liLink = document.getElementById('link-linkedin')
  if (ghLink && profile.github_url)   ghLink.href   = profile.github_url
  if (liLink && profile.linkedin_url) liLink.href   = profile.linkedin_url
}