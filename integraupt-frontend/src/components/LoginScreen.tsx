import {type FormEvent, useState } from 'react';
import {
    ArrowLeft,
    CheckCircle2,
    ChevronRight,
    GraduationCap,
    KeyRound,
    Lock,
    LogOut,
    User,
} from 'lucide-react';
import '../styles/LoginScreen.css';

type LoginMode = 'selection' | 'academic' | 'administrative';

interface LoginSuccessResponse {
    message?: string;
    userId: number;
}

interface AuthenticatedUser {
    email: string;
    userId: number;
    message: string;
}

const STATIC_CAPTCHA = '4721';
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'http://localhost:8080';

export function LoginScreen(): JSX.Element {
    const [loginMode, setLoginMode] = useState<LoginMode>('selection');
    const [academicCredentials, setAcademicCredentials] = useState({
        email: '',
        password: '',
        verification: '',
    });
    const [administrativeCredentials, setAdministrativeCredentials] = useState({
        email: '',
        password: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [authenticatedUser, setAuthenticatedUser] = useState<AuthenticatedUser | null>(null);

    const resetForms = () => {
        setAcademicCredentials({ email: '', password: '', verification: '' });
        setAdministrativeCredentials({ email: '', password: '' });
    };

    const changeMode = (mode: LoginMode) => {
        setError(null);
        setLoginMode(mode);
    };

    const authenticate = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const rawBody = await response.text();
            let payload: unknown = null;

            if (rawBody) {
                try {
                    payload = JSON.parse(rawBody);
                } catch {
                    payload = null;
                }
            }

            if (!response.ok) {
                const details = payload as { message?: string; error?: string } | null;
                const message =
                    details?.message ?? details?.error ?? 'Error al iniciar sesión. Verifica tus credenciales.';
                throw new Error(message);
            }

            if (
                typeof payload !== 'object' ||
                payload === null ||
                typeof (payload as { userId?: unknown }).userId !== 'number'
            ) {
                throw new Error('Respuesta del servidor no válida.');
            }

            const data = payload as LoginSuccessResponse;
            const message = data.message ?? 'Inicio de sesión exitoso.';
            setAuthenticatedUser({ email, userId: data.userId, message });
            resetForms();
            setLoginMode('selection');
            setError(null);
        } catch (authError) {
            if (authError instanceof Error) {
                setError(authError.message);
            } else {
                setError('Error inesperado al iniciar sesión.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleAcademicSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);

        if (academicCredentials.verification !== STATIC_CAPTCHA) {
            setError('El código de verificación no es correcto.');
            return;
        }

        await authenticate(academicCredentials.email, academicCredentials.password);
    };

    const handleAdministrativeSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        await authenticate(administrativeCredentials.email, administrativeCredentials.password);
    };

    const handleLogout = () => {
        setAuthenticatedUser(null);
        setLoginMode('selection');
        setError(null);
    };

    // Si el usuario está autenticado
    if (authenticatedUser) {
        return (
            <div className="login-container">
                <div className="login-wrapper">
                    <div className="login-header">
                        <div className="login-logo login-logo-blue">
                            <CheckCircle2 className="login-logo-icon" />
                        </div>
                        <h1 className="login-title">Bienvenido</h1>
                        <p className="login-description">{authenticatedUser.message}</p>
                    </div>
                    <div className="login-card login-success-card">
                        <p className="login-success-highlight">{authenticatedUser.email}</p>
                        <p className="login-success-text">
                            Tu sesión está activa. Puedes continuar con la plataforma o cerrar sesión para volver al inicio.
                        </p>
                        <button type="button" className="login-success-btn" onClick={handleLogout}>
                            <LogOut className="login-success-btn-icon" /> Cerrar sesión
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Selección de tipo de acceso
    if (loginMode === 'selection') {
        return (
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
                            <button onClick={() => changeMode('academic')} className="login-btn login-btn-academic">
                                <GraduationCap className="login-btn-icon" />
                                <span>Acceso Académico</span>
                                <ChevronRight className="login-btn-arrow" />
                            </button>
                            <button onClick={() => changeMode('administrative')} className="login-btn login-btn-admin">
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
    }

    // Acceso académico
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
                        <button onClick={() => changeMode('selection')} className="login-back-btn">
                            <ArrowLeft className="login-back-icon" /> Volver
                        </button>
                        {error && <div className="login-error">{error}</div>}

                        <form onSubmit={handleAcademicSubmit} className="login-form">
                            <div className="login-form-group">
                                <label htmlFor="academic-email" className="login-label">
                                    Correo institucional
                                </label>
                                <div className="login-input-wrapper">
                                    <KeyRound className="login-input-icon" />
                                    <input
                                        id="academic-email"
                                        type="email"
                                        className="login-input"
                                        placeholder="Ej: usuario@upt.pe"
                                        value={academicCredentials.email}
                                        onChange={(event) =>
                                            setAcademicCredentials((prev) => ({
                                                ...prev,
                                                email: event.target.value,
                                            }))
                                        }
                                        required
                                    />
                                </div>
                            </div>

                            <div className="login-form-group">
                                <label htmlFor="academic-password" className="login-label">
                                    Contraseña
                                </label>
                                <div className="login-input-wrapper">
                                    <Lock className="login-input-icon" />
                                    <input
                                        id="academic-password"
                                        type="password"
                                        className="login-input"
                                        placeholder="Ingresa tu contraseña"
                                        value={academicCredentials.password}
                                        onChange={(event) =>
                                            setAcademicCredentials((prev) => ({
                                                ...prev,
                                                password: event.target.value,
                                            }))
                                        }
                                        required
                                    />
                                </div>
                            </div>

                            <div className="login-form-group">
                                <label htmlFor="academic-verification" className="login-label">
                                    Código de verificación
                                </label>
                                <div className="login-input-wrapper">
                                    <input
                                        id="academic-verification"
                                        type="text"
                                        className="login-input"
                                        placeholder="Ingresa el código mostrado"
                                        value={academicCredentials.verification}
                                        onChange={(event) =>
                                            setAcademicCredentials((prev) => ({
                                                ...prev,
                                                verification: event.target.value,
                                            }))
                                        }
                                        required
                                    />
                                    <span className="login-captcha">{STATIC_CAPTCHA}</span>
                                </div>
                            </div>

                            <button type="submit" className="login-submit-btn login-submit-academic" disabled={isLoading}>
                                {isLoading ? (
                                    <span className="login-loading">
                                        <span className="login-spinner" /> Verificando...
                                    </span>
                                ) : (
                                    'Iniciar Sesión'
                                )}
                            </button>
                        </form>

                        <div className="login-test-credentials">
                            <strong>Credenciales de prueba:</strong>
                            <br />
                            Correo: demo@integraupt.pe
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
                    <button onClick={() => changeMode('selection')} className="login-back-btn">
                        <ArrowLeft className="login-back-icon" /> Volver
                    </button>
                    {error && <div className="login-error">{error}</div>}

                    <form onSubmit={handleAdministrativeSubmit} className="login-form">
                        <div className="login-form-group">
                            <label htmlFor="admin-email" className="login-label">
                                Correo electrónico
                            </label>
                            <div className="login-input-wrapper">
                                <User className="login-input-icon" />
                                <input
                                    id="admin-email"
                                    type="email"
                                    className="login-input"
                                    placeholder="Ingresa tu correo"
                                    value={administrativeCredentials.email}
                                    onChange={(event) =>
                                        setAdministrativeCredentials((prev) => ({
                                            ...prev,
                                            email: event.target.value,
                                        }))
                                    }
                                    required
                                />
                            </div>
                        </div>

                        <div className="login-form-group">
                            <label htmlFor="admin-password" className="login-label">
                                Contraseña
                            </label>
                            <div className="login-input-wrapper">
                                <Lock className="login-input-icon" />
                                <input
                                    id="admin-password"
                                    type="password"
                                    className="login-input"
                                    placeholder="Ingresa tu contraseña"
                                    value={administrativeCredentials.password}
                                    onChange={(event) =>
                                        setAdministrativeCredentials((prev) => ({
                                            ...prev,
                                            password: event.target.value,
                                        }))
                                    }
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className="login-submit-btn login-submit-admin" disabled={isLoading}>
                            {isLoading ? (
                                <span className="login-loading">
                                    <span className="login-spinner" /> Verificando...
                                </span>
                            ) : (
                                'Iniciar Sesión'
                            )}
                        </button>
                    </form>

                    <div className="login-test-credentials login-test-admin">
                        <strong>Credenciales de prueba:</strong>
                        <br />
                        Correo: admin@integraupt.pe
                        <br />
                        Contraseña: admin
                    </div>
                </div>
            </div>
        </div>
    );
}
