import React, { useState } from 'react';
import { GraduationCap, ChevronRight, ArrowLeft, User, Lock, RefreshCw, KeyRound } from 'lucide-react';
import '../styles/LoginScreen.css';

const STATIC_CAPTCHA = '4821';

export const LoginScreen: React.FC = () => {
    const [loginMode, setLoginMode] = useState<'selection' | 'academic' | 'administrative'>('selection');

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    };

    const renderSelection = () => (
        <div className="login-container">
            <div className="login-wrapper">
                <div className="login-header">
                    <div className="login-logo login-logo-blue">
                        <GraduationCap className="login-logo-icon" />
                    </div>
                    <h1 className="login-title">IntegraUPT</h1>
                    <p className="login-subtitle">PREGRADO</p>
                    <p className="login-description">Selecciona tu tipo de acceso</p>
                </div>

                <div className="login-card">
                    <div className="login-buttons">
                        <button onClick={() => setLoginMode('academic')} className="login-btn login-btn-academic">
                            <GraduationCap className="login-btn-icon" />
                            <span>Acceso Académico</span>
                            <ChevronRight className="login-btn-arrow" />
                        </button>

                        <button onClick={() => setLoginMode('administrative')} className="login-btn login-btn-admin">
                            <User className="login-btn-icon" />
                            <span>Acceso Administrativo</span>
                            <ChevronRight className="login-btn-arrow" />
                        </button>
                    </div>
                </div>

                <div className="login-footer">
                    <p>Universidad Privada de Tacna</p>
                    <p className="login-footer-sub">Sistema Integrado de Gestión Académica</p>
                </div>
            </div>
        </div>
    );

    if (loginMode === 'selection') return renderSelection();

    if (loginMode === 'academic') {
        return (
            <div className="login-container">
                <div className="login-wrapper">
                    <div className="login-header">
                        <div className="login-logo login-logo-blue">
                            <GraduationCap className="login-logo-icon" />
                        </div>
                        <h1 className="login-title">IntegraUPT</h1>
                        <p className="login-subtitle">ACCESO ACADÉMICO</p>
                        <p className="login-description">Estudiantes y docentes</p>
                    </div>

                    <div className="login-card">
                        <button onClick={() => setLoginMode('selection')} className="login-back-btn">
                            <ArrowLeft className="login-back-icon" /> Volver
                        </button>

                        <form onSubmit={handleSubmit} className="login-form">
                            <div className="login-form-group">
                                <label htmlFor="codigo" className="login-label">
                                    Código de estudiante
                                </label>
                                <div className="login-input-wrapper">
                                    <KeyRound className="login-input-icon" />
                                    <input id="codigo" type="text" className="login-input" placeholder="Ej: 2023077282" required />
                                </div>
                            </div>

                            <div className="login-form-group">
                                <label htmlFor="password-academic" className="login-label">
                                    Contraseña
                                </label>
                                <div className="login-input-wrapper">
                                    <Lock className="login-input-icon" />
                                    <input id="password-academic" type="password" className="login-input" placeholder="Ingresa tu contraseña" required />
                                </div>
                            </div>

                            <div className="login-form-group">
                                <label className="login-label">Código de verificación</label>
                                <div className="login-captcha-container">
                                    <div className="login-captcha-display">{STATIC_CAPTCHA}</div>
                                    <button type="button" className="login-captcha-refresh" disabled>
                                        <RefreshCw className="login-captcha-icon" />
                                    </button>
                                </div>
                                <input type="text" className="login-input" placeholder="Ingresa el código de verificación" maxLength={4} required />
                            </div>

                            <button type="submit" className="login-submit-btn login-submit-academic">
                                Iniciar Sesión
                            </button>
                        </form>

                        <div className="login-test-credentials">
                            <strong>Credenciales de prueba:</strong>
                            <br />
                            Código: 2023077282
                            <br />
                            Contraseña: 123456
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Acceso administrativo
    return (
        <div className="login-container">
            <div className="login-wrapper">
                <div className="login-header">
                    <div className="login-logo login-logo-gray">
                        <User className="login-logo-icon" />
                    </div>
                    <h1 className="login-title login-title-gray">IntegraUPT</h1>
                    <p className="login-subtitle login-subtitle-gray">ACCESO ADMINISTRATIVO</p>
                    <p className="login-description">Panel de administración</p>
                </div>

                <div className="login-card">
                    <button onClick={() => setLoginMode('selection')} className="login-back-btn">
                        <ArrowLeft className="login-back-icon" /> Volver
                    </button>

                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="login-form-group">
                            <label htmlFor="username" className="login-label">
                                Usuario
                            </label>
                            <div className="login-input-wrapper">
                                <User className="login-input-icon" />
                                <input id="username" type="text" className="login-input" placeholder="Ingresa tu usuario" required />
                            </div>
                        </div>

                        <div className="login-form-group">
                            <label htmlFor="password" className="login-label">
                                Contraseña
                            </label>
                            <div className="login-input-wrapper">
                                <Lock className="login-input-icon" />
                                <input id="password" type="password" className="login-input" placeholder="Ingresa tu contraseña" required />
                            </div>
                        </div>

                        <button type="submit" className="login-submit-btn login-submit-admin">
                            Iniciar Sesión
                        </button>
                    </form>

                    <div className="login-test-credentials login-test-admin">
                        <strong>Credenciales de prueba:</strong>
                        <br />
                        Usuario: admin
                        <br />
                        Contraseña: admin
                    </div>
                </div>
            </div>
        </div>
    );
};
