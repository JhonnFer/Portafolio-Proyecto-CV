// src/views/components/Timeline.js
// ─────────────────────────────────────────────
// VIEW Component: CV Timeline
// Renderiza educación, experiencia, certs y skills
// ─────────────────────────────────────────────

function timelineItemHTML(item) {
  return `
    <div class="timeline-item" data-id="${item.id}">
      <div class="timeline-date">${item.period || item.year || ''}</div>
      <div class="timeline-content">
        <h4>${item.title || item.name || ''}</h4>
        <p class="org">${item.institution || item.company || item.issuer || ''}</p>
        <p>${item.description || ''}</p>
      </div>
    </div>`
}

function skillChipHTML(skill) {
  return `
    <div class="skill-chip" data-id="${skill.id}">
      <div class="skill-icon">${skill.icon || '💡'}</div>
      <div class="skill-name">${skill.name}</div>
      <div class="skill-level">${skill.level || ''}</div>
    </div>`
}

export function renderEducation(items) {
  const el = document.getElementById('timeline-education')
  if (!el) return
  el.innerHTML = items.length
    ? items.map(timelineItemHTML).join('')
    : '<p style="color:var(--muted)">Sin registros.</p>'
}

export function renderExperience(items) {
  const el = document.getElementById('timeline-experience')
  if (!el) return
  el.innerHTML = items.length
    ? items.map(timelineItemHTML).join('')
    : '<p style="color:var(--muted)">Sin registros.</p>'
}

export function renderCertifications(items) {
  const el = document.getElementById('timeline-certifications')
  if (!el) return
  el.innerHTML = items.length
    ? items.map(timelineItemHTML).join('')
    : '<p style="color:var(--muted)">Sin registros.</p>'
}

export function renderSkills(items) {
  const el = document.getElementById('skills-grid')
  if (!el) return
  el.innerHTML = items.length
    ? items.map(skillChipHTML).join('')
    : '<p style="color:var(--muted)">Sin registros.</p>'
}