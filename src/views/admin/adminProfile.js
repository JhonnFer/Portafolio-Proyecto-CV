// src/views/admin/adminProfile.js
// ─────────────────────────────────────────────
// VIEW Admin: Formulario de edición de perfil
// Usa ProfileController para guardar cambios.
// ─────────────────────────────────────────────
import { ProfileController } from '../../controllers/profileController.js'

export function initAdminProfile() {
  const form = document.getElementById('form-profile')
  if (!form) return

  // Carga datos actuales en el formulario
  ProfileController.load((profile, err) => {
    if (err || !profile) return showToast('Error cargando perfil', 'error')

    form.querySelector('[name=name]').value         = profile.name         || ''
    form.querySelector('[name=title]').value        = profile.title        || ''
    form.querySelector('[name=bio]').value          = profile.bio          || ''
    form.querySelector('[name=email]').value        = profile.email        || ''
    form.querySelector('[name=phone]').value        = profile.phone        || ''
    form.querySelector('[name=location]').value     = profile.location     || ''
    form.querySelector('[name=github_url]').value   = profile.github_url   || ''
    form.querySelector('[name=linkedin_url]').value = profile.linkedin_url || ''

    const avatarPreview = document.getElementById('avatar-preview')
    if (avatarPreview && profile.avatar_url) {
      avatarPreview.src = profile.avatar_url
      avatarPreview.style.display = 'block'
    }
  })

  // Guarda cambios del formulario
  form.addEventListener('submit', (e) => {
    e.preventDefault()
    const fields = {
      name:         form.querySelector('[name=name]').value.trim(),
      title:        form.querySelector('[name=title]').value.trim(),
      bio:          form.querySelector('[name=bio]').value.trim(),
      email:        form.querySelector('[name=email]').value.trim(),
      phone:        form.querySelector('[name=phone]').value.trim(),
      location:     form.querySelector('[name=location]').value.trim(),
      github_url:   form.querySelector('[name=github_url]').value.trim(),
      linkedin_url: form.querySelector('[name=linkedin_url]').value.trim(),
    }

    const btn = form.querySelector('button[type=submit]')
    btn.textContent = 'Guardando...'
    btn.disabled = true

    ProfileController.save(
      fields,
      () => {
        showToast('✓ Perfil actualizado', 'success')
        btn.textContent = 'Guardar cambios'
        btn.disabled = false
      },
      () => {
        showToast('Error al guardar', 'error')
        btn.textContent = 'Guardar cambios'
        btn.disabled = false
      }
    )
  })

  // Upload avatar
  const avatarInput = document.getElementById('input-avatar')
  if (avatarInput) {
    avatarInput.addEventListener('change', (e) => {
      const file = e.target.files[0]
      if (!file) return

      // Preview local inmediato
      const reader = new FileReader()
      reader.onload = (ev) => {
        const preview = document.getElementById('avatar-preview')
        if (preview) { preview.src = ev.target.result; preview.style.display = 'block' }
      }
      reader.readAsDataURL(file)

      ProfileController.uploadAvatar(
        file,
        () => showToast('✓ Avatar actualizado', 'success'),
        () => showToast('Error subiendo avatar', 'error')
      )
    })
  }

  // Upload CV PDF
  const cvInput = document.getElementById('input-cv-pdf')
  if (cvInput) {
    cvInput.addEventListener('change', (e) => {
      const file = e.target.files[0]
      if (!file) return
      ProfileController.uploadCvPdf(
        file,
        () => showToast('✓ CV PDF actualizado', 'success'),
        () => showToast('Error subiendo PDF', 'error')
      )
    })
  }
}

// ── Toast helper ─────────────────────────────
function showToast(msg, type = 'success') {
  let toast = document.getElementById('admin-toast')
  if (!toast) {
    toast = document.createElement('div')
    toast.id = 'admin-toast'
    document.body.appendChild(toast)
  }
  toast.textContent  = msg
  toast.className    = `admin-toast admin-toast--${type} admin-toast--show`
  setTimeout(() => toast.classList.remove('admin-toast--show'), 3000)
}