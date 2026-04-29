import { StoreProvider, useStore } from './lib/store';
import { UserRole } from './types';
import LoginScreen from './components/LoginScreen';
import BlockingScreen from './components/BlockingScreen';
import SuperAdminDashboard from './components/roles/SuperAdminDashboard';
import AdminDashboard from './components/roles/AdminDashboard';
import EmployeeDashboard from './components/roles/EmployeeDashboard';
import ClientDashboard from './components/roles/ClientDashboard';

function Navigation() {
  const { user, config } = useStore();

  if (!user) {
    return <LoginScreen />;
  }

  // Blocking logic: If blocked, non-clients see blocking screen
  if (config.status === 'bloqueado' && user.tipo !== UserRole.CLIENT) {
    return <BlockingScreen />;
  }

  switch (user.tipo) {
    case UserRole.SUPER_ADMIN:
      return <SuperAdminDashboard />;
    case UserRole.ADMIN:
      return <AdminDashboard />;
    case UserRole.EMPLOYEE:
      return <EmployeeDashboard />;
    case UserRole.CLIENT:
      return <ClientDashboard />;
    default:
      return <LoginScreen />;
  }
}

export default function App() {
  return (
    <StoreProvider>
      <div className="min-h-screen bg-background font-sans antialiased text-foreground selection:bg-primary selection:text-primary-foreground">
        <Navigation />
      </div>
    </StoreProvider>
  );
}
