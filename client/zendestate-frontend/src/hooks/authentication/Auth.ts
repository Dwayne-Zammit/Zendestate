// src/hooks/authentication/checkIfUserIsAuthenticated.ts
import { useState, useEffect } from 'react';
import { ensureUserIsLoggedIn } from '../../services/authentication/authentication';

const checkIfUserIsLoggedIn = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await ensureUserIsLoggedIn();
        setUser(userData);
      } catch (err) {
        setError('Unauthorized');
        window.location.href = '/login'; // Redirect if unauthorized
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, loading, error };
};

export default checkIfUserIsLoggedIn;
