import { useState, useEffect } from 'react';
import { EmployeePage } from './pages/Employee';
import { DepartmentPage } from './pages/Department';
import { AttendancePage } from './pages/Attendance';
import { LeaveRequestPage } from './pages/LeaveRequest';
import { LoginPage } from './pages/Login';
import { Signup } from './pages/Signup';
import { ToastProvider } from './components/ToastProvider';

type EntityPage = 'employees' | 'departments' | 'attendance' | 'leave';

// Main App Component
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [currentPage, setCurrentPage] = useState<EntityPage>('employees');

  // Check if user is already logged in on app load
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    setIsAuthenticated(false);
    setCurrentPage('employees');
  };

  if (isAuthenticated) {
    return (
      <ToastProvider>
        {currentPage === 'employees' && (
          <EmployeePage onLogout={handleLogout} onPageChange={setCurrentPage} />
        )}
        {currentPage === 'departments' && (
          <DepartmentPage onLogout={handleLogout} onPageChange={setCurrentPage} />
        )}
        {currentPage === 'attendance' && (
          <AttendancePage onLogout={handleLogout} onPageChange={setCurrentPage} />
        )}
        {currentPage === 'leave' && (
          <LeaveRequestPage onLogout={handleLogout} onPageChange={setCurrentPage} />
        )}
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
