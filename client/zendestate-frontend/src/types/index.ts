// src/types/index.ts

export interface User {
    username: string;
    email: string;
    role: string;
    password: string;
  }
  
  export interface LoginRequest {
    username: string;
    password: string;
  }
  
  export interface TokenResponse {
    access_token: string;
    token_type: string;
  }
  
  export interface UserResponse {
    username: string;
    email: string;
    role: string;
  }
  
  export interface AuthFormProps {
    type: 'login' | 'register';
  }