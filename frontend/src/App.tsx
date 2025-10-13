/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { EmployeePage } from './pages/Employee';
import { LoginPage } from './pages/Login';
// Main App Component
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

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
    setUser(null);
    setIsAuthenticated(false);
  };

  if (isAuthenticated) {
    return <EmployeePage onLogout={handleLogout} />;
  }

  return <LoginPage />;
}

export default App;
