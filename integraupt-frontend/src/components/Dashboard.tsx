import type { AuthenticatedUser } from '../App'
import '../styles/Dashboard.css'

interface DashboardProps {
    user: AuthenticatedUser
    onLogout: () => void
}
export function Dashboard({ user, onLogout }: DashboardProps) {
    return (
        <div className="dashboard-container">
            <div className="dashboard-card">
                <h1 className="dashboard-title">Bienvenido</h1>
                <p className="dashboard-subtitle">
                    Sesión iniciada como <span className="dashboard-highlight">{user.email}</span>.
                </p>
                <p className="dashboard-message">
                El frontend ahora consume directamente los servicios del backend de IntegraUPT.
                Utilice el menú lateral o continúe construyendo los módulos necesarios sobre esta base.
            </p>
}