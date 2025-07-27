import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Mail, MapPin } from 'lucide-react';

const PrivacyPolicyPage: React.FC = () => {
  const currentDate = new Date().toLocaleDateString('es-CL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

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
                <p className="text-sm text-gray-500">Política de Privacidad</p>
              </div>
            </div>
            
            <Link
              to="/"
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Volver al Inicio</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-12">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Política de Privacidad
            </h1>
            <p className="text-lg text-gray-600">
              Última actualización: {currentDate}
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-6">
              En CompassMetrics, nos tomamos muy en serio tu privacidad. Esta Política explica cómo recopilamos, usamos y protegemos tu información.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Información recopilada</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Solo accedemos a datos cuando el usuario otorga permiso explícito, como:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li>Estadísticas de campañas publicitarias.</li>
              <li>Métricas de cuentas orgánicas (engagement, seguidores, publicaciones).</li>
              <li>Nombre, email y organización asociada a la cuenta conectada.</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mb-6">
              No accedemos a tus mensajes, contraseñas, ni contenidos no autorizados por las APIs.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Uso de la información</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Utilizamos tus datos exclusivamente para:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li>Mostrar métricas y gráficos en CompassMetrics.</li>
              <li>Generar recomendaciones mediante inteligencia artificial.</li>
              <li>Mejorar el rendimiento de tu cuenta publicitaria.</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mb-6">
              <strong>No vendemos ni compartimos tus datos con terceros.</strong>
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Seguridad</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Tus credenciales están protegidas mediante cifrado y almacenadas solo en servidores certificados. Nunca serán expuestas ni utilizadas fuera del contexto de esta plataforma.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Eliminación de datos</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Puedes solicitar la eliminación completa de tus datos enviando un correo a{' '}
              <a href="mailto:privacidad@elfaro-pv.com" className="text-blue-600 hover:text-blue-700 underline">
                privacidad@elfaro-pv.com
              </a>{' '}
              o desde tu perfil. La eliminación se realizará en un máximo de 5 días hábiles.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Cookies y almacenamiento</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Podemos usar cookies estrictamente necesarias para mantener tu sesión activa. No usamos cookies de terceros ni de seguimiento publicitario.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-8">
              <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                Información Legal
              </h3>
              <div className="space-y-2 text-blue-800">
                <p><strong>Responsable del tratamiento de datos:</strong></p>
                <p>Agencia Publicitaria Thomas Schmidt Guerrero E.I.R.L.</p>
                <p><strong>RUT:</strong> 78.081.893-K</p>
                <div className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                  <p>San Francisco 640, oficina C, Puerto Varas, Chile</p>
                </div>
                <p>
                  <strong>Correo de contacto:</strong>{' '}
                  <a href="mailto:thomas.schmidt@elfaro-pv.com" className="underline hover:text-blue-700">
                    thomas.schmidt@elfaro-pv.com
                  </a>
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-12 pt-8 border-t border-gray-200">
            <Link
              to="/"
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver al Inicio</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;