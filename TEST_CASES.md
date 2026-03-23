# Casos de Uso y Pruebas por Plan

## Cuentas de prueba
| Plan | Email | Contraseña |
|---|---|---|
| Free | (cuenta nueva registrada) | — |
| Pro | elverdavid0839@gmail.com | Pro2024 |
| Business | elvdeveloper2302@gmail.com | Business2024 |

> Nota: ambas cuentas Pro y Business son OAuth de Google. Las contraseñas fueron seteadas vía SQL para poder hacer pruebas.

---

## Bugs encontrados y corregidos

### 🔧 BUG 1 — API key revoke no invalidaba la clave
**Síntoma:** Después de revocar una API key en la UI, hacer curl con esa clave seguía retornando `200`.
**Causa:** `api-keys-manager.tsx` usaba `crypto.randomUUID()` como ID optimista para la nueva key. `revokeApiKey(fakeUUID)` no encontraba ningún row en DB → falla silenciosa.
**Fix:**
- `api-key-actions.ts`: el insert ahora retorna el `id` real del row.
- `api-keys-manager.tsx`: la actualización optimista usa `result.id` en lugar de `crypto.randomUUID()`.

### 🔧 BUG 2 — QR inactivo redirigía a `/qr-not-found` en vez de `/qr-inactive`
**Síntoma:** Escanear un QR desactivado mostraba "QR no encontrado" en vez de "QR inactivo".
**Causa:** El endpoint `GET /api/t/[slug]` usaba `createClient()` (SSR con sesión del usuario), que respeta la policy RLS `Public can view active qrs by slug` → los QRs inactivos devolvían `null` → caía en el branch `!qr`.
**Fix:** `src/app/api/t/[slug]/route.ts` ahora usa `createAdminClient()` para poder ver todos los QRs independientemente de `is_active`.

### 🔧 BUG 3 — Webhooks nunca se disparaban al escanear un QR
**Síntoma:** Escanear cualquier QR no generaba ningún POST al servidor webhook.
**Causa:** `deliver-webhooks.ts` usaba `createClient()` que necesita sesión autenticada. El endpoint `/api/t/[slug]` es público (sin cookies de auth) → la query de webhooks retornaba vacío por RLS → webhooks nunca se enviaban.
**Fix:** `deliver-webhooks.ts` ahora usa `createAdminClient()` para bypassear RLS.

### 🔧 BUG 4 — Login ignoraba el parámetro `?next=`
**Síntoma:** Usuario sin sesión que abría `/invite/[token]` era redirigido a `/login?next=/invite/[token]`, pero al iniciar sesión iba a `/dashboard/qrs` en vez de a la URL del invite.
**Causa:** `use-login.tsx` tenía hardcodeado `window.location.href = '/dashboard/qrs'`.
**Fix:** Lee `new URLSearchParams(window.location.search).get('next')` y usa ese valor como destino del redirect.

### 🔧 BUG 5 — Invite de equipo no validaba que el email del invitado coincide con el usuario logueado
**Síntoma:** Cualquier usuario logueado podía aceptar cualquier invitación si tenía el token, independientemente del email al que fue enviada.
**Causa:** `acceptInvite()` en `team-actions.ts` no comparaba `session.user.email` con `invite.email`.
**Fix:** Se agregó validación: si el email no coincide, retorna `{ error: 'Esta invitación es para otro usuario' }`.

---

## Plan Free

### ✅ Funciona correctamente
- [x] Registrarse con email y contraseña
- [x] Ver el modal de onboarding al entrar por primera vez
- [x] Saltar el onboarding → modal desaparece
- [x] Completar el onboarding → redirige a `/dashboard/qrs/new`
- [x] Crear hasta **3 QRs** (URL, Texto, Email, Teléfono, WiFi)
- [x] Personalizar colores de fondo y puntos del QR
- [x] Ver vista previa del QR en tiempo real
- [x] Descargar QR en **PNG**
- [x] Ver lista de QRs en `/dashboard/qrs`
- [x] Activar / desactivar un QR
- [x] Eliminar un QR
- [x] Marcar QR como favorito y ver en `/dashboard/favorites`
- [x] Ver analytics básico (contador de escaneos)
- [x] Editar nombre y datos de un QR existente
- [x] Crear carpetas y mover QRs
- [x] Ver el dashboard con stats generales
- [x] Cambiar idioma (ES / EN)
- [x] Cambiar tema (claro / oscuro)
- [x] Editar perfil (nombre, apellido, teléfono)

### ✅ Bloqueado correctamente
- [x] Intentar crear el **4to QR** → mensaje de límite alcanzado
- [x] URL personalizada (slug) → badge Pro visible, campo deshabilitado
- [x] Parámetros UTM → badge Pro visible, campos deshabilitados
- [x] Descargar en SVG → badge Pro visible
- [x] Guardar plantilla de estilo → badge Pro visible
- [x] Redirección condicional iOS/Android → badge Pro visible
- [x] Página `/dashboard/api` → redirige a `/dashboard/billing`
- [x] Página `/dashboard/team` → redirige a `/dashboard/billing`

### ⚠️ Discrepancia
- [~] Página `/dashboard/webhooks` → muestra bloque inline "Función exclusiva Business" con botón "Actualizar a Business" **en vez de redirigir a `/dashboard/billing`**. Misma conducta para plan Pro. No es un error funcional pero difiere del spec.

---

## Plan Pro

### ✅ Funciona correctamente (además de todo lo de Free)
- [x] Crear **QRs ilimitados**
- [x] Asignar **URL personalizada** al QR (slug único)
- [x] Agregar **parámetros UTM** (source, medium, campaign, term, content)
  - El UTM se aplica al redirect: `https://github.com/?utm_source=...&utm_medium=...`
- [x] Descargar QR en **SVG**
- [x] **Guardar plantilla** de estilo desde un QR → "Plantilla Pro" apareció en `/dashboard/qrs/new`
- [x] **Aplicar plantilla** al crear un nuevo QR → estilos se aplican en tiempo real
- [x] **Eliminar plantilla** guardada → "Plantilla eliminada" toast
- [x] **Compartir QR por link** → copia URL `/share/[slug]` al portapapeles
- [x] Ver **analytics avanzado** con mapa mundial de escaneos por país
- [x] **Acciones en masa**: seleccionar varios QRs → desactivar, activar, mover a carpeta
- [x] Página `/dashboard/webhooks` → muestra bloque inline "Función exclusiva Business"
- [x] Página `/dashboard/api` → redirige a `/dashboard/billing`
- [x] Página `/dashboard/team` → redirige a `/dashboard/billing`

---

## Plan Business

### ✅ Funciona correctamente (además de todo lo de Pro)

#### Webhooks
- [x] Ir a `/dashboard/webhooks` → crear webhook con nombre y URL
- [x] Webhook aparece en la lista (requiere reload de página — UI no actualiza sin navegar)
- [x] Activar / desactivar webhook
- [x] Escanear QR → webhook recibe payload con `event`, `qr_id`, `qr_name`, `slug`, `timestamp`, `scan { ip, browser, os, device_type, country }`
- [x] Eliminar webhook

#### API Pública
- [x] Crear API key → se muestra **una sola vez** en modal no-dismissable
- [x] `GET /api/v1/qrs` con Bearer token → `200` + lista de QRs
- [x] `POST /api/v1/qrs` → `200` + QR creado
- [x] `GET /api/v1/qrs/:id` → `200`
- [x] `PATCH /api/v1/qrs/:id` → `200`
- [x] `DELETE /api/v1/qrs/:id` → `204`
- [x] Sin token → `401 Unauthorized`
- [x] Token inválido → `401 Unauthorized`
- [x] **Revocar API key** → deja de funcionar (`401`) ← *bug corregido*

#### Gestión de Equipo
- [x] Invitar miembro por email → modal con link de invitación generado
- [x] Invitar con rol **Admin** → DB guarda `role = 'admin'`
- [x] Miembro invitado aparece con estado "Pendiente"
- [x] Invitado sin sesión abre `/invite/[token]` → redirige a `/login?next=/invite/[token]`
- [x] Invitado logueado abre `/invite/[token]` → "¡Te uniste al equipo!" → redirige al dashboard ← *(fix `?next=` en use-login)*
- [x] Miembro cambia a estado "Activo" (contador 1/10)
- [x] Eliminar miembro → pierde acceso, contador vuelve a 0/10
- [x] Invitar email ya miembro activo → muestra error "Ya es miembro del equipo" (modal permanece abierto)
- [x] Invitar cuando contador es 10/10 → botón "Invitar miembro" deshabilitado
- [x] Invite solo aceptable por el email destinatario ← *bug de seguridad corregido*

---

## Flujos de Escaneo de QR

| Caso | URL de prueba | Resultado | Estado |
|---|---|---|---|
| QR activo (URL) | `/api/t/qr-pro-test` | `307 → https://github.com/?utm_source=...` | ✅ |
| QR inactivo | `/api/t/4-fydc-test3` | `307 → /qr-inactive` | ✅ (bug corregido) |
| QR expirado | `/api/t/mxw2pr-dfkdkf` | `307 → /qr-expired` | ✅ |
| QR límite alcanzado | `/api/t/hvhbgu-test2` | `307 → /qr-limit` | ✅ |
| QR con contraseña (sin pass) | `/api/t/gsff6s-texto` | `307 → /qr-gate/gsff6s-texto` | ✅ |
| QR con contraseña incorrecta | `/qr-gate/gsff6s-texto` | "Contraseña incorrecta" en UI | ✅ |
| QR con contraseña correcta | `/qr-gate/gsff6s-texto` + "12345" | `→ /qr-view/gsff6s-texto` con contenido | ✅ |
| QR con redirect iOS | `/api/t/lzbzhl-mi-pagina` (UA iPhone) | `307 → https://apps.apple.com/test` | ✅ |
| QR con redirect Android | `/api/t/lzbzhl-mi-pagina` (UA Android) | `307 → https://play.google.com/test` | ✅ |
| QR no encontrado | `/api/t/slug-inexistente` | `307 → /qr-not-found` | ✅ |

> Nota del spec: el caso de QR expirado redirige a `/qr-expired`, no a `/qr-inactive` como decía el spec original.

---

## Analytics de Escaneos

- [x] Escanear QR → scan registrado en DB (`qr_scans`) con browser, OS, device_type, IP, is_unique_scan
- [x] `/dashboard/analytics` muestra contadores correctos (totales, hoy, únicos, promedio por QR)
- [x] Gráfica "Escaneos en el tiempo" refleja los scans del día
- [x] Gráficas de SO, Navegador y Dispositivo muestran desglose correcto
- [x] "Escaneos recientes" lista los últimos 10 scans con fecha y plataforma
- [x] "Top QRs más escaneados" muestra los QRs con más actividad
- [x] Country null cuando IP es `::1` (localhost) — comportamiento esperado

---

## Flujos de Billing

- [ ] Usuario Free → "Mejorar a Pro" → checkout Lemon Squeezy *(no probado, requiere entorno de pagos)*
- [ ] Webhook de Lemon Squeezy actualiza plan *(no probado)*

---

## Notas generales
- Tarjeta de prueba Lemon Squeezy: `4242 4242 4242 4242` · cualquier fecha futura · cualquier CVC
- Para probar webhooks de QR scan se necesita URL pública (Cloudflare Tunnel, ngrok, etc.)
- Los webhooks del plan Business se probaron con un servidor HTTP local en `http://localhost:4567`
