import React, { useState } from 'react';
import checkIfUserIsLoggedIn from '../../hooks/authentication/Auth';

import '../../styles/numberGenerator.css';
import StarsBackground from '../../components/background/StarsBackground'; // Import the StarsBackground component

const NumberGeneratorPage: React.FC = () => {
  const { user, loading: userLoading } = checkIfUserIsLoggedIn();
  const [generatingPhoneNumber, setGeneratingPhoneNumber] = useState<boolean>(false);
  const [generatedNumber, setGeneratedNumber] = useState<string | null>(null);
  const [generatedNumberHistory, setGeneratedNumberHistory] = useState<any[]>([]); // Initialize as an empty array
  const [error, setError] = useState<string | null>(null);
  const [phoneStatus, setPhoneStatus] = useState<string>('notSet'); // Set "notSet" as the default value


  const handleGeneratePhoneNumber = async () => {
    // Set generatingPhoneNumber to true before starting the generation process
    setGeneratingPhoneNumber(true);

    try {
      // Simulate a 500ms delay before showing the phone number generation process
      setTimeout(async () => {
        const response = await fetch('http://localhost:8000/assisted_dialer/generatePhoneNumber', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        console.log("Phone number generated:", data);
        setPhoneStatus("notSet");
        setGeneratedNumber(data.generated_number);
        setGeneratedNumberHistory(data.generated_number_history); // Make sure the response is an array
        setError(null);

        // After the generation is complete, set generatingPhoneNumber to false
        setGeneratingPhoneNumber(false);
      }, 500);  // 500ms delay before making the actual request
    } catch (error) {
      console.error("Error generating phone number:", error);
      setError("Failed to generate phone number. Please try again.");

      // In case of error, set generatingPhoneNumber to false
      setGeneratingPhoneNumber(false);
    }
  };

  // Handle phone status change
  const handleStatusChange = async (selectedStatus: string) => {
    setPhoneStatus(selectedStatus);

    console.log({
      "phoneNumber:": generatedNumber,
      "Selected Phone Status:": selectedStatus,
    });

    // Send the lead status and phone number to the backend
    try {
      const response = await fetch('http://localhost:8000/leads/new_call_history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',  // Send cookies with the request (for session)
        body: JSON.stringify({
          call_status: selectedStatus,  // Use the selected status
          phone_number: generatedNumber,  // Use the generated phone number
        }),
      });

      // Handle the response from the backend
      if (!response.ok) {
        throw new Error('Failed to update phone status');
      }
      const data = await response.json();
      console.log('Response from backend:', data);
      handleGeneratePhoneNumber(); // Re-fetch the generated phone number and history

    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (generatingPhoneNumber) return <div><div className="LoadingScreen">Generating Phone Number...<div className="spinner"></div></div></div>;
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
    <div className='pageContainer'>
      <StarsBackground />
      <div className='pageBodyContainer'>
        <div className='generatePhoneNumberContainer'>
          <h2>Generate a Phone Number</h2>
          {/* Conditionally render the "Generate" button only if the number has not been generated */}
          {!generatedNumber && (
            <button
              className='generatePhoneNumberButton'
              onClick={handleGeneratePhoneNumber}
              disabled={generatingPhoneNumber} // Disable the button while generating
            >
              {generatingPhoneNumber ? 'Generating...' : 'Generate'}  {/* Change text while generating */}
            </button>
          )}

          <div className='generatedPhoneNumberContainer'>
            {generatedNumber && (
              <div className="generatedPhoneNumberContentsContainer">
                <div className='generatedPhoneNumberContainerBox'>
                  <div>
                    <h3 className="generatedPhoneNumberSectionTitle">Generated Phone Number</h3>
                    <div className='generatedPhoneNumberBox'>
                      {generatedNumber && <p className='generatedNumber'>{generatedNumber}</p>}
                    </div>
                  </div>
                  <h3 className="generatedPhoneNumberSectionTitle">Notes</h3>
                  {generatedNumberHistory && (
                    <div className="generatedNumberHistory">
                      <ul className='generatedNumberHistoryUl'>
                        {generatedNumberHistory.length === 0 && (
                          <p>None</p>
                        )}
                        {generatedNumberHistory.length > 0 && generatedNumberHistory.map((historyItem, index) => (
                          <li key={index}>
                            <p><strong>Call Status:</strong> {historyItem.call_history}</p>
                            <p><strong>Creator:</strong> {historyItem.creator}</p>
                            <p><strong>Assignee:</strong> {historyItem.assignee || "N/A"}</p>
                            <p><strong>Date Created:</strong> {new Date(historyItem.date_created).toLocaleString()}</p>
                            <hr />
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <h3 className="generatedPhoneNumberSectionTitle">Number History</h3>
                  {generatedNumberHistory.length === 0 && (
                    <div className="generatedNumberHistory">
                      <p className='noneText'>None</p>
                    </div>
                  )}
                  {generatedNumberHistory.length > 0 && (
                    <div className="generatedNumberHistory">
                      <ul>
                        {generatedNumberHistory.map((historyItem, index) => (
                          <li key={index}>
                            <p><strong>Call status:</strong> {historyItem.call_history}</p>
                            <p><strong>Creator:</strong> {historyItem.creator}</p>
                            <p><strong>Assignee:</strong> {historyItem.assignee || "N/A"}</p>
                            <p><strong>Date Created:</strong> {new Date(historyItem.date_created).toLocaleString()}</p>
                            <hr />
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <div className='generatedPhoneNumberContainerBox'>
                  <div className='phoneStatusButtonsContainer'>
                    <h3 className='callOutcomeTitle'>Call Outcome</h3>
                    <div className="phoneStatusButtons">
                      {/* Button for each phone status */}
                      <button
                        className={`statusButtonInterested ${phoneStatus === 'interested' ? 'active' : ''}`}
                        onClick={() => handleStatusChange('interested')}
                      >
                        Interested
                      </button>
                      <button
                        className={`statusButtonNotInterested ${phoneStatus === 'notInterested' ? 'active' : ''}`}
                        onClick={() => handleStatusChange('Not Interested: Call')}
                      >
                        Not Interested
                      </button>
                      <button
                        className={`statusButton ${phoneStatus === 'callback' ? 'active' : ''}`}
                        onClick={() => handleStatusChange('callback')}
                      >
                        Call Back
                      </button>
                      <button
                        className={`statusButton ${phoneStatus === 'unreachable' ? 'active' : ''}`}
                        onClick={() => handleStatusChange('unreachable')}
                      >
                        Unreachable
                      </button>
                      <button
                        className={`statusButtonDoNotCall ${phoneStatus === 'dnc' ? 'active' : ''}`}
                        onClick={() => handleStatusChange('dnc')}
                      >
                        Do-Not-Call Requested
                      </button>
                      <button
                        className={`statusButtonSkip ${phoneStatus === 'skipnumber' ? 'active' : ''}`}
                        onClick={() => handleStatusChange('skipnumber')}
                      >
                        Skip Number
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {error && <p style={{ color: 'red' }}>{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NumberGeneratorPage;
