import React, { useState } from 'react';
import { X, CreditCard, Shield } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  planType: 'monthly' | 'trial';
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onSuccess, planType }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simular procesamiento de pago
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess();
    }, 2000);
  };

  const planDetails = {
    monthly: {
      name: 'Plan Mensual',
      price: 'CLP 15.000',
      description: '15 consultas mensuales incluidas'
    },
    trial: {
      name: 'Prueba Gratuita',
      price: 'Gratis',
      description: '3 consultas incluidas'
    }
  };

  const plan = planDetails[planType];

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Confirmar Suscripción
          </h2>
          <p className="text-gray-600">
            {plan.name} - {plan.price}
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-900 mb-2">Resumen del Plan</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>{plan.name}</span>
              <span>{plan.price}</span>
            </div>
            <div className="text-xs text-gray-500">
              {plan.description}
            </div>
          </div>
        </div>

        <button
          onClick={handlePayment}
          disabled={isProcessing}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
        >
          {isProcessing ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <Shield className="w-4 h-4" />
              <span>Confirmar Pago</span>
            </>
          )}
        </button>

        <p className="text-xs text-gray-500 text-center mt-4">
          Pago seguro procesado por MercadoPago
        </p>
      </div>
    </div>
  );
};

export default PaymentModal;