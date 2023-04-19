import { useState } from 'react';
import UserContext,{User} from './UserContext';

function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (username: string, password: string) => {
    // Simulação de uma requisição de login
    if (username === 'usuario' && password === '1234') {
      setUser({ username: 'usuario' });
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export default UserProvider;
