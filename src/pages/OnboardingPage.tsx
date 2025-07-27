import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PaymentModal from '../components/PaymentModal';
import { CheckCircle, ArrowRight, Zap, Users, Clock, Shield } from 'lucide-react';

const OnboardingPage: React.FC = () => {
  const { user, selectPlan } = useAuth();
  const navigate = useNavigate();
  const [showPaymentModal, setShowPaymentModal] = React.useState(false);
  const [selectedPlanType, setSelectedPlanType] = React.useState<'monthly' | 'trial'>('trial');
  const [isLoading, setIsLoading] = React.useState(false);

  const handlePlanSelection = (planType: 'monthly' | 'trial') => {
    setIsLoading(true);
    if (planType === 'trial') {
      // Para el plan gratuito, ir directamente al dashboard
      selectPlan(planType);
      navigate('/dashboard');
    } else {
      // Para planes de pago, mostrar modal de pago
      setSelectedPlanType(planType);
      setShowPaymentModal(true);
    }
    setIsLoading(false);
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    selectPlan(selectedPlanType);
    navigate('/dashboard');
  };

  const benefits = [
    "Respuestas rápidas sobre el estado de tus campañas",
    "Transparencia total para tu equipo y clientes",
    "Diagnósticos inteligentes basados en IA",
    "Acceso a un experto en paid media sin contratar uno",
    "Cuentas y usuarios ilimitados",
    "Solo pagas por uso, sin costos ocultos"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl p-8 relative">
        <div className="text-center mb-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            ¡Bienvenido a CompassMetrics, {user?.name || 'Usuario'}!
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            El asistente IA que traduce datos en decisiones para tu agencia o tus clientes.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Descripción del Producto */}
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
              <Zap className="w-4 h-4" />
              <span>Powered by AI</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              El asistente IA que potencia las capacidades de todo tu equipo.
            </h3>
            <p className="text-gray-700 leading-relaxed">
              CompassMetrics potencia las capacidades de todo tu equipo con respuestas rápidas y diagnósticos inteligentes sobre el estado de tus campañas digitales. 
              Permite que cada miembro del equipo y tus clientes accedan a información clara y actualizada, optimizando la colaboración y los recursos de todos.
            </p>
            <div className="space-y-3">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700 text-base">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Opciones de Plan */}
          <div className="space-y-6">
            {/* Opción 14 Días Gratis */}
            <div className="bg-blue-50 border-2 border-blue-500 rounded-xl p-6 text-center relative shadow-md">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                  Recomendado
                </span>
              </div>
              <h3 className="text-2xl font-bold text-blue-700 mb-2">14 Días Gratis</h3>
              <p className="text-gray-600 text-sm mb-4">Sin tarjeta de crédito</p>
              <div className="text-5xl font-bold text-blue-600 mb-4">Gratis</div>
              <ul className="text-left text-gray-700 text-sm space-y-2 mb-6">
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" /> Acceso completo a la plataforma</li>
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" /> 3 consultas incluidas</li>
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" /> Cuentas y usuarios ilimitados</li>
              </ul>
              <button
                onClick={() => handlePlanSelection('free_trial')}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Comenzar Prueba Gratis</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* Plan de Suscripción */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 text-center shadow-md">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Plan Mensual</h3>
              <p className="text-gray-600 text-sm mb-4">Para uso continuo</p>
              <div className="text-5xl font-bold text-gray-900 mb-4">CLP 15.000<span className="text-lg text-gray-600">/mes + IVA</span></div>
              <p className="text-sm text-gray-500 mb-4">Aproximadamente US$15</p>
              <ul className="text-left text-gray-700 text-sm space-y-2 mb-6">
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" /> 15 consultas mensuales incluidas</li>
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" /> Posibilidad de agregar más consultas</li>
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" /> Cuentas y usuarios ilimitados</li>
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" /> Solo pagas por uso</li>
              </ul>
              <button
                onClick={() => handlePlanSelection('monthly')}
                className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Contratar Plan Mensual</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            ¿Necesitas algo diferente? Contáctanos para un plan personalizado.
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>Garantía de 30 días</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Soporte 24/7</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Configuración en minutos</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default OnboardingPage;