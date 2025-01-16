import { User, LoginRequest, TokenResponse } from '../../types';
import axios from 'axios';

const API_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export const ensureUserIsLoggedIn = async (): Promise<any> => {
  try {
    const response = await api.get('/users/me');
    return response.data;
  } catch (error) {
    throw new Error('Unauthorized');
  }
};

// Register a new user
export const registerUser = async (user: User) => {
    const response = await api.post('/users/register', user);
    return response.data;
  };
  
// Login a user and set HttpOnly cookie
export const loginUser = async (loginData: LoginRequest): Promise<TokenResponse> => {
    try {
      const response = await api.post<TokenResponse>('/auth/login', loginData);
      return response.data;  // No need to store the token in localStorage as it is in the cookie
    } catch (error) {
      throw new Error('Login failed');
    }
};