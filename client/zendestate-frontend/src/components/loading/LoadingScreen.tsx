import React from 'react';

const LoadingScreen: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div className="LoadingScreen">
      {message}
      <div className="spinner"></div>
    </div>
  );
};

export default LoadingScreen;
