import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/context/ThemeContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { LoginPage } from '@/pages/auth/LoginPage';
import { DashboardPage } from '@/pages/dashboard/DashboardPage';
import { ServersPage } from '@/pages/dashboard/ServersPage';
import { UsersPage } from '@/pages/dashboard/UsersPage';
import { NodesPage } from '@/pages/dashboard/NodesPage';
import { LocationsPage } from '@/pages/dashboard/LocationsPage';
import { SettingsPage } from '@/pages/dashboard/SettingsPage';
import { MinecraftDashboard } from '@/pages/minecraft/MinecraftDashboard';
import { CreateServer } from '@/pages/minecraft/CreateServer';
import { ServerConsole } from '@/pages/minecraft/ServerConsole';
import { AIPage } from '@/pages/ai/AIPage';
import { getAuthToken } from '@/api/http';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = getAuthToken();
  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
        <Routes>
          <Route path="/auth/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="servers" element={<ServersPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="nodes" element={<NodesPage />} />
            <Route path="locations" element={<LocationsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="minecraft" element={<MinecraftDashboard />} />
            <Route path="minecraft/create" element={<CreateServer />} />
            <Route path="minecraft/console/:id" element={<ServerConsole />} />
            <Route path="ai" element={<AIPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;