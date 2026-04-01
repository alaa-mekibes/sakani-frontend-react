import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider } from '@tanstack/react-router';
import router from './router';
import { AuthProvider, useAuth } from './context/AuthContext';


const App = () => {
  const { user, isAuthenticated } = useAuth();

  return (
    <RouterProvider
      router={router}
      context={{ user, isAuthenticated }}
    />
  );
};

createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);