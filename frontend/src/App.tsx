import { useState, useEffect } from 'react';
import { EmployeePage } from './pages/Employee';
import { LoginPage } from './pages/Login';
import { Signup } from './pages/Signup';
import { ToastProvider } from './components/ToastProvider';

// Main App Component
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(true);

  // Check if user is already logged in on app load
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // const handleLoginSuccess = (userData: any) => {
  //   setUser(userData.user || userData);
  //   setIsAuthenticated(true);
  // };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    setIsAuthenticated(false);
  };

  if (isAuthenticated) {
    return (
      <ToastProvider>
        <EmployeePage onLogout={handleLogout} />
      </ToastProvider>
    );
  }

  return (
    <ToastProvider>
      {showLogin ? (
        <LoginPage onToggleToSignup={() => setShowLogin(false)} />
      ) : (
        <Signup onToggleToLogin={() => setShowLogin(true)} />
      )}
    </ToastProvider>
  );
}

export default App;
