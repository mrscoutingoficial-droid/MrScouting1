# INFORME DE UX – MR. SCOUTING

> Generado tras exploración del proyecto y análisis de flujos de usuario.

---

## 1. RESUMEN EJECUTIVO

**MR. SCOUTING** es una plataforma de análisis táctico y scouting de fútbol construida con Next.js 16, Supabase y Stripe. La app incluye landing, auth, dashboard con múltiples secciones y flujo de suscripción.

**Fortalezas:** diseño consistente, feedback de carga en varias vistas, layout responsive con breakpoint `lg` (1024px), flujo de auth con modal y páginas dedicadas.

**Áreas de mejora:** accesibilidad casi inexistente, feedback de errores limitado (uso de `alert`), flujos incompletos (onboarding, recuperación de contraseña), inconsistencias entre sidebar y mobile nav, y falta de middleware de protección de rutas.

---

## 2. MAPEO DE PÁGINAS Y RUTAS

### Estructura en `src/app/`

| Ruta | Archivo | Descripción |
|------|---------|-------------|
| `/` | `(public)/page.tsx` | Landing principal |
| `/login` | `(auth)/login/page.tsx` | Login |
| `/signup` | `(auth)/signup/page.tsx` | Registro |
| `/auth/callback` | `auth/callback/route.ts` | Callback OAuth Google |
| `/auth/signout` | `auth/signout/route.ts` | Cierre de sesión |
| `/dashboard` | `(dashboard)/dashboard/page.tsx` | Feed principal |
| `/dashboard/scouting` | `dashboard/scouting/page.tsx` | Base de datos scouting |
| `/dashboard/scouting/[id]` | `dashboard/scouting/[id]/page.tsx` | Detalle de jugador |
| `/dashboard/reports` | `dashboard/reports/page.tsx` | Archivo de informes |
| `/dashboard/tactics` | `dashboard/tactics/page.tsx` | Laboratorio táctico |
| `/dashboard/profile` | `dashboard/profile/page.tsx` | Perfil de analista |
| `/dashboard/create` | `dashboard/create/page.tsx` | Crear nuevo análisis |
| `/dashboard/feed/[id]` | `dashboard/feed/[id]/page.tsx` | Detalle de post/informe |
| `/dashboard/success` | `dashboard/success/page.tsx` | Post-checkout Stripe |
| `/dashboard/admin` | `dashboard/admin/page.tsx` | Panel admin (solo ADMIN_EMAIL) |

### Flujo de usuario

```
Anónimo → Landing (/)
    ├── CTA "Ingresar" → AuthModal (login/signup) o /login
    ├── CTA "Comienza Gratis" → AuthModal
    ├── Checkout (planes) → Stripe → /dashboard/success
    └── "Ver Demo" → scroll a #features

Auth → /login o /signup
    ├── Email/password → Supabase
    ├── Google OAuth → /auth/callback → /dashboard
    └── Signup exitoso → redirect /login?message=...

Autenticado → /dashboard (redirect si no hay user)
    ├── Feed, Scouting, Reports, Tactics, Profile, Create
    └── Admin (solo si user.email === ADMIN_EMAIL)
```

---

## 3. INCONSISTENCIAS DE NAVEGACIÓN

| Sidebar (Desktop) | Mobile Nav |
|-------------------|------------|
| Scouting Central | Scouting |
| Archivo de Informes | Informes |
| Laboratorio Táctico | Táctica |
| Nuevo Análisis (CTA) | No visible |

---

## 4. PROBLEMAS UX PRIORIZADOS

### Prioridad ALTA

| # | Problema | Ubicación | Impacto |
|---|----------|-----------|---------|
| 1 | Recuperación de contraseña no implementada | `login/page.tsx`, `AuthModal.tsx` | Usuarios bloqueados |
| 2 | Scouting `[id]` usa mock; IDs reales no funcionan | `scouting/[id]/page.tsx` | Flujo roto |
| 3 | Feedback de errores con `alert()` | `create/page.tsx`, `admin/page.tsx`, landing checkout | UX pobre |
| 4 | Sin middleware de protección de rutas | No existe `middleware.ts` | Rutas protegidas solo por layout |
| 5 | Onboarding sin persistencia | Landing sección "Dinos quién eres" | Expectativas no cumplidas |

### Prioridad MEDIA

| # | Problema | Ubicación | Impacto |
|---|----------|-----------|---------|
| 6 | Inconsistencia sidebar vs mobile nav | `DashboardSidebarNav`, `MobileNav` | Confusión de nombres |
| 7 | AuthModal no cierra con Escape | `AuthModal.tsx` | Accesibilidad |
| 8 | Profile: stats y formulario no persistentes | `profile/page.tsx` | Datos falsos |
| 9 | Tactics: `window.prompt` para guardar | `Board.tsx` | UX anticuada |
| 10 | Footer oculto en mobile | `(public)/page.tsx` | Información no visible |

### Prioridad BAJA

| # | Problema | Ubicación | Impacto |
|---|----------|-----------|---------|
| 11 | Sin `aria-label` en iconos/botones | Global | Lectores de pantalla |
| 12 | Contraste en placeholders | Varios inputs | Legibilidad |
| 13 | "Ver Demo" no muestra demo real | Landing | Expectativas |
| 14 | Admin modal sin cierre con Escape | `admin/page.tsx` | Consistencia |
| 15 | Sin lazy load de imágenes | N/A | Performance |

---

## 5. RECOMENDACIONES DE IMPLEMENTACIÓN

### Quick wins (1–2 días)

1. **Reemplazar `alert()` por toast/notificación**
   - Archivos: `create/page.tsx`, `admin/page.tsx`, `(public)/page.tsx` (handleCheckout)
   - Añadir componente Toast (ej. Sonner, react-hot-toast)

2. **Cerrar AuthModal con Escape**
   - Archivo: `AuthModal.tsx`
   - Añadir `useEffect` con listener `keydown` para `Escape` → `onClose()`

3. **Unificar labels sidebar/mobile**
   - Archivos: `DashboardSidebarNav.tsx`, `MobileNav.tsx`
   - Usar mismo array de items y labels compartidos

4. **Footer visible en mobile**
   - Archivo: `(public)/page.tsx`
   - Cambiar `hidden md:block` del footer por `block` o variante responsive

5. **`aria-label` en botones críticos**
   - Archivos: AuthModal, MobileNav, landing CTAs
   - Ej.: `aria-label="Cerrar modal"`, `aria-label="Ir a Scouting"`

### Mejoras a medio plazo (1–2 semanas)

6. **Implementar recuperación de contraseña**
   - Crear `forgot-password/page.tsx` y flujo con Supabase `resetPasswordForEmail`
   - Actualizar links en login y AuthModal

7. **Conectar Scouting `[id]` a Supabase**
   - Archivo: `scouting/[id]/page.tsx`
   - Sustituir mock por fetch a `players` por `id`

8. **Componente de feedback de errores**
   - Crear `components/shared/ErrorMessage.tsx` o `Toast`
   - Sustituir `alert()` y `confirm()` en create, admin, checkout

9. **Persistir onboarding y perfil**
   - Guardar rol (Aficionado/Estudiante/Profesional) en `user_profiles`
   - Conectar formulario de perfil a Supabase

10. **Modal de guardar pizarra en Tactics**
    - Archivo: `Board.tsx`
    - Sustituir `window.prompt` por modal con input y botones

### Mejoras estructurales

11. **Middleware de auth**
    - Crear `middleware.ts` en raíz
    - Proteger `/dashboard/*` y redirigir a `/login` si no hay sesión

12. **Layout para auth**
    - Crear `(auth)/layout.tsx` con branding común
    - Evitar duplicación entre login y signup

13. **Breadcrumbs en dashboard**
    - Componente `Breadcrumbs` para feed/[id], scouting/[id], reports
    - Mejor orientación en rutas anidadas

---

## 6. ARCHIVOS A MODIFICAR (RESUMEN)

| Prioridad | Archivos |
|-----------|----------|
| Alta | `AuthModal.tsx`, `scouting/[id]/page.tsx`, `create/page.tsx`, `admin/page.tsx`, `(public)/page.tsx`, `login/page.tsx` |
| Media | `DashboardSidebarNav.tsx`, `MobileNav.tsx`, `profile/page.tsx`, `Board.tsx` |
| Baja | `globals.css` (contraste placeholders), varios componentes (aria-labels) |
| Nuevos | `middleware.ts`, `forgot-password/page.tsx`, `components/shared/Toast.tsx`, `(auth)/layout.tsx` |

---

## 7. CONCLUSIÓN

La base visual y de flujos es sólida: diseño coherente, responsive y feedback de carga en varias vistas. Las mejoras más urgentes son:

1. Recuperación de contraseña
2. Scouting `[id]` conectado a datos reales
3. Sustitución de `alert()`/`confirm()` por feedback en UI
4. Accesibilidad básica (Escape, aria-labels, contraste)
5. Consistencia entre sidebar y mobile nav

Con los quick wins se puede mejorar la UX de forma inmediata; las mejoras a medio plazo completan flujos críticos y la experiencia en dashboard y auth.
