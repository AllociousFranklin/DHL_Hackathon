import React, { useState } from 'react';
import LoginPage from './components/LoginPage';
import OperatorDashboard from './components/OperatorDashboard';
import ReviewerDashboard from './components/ReviewerDashboard';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState('reviewer');

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return (
      <LoginPage
        role={role}
        onRoleChange={setRole}
        onLogin={() => setIsLoggedIn(true)}
      />
    );
  }

  if (role === 'operator') {
    return <OperatorDashboard onLogout={handleLogout} />;
  }

  return <ReviewerDashboard onLogout={handleLogout} />;
}
