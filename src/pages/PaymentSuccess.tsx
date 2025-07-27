import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { selectPlan } = useAuth();

  useEffect(() => {
    // Obtener parámetros de la URL de retorno de Mercado Pago
    const paymentId = searchParams.get('payment_id');
    const preapprovalId = searchParams.get('preapproval_id');
    const status = searchParams.get('status');
    const externalReference = searchParams.get('external_reference');

    if ((status === 'approved' || preapprovalId) && externalReference) {
      // Extraer el tipo de plan de la referencia externa
      const planType = externalReference.includes('monthly') || externalReference.includes('subscription') ? 'monthly' : 'trial';
      selectPlan(planType);
    }
  }, [searchParams, selectPlan]);

  const handleContinue = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          ¡Pago Exitoso!
        </h1>

        <p className="text-gray-600 mb-8">
          Tu suscripción a CompassMetrics ha sido activada correctamente. 
          Ya puedes comenzar a usar todas las funcionalidades de la plataforma.
        </p>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-green-800">
            <strong>¡Bienvenido a CompassMetrics!</strong><br/>
            Tu plan mensual incluye 15 consultas y usuarios ilimitados.
          </p>
        </div>

        <button
          onClick={handleContinue}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
        >
          <span>Ir al Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <p className="text-xs text-gray-500 mt-4">
          Recibirás un email de confirmación con los detalles de tu suscripción.
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess;