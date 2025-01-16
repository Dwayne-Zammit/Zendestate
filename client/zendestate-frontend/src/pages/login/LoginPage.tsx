import React from 'react';
import AuthForm from '../../components/login/AuthForm';
import '../../styles/login/login.css';

const LoginPage: React.FC = () => {
  return (
    <div className='loginContainer'>
      <AuthForm type="login" />
    </div>
  );
};

export default LoginPage;
