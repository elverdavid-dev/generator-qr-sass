-- ============================================================
-- Row Level Security (RLS) — QR Generator SaaS
-- Aplica este script en el SQL Editor de tu proyecto Supabase
-- ============================================================

-- ─── Habilitar RLS en todas las tablas ───────────────────────

ALTER TABLE profiles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE qrs            ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_scans       ENABLE ROW LEVEL SECURITY;
ALTER TABLE folders        ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members   ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhooks       ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys       ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_templates   ENABLE ROW LEVEL SECURITY;

-- ─── profiles ────────────────────────────────────────────────
-- Cada usuario solo puede leer y modificar su propio perfil

CREATE POLICY "profiles: select own"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "profiles: update own"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- ─── qrs ─────────────────────────────────────────────────────
-- Cada usuario solo puede ver y gestionar sus propios QR codes

CREATE POLICY "qrs: select own"
  ON qrs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "qrs: insert own"
  ON qrs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "qrs: update own"
  ON qrs FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "qrs: delete own"
  ON qrs FOR DELETE
  USING (auth.uid() = user_id);

-- ─── qr_scans ─────────────────────────────────────────────────
-- Usuarios pueden leer sus propios scans.
-- El INSERT lo hace el service role (admin client) desde el servidor,
-- por eso no hay política INSERT para usuarios normales.

CREATE POLICY "qr_scans: select own"
  ON qr_scans FOR SELECT
  USING (auth.uid() = user_id);

-- ─── folders ──────────────────────────────────────────────────

CREATE POLICY "folders: select own"
  ON folders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "folders: insert own"
  ON folders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "folders: update own"
  ON folders FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "folders: delete own"
  ON folders FOR DELETE
  USING (auth.uid() = user_id);

-- ─── team_members ─────────────────────────────────────────────
-- El owner puede gestionar todos los miembros de su equipo.
-- El miembro puede leer las invitaciones donde aparece su email o su user id.

CREATE POLICY "team_members: owner full access"
  ON team_members FOR ALL
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "team_members: member can read own invite"
  ON team_members FOR SELECT
  USING (
    auth.uid() = member_id
    OR email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

-- ─── webhooks ─────────────────────────────────────────────────

CREATE POLICY "webhooks: select own"
  ON webhooks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "webhooks: insert own"
  ON webhooks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "webhooks: update own"
  ON webhooks FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "webhooks: delete own"
  ON webhooks FOR DELETE
  USING (auth.uid() = user_id);

-- ─── api_keys ─────────────────────────────────────────────────

CREATE POLICY "api_keys: select own"
  ON api_keys FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "api_keys: insert own"
  ON api_keys FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "api_keys: update own"
  ON api_keys FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "api_keys: delete own"
  ON api_keys FOR DELETE
  USING (auth.uid() = user_id);

-- ─── qr_templates ─────────────────────────────────────────────

CREATE POLICY "qr_templates: select own"
  ON qr_templates FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "qr_templates: insert own"
  ON qr_templates FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "qr_templates: update own"
  ON qr_templates FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "qr_templates: delete own"
  ON qr_templates FOR DELETE
  USING (auth.uid() = user_id);

-- ─── Nota sobre el service role ───────────────────────────────
-- El SUPABASE_SERVICE_ROLE_KEY (admin client) utilizado en el servidor
-- bypasea RLS automáticamente. Las políticas de arriba aplican solo
-- cuando el cliente usa el anon key con la sesión del usuario.
