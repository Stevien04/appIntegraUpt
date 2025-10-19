import { useState } from 'react';
import './styles/App.css';
import { LoginScreen } from './components/LoginScreen';
import { Dashboard } from './components/Dashboard';

export interface AuthenticatedUser {
    email: string;
    userId: number;
}

function App() {
    const [user, setUser] = useState<AuthenticatedUser | null>(null);

    const handleLogout = () => {
        setUser(null);
    };

    return (
        <div className="app-container">
            {user ? <Dashboard user={user} onLogout={handleLogout} /> : <LoginScreen onLoginSuccess={setUser} />}
        </div>
    );
}

export default App;