import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

export const usePortfolioData = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isLoaded } = useUser();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) return;

      try {
        const res = await fetch(`/api/users/${user.id}`);
        const data = await res.json();
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load portfolio data');
      } finally {
        setLoading(false);
      }
    };

    if (isLoaded) {
      fetchUserData();
    }
  }, [user?.id, isLoaded]);

  return { userData, loading, error };
};