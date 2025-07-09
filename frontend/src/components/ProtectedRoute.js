// src/components/ProtectedRoute.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredUserType = null }) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthentication = () => {
      const userData = sessionStorage.getItem('userData');
      
      if (!userData) {
        // No user data found, redirect to login
        navigate('/login');
        return;
      }

      try {
        const user = JSON.parse(userData);
        
        // Check if specific user type is required
        if (requiredUserType && user.user_type !== requiredUserType) {
          // User doesn't have required permissions
          if (user.user_type === 'admin') {
            navigate('/admin-dashboard');
          } else {
            navigate('/dashboard');
          }
          return;
        }

        // User is authorized
        setIsAuthorized(true);
      } catch (error) {
        console.error('Error parsing user data:', error);
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthentication();
  }, [navigate, requiredUserType]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return isAuthorized ? children : null;
};

export default ProtectedRoute;