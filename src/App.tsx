import { useState, useEffect } from 'react';
import { supabase } from './utils/supabase/client';
import { LoginScreen } from './components/LoginScreen';
import { Dashboard } from './components/Dashboard';
import './styles/App.css';

interface UserMetadata {
    name: string;
    avatar_url: string;
    role?: string;
    login_type?: string;
}

interface User {
    id: string;
    email: string;
    user_metadata: UserMetadata;
}

function App() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkSession = async () => {
            // Verificar sesión admin local
            const adminSession = localStorage.getItem('admin_session');
            if (adminSession) {
                try {
                    const adminUser = JSON.parse(adminSession) as User;
                    setUser(adminUser);
                    setLoading(false);
                    return;
                } catch {
                    localStorage.removeItem('admin_session');
                }
            }

            // Verificar sesión Supabase
            const {
                data: { session },
            } = await supabase.auth.getSession();

            const supabaseUser: User | null = session?.user
                ? {
                    id: session.user.id,
                    email: session.user.email ?? '', // Forzar string
                    user_metadata: session.user.user_metadata,
                }
                : null;

            setUser(supabaseUser);
            setLoading(false);
        };

        checkSession();

        // Escuchar cambios de autenticación
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                const supabaseUser: User | null = session?.user
                    ? {
                        id: session.user.id,
                        email: session.user.email ?? '',
                        user_metadata: session.user.user_metadata,
                    }
                    : null;

                setUser(supabaseUser);
                setLoading(false);
            }
        );

        // Escuchar login admin personalizado
        const handleAdminLogin = (event: Event) => {
            const customEvent = event as CustomEvent<User>;
            const adminUser = customEvent.detail;
            localStorage.setItem('admin_session', JSON.stringify(adminUser));
            setUser(adminUser);
        };

        window.addEventListener('admin-login', handleAdminLogin);

        return () => {
            subscription.unsubscribe();
            window.removeEventListener('admin-login', handleAdminLogin);
        };
    }, []);

    if (loading) {
        return (
            <div className="app-loading-container">
                <div className="app-loading-spinner"></div>
            </div>
        );
    }

    return <div className="app-container">{user ? <Dashboard user={user} /> : <LoginScreen />}</div>;
}

export default App;
