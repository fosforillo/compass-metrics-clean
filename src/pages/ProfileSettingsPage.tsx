import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, User, Building, Mail, Link as LinkIcon, Save, CheckCircle, AlertCircle } from 'lucide-react';

const ProfileSettingsPage: React.FC = () => {
  const { user, updateUserProfile, connectPlatform, disconnectPlatform } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    company: user?.company || ''
  });

  const platforms = [
    { id: 'meta', name: 'Meta Ads', color: 'bg-blue-600', icon: '📘' },
    { id: 'google', name: 'Google Ads', color: 'bg-green-600', icon: '🔍' },
    { id: 'tiktok', name: 'TikTok Ads', color: 'bg-black', icon: '🎵' },
    { id: 'linkedin', name: 'LinkedIn Ads', color: 'bg-blue-700', icon: '💼' }
  ];

  const connectedPlatforms = user?.connectedPlatforms || [];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await updateUserProfile(formData);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlatformToggle = (platformId: string) => {
    if (connectedPlatforms.includes(platformId)) {
      disconnectPlatform(platformId);
    } else {
      connectPlatform(platformId);
    }
  };

  const generateShareableLink = () => {
    const baseUrl = window.location.origin;
    const shareableLink = `${baseUrl}/public-dashboard/${user?.id}`;
    navigator.clipboard.writeText(shareableLink);
    // Aquí podrías mostrar una notificación de que el link se copió
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <img 
                src="/CompassMetrics icono copy copy.png" 
                alt="CompassMetrics Logo" 
                className="w-12 h-12 object-contain"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900">CompassMetrics</h1>
                <p className="text-sm text-gray-500">Configuración del Perfil</p>
              </div>
            </div>
            <Link
              to="/dashboard"
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Volver al Dashboard</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          
          {/* Información del Perfil */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Información del Perfil</h2>
                <p className="text-gray-600">Actualiza tu información personal</p>
              </div>
            </div>

            {showSuccess && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-green-800">Perfil actualizado correctamente</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tu nombre completo"
                  />
                </div>
                
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                    Empresa
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nombre de tu empresa"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="flex items-center space-x-2">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">{user?.email}</span>
                  <span className="text-xs text-gray-500">(No se puede modificar)</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Save className="w-5 h-5" />
                )}
                <span>Guardar Cambios</span>
              </button>
            </form>
          </div>

          {/* Gestión de Plataformas */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <LinkIcon className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Plataformas Conectadas</h2>
                <p className="text-gray-600">Gestiona tus conexiones de plataformas publicitarias</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {platforms.map((platform) => {
                const isConnected = connectedPlatforms.includes(platform.id);
                return (
                  <button
                    key={platform.id}
                    onClick={() => handlePlatformToggle(platform.id)}
                    className={`relative p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                      isConnected
                        ? `${platform.color} text-white border-transparent shadow-md`
                        : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{platform.icon}</span>
                        <div>
                          <div className="font-medium">{platform.name}</div>
                          <div className={`text-xs ${isConnected ? 'text-white/80' : 'text-gray-500'}`}>
                            {isConnected ? 'Conectado' : 'Desconectado'}
                          </div>
                        </div>
                      </div>
                      {isConnected && (
                        <CheckCircle className="w-5 h-5 text-white" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {connectedPlatforms.length === 0 && (
              <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-center space-x-2 text-amber-800">
                  <AlertCircle className="w-5 h-5" />
                  <span className="text-sm">
                    Conecta al menos una plataforma para usar el asistente de IA
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Link para Compartir */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <LinkIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Compartir Dashboard</h2>
                <p className="text-gray-600">Genera un link para que otros vean tus métricas</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-600 mb-2">Link de acceso público:</p>
              <div className="flex items-center space-x-2">
                <code className="flex-1 text-sm bg-white px-3 py-2 rounded border">
                  {window.location.origin}/public-dashboard/{user?.id}
                </code>
                <button
                  onClick={generateShareableLink}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm whitespace-nowrap"
                >
                  Copiar
                </button>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-900 mb-2">¿Cómo funciona el link para compartir?</h4>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• Permite a otros ver un resumen de tus métricas principales</li>
                <li>• No requiere que inicien sesión</li>
                <li>• Solo muestra datos agregados, no información sensible</li>
                <li>• Ideal para compartir con clientes o stakeholders</li>
                <li>• Puedes revocar el acceso en cualquier momento</li>
              </ul>
            </div>

            <p className="text-xs text-gray-500 mt-2">
              Nota: Esta funcionalidad estará disponible próximamente. El link se generará automáticamente cuando esté listo.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfileSettingsPage;