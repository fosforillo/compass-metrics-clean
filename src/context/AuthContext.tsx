import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, isSupabaseAvailable, UserProfile } from '../lib/supabase';

interface User {
  id: string;
  email: string;
  name: string;
  company?: string;
  planSelected?: boolean;
  connectedPlatforms?: string[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (email: string, password: string, name: string, company?: string) => Promise<boolean>;
  selectPlan: (planType: string) => void;
  connectPlatform: (platform: string) => void;
  disconnectPlatform: (platform: string) => void;
  updateUserProfile: (profileData: { name: string; company: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Función de login - usa Supabase si está disponible, sino modo demo
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      if (isSupabaseAvailable() && supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          console.error('Supabase login error:', error);
          return false;
        }

        if (data.user) {
          // Obtener perfil del usuario
          const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', data.user.id)
            .single();

          const userData: User = {
            id: data.user.id,
            email: data.user.email || email,
            name: profile?.name || email.split('@')[0],
            company: profile?.company,
            planSelected: profile?.plan_selected || false,
            connectedPlatforms: profile?.connected_platforms || []
          };

          setUser(userData);
          return true;
        }
      } else {
        // Modo demo
        const demoUser: User = {
          id: 'demo-user-' + Date.now(),
          email: email,
          name: email.split('@')[0] || 'Usuario Demo',
          company: 'Empresa Demo',
          planSelected: true,
          connectedPlatforms: ['meta', 'google']
        };
        setUser(demoUser);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  // Función de registro - usa Supabase si está disponible, sino modo demo
  const register = async (email: string, password: string, name: string, company?: string): Promise<boolean> => {
    try {
      if (isSupabaseAvailable() && supabase) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) {
          console.error('Supabase register error:', error);
          return false;
        }

        if (data.user) {
          // Crear perfil del usuario
          const { error: profileError } = await supabase
            .from('users')
            .insert([
              {
                id: data.user.id,
                email: data.user.email,
                name: name,
                company: company,
                plan_selected: false,
                connected_platforms: []
              }
            ]);

          if (profileError) {
            console.error('Profile creation error:', profileError);
          }

          const userData: User = {
            id: data.user.id,
            email: data.user.email || email,
            name: name,
            company: company,
            planSelected: false,
            connectedPlatforms: []
          };

          setUser(userData);
          return true;
        }
      } else {
        // Modo demo
        const demoUser: User = {
          id: 'demo-user-' + Date.now(),
          email: email,
          name: name,
          company: company || 'Empresa Demo',
          planSelected: false,
          connectedPlatforms: []
        };
        setUser(demoUser);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Register error:', error);
      return false;
    }
  };

  // Función de logout
  const logout = async (): Promise<void> => {
    try {
      if (isSupabaseAvailable() && supabase) {
        await supabase.auth.signOut();
      }
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      setUser(null);
    }
  };

  // Función para seleccionar plan
  const selectPlan = async (planType: string) => {
    if (!user) return;

    try {
      if (isSupabaseAvailable() && supabase) {
        const { error } = await supabase
          .from('users')
          .update({ plan_selected: true })
          .eq('id', user.id);

        if (error) {
          console.error('Plan selection error:', error);
        }
      }

      setUser(prev => prev ? { ...prev, planSelected: true } : null);
    } catch (error) {
      console.error('Select plan error:', error);
    }
  };

  // Función para conectar plataforma
  const connectPlatform = async (platform: string) => {
    if (!user || user.connectedPlatforms?.includes(platform)) return;

    const updatedPlatforms = [...(user.connectedPlatforms || []), platform];

    try {
      if (isSupabaseAvailable() && supabase) {
        const { error } = await supabase
          .from('users')
          .update({ connected_platforms: updatedPlatforms })
          .eq('id', user.id);

        if (error) {
          console.error('Connect platform error:', error);
          return;
        }
      }

      setUser(prev => prev ? { ...prev, connectedPlatforms: updatedPlatforms } : null);
    } catch (error) {
      console.error('Connect platform error:', error);
    }
  };

  // Función para desconectar plataforma
  const disconnectPlatform = async (platform: string) => {
    if (!user || !user.connectedPlatforms?.includes(platform)) return;

    const updatedPlatforms = user.connectedPlatforms.filter(p => p !== platform);

    try {
      if (isSupabaseAvailable() && supabase) {
        const { error } = await supabase
          .from('users')
          .update({ connected_platforms: updatedPlatforms })
          .eq('id', user.id);

        if (error) {
          console.error('Disconnect platform error:', error);
          return;
        }
      }

      setUser(prev => prev ? { ...prev, connectedPlatforms: updatedPlatforms } : null);
    } catch (error) {
      console.error('Disconnect platform error:', error);
    }
  };

  // Función para actualizar el perfil del usuario
  const updateUserProfile = async (profileData: { name: string; company: string }) => {
    if (!user) return;

    try {
      if (isSupabaseAvailable() && supabase) {
        const { error } = await supabase
          .from('users')
          .update({
            name: profileData.name,
            company: profileData.company
          })
          .eq('id', user.id);

        if (error) {
          console.error('Update profile error:', error);
          return;
        }
      }

      setUser(prev => prev ? { 
        ...prev, 
        name: profileData.name,
        company: profileData.company 
      } : null);
    } catch (error) {
      console.error('Update profile error:', error);
    }
  };

  // Efecto para inicializar la sesión
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        if (isSupabaseAvailable() && supabase) {
          // Obtener sesión actual
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session?.user && mounted) {
            // Obtener perfil del usuario
            const { data: profile } = await supabase
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .single();

            const userData: User = {
              id: session.user.id,
              email: session.user.email || '',
              name: profile?.name || session.user.email?.split('@')[0] || 'Usuario',
              company: profile?.company,
              planSelected: profile?.plan_selected || false,
              connectedPlatforms: profile?.connected_platforms || []
            };

            setUser(userData);
          }

          // Escuchar cambios de autenticación
          const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
              if (!mounted) return;

              if (event === 'SIGNED_IN' && session?.user) {
                const { data: profile } = await supabase
                  .from('users')
                  .select('*')
                  .eq('id', session.user.id)
                  .single();

                const userData: User = {
                  id: session.user.id,
                  email: session.user.email || '',
                  name: profile?.name || session.user.email?.split('@')[0] || 'Usuario',
                  company: profile?.company,
                  planSelected: profile?.plan_selected || false,
                  connectedPlatforms: profile?.connected_platforms || []
                };

                setUser(userData);
              } else if (event === 'SIGNED_OUT') {
                setUser(null);
              }
            }
          );

          return () => {
            subscription.unsubscribe();
          };
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    // Timeout de seguridad para evitar carga infinita
    const timeout = setTimeout(() => {
      if (mounted) {
        setIsLoading(false);
      }
    }, 2000);

    return () => {
      mounted = false;
      clearTimeout(timeout);
    };
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    register,
    selectPlan,
    connectPlatform,
    disconnectPlatform,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};