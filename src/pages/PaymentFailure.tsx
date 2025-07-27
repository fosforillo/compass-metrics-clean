import React from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';

const PaymentFailure: React.FC = () => {
  const navigate = useNavigate();

  const handleRetry = () => {
    navigate('/onboarding');
  };

  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-10 h-10 text-red-600" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Pago No Completado
        </h1>

        <p className="text-gray-600 mb-8">
          Hubo un problema al procesar tu pago. No te preocupes, no se ha realizado ningún cargo a tu tarjeta.
        </p>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-amber-800">
            <strong>Posibles causas:</strong><br/>
            • Fondos insuficientes<br/>
            • Datos de tarjeta incorrectos<br/>
            • Problema temporal del banco
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleRetry}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Intentar Nuevamente</span>
          </button>

          <button
            onClick={handleGoBack}
            className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al Inicio</span>
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-6">
          Si el problema persiste, contáctanos en thomas.schmidt@elfaro-pv.com
        </p>
      </div>
    </div>
  );
};

export default PaymentFailure;