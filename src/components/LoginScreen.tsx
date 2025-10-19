import React, { useState, useEffect } from 'react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { GraduationCap, ChevronRight, ArrowLeft, User, Lock, RefreshCw, KeyRound } from 'lucide-react';
import './../styles/LoginScreen.css';

export const LoginScreen: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loginMode, setLoginMode] = useState<'selection' | 'academic' | 'administrative'>('selection');
  const [captcha, setCaptcha] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [academicCredentials, setAcademicCredentials] = useState({
    codigo: '',
    password: ''
  });
  const [adminCredentials, setAdminCredentials] = useState({ 
    username: '', 
    password: '' 
  });

  // Generar captcha de 4 dígitos únicos
  const generateCaptcha = () => {
    const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const shuffled = digits.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 4).join('');
  };

  useEffect(() => {
    if (loginMode === 'academic') {
      setCaptcha(generateCaptcha());
    }
  }, [loginMode]);

  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha());
    setCaptchaInput('');
  };

  const handleAcademicLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (captchaInput !== captcha) {
      setError('El código CAPTCHA es incorrecto');
      refreshCaptcha();
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-82f4c750/academic-login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({
            codigo: academicCredentials.codigo,
            password: academicCredentials.password
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Error al iniciar sesión');
        refreshCaptcha();
        return;
      }

      if (data.success) {
        const academicUser = {
          id: data.user.id || 'academic-user',
          email: data.user.email || `${academicCredentials.codigo}@upt.edu.pe`,
          user_metadata: {
            name: data.user.user_metadata?.name || 'Estudiante',
            avatar_url: data.user.user_metadata?.avatar_url || '',
            role: 'student',
            login_type: 'academic',
            codigo: academicCredentials.codigo
          }
        };

        window.dispatchEvent(new CustomEvent('admin-login', { 
          detail: academicUser 
        }));
      }
    } catch (err) {
      setError('Error inesperado al intentar iniciar sesión');
      console.error('Academic login error:', err);
      refreshCaptcha();
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-82f4c750/admin-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          username: adminCredentials.username,
          password: adminCredentials.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Error al iniciar sesión');
        return;
      }

      if (data.success) {
        const adminUser = {
          id: data.user.id || 'admin-user',
          email: data.user.email,
          user_metadata: {
            name: data.user.user_metadata?.name || 'Administrador',
            avatar_url: data.user.user_metadata?.avatar_url || '',
            role: 'admin',
            login_type: 'administrative'
          }
        };

        window.dispatchEvent(new CustomEvent('admin-login', { 
          detail: adminUser 
        }));
      }
    } catch (err) {
      setError('Error inesperado al intentar iniciar sesión');
      console.error('Admin login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetToSelection = () => {
    setLoginMode('selection');
    setError(null);
    setAcademicCredentials({ codigo: '', password: '' });
    setAdminCredentials({ username: '', password: '' });
    setCaptchaInput('');
  };

  // Pantalla de selección de tipo de usuario
  if (loginMode === 'selection') {
    return (
      <div className="login-container">
        <div className="login-wrapper">
          {/* Logo y título */}
          <div className="login-header">
            <div className="login-logo login-logo-blue">
              <GraduationCap className="login-logo-icon" />
            </div>
            <h1 className="login-title">IntegraUPT</h1>
            <p className="login-subtitle">PREGRADO</p>
            <p className="login-description">Selecciona tu tipo de acceso</p>
          </div>

          {/* Tarjeta de selección */}
          <div className="login-card">
            <div className="login-buttons">
              <button 
                onClick={() => setLoginMode('academic')}
                className="login-btn login-btn-academic"
              >
                <GraduationCap className="login-btn-icon" />
                <span>Acceso Académico</span>
                <ChevronRight className="login-btn-arrow" />
              </button>
              
              <button 
                onClick={() => setLoginMode('administrative')}
                className="login-btn login-btn-admin"
              >
                <User className="login-btn-icon" />
                <span>Acceso Administrativo</span>
                <ChevronRight className="login-btn-arrow" />
              </button>
            </div>

            {/* Error message */}
            {error && (
              <div className="login-error">
                {error}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="login-footer">
            <p>Universidad Privada de Tacna</p>
            <p className="login-footer-sub">Sistema Integrado de Gestión Académica</p>
          </div>
        </div>
      </div>
    );
  }

  // Pantalla de login académico (código/contraseña + captcha)
  if (loginMode === 'academic') {
    return (
      <div className="login-container">
        <div className="login-wrapper">
          {/* Logo y título */}
          <div className="login-header">
            <div className="login-logo login-logo-blue">
              <GraduationCap className="login-logo-icon" />
            </div>
            <h1 className="login-title">IntegraUPT</h1>
            <p className="login-subtitle">ACCESO ACADÉMICO</p>
            <p className="login-description">Estudiantes y docentes</p>
          </div>

          {/* Tarjeta de login académico */}
          <div className="login-card">
            <button
              onClick={resetToSelection}
              className="login-back-btn"
            >
              <ArrowLeft className="login-back-icon" />
              Volver
            </button>

            <form onSubmit={handleAcademicLogin} className="login-form">
              <div className="login-form-group">
                <label htmlFor="codigo" className="login-label">
                  Código de estudiante
                </label>
                <div className="login-input-wrapper">
                  <KeyRound className="login-input-icon" />
                  <input
                    id="codigo"
                    type="text"
                    value={academicCredentials.codigo}
                    onChange={(e) => setAcademicCredentials(prev => ({ ...prev, codigo: e.target.value }))}
                    className="login-input"
                    placeholder="Ej: 2023077282"
                    required
                  />
                </div>
              </div>

              <div className="login-form-group">
                <label htmlFor="password-academic" className="login-label">
                  Contraseña
                </label>
                <div className="login-input-wrapper">
                  <Lock className="login-input-icon" />
                  <input
                    id="password-academic"
                    type="password"
                    value={academicCredentials.password}
                    onChange={(e) => setAcademicCredentials(prev => ({ ...prev, password: e.target.value }))}
                    className="login-input"
                    placeholder="Ingresa tu contraseña"
                    required
                  />
                </div>
              </div>

              {/* CAPTCHA */}
              <div className="login-form-group">
                <label className="login-label">
                  Código de verificación
                </label>
                <div className="login-captcha-container">
                  <div className="login-captcha-display">
                    {captcha}
                  </div>
                  <button
                    type="button"
                    onClick={refreshCaptcha}
                    className="login-captcha-refresh"
                    title="Generar nuevo código"
                  >
                    <RefreshCw className="login-captcha-icon" />
                  </button>
                </div>
                <input
                  type="text"
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  className="login-input"
                  placeholder="Ingresa el código de verificación"
                  maxLength={4}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="login-submit-btn login-submit-academic"
              >
                {loading ? (
                  <div className="login-loading">
                    <div className="login-spinner"></div>
                    <span>Iniciando sesión...</span>
                  </div>
                ) : (
                  'Iniciar Sesión'
                )}
              </button>
            </form>

            {/* Error message */}
            {error && (
              <div className="login-error">
                {error}
              </div>
            )}

            <div className="login-test-credentials">
              <strong>Credenciales de prueba:</strong><br />
              Código: 2023077282<br />
              Contraseña: 123456
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Pantalla de login administrativo (usuario/contraseña)
  if (loginMode === 'administrative') {
    return (
      <div className="login-container">
        <div className="login-wrapper">
          {/* Logo y título */}
          <div className="login-header">
            <div className="login-logo login-logo-gray">
              <User className="login-logo-icon" />
            </div>
            <h1 className="login-title login-title-gray">IntegraUPT</h1>
            <p className="login-subtitle login-subtitle-gray">ACCESO ADMINISTRATIVO</p>
            <p className="login-description">Panel de administración</p>
          </div>

          {/* Tarjeta de login administrativo */}
          <div className="login-card">
            <button
              onClick={resetToSelection}
              className="login-back-btn"
            >
              <ArrowLeft className="login-back-icon" />
              Volver
            </button>

            <form onSubmit={handleAdminLogin} className="login-form">
              <div className="login-form-group">
                <label htmlFor="username" className="login-label">
                  Usuario
                </label>
                <div className="login-input-wrapper">
                  <User className="login-input-icon" />
                  <input
                    id="username"
                    type="text"
                    value={adminCredentials.username}
                    onChange={(e) => setAdminCredentials(prev => ({ ...prev, username: e.target.value }))}
                    className="login-input"
                    placeholder="Ingresa tu usuario"
                    required
                  />
                </div>
              </div>

              <div className="login-form-group">
                <label htmlFor="password" className="login-label">
                  Contraseña
                </label>
                <div className="login-input-wrapper">
                  <Lock className="login-input-icon" />
                  <input
                    id="password"
                    type="password"
                    value={adminCredentials.password}
                    onChange={(e) => setAdminCredentials(prev => ({ ...prev, password: e.target.value }))}
                    className="login-input"
                    placeholder="Ingresa tu contraseña"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="login-submit-btn login-submit-admin"
              >
                {loading ? (
                  <div className="login-loading">
                    <div className="login-spinner"></div>
                    <span>Iniciando sesión...</span>
                  </div>
                ) : (
                  'Iniciar Sesión'
                )}
              </button>
            </form>

            {/* Error message */}
            {error && (
              <div className="login-error">
                {error}
              </div>
            )}

            <div className="login-test-credentials login-test-admin">
              <strong>Credenciales de prueba:</strong><br />
              Usuario: admin<br />
              Contraseña: admin
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};