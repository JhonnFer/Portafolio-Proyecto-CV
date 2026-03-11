# Portafolio MVC + Supabase

Portafolio personal con panel de administración para editar contenido en tiempo real, construido con arquitectura **MVC**, **Vite** y **Supabase**.

---

## 📁 Estructura del proyecto

```
portafolio/
├── index.html                  ← Vista pública
├── admin/index.html            ← Panel de edición (solo tú)
├── src/
│   ├── models/                 ── MODEL (datos ↔ Supabase)
│   │   ├── profile.js
│   │   ├── projects.js
│   │   └── cv.js
│   ├── controllers/            ── CONTROLLER (lógica)
│   │   ├── profileController.js
│   │   ├── projectsController.js
│   │   └── cvController.js
│   ├── views/                  ── VIEW (render HTML)
│   │   ├── components/
│   │   │   ├── Hero.js
│   │   │   ├── ProjectCard.js
│   │   │   └── Timeline.js
│   │   └── admin/
│   │       ├── adminProfile.js
│   │       ├── adminProjects.js
│   │       └── adminCv.js
│   └── services/
│       └── supabase.js         ← Único punto de contacto con Supabase
├── assets/
│   ├── css/main.css
│   ├── css/admin.css
│   ├── js/main.js              ← Entry point público
│   └── js/admin.js             ← Entry point admin
├── .env.example                ← Copia esto a .env
├── .gitignore                  ← .env está excluido
├── vite.config.js
├── package.json
└── supabase_schema.sql         ← SQL para crear tablas
```

---

## 🚀 Setup en 5 pasos

### 1. Clona e instala dependencias
```bash
git clone https://github.com/tu-usuario/portafolio.git
cd portafolio
npm install
```

### 2. Crea el proyecto en Supabase
1. Ve a [supabase.com](https://supabase.com) → New project
2. Copia tu **Project URL** y **anon public key** desde *Settings > API*

### 3. Crea las tablas
1. Ve a *SQL Editor* en Supabase
2. Pega el contenido de `supabase_schema.sql`
3. Click en **Run**

### 4. Crea el bucket de Storage
1. Ve a *Storage* → *New bucket*
2. Nombre: `portfolio-assets`
3. Activa **Public bucket**

### 5. Configura variables de entorno
```bash
cp .env.example .env
```
Edita `.env`:
```env
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 6. Inicia el servidor de desarrollo
```bash
npm run dev
```
- Portafolio público: `http://localhost:5173/`
- Panel admin:        `http://localhost:5173/admin/`

---

## 🌐 Deploy en Netlify

1. `npm run build` genera la carpeta `dist/`
2. En Netlify: *Site Settings → Environment Variables* → agrega las mismas variables del `.env`
3. Build command: `npm run build`
4. Publish directory: `dist`

---

## 🔒 Seguridad del panel admin

Actualmente el admin es accesible por URL. Para protegerlo agrega **Supabase Auth**:
1. Activa *Email Auth* en *Supabase > Authentication*
2. En `admin/index.html` verifica la sesión antes de mostrar el panel
3. Actualiza las políticas RLS del SQL para requerir `auth.role() = 'authenticated'`

---

## 🗄️ Tablas en Supabase

| Tabla | Descripción |
|-------|-------------|
| `profile` | Una fila — info personal, avatar, CV PDF |
| `projects` | CRUD proyectos con imagen y stack |
| `education` | Historial académico |
| `experience` | Experiencia laboral/prácticas |
| `certifications` | Cursos y certificados |
| `skills` | Tecnologías con nivel e ícono |

# Crea el bucket de Storage

En Supabase ve a Storage → New bucket
Nombre: portfolio-assets
Activa Public bucket ✓
Click en Create
