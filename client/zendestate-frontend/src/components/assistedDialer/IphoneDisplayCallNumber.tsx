import React, { useState, useEffect } from 'react';
import { IoCall } from "react-icons/io5";
import { IoIosBackspace } from "react-icons/io";
import { FaSignal } from "react-icons/fa";
import { IoIosWifi, IoIosBatteryFull } from "react-icons/io";
import { IoIosStar } from "react-icons/io";
import { LuClock9 } from "react-icons/lu";
import { IoMdContact } from "react-icons/io";
import { IoIosKeypad } from "react-icons/io";
import { PiVoicemail } from "react-icons/pi";


const IphoneDisplayCallNumber: React.FC = () => {
  const [number, setNumber] = useState<string>(''); 
  const [currentTime, setCurrentTime] = useState<string>(''); 
  const [clearTimer, setClearTimer] = useState<NodeJS.Timeout | null>(null); 

  const keypadMapping: { [key: string]: string } = {
    1: '', 2: 'ABC', 3: 'DEF', 4: 'GHI', 5: 'JKL', 6: 'MNO',
    7: 'PQRS', 8: 'TUV', 9: 'WXYZ', 0: '', '*': '', '#': ''
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const date = new Date();
      const hours = date.getHours().toString().padStart(2, '0'); 
      const minutes = date.getMinutes().toString().padStart(2, '0'); 
      setCurrentTime(`${hours}:${minutes}`);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleButtonClick = (value: string) => setNumber((prev) => prev + value);

  const handleClear = () => setNumber('');

  const startClearing = () => {
    if (!clearTimer) {
      const timer = setInterval(() => setNumber(prev => prev.slice(0, -1)), 50);
      setClearTimer(timer);
    }
  };

  const stopClearing = () => {
    if (clearTimer) {
      clearInterval(clearTimer);
      setClearTimer(null);
    }
  };

  return (
    <div className="iphoneContainer">
      <div className="iphoneTopBar">
        <span className="time">{currentTime}</span>
        <div className="statusIcons">
          <span className="signal"><FaSignal /></span>
          <span className="wifi"><IoIosWifi /></span>
          <span className="battery"><IoIosBatteryFull /></span>
        </div>
      </div>
      <div className="iphoneDialerScreen">
        <div className="dialerContainer">
          <div className="display">
            <p className="displayNumberText">{number || "\u00A0"}</p>
          </div>
          <div className="keypad">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                className="dialButton"
                onClick={() => handleButtonClick(num.toString())}
              >
                <div className="buttonContent">
                  <span className="buttonNumber">{num}</span>
                  {keypadMapping[num.toString()] && (
                    <span className="keypadLetters">{keypadMapping[num.toString()]}</span>
                  )}
                </div>
              </button>
            ))}
          </div>
          <div className="bottomKeypadRow">
            {['*', 0, '#'].map((key) => (
              <button key={key} className="dialButton" onClick={() => handleButtonClick(key.toString())}>
                {key}
              </button>
            ))}
          </div>
          <div className="callNowClearContainer">
            <button className="callNowButton">
              <IoCall />
            </button>
            <button
              className="clearButton"
              onClick={handleClear}
              onMouseDown={startClearing}
              onMouseUp={stopClearing}
              onMouseLeave={stopClearing}
            >
              <IoIosBackspace />
            </button>
          </div>
        </div>
        <div className='bottomCallNavbar'>
              <div className='bottomCallNavbarOptionContainer'>
                <IoIosStar size={20}/>
                <p className='bottomDialerOptionsText'>Favourites</p>
              </div>
              <div className='bottomCallNavbarOptionContainer'>
                <LuClock9 size={20}/>
                <p className='bottomDialerOptionsText'>Recents</p>
              </div>
              <div className='bottomCallNavbarOptionContainer'>
                <IoMdContact size={20}/>
                <p className='bottomDialerOptionsText'>Contacts</p>
              </div>
              <div className='bottomCallNavbarOptionContainer'>
                <IoIosKeypad size={20}/>
                <p className='bottomDialerOptionsText'>Keypad</p>
              </div>
              <div className='bottomCallNavbarOptionContainer'>
                <PiVoicemail size={20}/>
                <p className='bottomDialerOptionsText'>Voicemail</p>
              </div>
            </div>
            <div className="bottomIosMenuButton"></div>
          </div>
        </div>
  );
};

export default IphoneDisplayCallNumber;
