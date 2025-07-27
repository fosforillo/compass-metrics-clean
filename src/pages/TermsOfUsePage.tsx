import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, Mail, MapPin } from 'lucide-react';

const TermsOfUsePage: React.FC = () => {
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
                <p className="text-sm text-gray-500">Términos y Condiciones</p>
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
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Términos y Condiciones de Uso
            </h1>
            <p className="text-lg text-gray-600">
              Fecha de entrada en vigor: {currentDate}
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-6">
              Bienvenido a CompassMetrics, un asistente digital operado por Agencia Publicitaria Thomas Schmidt Guerrero E.I.R.L. ("nosotros", "El Faro", o "CompassMetrics"). Al registrarte o usar nuestros servicios, aceptas estos Términos y Condiciones de Uso.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Objeto del servicio</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              CompassMetrics es una herramienta digital que permite a usuarios y agencias conectar sus cuentas de redes sociales y plataformas publicitarias (Google Ads, Meta Ads, Instagram, entre otras), con el fin de generar métricas básicas, recomendaciones automatizadas y análisis generales mediante inteligencia artificial.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Acceso y uso de cuentas conectadas</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Los usuarios conectan voluntariamente sus cuentas mediante APIs oficiales. CompassMetrics no modifica ni gestiona directamente tus campañas. Solo accedemos a:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li>Información pública y analítica de las cuentas.</li>
              <li>Historial de campañas y resultados para recomendaciones.</li>
              <li>Datos orgánicos disponibles mediante conexión autorizada.</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mb-6">
              CompassMetrics no almacena contenido privado ni contraseñas. Solo usamos credenciales temporales (tokens) con permisos limitados.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Propiedad intelectual</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              CompassMetrics y todo su contenido asociado (incluyendo textos, diseños, logotipos y funcionalidades) son propiedad exclusiva de Agencia Publicitaria Thomas Schmidt Guerrero E.I.R.L. Queda prohibida su reproducción o uso no autorizado.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Responsabilidad</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              El uso de CompassMetrics es bajo tu propio riesgo. Si bien tomamos medidas razonables para proteger tus datos y ofrecer recomendaciones útiles, no garantizamos resultados específicos ni continuidad de conexión con plataformas externas.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Modificaciones y actualizaciones</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Podemos actualizar estos Términos y Condiciones ocasionalmente. Se informará a los usuarios en caso de cambios importantes.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Legislación aplicable</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Estos términos se rigen por las leyes de la República de Chile, en particular la Ley N° 19.496 (Protección de los Derechos de los Consumidores) y la Ley N° 19.628 (Protección de Datos Personales).
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

export default TermsOfUsePage;