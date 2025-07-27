import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Verificar si las variables de entorno están configuradas correctamente
const isSupabaseConfigured = () => {
  return supabaseUrl && 
         supabaseAnonKey && 
         supabaseUrl !== 'https://placeholder.supabase.co' &&
         supabaseAnonKey !== 'placeholder_anon_key' &&
         supabaseUrl.includes('.supabase.co')
}

// Crear cliente de Supabase solo si está configurado correctamente
export const supabase = isSupabaseConfigured() 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Log del estado de configuración (solo en desarrollo)
if (import.meta.env.DEV) {
  if (supabase) {
    console.log('✅ Supabase: Configurado correctamente')
  } else {
    console.log('⚠️ Supabase: Funcionando en modo demo - configura VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY')
  }
}

// Tipos para TypeScript
export interface UserProfile {
  id: string
  email: string
  name: string
  company?: string
  plan_selected?: boolean
  connected_platforms?: string[]
  created_at?: string
  updated_at?: string
}

// Función helper para verificar si Supabase está disponible
export const isSupabaseAvailable = () => supabase !== null