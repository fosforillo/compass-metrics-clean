import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { 
  BarChart3, 
  TrendingUp, 
  Zap, 
  Target, 
  Eye, 
  Brain, 
  CheckCircle, 
  ArrowRight,
  Users,
  Clock,
  Shield,
  Play,
  Mail,
  X,
  LogIn,
  Cookie
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showCookieNotice, setShowCookieNotice] = useState(true);
  const [registeredUser, setRegisteredUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    company: ''
  });
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  
  // Ref para hacer scroll al formulario
  const authFormRef = useRef<HTMLDivElement>(null);

  // Verificar si ya se aceptaron las cookies
  useEffect(() => {
    const cookiesAccepted = localStorage.getItem('cookies-accepted');
    if (cookiesAccepted === 'true') {
      setShowCookieNotice(false);
    }
  }, []);

  const handleAcceptCookies = () => {
    localStorage.setItem('cookies-accepted', 'true');
    setShowCookieNotice(false);
  };

  const scrollToAuthForm = () => {
    authFormRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await register(formData.email, formData.password, formData.name, formData.company);
      if (success) {
        setRegisteredUser({ email: formData.email, name: formData.name, company: formData.company });
        // Si Supabase no está configurado, ir directamente al onboarding
        if (!import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL === 'https://placeholder.supabase.co') {
          navigate('/onboarding');
        } else {
          setShowEmailConfirmation(true);
        }
      } else {
        alert('Error en el registro. Intenta nuevamente.');
      }
    } catch (error) {
      alert('Hubo un error. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoginLoading(true);

    try {
      const success = await login(loginData.email, loginData.password);
      if (success) {
        setShowLoginModal(false);
        navigate('/dashboard');
      } else {
        // Si Supabase no está configurado, simular login exitoso
        if (!import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL === 'https://placeholder.supabase.co') {
          setShowLoginModal(false);
          navigate('/dashboard');
        } else {
          alert('Error en las credenciales. Intenta nuevamente.');
        }
      }
    } catch (error) {
      alert('Hubo un error. Intenta nuevamente.');
    } finally {
      setIsLoginLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLoginInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };

  const handleEmailConfirmation = () => {
    setShowEmailConfirmation(false);
    setShowLoginModal(true);
  };

  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "Diagnósticos Inteligentes",
      description: "Obtén respuestas rápidas y diagnósticos precisos sobre el estado de tus campañas digitales, basados en IA avanzada."
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: "Transparencia Total",
      description: "Todo tu equipo y clientes pueden acceder a información clara sobre las campañas, sin depender de intermediarios."
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Modelo Flexible",
      description: "15 consultas al mes por US$15. ¿Necesitas más? Agrega consultas adicionales fácilmente. Solo pagas por uso."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Escalabilidad Ilimitada",
      description: "Cuentas y usuarios ilimitados. Perfecto para agencias que manejan múltiples clientes y equipos grandes."
    }
  ];

  const benefits = [
    "Respuestas rápidas sobre el estado de tus campañas",
    "Transparencia total para tu equipo y clientes",
    "Diagnósticos inteligentes basados en IA",
    "Acceso a un experto en paid media sin contratar uno",
    "Cuentas y usuarios ilimitados",
    "Solo pagas por uso, sin costos ocultos"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200 sticky top-0 z-50">
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
                <p className="text-sm text-gray-500">Inteligencia de Marketing Digital</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowLoginModal(true)}
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span className="text-sm font-medium">Iniciar Sesión</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Banner Principal */}
      <div className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)'
          }}
        ></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              El asistente IA que potencia a todo tu equipo de paid media
            </h1>
            <p className="text-xl lg:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
              CompassMetrics es el asistente IA que traduce datos en decisiones para tu agencia o tus clientes.
            </p>
            <div className="mt-8">
              <button 
                onClick={scrollToAuthForm}
                className="bg-white text-blue-900 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg"
              >
                Comenzar Gratis
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 py-12">
          
          {/* Contenido Principal */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                <Zap className="w-4 h-4" />
                <span>Powered by AI</span>
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                CompassMetrics: La IA que <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">potencia a todo tu equipo</span> de paid media.
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed">
                El asistente inteligente que transforma horas de análisis manual en minutos de insights claros. 
                Potencia las capacidades de todo tu equipo de paid media, permitiendo que cada miembro acceda a información 
                transparente y tome decisiones estratégicas más informadas.
              </p>

              <div className="flex items-center space-x-6">
                <button 
                  onClick={scrollToAuthForm}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Play className="w-4 h-4" />
                  <span>Comenzar Gratis</span>
                </button>
              </div>
            </div>

            {/* Mensaje de Libertad y Personalización */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-xl border border-blue-100">
              <p className="text-lg text-gray-700 leading-relaxed text-center">
                <strong>15 consultas mensuales incluidas en tu plan.</strong><br/>
                ¿Necesitas más? Puedes agregar consultas adicionales fácilmente.<br/>
                <strong>Cuentas ilimitadas. Usuarios ilimitados. Solo pagas por uso.</strong>
              </p>
            </div>

            {/* Características Principales */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">
                ¿Por qué elegir CompassMetrics?
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {features.map((feature, index) => (
                  <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 flex-shrink-0">
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">{feature.description.replace('Diagnósticos', 'Consultas').replace('diagnósticos', 'consultas')}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Beneficios */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Lo que obtienes con CompassMetrics:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Formulario de Registro */}
          <div className="lg:sticky lg:top-24 lg:self-start" ref={authFormRef}>
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Crea tu Cuenta Gratis
                </h2>
                <p className="text-gray-600">
                  Crea tu cuenta y transforma tus reportes hoy mismo
                </p>
              </div>

              <form onSubmit={handleRegisterSubmit} className="space-y-6">
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
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tu nombre completo"
                  />
                </div>
                
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                    Empresa (opcional)
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

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="tu@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                   autoComplete="current-password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>Crear Cuenta Gratis</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                  <Shield className="w-4 h-4" />
                  <span>Tus datos están seguros y protegidos</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Sección de Demo - Ahora enfocada en el registro */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            CompassMetrics: El asistente IA que potencia a todo tu equipo de paid media
          </h2>
          <p className="text-xl lg:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
            El asistente inteligente que transforma horas de análisis manual en minutos de insights claros, 
            potenciando las capacidades de cada miembro de tu equipo para tomar decisiones estratégicas con mayor agilidad y precisión.
          </p>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-4xl mx-auto">
            <div className="aspect-video bg-gray-900 rounded-xl flex items-center justify-center mb-6">
              <div className="text-center">
                <BarChart3 className="w-16 h-16 text-white mx-auto mb-4" />
                <p className="text-white text-lg">Video Demo Próximamente</p>
                <p className="text-gray-300 text-sm">Crea tu cuenta para acceder inmediatamente a la plataforma</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={scrollToAuthForm}
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Crear Cuenta Gratis
              </button>
              <button 
                onClick={() => setShowLoginModal(true)}
                className="bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-400 transition-colors border border-blue-400"
              >
                Ya tengo cuenta
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sección de Precios */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Precios Simples y Transparentes
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Solo pagas por uso. Cuentas y usuarios ilimitados.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Plan Gratuito */}
            <div className="bg-white rounded-2xl shadow-lg border-2 border-blue-500 p-8 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                  Recomendado
                </span>
              </div>
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-blue-700 mb-2">14 Días Gratis</h3>
                <p className="text-gray-600 text-sm mb-4">Sin tarjeta de crédito</p>
                <div className="text-4xl font-bold text-blue-600 mb-4">Gratis</div>
              </div>
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Acceso completo a la plataforma</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">3 consultas incluidas</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Cuentas y usuarios ilimitados</span>
                </div>
              </div>
              <button 
                onClick={scrollToAuthForm}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Comenzar Gratis
              </button>
            </div>

            {/* Plan Mensual */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Plan Mensual</h3>
                <p className="text-gray-600 text-sm mb-4">Para uso continuo</p>
                <div className="text-4xl font-bold text-gray-900 mb-2">CLP 15.000<span className="text-lg text-gray-600">/mes + IVA</span></div>
                <div className="text-sm text-gray-500 font-medium">Aproximadamente US$15</div>
              </div>
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">15 consultas mensuales incluidas</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Posibilidad de agregar más consultas</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Cuentas y usuarios ilimitados</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Solo pagas por uso</span>
                </div>
              </div>
              <button 
                onClick={scrollToAuthForm}
                className="w-full bg-gray-900 text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Contratar
              </button>
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

      {/* Sección de Q&A */}
      <div className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Preguntas Frecuentes
            </h2>
            <p className="text-xl text-gray-600">
              Todo lo que necesitas saber sobre CompassMetrics
            </p>
          </div>

          <div className="space-y-8">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                ¿Cuánto cuesta CompassMetrics?
              </h3>
              <p className="text-gray-700 leading-relaxed">
                El plan mensual cuesta CLP 15.000 + IVA (aproximadamente US$15) e incluye 15 consultas inteligentes. 
                Si necesitas más, puedes agregar paquetes de consultas adicionales.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                ¿Qué incluye la prueba gratuita de 14 días?
              </h3>
              <p className="text-gray-700 leading-relaxed">
                La prueba gratuita incluye acceso completo a la plataforma con 3 consultas incluidas para que puedas 
                probar todas las funcionalidades. No se requiere tarjeta de crédito.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                ¿Hay límite de usuarios o cuentas?
              </h3>
              <p className="text-gray-700 leading-relaxed">
                No, puedes tener usuarios y cuentas ilimitados. Solo pagas por las consultas que uses, 
                lo que hace que CompassMetrics sea perfecto para agencias con múltiples clientes y equipos grandes.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                ¿Qué plataformas de publicidad soporta?
              </h3>
              <p className="text-gray-700 leading-relaxed">
                CompassMetrics está optimizado para Meta Ads (Facebook e Instagram) y Google Ads, 
                las dos plataformas más importantes para campañas de marketing digital.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                ¿Cómo funciona la IA de consultas?
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Nuestra IA analiza los datos de tus campañas y proporciona respuestas claras sobre el rendimiento, 
                identificando oportunidades de mejora y respondiendo preguntas específicas sobre ROAS, CPA, CTR y más.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                ¿Puedo cancelar en cualquier momento?
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Sí, puedes cancelar tu suscripción en cualquier momento. No hay contratos a largo plazo ni penalizaciones. 
                Solo pagas por lo que usas.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Confirmación de Email (se mantiene aquí para el flujo inicial de registro) */}
      {showEmailConfirmation && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full relative">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                ¡Revisa tu Email!
              </h2>
              
              <p className="text-gray-600 mb-6">
                Hemos enviado un enlace de confirmación a <strong>{registeredUser?.email}</strong>. 
                Revisa tu bandeja de entrada y haz clic en el enlace para confirmar tu cuenta.
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800">
                  <strong>Importante:</strong> Debes hacer clic en el enlace de confirmación en tu email antes de poder iniciar sesión. ¿No ves el email? Revisa tu carpeta de spam o promociones.
                </p>
              </div>
              
              <button
                onClick={handleEmailConfirmation}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Ya confirmé mi email - Iniciar Sesión
              </button>
              
              <p className="text-xs text-gray-500 mt-4">
                Después de confirmar tu email, podrás iniciar sesión y acceder a CompassMetrics
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Login (se mantiene aquí) */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full relative">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Iniciar Sesión
              </h2>
              <p className="text-gray-600">
                Accede a tu dashboard de CompassMetrics
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-6">
              <div>
                <label htmlFor="loginEmail" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="loginEmail"
                  name="email"
                  value={loginData.email}
                  onChange={handleLoginInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="tu@email.com"
                />
              </div>

              <div>
                <label htmlFor="loginPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña
                </label>
                <input
                  type="password"
                  id="loginPassword"
                  name="password"
                  value={loginData.password}
                  onChange={handleLoginInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={isLoginLoading}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                {isLoginLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Iniciar Sesión</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                ¿No tienes cuenta?{' '}
                <button
                  onClick={() => {
                    setShowLoginModal(false);
                    scrollToAuthForm();
                  }}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Regístrate gratis
                </button>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Notificación de Cookies */}
      {showCookieNotice && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 p-4">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-start space-x-3">
              <Cookie className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-700">
                <p className="mb-1">
                  <strong>Usamos cookies para mejorar tu experiencia</strong>
                </p>
                <p>
                  Utilizamos cookies estrictamente necesarias para mantener tu sesión activa y garantizar el funcionamiento de la plataforma. 
                  No usamos cookies de seguimiento publicitario.{' '}
                  <Link to="/privacy-policy" className="text-blue-600 hover:text-blue-700 underline">
                    Ver Política de Privacidad
                  </Link>
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleAcceptCookies}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-3">
              <img 
                src="/CompassMetrics icono copy copy.png" 
                alt="CompassMetrics Logo" 
                className="w-8 h-8 object-contain"
              />
              <span className="font-bold text-gray-900">CompassMetrics</span>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <Link to="/privacy-policy" className="hover:text-gray-700 transition-colors">
                Política de Privacidad
              </Link>
              <Link to="/terms-of-use" className="hover:text-gray-700 transition-colors">
                Términos y Condiciones
              </Link>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>Otro experimento por El Faro - Laboratorio de marketing digital</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;