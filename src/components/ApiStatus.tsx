import React from 'react';
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { checkApiConfiguration } from '../lib/socialApis';

const ApiStatus: React.FC = () => {
  const apiStatus = checkApiConfiguration();
  
  const getStatusIcon = (configured: boolean) => {
    if (configured) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
    return <XCircle className="w-4 h-4 text-red-500" />;
  };

  const getStatusColor = (configured: boolean) => {
    return configured ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200';
  };

  const getStatusText = (configured: boolean) => {
    return configured ? 'Configurado' : 'No configurado';
  };

  const configuredCount = Object.values(apiStatus).filter(api => api.configured).length;
  const totalApis = Object.keys(apiStatus).length;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Estado de APIs</h3>
        <div className="text-sm text-gray-600">
          {configuredCount}/{totalApis} configuradas
        </div>
      </div>

      <div className="space-y-3">
        <div className={`p-3 rounded-lg border ${getStatusColor(apiStatus.meta.configured)}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {getStatusIcon(apiStatus.meta.configured)}
              <span className="font-medium">Meta Ads (Facebook/Instagram)</span>
            </div>
            <span className="text-sm">{getStatusText(apiStatus.meta.configured)}</span>
          </div>
          {!apiStatus.meta.configured && apiStatus.meta.missing.length > 0 && (
            <div className="mt-2 text-xs text-red-600">
              Faltan: {apiStatus.meta.missing.join(', ')}
            </div>
          )}
        </div>

        <div className={`p-3 rounded-lg border ${getStatusColor(apiStatus.google.configured)}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {getStatusIcon(apiStatus.google.configured)}
              <span className="font-medium">Google Ads</span>
            </div>
            <span className="text-sm">{getStatusText(apiStatus.google.configured)}</span>
          </div>
          {!apiStatus.google.configured && apiStatus.google.missing.length > 0 && (
            <div className="mt-2 text-xs text-red-600">
              Faltan: {apiStatus.google.missing.join(', ')}
            </div>
          )}
        </div>

        <div className={`p-3 rounded-lg border ${getStatusColor(apiStatus.tiktok.configured)}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {getStatusIcon(apiStatus.tiktok.configured)}
              <span className="font-medium">TikTok Ads</span>
            </div>
            <span className="text-sm">{getStatusText(apiStatus.tiktok.configured)}</span>
          </div>
          {!apiStatus.tiktok.configured && apiStatus.tiktok.missing.length > 0 && (
            <div className="mt-2 text-xs text-red-600">
              Faltan: {apiStatus.tiktok.missing.join(', ')}
            </div>
          )}
        </div>

        <div className={`p-3 rounded-lg border ${getStatusColor(apiStatus.linkedin.configured)}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {getStatusIcon(apiStatus.linkedin.configured)}
              <span className="font-medium">LinkedIn Ads</span>
            </div>
            <span className="text-sm">{getStatusText(apiStatus.linkedin.configured)}</span>
          </div>
          {!apiStatus.linkedin.configured && apiStatus.linkedin.missing.length > 0 && (
            <div className="mt-2 text-xs text-red-600">
              Faltan: {apiStatus.linkedin.missing.join(', ')}
            </div>
          )}
        </div>

        <div className={`p-3 rounded-lg border ${getStatusColor(apiStatus.twitter.configured)}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {getStatusIcon(apiStatus.twitter.configured)}
              <span className="font-medium">Twitter Ads</span>
            </div>
            <span className="text-sm">{getStatusText(apiStatus.twitter.configured)}</span>
          </div>
          {!apiStatus.twitter.configured && apiStatus.twitter.missing.length > 0 && (
            <div className="mt-2 text-xs text-red-600">
              Faltan: {apiStatus.twitter.missing.join(', ')}
            </div>
          )}
        </div>
      </div>

      {configuredCount === 0 && (
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-center space-x-2 text-amber-800">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">
              <strong>Modo Demo:</strong> Configura al menos una API para conectar datos reales
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiStatus;