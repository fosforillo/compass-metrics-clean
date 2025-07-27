    import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
    import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.52.1';

    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    };

    serve(async (req) => {
      // Manejar preflight requests
      if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
      }

      try {
        const url = new URL(req.url);
        const code = url.searchParams.get('code');
        const state = url.searchParams.get('state'); // Este 'state' debería ser el access_token de Supabase del usuario
        const error = url.searchParams.get('error');
        const errorDescription = url.searchParams.get('error_description');

        console.log('LinkedIn Callback recibido:');
        console.log('Code:', code);
        console.log('State (Supabase Access Token):', state);
        console.log('Error:', error);

        const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
        const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY');
        const LINKEDIN_CLIENT_ID = Deno.env.get('VITE_LINKEDIN_CLIENT_ID');
        const LINKEDIN_CLIENT_SECRET = Deno.env.get('VITE_LINKEDIN_CLIENT_SECRET');

        if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !LINKEDIN_CLIENT_ID || !LINKEDIN_CLIENT_SECRET) {
          console.error('Faltan variables de entorno de Supabase o LinkedIn.');
          return new Response(JSON.stringify({ error: 'Server configuration error' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500,
          });
        }

        const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
          auth: {
            persistSession: false,
          },
        });

        // Si hay un error en la autorización de LinkedIn
        if (error) {
          console.error('Error de autorización de LinkedIn:', error, errorDescription);
          const redirectUrl = `${url.origin}/settings?linkedin_status=error&error=${encodeURIComponent(error)}`;
          return new Response(null, {
            status: 302,
            headers: {
              Location: redirectUrl,
            },
          });
        }

        // Si no hay código de autorización
        if (!code) {
          console.error('No se recibió código de autorización de LinkedIn.');
          const redirectUrl = `${url.origin}/settings?linkedin_status=error&error=no_code`;
          return new Response(null, {
            status: 302,
            headers: {
              Location: redirectUrl,
            },
          });
        }

        // Intercambiar el código por un token de acceso de LinkedIn
        const redirectUri = `${url.origin}/functions/v1/linkedin-callback`; // Debe coincidir con la URI de redirección registrada en LinkedIn
        const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: redirectUri,
            client_id: LINKEDIN_CLIENT_ID,
            client_secret: LINKEDIN_CLIENT_SECRET,
          }).toString(),
        });

        if (!tokenResponse.ok) {
          const errorData = await tokenResponse.json();
          console.error('Error al intercambiar código por token de LinkedIn:', errorData);
          const redirectUrl = `${url.origin}/settings?linkedin_status=error&error=${encodeURIComponent(errorData.error_description || 'token_exchange_failed')}`;
          return new Response(null, {
            status: 302,
            headers: {
              Location: redirectUrl,
            },
          });
        }

        const { access_token, expires_in, refresh_token, refresh_token_expires_in } = await tokenResponse.json();

        // Calcular fechas de expiración
        const now = Date.now();
        const linkedin_token_expires_at = new Date(now + expires_in * 1000).toISOString();
        const linkedin_refresh_token_expires_at = new Date(now + refresh_token_expires_in * 1000).toISOString();

        // Usar el 'state' (Supabase access_token) para obtener el usuario actual
        const { data: { user: supabaseUser }, error: userError } = await supabase.auth.getUser(state);

        if (userError || !supabaseUser) {
          console.error('Error al obtener usuario de Supabase con el token de estado:', userError?.message || 'Usuario no encontrado');
          const redirectUrl = `${url.origin}/settings?linkedin_status=error&error=user_not_found`;
          return new Response(null, {
            status: 302,
            headers: {
              Location: redirectUrl,
            },
          });
        }

        // Actualizar el perfil del usuario en Supabase
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('connected_platforms')
          .eq('id', supabaseUser.id)
          .single();

        if (profileError) {
          console.error('Error al obtener perfil de usuario:', profileError);
          const redirectUrl = `${url.origin}/settings?linkedin_status=error&error=profile_fetch_failed`;
          return new Response(null, {
            status: 302,
            headers: {
              Location: redirectUrl,
            },
          });
        }

        let updatedPlatforms = profile?.connected_platforms || [];
        if (!updatedPlatforms.includes('linkedin')) {
          updatedPlatforms = [...updatedPlatforms, 'linkedin'];
        }

        const { error: updateError } = await supabase
          .from('users')
          .update({
            linkedin_access_token: access_token,
            linkedin_refresh_token: refresh_token,
            linkedin_token_expires_at: linkedin_token_expires_at,
            linkedin_refresh_token_expires_at: linkedin_refresh_token_expires_at,
            connected_platforms: updatedPlatforms,
          })
          .eq('id', supabaseUser.id);

        if (updateError) {
          console.error('Error al actualizar el perfil del usuario con tokens de LinkedIn:', updateError);
          const redirectUrl = `${url.origin}/settings?linkedin_status=error&error=profile_update_failed`;
          return new Response(null, {
            status: 302,
            headers: {
              Location: redirectUrl,
            },
          });
        }

        console.log('Tokens de LinkedIn guardados y plataforma conectada para el usuario:', supabaseUser.id);

        // Redirigir al usuario de vuelta a settings con éxito
        const redirectUrl = `${url.origin}/settings?linkedin_status=success`;
        return new Response(null, {
          status: 302,
          headers: {
            Location: redirectUrl,
          },
        });

      } catch (error) {
        console.error('Error en LinkedIn callback:', error);
        
        // En caso de error, redirigir con mensaje de error
        const redirectUrl = `${new URL(req.url).origin}/settings?linkedin_status=error&error=server_error`;
        return new Response(null, {
          status: 302,
          headers: {
            Location: redirectUrl,
          },
        });
      }
    });