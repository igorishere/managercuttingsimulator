import { createContext } from 'react';

export interface User {
  username: string;
}

export interface UserContextType {
  user: User | null;
  login: (username: string, password: string) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType>({
  user: null,
  login: () => {},
  logout: () => {},
});

export default UserContext;
