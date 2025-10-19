type LoginMode = 'selection' | 'academic' | 'administrative';

interface LoginSuccessResponse {
    message: string;
    userId: number;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
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

            let payload: LoginSuccessResponse | { message?: string; error?: string } | null = null;
            try {
                payload = (await response.json()) as LoginSuccessResponse | { message?: string; error?: string };
            } catch (parseError) {
                payload = null;
            }

            if (!response.ok) {
                const details = payload as { message?: string; error?: string } | null;
                const message = details?.message ?? details?.error ?? 'Error al iniciar sesión. Verifica tus credenciales.';
                throw new Error(message);
            }

            if (!payload || typeof (payload as LoginSuccessResponse).userId !== 'number') {
                throw new Error('Respuesta del servidor no válida.');
            }

            const data = payload as LoginSuccessResponse;
            onLoginSuccess({ email, userId: data.userId });
            setAcademicCredentials({ email: '', password: '', verification: '' });
            setAdministrativeCredentials({ email: '', password: '' });
            setLoginMode('selection');
        } catch (authError) {
            if (authError instanceof Error) {
                setError(authError.message);
            } else {
                setError('Error inesperado al iniciar sesión');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleAcademicSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);

        if (academicCredentials.verification !== STATIC_CAPTCHA) {
            setError('El código de verificación no es correcto.');
            return;
        }

        await authenticate(academicCredentials.email, academicCredentials.password);
    };

    const handleAdministrativeSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        await authenticate(administrativeCredentials.email, administrativeCredentials.password);
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
                        <button onClick={() => changeMode('selection')} className="login-back-btn">
                            <ArrowLeft className="login-back-icon" /> Volver
                        </button>{error && <div className="login-error">{error}</div>}

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
                                <label htmlFor="password-academic" className="login-label">
                                    Contraseña
                                </label>
                                <div className="login-input-wrapper">
                                    <Lock className="login-input-icon" />
                                    <input
                                        id="password-academic"
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
                                <label className="login-label">Código de verificación</label>
                                <div className="login-captcha-container">
                                    <div className="login-captcha-display">{STATIC_CAPTCHA}</div>
                                    <button type="button" className="login-captcha-refresh" disabled>
                                        <RefreshCw className="login-captcha-icon" />
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    className="login-input"
                                    placeholder="Ingresa el código de verificación"
                                    maxLength={4}
                                    value={academicCredentials.verification}
                                    onChange={(event) =>
                                        setAcademicCredentials((prev) => ({
                                            ...prev,
                                            verification: event.target.value,
                                        }))
                                    }
                                    required
                                />
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
                        <div className="login-form-group"><label htmlFor="admin-email" className="login-label">
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
};