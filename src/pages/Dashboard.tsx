import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { isSupabaseAvailable } from '../lib/supabase';
import ApiStatus from '../components/ApiStatus';
import { Send, BarChart3, TrendingUp, Target, MessageCircle, LogOut, User, Settings, Link as LinkIcon, CheckCircle, AlertCircle } from 'lucide-react';

// Verificar la configuración de OpenAI API
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

// Componente para mostrar el estado de la API
const OpenAIStatus: React.FC = () => {
  const hasApiKey = !!OPENAI_API_KEY && OPENAI_API_KEY !== 'your_openai_api_key_here';
  
  if (!hasApiKey) {
    return (
      <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
        <div className="flex items-center space-x-2 text-amber-800">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">
            <strong>API de OpenAI no configurada.</strong> Agrega tu clave de OpenAI en el archivo .env para activar el chat inteligente.
          </span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
      <div className="flex items-center space-x-2 text-green-800">
        <CheckCircle className="w-4 h-4" />
        <span className="text-sm">
          <strong>API de OpenAI configurada correctamente.</strong> Chat inteligente activo.
        </span>
      </div>
    </div>
  );
};

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  graphUrl?: string;
}

// Mapeo de KPIs a URLs de gráficos estáticos
const KPI_GRAPHS = {
  'ROAS': 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&fit=crop',
  'CPA': 'https://images.pexels.com/photos/669610/pexels-photo-669610.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&fit=crop',
  'CTR': 'https://images.pexels.com/photos/186461/pexels-photo-186461.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&fit=crop',
  'CONVERSIONES': 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&fit=crop',
  'ENGAGEMENT': 'https://images.pexels.com/photos/669615/pexels-photo-669615.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&fit=crop',
  'ALCANCE': 'https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&fit=crop'
};

const Dashboard: React.FC = () => {
  const { user, logout, connectPlatform, disconnectPlatform } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Hola ${user?.name || 'Usuario'}, soy tu asistente de CompassMetrics para campañas digitales. Pregúntame lo que necesites sobre las campañas de ${user?.company || 'tu empresa'}.`,
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const platforms = [
    { id: 'meta', name: 'Meta Ads', color: 'bg-blue-600', icon: '📘' },
    { id: 'google', name: 'Google Ads', color: 'bg-green-600', icon: '🔍' },
    { id: 'tiktok', name: 'TikTok Ads', color: 'bg-black', icon: '🎵' },
    { id: 'linkedin', name: 'LinkedIn Ads', color: 'bg-blue-700', icon: '💼' }
  ];

  const connectedPlatforms = user?.connectedPlatforms || [];
  const hasConnectedPlatforms = connectedPlatforms.length > 0;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // Solo hacer scroll al final cuando hay nuevos mensajes, no en la carga inicial
    if (messages.length > 1) {
      scrollToBottom();
    }
  }, [messages]);

  const generateResponse = async (userMessage: string): Promise<{ text: string; graphUrl?: string }> => {
    // Verificar si la API key está configurada correctamente
    const hasValidApiKey = OPENAI_API_KEY && 
      OPENAI_API_KEY !== 'your_openai_api_key_here' && 
      OPENAI_API_KEY.startsWith('sk-');
    
    if (!hasValidApiKey) {
      return generateSimulatedResponse(userMessage);
    }
    
    try {
      const systemPrompt = `Eres un asistente digital de CompassMetrics, una plataforma de inteligencia de marketing digital que proporciona diagnósticos rápidos y transparencia sobre el estado de las campañas. Atiendes exclusivamente al cliente ${user?.company || 'el cliente'}.

Tu trabajo es proporcionar respuestas rápidas y diagnósticos inteligentes sobre el estado de sus campañas en Meta Ads y Google Ads. Permite que todo el equipo y los clientes sepan qué está pasando, sin tener que ir a la persona encargada cada vez. Eres una herramienta de transparencia.

Actúas como parte del equipo de CompassMetrics, no como una IA. No digas que eres un bot ni que tus respuestas son simuladas. Usa un tono claro, profesional y directo. Siempre proporciona diagnósticos detallados, recomendaciones específicas, observaciones y próximos pasos.

IMPORTANTE: Si la pregunta se refiere específicamente a un KPI (ROAS, CPA, CTR, CONVERSIONES, ENGAGEMENT, ALCANCE), inicia tu respuesta con [GRAPH:NOMBRE_KPI] seguido de tu análisis completo.

Ejemplos:
- Si preguntan sobre ROAS: "[GRAPH:ROAS] El ROAS actual de ${user?.company || 'tu empresa'}..."
- Si preguntan sobre CPA: "[GRAPH:CPA] El CPA promedio de las campañas..."
- Si preguntan sobre CTR: "[GRAPH:CTR] El CTR de las campañas muestra..."

Datos de contexto de ${user?.company || 'la empresa'}:
- ROAS promedio: 4.2x
- CPA promedio: $29.50
- CTR general: 2.8%
- Conversiones totales: 423
- Plataformas conectadas: ${connectedPlatforms.join(', ') || 'Ninguna'}
- Formatos que funcionan: Videos cortos, carruseles, testimoniales

Recuerda que tu función es dar transparencia y respuestas rápidas sobre el estado de las campañas.
Siempre incluye recomendaciones específicas, observaciones detalladas y próximos pasos estratégicos.`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'User-Agent': 'CompassMetrics/1.0'
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage }
          ],
          max_tokens: 800,
          temperature: 0.7,
        })
      });

      if (!response.ok) {
        console.error('OpenAI API Error:', response.status);
        throw new Error(`Error de OpenAI: ${response.status}`);
      }

      const data = await response.json();
      let responseText = data.choices[0].message.content;

      // Buscar si hay un gráfico solicitado
      let graphUrl: string | undefined;
      const graphMatch = responseText.match(/^\[GRAPH:(\w+)\]/);
      
      if (graphMatch) {
        const kpiName = graphMatch[1];
        graphUrl = KPI_GRAPHS[kpiName as keyof typeof KPI_GRAPHS];
        // Remover el prefijo del gráfico del texto
        responseText = responseText.replace(/^\[GRAPH:\w+\]\s*/, '');
      }

      return { text: responseText, graphUrl };

    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      // Si falla la API, usar respuesta simulada como fallback
      return generateSimulatedResponse(userMessage);
    }
  };

  // Función para generar respuestas simuladas cuando no hay API key
  const generateSimulatedResponse = (userMessage: string): { text: string; graphUrl?: string } => {
    const message = userMessage.toLowerCase();
    
    // Detectar si se pregunta por un KPI específico
    let graphUrl: string | undefined;
    let responseText = '';
    
    if (message.includes('roas')) {
      graphUrl = KPI_GRAPHS.ROAS;
      responseText = `**Análisis de ROAS para ${user?.company || 'tu empresa'}**

El ROAS actual está en 4.2x, lo cual está por encima del promedio de la industria (3.5x). 

**Observaciones:**
• Las campañas de video están generando el mejor ROAS (5.8x)
• Los anuncios de carrusel mantienen un ROAS estable de 4.1x
• Las campañas de prospección necesitan optimización (2.9x)

**Recomendaciones:**
1. Aumentar presupuesto en campañas de video (+30%)
2. Pausar audiencias con ROAS < 2.0
3. Implementar lookalike audiences basadas en conversiones

**Próximos pasos:**
• Revisar creativos de bajo rendimiento esta semana
• Ajustar pujas automáticas en campañas de prospección`;
    } else if (message.includes('cpa')) {
      graphUrl = KPI_GRAPHS.CPA;
      responseText = `**Análisis de CPA para ${user?.company || 'tu empresa'}**

El CPA promedio actual es de $29.50, manteniéndose dentro del objetivo de $35.

**Observaciones:**
• Meta Ads: CPA promedio $27.80 (excelente)
• Google Ads: CPA promedio $32.20 (bueno)
• Tendencia descendente del 12% vs mes anterior

**Recomendaciones:**
1. Escalar campañas con CPA < $25
2. Optimizar landing pages para mejorar conversión
3. Implementar remarketing más agresivo

**Próximos pasos:**
• A/B testing en páginas de destino
• Revisar audiencias de alto CPA`;
    } else if (message.includes('ctr')) {
      graphUrl = KPI_GRAPHS.CTR;
      responseText = `**Análisis de CTR para ${user?.company || 'tu empresa'}**

El CTR general está en 2.8%, superando el benchmark de la industria (2.1%).

**Observaciones:**
• Creativos de video: CTR 3.4% (excelente)
• Imágenes estáticas: CTR 2.2% (promedio)
• Anuncios de texto: CTR 1.8% (mejorable)

**Recomendaciones:**
1. Crear más contenido de video similar al top performer
2. Refrescar creativos con CTR < 1.5%
3. Testear nuevos formatos de anuncios

**Próximos pasos:**
• Producir 5 nuevos videos esta semana
• Pausar creativos de bajo rendimiento`;
    } else {
      responseText = `Hola, soy tu asistente de CompassMetrics para ${user?.company || 'tu empresa'}.

Puedo ayudarte con consultas sobre:
• **ROAS** - Retorno de inversión publicitaria
• **CPA** - Costo por adquisición
• **CTR** - Tasa de clics
• **Conversiones** - Análisis de resultados
• **Rendimiento de campañas** - Meta Ads y Google Ads

**Ejemplo de preguntas:**
"¿Cómo está el ROAS este mes?"
"¿Cuál es el CPA actual?"
"¿Qué tal el CTR de las campañas?"

*Nota: Actualmente funcionando en modo demostración. Para análisis con datos reales, se requiere configurar la API de OpenAI.*`;
    }
    
    return { text: responseText, graphUrl };
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await generateResponse(inputText);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.text,
        isUser: false,
        timestamp: new Date(),
        graphUrl: response.graphUrl
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Disculpa, hubo un error al procesar tu consulta. Por favor, intenta nuevamente.',
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handlePlatformToggle = (platformId: string) => {
    if (connectedPlatforms.includes(platformId)) {
      disconnectPlatform(platformId);
    } else {
      connectPlatform(platformId);
    }
  };
  const quickQuestions = [
    "¿Cómo está el ROAS de las campañas este mes?",
    "¿Cuál es el CPA actual?",
    "¿Qué tal está el CTR de nuestras campañas?",
    "¿Cuántas conversiones hemos generado?",
    "¿Qué formato tuvo mejor rendimiento esta semana?",
    "¿Qué canal generó más conversiones este mes?"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
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
                <p className="text-sm text-gray-500">Dashboard de Marketing - {user?.company || 'Dashboard'}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span>{user?.name}</span>
              </div>
              
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Settings className="w-5 h-5" onClick={() => navigate('/settings')} />
              </button>
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Salir</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sección de Conexiones de Plataformas */}
          <div className="lg:col-span-4 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Conecta tus Plataformas Publicitarias</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Conecta al menos una plataforma para comenzar a usar el asistente de IA
                  </p>
                </div>
                {hasConnectedPlatforms && (
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">{connectedPlatforms.length} plataforma{connectedPlatforms.length !== 1 ? 's' : ''} conectada{connectedPlatforms.length !== 1 ? 's' : ''}</span>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {platforms.map((platform) => {
                  const isConnected = connectedPlatforms.includes(platform.id);
                  return (
                    <button
                      key={platform.id}
                      onClick={() => handlePlatformToggle(platform.id)}
                      className={`relative p-4 rounded-lg border-2 transition-all duration-200 ${
                        isConnected
                          ? `${platform.color} text-white border-transparent shadow-md`
                          : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{platform.icon}</span>
                        <div className="text-left">
                          <div className="font-medium">{platform.name}</div>
                          <div className={`text-xs ${isConnected ? 'text-white/80' : 'text-gray-500'}`}>
                            {isConnected ? 'Conectado' : 'Desconectado'}
                          </div>
                        </div>
                      </div>
                      {isConnected && (
                        <div className="absolute top-2 right-2">
                          <CheckCircle className="w-5 h-5 text-white" />
                        </div>
                      )}
                      {!isConnected && (
                        <div className="absolute top-2 right-2">
                          <LinkIcon className="w-4 h-4 text-gray-400" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
              
              {!hasConnectedPlatforms && (
                <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-center space-x-2 text-amber-800">
                    <AlertCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">
                      <strong>{isSupabaseAvailable() ? 'Conecta plataformas' : 'Modo Demo'}:</strong> {isSupabaseAvailable() ? 'Conecta al menos una plataforma para obtener datos reales' : 'Configura Supabase para conectar plataformas reales. Por ahora puedes probar el chat.'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar con métricas rápidas */}
          <div className="lg:col-span-1 space-y-6">
            <ApiStatus />
            
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Preguntas Frecuentes</h3>
              <div className="space-y-2">
                {quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => setInputText(question)}
                    className="w-full text-left text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Chat principal */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm h-[600px] flex flex-col">
              
              {/* Chat messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-3xl ${message.isUser ? 'order-2' : 'order-1'}`}>
                      <div
                        className={`px-4 py-3 rounded-2xl ${
                          message.isUser
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <div className="whitespace-pre-wrap text-sm leading-relaxed">
                          {message.text}
                        </div>
                        
                        {/* Mostrar gráfico si está presente */}
                        {message.graphUrl && !message.isUser && (
                          <div className="mt-4">
                            <img 
                              src={message.graphUrl} 
                              alt="Gráfico de KPI"
                              className="w-full max-w-md rounded-lg shadow-sm border border-gray-200"
                              style={{ maxHeight: '200px', objectFit: 'cover' }}
                            />
                            <p className="text-xs text-gray-500 mt-2">Gráfico generado basado en datos de campañas</p>
                          </div>
                        )}
                      </div>
                      <div className={`text-xs text-gray-500 mt-1 ${message.isUser ? 'text-right' : 'text-left'}`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.isUser ? 'order-1 mr-3 bg-blue-600' : 'order-2 ml-3 bg-gradient-to-r from-blue-600 to-indigo-600'
                    }`}>
                      {message.isUser ? (
                        <Target className="w-4 h-4 text-white" />
                      ) : (
                        <MessageCircle className="w-4 h-4 text-white" />
                      )}
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex items-center space-x-2 bg-gray-100 px-4 py-3 rounded-2xl">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-sm text-gray-600">Analizando datos...</span>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input area */}
              <div className="border-t border-gray-200 p-4">
                <OpenAIStatus />
                {!hasConnectedPlatforms && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm">
                        <strong>Modo Demo:</strong> Conecta plataformas reales cuando tengas Supabase configurado. Por ahora puedes probar el chat.
                      </span>
                    </div>
                  </div>
                )}
                <div className="flex space-x-3">
                  <div className="flex-1">
                    <textarea
                      id="chatInput"
                      name="chatInput"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Pregúntame sobre tus campañas digitales..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows={2}
                      disabled={isLoading}
                    />
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputText.trim() || isLoading}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Enviar</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;