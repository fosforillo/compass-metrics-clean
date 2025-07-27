/*
  # Agregar columnas faltantes a la tabla users

  1. Modificaciones a la tabla users
    - Agregar columna `company` (text, nullable)
    - Agregar columna `plan_selected` (boolean, default false)
    - Agregar columna `connected_platforms` (text array, default empty array)

  2. Notas importantes
    - Estas columnas son necesarias para el funcionamiento del AuthContext
    - Se usan valores por defecto seguros para no afectar registros existentes
*/

-- Agregar columna company (texto opcional)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'company'
  ) THEN
    ALTER TABLE users ADD COLUMN company text;
  END IF;
END $$;

-- Agregar columna plan_selected (booleano con valor por defecto false)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'plan_selected'
  ) THEN
    ALTER TABLE users ADD COLUMN plan_selected boolean DEFAULT false;
  END IF;
END $$;

-- Agregar columna connected_platforms (array de texto con valor por defecto array vacío)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'connected_platforms'
  ) THEN
    ALTER TABLE users ADD COLUMN connected_platforms text[] DEFAULT '{}';
  END IF;
END $$;