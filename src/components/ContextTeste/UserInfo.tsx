import { useContext } from 'react';
import UserContext ,{UserContextType}from './UserContext';

function UserInfo() {
  const { user } = useContext<UserContextType>(UserContext);

  return (
    <div>
      {user ? (
        <p>Usuário logado: {user.username}</p>
      ) : (
        <p>Nenhum usuário logado</p>
      )}
    </div>
  );
}

export default UserInfo;
