import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Dar tiempo para que Supabase procese la confirmación del email
    const timer = setTimeout(() => {
      if (user) {
        // Si el usuario ya tiene un plan seleccionado, ir al dashboard
        if (user.planSelected) {
          navigate('/dashboard');
        } else {
          // Si no ha seleccionado plan, ir a onboarding
          navigate('/onboarding');
        }
      } else {
        // Si no hay usuario autenticado, ir a la página principal
        navigate('/');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Confirmando tu cuenta...
        </h2>
        <p className="text-gray-600">
          Te redirigiremos en un momento
        </p>
      </div>
    </div>
  );
};

export default AuthCallback;