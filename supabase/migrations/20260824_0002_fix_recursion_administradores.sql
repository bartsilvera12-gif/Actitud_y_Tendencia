-- ============================================================================
--  Fix: recursión infinita en las policies de `administradores`
--
--  La policy `superadmin_gestiona` consultaba `administradores` dentro de una
--  policy DE `administradores`, lo que dispara sus propias policies otra vez.
--  Postgres corta con "infinite recursion detected in policy".
--
--  Efecto: cualquier SELECT sobre la tabla fallaba, y como el login del panel
--  verifica ahí si el usuario es administrador, nadie podía entrar.
--
--  Se resuelve igual que is_admin(): una función SECURITY DEFINER que lee la
--  tabla salteando RLS.
-- ============================================================================

CREATE OR REPLACE FUNCTION actitudytendencia.is_superadmin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = actitudytendencia, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM actitudytendencia.administradores a
    WHERE a.user_id = auth.uid()
      AND a.activo
      AND a.rol = 'superadmin'
  );
$$;

GRANT EXECUTE ON FUNCTION actitudytendencia.is_superadmin() TO anon, authenticated, service_role;

DROP POLICY IF EXISTS superadmin_gestiona ON actitudytendencia.administradores;
CREATE POLICY superadmin_gestiona ON actitudytendencia.administradores
  FOR ALL TO authenticated
  USING (actitudytendencia.is_superadmin())
  WITH CHECK (actitudytendencia.is_superadmin());

-- `admin_se_ve` ya usaba is_admin(), que es SECURITY DEFINER, pero se recrea
-- para dejar explícito que ninguna policy de esta tabla la consulta directo.
DROP POLICY IF EXISTS admin_se_ve ON actitudytendencia.administradores;
CREATE POLICY admin_se_ve ON actitudytendencia.administradores
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR actitudytendencia.is_admin());
