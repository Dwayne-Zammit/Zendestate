import React from 'react';
import checkIfUserIsLoggedIn from '../../hooks/authentication/Auth';
import { useNavigate } from 'react-router-dom';
import StarsBackground from '../../components/background/StarsBackground'; 
import IphoneDisplayCallNumber from '../../components/assistedDialer/IphoneDisplayCallNumber';
import '../../styles/assisted_dialer/assistedDialer.css'; 
import { FaSquarePhone } from "react-icons/fa6";
import { IoIosArrowForward } from "react-icons/io";

const AssistedDialerPage: React.FC = () => {
  const { user, loading: userLoading } = checkIfUserIsLoggedIn();
  const navigate = useNavigate();

  if (userLoading) {
    return (
      <div>
        <div className="LoadingScreen">
          Loading...
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="pageContainer">
      <StarsBackground />
      <div className="dialerPageBodyContainer">
        <IphoneDisplayCallNumber />
        <div className="poolOptionsContainer">
          <h2>
            <FaSquarePhone /> Select a pool to start dialing
          </h2>
          <div className="poolOptions">
            <button className="optionButton" onClick={() => navigate('/numberGenerator')}>
              <IoIosArrowForward /> Number Generator
            </button>
            <button className="optionButton" onClick={() => navigate('/userNumbers')}>
              <IoIosArrowForward /> User's Numbers
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssistedDialerPage;
