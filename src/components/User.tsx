import { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

type UserContextType = {
  user: { username: string } | null;
  token: string | null;
  setUser: (user: { username: string } | null) => void;
  setToken: (token: string | null) => void;
};

export const UserContext = createContext<UserContextType>({
  user: null,
  token: null,
  setUser: () => {},
  setToken: () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('access_token');
    if (savedToken) {
      // Validate token by fetching user profile
      fetch('http://localhost:8000/profile', {
        headers: { Authorization: `Bearer ${savedToken}` },
      })
        .then(res => {
          if (!res.ok) throw new Error('Invalid token');
          return res.json();
        })
        .then(data => {
          setUser({ username: data.username });
          setToken(savedToken);
        })
        .catch(() => {
          localStorage.removeItem('access_token');
          setUser(null);
          setToken(null);
        });
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, token, setUser, setToken }}>
      {children}
    </UserContext.Provider>
  );
};