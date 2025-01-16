import React, { useState } from 'react';
import { User, LoginRequest, AuthFormProps } from '../../types';
import { registerUser, loginUser } from '../../services/authentication/authentication';
import { useNavigate } from 'react-router-dom';


const AuthForm: React.FC<AuthFormProps> = ({ type }) => {
  const navigate = useNavigate(); // Hook for navigation after successful login

  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [role, setRole] = useState<string>('user');
  const [message, setMessage] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(''); // Clear previous messages

    if (type === 'register') {
      const newUser: User = { username, email, password, role };
      try {
        const response = await registerUser(newUser);
        setMessage(response.message);
      } catch (error) {
        setMessage('Error registering user');
      }
    } else {
      const loginData: LoginRequest = { username, password };
      try {
        await loginUser(loginData); // Call the login function
        navigate('/dashboard'); // Redirect after login
      } catch (error) {
        setMessage('Invalid username or password');
      }
    }
  };

  return (
    <div>
      <h2 className='title'>{type === 'register' ? 'Register' : 'Login'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        {type === 'register' && (
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        )}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {type === 'register' && (
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        )}
        <button type="submit">{type === 'register' ? 'Register' : 'Login'}</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AuthForm;
