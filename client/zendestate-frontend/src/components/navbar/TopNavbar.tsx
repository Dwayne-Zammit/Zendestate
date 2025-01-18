import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation from react-router-dom
import '../../styles/navbar/topNavbar.css';

const TopNavbar: React.FC = () => {
  const location = useLocation();  // Get the current location/path
  const [time, setTime] = useState(0);  // Store time in seconds
  const [isRunning, setIsRunning] = useState(false);  // State to control timer
  const [error, setError] = useState<string | null>(null);  // State to store error message
  const [existingShift, setExistingShift] = useState<boolean>(false);  // State to check if there is an existing shift
  const [activeLink, setActiveLink] = useState<string>('dashboard');

  // Fetch existing shift data when the component mounts
  useEffect(() => {
    // Only check for existing shift if on the specific routes
    if (['/dashboard', '/opportunities', '/assistedDialer', '/reports', '/settings'].includes(location.pathname)) {
      checkForExistingShift();  // Check for existing shift
    }

    // Set active link based on the current route
    const path = location.pathname;
    if (path.includes('/dashboard')) setActiveLink('dashboard');
    else if (path.includes('/opportunities')) setActiveLink('opportunities');
    else if (path.includes('/assistedDialer')) setActiveLink('assistedDialer');
    else if (path.includes('/reports')) setActiveLink('reports');
    else if (path.includes('/settings')) setActiveLink('settings');
  }, [location]);  // Run the effect when the location changes

  const checkForExistingShift = async () => {
    try {
      const response = await fetch('http://localhost:8000/punch_clock/check_for_unterminated_shift', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // This ensures cookies are sent
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to check for active shift');
      }

      const data = await response.json();

      if (data.elapsed_time) {
        const [hours, minutes, seconds] = data.elapsed_time.split(':').map(Number);
        setTime(hours * 3600 + minutes * 60 + seconds);  // Convert elapsed time to seconds
        setIsRunning(true);  // Start the timer since there's an existing active shift
        setExistingShift(true);  // Mark that there's an active shift
      }
    } catch (error) {
        if (!error.message.includes("No active shift found.")) {
            setError(error instanceof Error ? error.message : 'An error occurred');
        }
        
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isRunning) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime + 1);  // Update time every second
      }, 1000);
    } else if (timer) {
      clearInterval(timer);  // Clear interval when timer stops
    }
    return () => {
      if (timer) clearInterval(timer);  // Cleanup on component unmount
    };
  }, [isRunning]);

  const handleStart = async () => {
    try {
      // Post request to backend to start the shift
      const response = await fetch('http://localhost:8000/punch_clock/start_shift', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // This ensures cookies are sent
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to start shift');
      }

      // If successful, start the timer
      setIsRunning(true);
      setError(null); // Clear any previous error
      setExistingShift(false);  // No existing shift anymore
    } catch (error) {
      // Handle error from backend
      setError(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  const handleStop = async () => {
    try {
      // Post request to backend to end the shift
      const response = await fetch('http://localhost:8000/punch_clock/end_shift', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // This ensures cookies are sent
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to end shift');
      }

      // If successful, stop the timer and reset
      setIsRunning(false);
      setTime(0);  // Reset the timer
      setError(null); // Clear any previous error
      setExistingShift(false);  // No active shift anymore
    } catch (error) {
      // Handle error from backend
      
      setError(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  // Format the time in HH:MM:SS format
  const formatTime = (timeInSeconds: number): string => {
    const hours = Math.floor(timeInSeconds / 3600);  // Get total hours
    const minutes = Math.floor((timeInSeconds % 3600) / 60);  // Get remaining minutes
    const seconds = timeInSeconds % 60;  // Get remaining seconds
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  // Only render the timer component on specific routes
  if (!['/dashboard', '/opportunities', '/assistedDialer', '/reports', '/settings'].includes(location.pathname)) {
    return null;  // Return null to not render the component for other routes
  }

  return (
    <div className="top-navbar">
      <div className="top-navbar-timer">
        <span className="top-navbar-timer-label">Timer: {formatTime(time)}</span>
        <button 
          className="top-navbar-button top-navbar-start" 
          onClick={handleStart} 
          disabled={isRunning || existingShift}  // Disable start if already running or existing shift found
        >
          Start
        </button>
        <button 
          className="top-navbar-button top-navbar-stop" 
          onClick={handleStop} 
          disabled={!isRunning}  // Disable stop if timer is not running
        >
          Stop
        </button>
      </div>

      {error && (
        <div className="top-navbar-error">
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default TopNavbar;
