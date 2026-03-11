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

# sql 
-- ─────────────────────────────────────────────
-- SUPABASE SQL — Portafolio MVC
-- Ejecuta esto en: Supabase > SQL Editor > New query
-- ─────────────────────────────────────────────

-- ── PERFIL (una sola fila) ────────────────────
create table if not exists profile (
  id            int primary key default 1,
  name          text,
  title         text,
  bio           text,
  email         text,
  phone         text,
  location      text,
  avatar_url    text,
  github_url    text,
  linkedin_url  text,
  cv_pdf_url    text,
  constraint single_row check (id = 1)
);

-- Inserta la fila inicial (solo una vez)
insert into profile (id) values (1)
on conflict (id) do nothing;

-- ── PROYECTOS ─────────────────────────────────
create table if not exists projects (
  id           bigint generated always as identity primary key,
  title        text not null,
  description  text,
  category     text check (category in ('frontend','backend','mobile','data')) default 'frontend',
  emoji        text,
  image_url    text,
  stack        text[],           -- array: {'React','Node.js','MySQL'}
  repo_url     text,
  demo_url     text,
  featured     boolean default false,
  created_at   timestamptz default now()
);

-- ── EDUCACIÓN ─────────────────────────────────
create table if not exists education (
  id           bigint generated always as identity primary key,
  title        text not null,    -- Ej: "Ingeniería en Sistemas"
  institution  text,             -- Ej: "Universidad Central"
  period       text,             -- Ej: "2021–Presente"
  description  text,
  "order"      int default 0
);

-- ── EXPERIENCIA ───────────────────────────────
create table if not exists experience (
  id           bigint generated always as identity primary key,
  title        text not null,    -- cargo / rol
  company      text,
  period       text,
  description  text,
  "order"      int default 0
);

-- ── CERTIFICACIONES ───────────────────────────
create table if not exists certifications (
  id           bigint generated always as identity primary key,
  name         text not null,
  issuer       text,             -- Platzi, Udemy, Coursera…
  year         int,
  url          text
);

-- ── SKILLS ───────────────────────────────────
create table if not exists skills (
  id           bigint generated always as identity primary key,
  name         text not null,
  icon         text,             -- emoji o URL de ícono
  level        text,             -- Básico / Intermedio / Avanzado
  "order"      int default 0
);

-- ─────────────────────────────────────────────
-- RLS (Row Level Security)
-- Lectura pública; escritura solo con clave de servicio
-- ─────────────────────────────────────────────
alter table profile          enable row level security;
alter table projects         enable row level security;
alter table education        enable row level security;
alter table experience       enable row level security;
alter table certifications   enable row level security;
alter table skills           enable row level security;

-- Cualquiera puede leer
create policy "Lectura pública" on profile        for select using (true);
create policy "Lectura pública" on projects       for select using (true);
create policy "Lectura pública" on education      for select using (true);
create policy "Lectura pública" on experience     for select using (true);
create policy "Lectura pública" on certifications for select using (true);
create policy "Lectura pública" on skills         for select using (true);

-- Solo el dueño autenticado puede escribir
-- (cuando integres Supabase Auth, reemplaza `true` por `auth.role() = 'authenticated'`)
create policy "Escritura autenticada" on profile        for all using (true) with check (true);
create policy "Escritura autenticada" on projects       for all using (true) with check (true);
create policy "Escritura autenticada" on education      for all using (true) with check (true);
create policy "Escritura autenticada" on experience     for all using (true) with check (true);
create policy "Escritura autenticada" on certifications for all using (true) with check (true);
create policy "Escritura autenticada" on skills         for all using (true) with check (true);

-- ─────────────────────────────────────────────
-- STORAGE BUCKET
-- Crea el bucket en Supabase > Storage > New bucket
-- Nombre: portfolio-assets   (public: true)
-- ─────────────────────────────────────────────

# fix de supabase 
-- ─────────────────────────────────────────────
-- SUPABASE RLS — Políticas corregidas
-- Ejecuta esto en: Supabase > SQL Editor > New query
-- ─────────────────────────────────────────────

-- ── 1. ELIMINA las políticas anteriores ───────
drop policy if exists "Lectura pública"       on profile;
drop policy if exists "Lectura pública"       on projects;
drop policy if exists "Lectura pública"       on education;
drop policy if exists "Lectura pública"       on experience;
drop policy if exists "Lectura pública"       on certifications;
drop policy if exists "Lectura pública"       on skills;

drop policy if exists "Escritura autenticada" on profile;
drop policy if exists "Escritura autenticada" on projects;
drop policy if exists "Escritura autenticada" on education;
drop policy if exists "Escritura autenticada" on experience;
drop policy if exists "Escritura autenticada" on certifications;
drop policy if exists "Escritura autenticada" on skills;

-- ── 2. LECTURA pública (visitantes del portafolio) ──
create policy "Lectura pública" on profile        for select using (true);
create policy "Lectura pública" on projects       for select using (true);
create policy "Lectura pública" on education      for select using (true);
create policy "Lectura pública" on experience     for select using (true);
create policy "Lectura pública" on certifications for select using (true);
create policy "Lectura pública" on skills         for select using (true);

-- ── 3. ESCRITURA solo para usuario autenticado (tú) ──
create policy "Solo admin insert" on profile        for insert with check (auth.role() = 'authenticated');
create policy "Solo admin update" on profile        for update using     (auth.role() = 'authenticated');
create policy "Solo admin delete" on profile        for delete using     (auth.role() = 'authenticated');

create policy "Solo admin insert" on projects       for insert with check (auth.role() = 'authenticated');
create policy "Solo admin update" on projects       for update using     (auth.role() = 'authenticated');
create policy "Solo admin delete" on projects       for delete using     (auth.role() = 'authenticated');

create policy "Solo admin insert" on education      for insert with check (auth.role() = 'authenticated');
create policy "Solo admin update" on education      for update using     (auth.role() = 'authenticated');
create policy "Solo admin delete" on education      for delete using     (auth.role() = 'authenticated');

create policy "Solo admin insert" on experience     for insert with check (auth.role() = 'authenticated');
create policy "Solo admin update" on experience     for update using     (auth.role() = 'authenticated');
create policy "Solo admin delete" on experience     for delete using     (auth.role() = 'authenticated');

create policy "Solo admin insert" on certifications for insert with check (auth.role() = 'authenticated');
create policy "Solo admin update" on certifications for update using     (auth.role() = 'authenticated');
create policy "Solo admin delete" on certifications for delete using     (auth.role() = 'authenticated');

create policy "Solo admin insert" on skills         for insert with check (auth.role() = 'authenticated');
create policy "Solo admin update" on skills         for update using     (auth.role() = 'authenticated');
create policy "Solo admin delete" on skills         for delete using     (auth.role() = 'authenticated');

-- ── 4. STORAGE — bucket portfolio-assets ──────
-- Lectura pública (para mostrar fotos en el portafolio)
create policy "Storage lectura pública"
  on storage.objects for select
  using ( bucket_id = 'portfolio-assets' );

-- Subida solo autenticado
create policy "Storage upload autenticado"
  on storage.objects for insert
  with check (
    bucket_id = 'portfolio-assets'
    and auth.role() = 'authenticated'
  );

-- Actualizar solo autenticado
create policy "Storage update autenticado"
  on storage.objects for update
  using (
    bucket_id = 'portfolio-assets'
    and auth.role() = 'authenticated'
  );

-- Eliminar solo autenticado
create policy "Storage delete autenticado"
  on storage.objects for delete
  using (
    bucket_id = 'portfolio-assets'
    and auth.role() = 'authenticated'
  );
