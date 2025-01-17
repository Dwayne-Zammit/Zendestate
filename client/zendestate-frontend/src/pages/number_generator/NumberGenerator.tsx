import React, { useState } from 'react';
import checkIfUserIsLoggedIn from '../../hooks/authentication/Auth';

import '../../styles/numberGenerator.css';
import StarsBackground from '../../components/background/StarsBackground';
import InterestedFormModal from '../../components/number_generator/forms/InterestedFormModal';

const NumberGeneratorPage: React.FC = () => {
  const { user, loading: userLoading } = checkIfUserIsLoggedIn();
  const [generatingPhoneNumber, setGeneratingPhoneNumber] = useState<boolean>(false);
  const [leadSubmittedSuccessfully, setLeadSubmittedSuccessfully] = useState<boolean>(false);
  const [generatedNumber, setGeneratedNumber] = useState<string | null>(null);
  const [generatedNumberHistory, setGeneratedNumberHistory] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [phoneStatus, setPhoneStatus] = useState<string>('notSet');

  // Modal State
  const [showInterestedModal, setShowInterestedModal] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    contact_name: '',
    email: '',
    phone_number: '',
    interestedProducts: '',
    age: '',
    hasPartner: false,
    country: '',
    locality_of_meeting: '',
    occupation: '',
    tracking_source: '',
    notes: '',
    lead_status: 'interested',
  });

  const handleGeneratePhoneNumber = async () => {
    setGeneratingPhoneNumber(true);
    try {
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
        setPhoneStatus("notSet");
        setGeneratedNumber(data.generated_number);
        setGeneratedNumberHistory(data.generated_number_history);
        setError(null);
        setGeneratingPhoneNumber(false);
      }, 500);
    } catch (error) {
      console.error("Error generating phone number:", error);
      setError("Failed to generate phone number. Please try again.");
      setGeneratingPhoneNumber(false);
    }
  };

  const handleStatusChange = async (selectedStatus: string) => {
    try {
      const response = await fetch('http://localhost:8000/leads/new_call_history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          call_status: selectedStatus,
          phone_number: generatedNumber,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update phone status');
      }
      const data = await response.json();
      if (selectedStatus === 'interested') {
        setFormData((prev) => ({
          ...prev,
          phone_number: generatedNumber || '',
        }));
        setShowInterestedModal(true);
        return;
      }
      setPhoneStatus(selectedStatus);
      console.log('Response from backend:', data);
      handleGeneratePhoneNumber();
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name } = e.target;
  
    if ((e.target as HTMLInputElement).type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked, // Explicitly cast to HTMLInputElement
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: e.target.value,
      }));
    }
  };
  
  
  
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const response = await fetch('http://localhost:8000/leads/new_lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        throw new Error('Failed to submit interested form');
      }
  
      const data = await response.json();
      console.log('Interested form submitted:', data);
  
      // Show success animation and then reset form data after 2 seconds
      setLeadSubmittedSuccessfully(true);
  
      // Set a delay to hide the success animation and reset the form
      setTimeout(() => {
        setLeadSubmittedSuccessfully(false);  // Hide the success animation
        setShowInterestedModal(false);  // Close the modal after 2 seconds
        handleGeneratePhoneNumber();  // Handle any other necessary actions
  
        // Reset form data
        setFormData({
          contact_name: '',
          email: '',
          phone_number: '',
          interestedProducts: '',
          age: '',
          hasPartner: false,
          country: '',
          locality_of_meeting: '',
          occupation: '',
          tracking_source: '',
          notes: '',
          lead_status: 'new',
        });
      }, 3000); // The duration of the success animation
    } catch (error) {
      console.error('Error submitting interested form:', error);
    }
  };
  

  const closeModal = () => {
    setShowInterestedModal(false);
  };

  if (leadSubmittedSuccessfully) {
    return (
      <div>
        <div className="leadSubmittedSuccessfullyAnimation">
          <h1 className="leadSubmittedText">Congratulations on Submitting a lead!🥳🎉🥂</h1>
  
          {/* More Money Rain */}
          <div className="money">💵</div>
          <div className="money">💵</div>
          <div className="money">💵</div>
          <div className="money">💵</div>
          <div className="money">💵</div>
          <div className="money">💵</div>
          <div className="money">💵</div>
          <div className="money">💵</div>
          <div className="money">💵</div>
          <div className="money">💵</div>
          <div className="money">💵</div>
          <div className="money">💵</div>
          <div className="money">💵</div>
          <div className="money">💵</div>
          <div className="money">💵</div>
          <div className="money">💵</div>
          <div className="money">💵</div>
          <div className="money">💵</div>
          <div className="money">💵</div>
        </div>
      </div>
    );
  }
  
  
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
          {!generatedNumber && (
            <button
              className='generatePhoneNumberButton'
              onClick={handleGeneratePhoneNumber}
              disabled={generatingPhoneNumber}
            >
              {generatingPhoneNumber ? 'Generating...' : 'Generate'}
            </button>
          )}
          <div className='generatedPhoneNumberContainer'>
            {generatedNumber && (
              <div className="generatedPhoneNumberContentsContainer">
                <div className='ContainerBox'>
                  <div>
                    <h3 className="generatedPhoneNumberSectionTitle">Generated Phone Number</h3>
                    <div className='generatedPhoneNumberBox'>
                      {generatedNumber && <p className='generatedNumber'>{generatedNumber}</p>}
                    </div>
                  </div>
                  <h3 className="generatedPhoneNumberSectionTitle">Notes</h3>
                  {generatedNumberHistory.length === 0 ? (
                    <p className="numberHistorySection">None</p>
                  ) : (
                    <ul className='numberHistorySection'>
                      {generatedNumberHistory.map((historyItem, index) => (
                        <li key={index}>
                          <p><strong>Call Status:</strong> {historyItem.call_history}</p>
                          <p><strong>Creator:</strong> {historyItem.creator}</p>
                          <p><strong>Assignee:</strong> {historyItem.assignee || "N/A"}</p>
                          <p><strong>Date Created:</strong> {new Date(historyItem.date_created).toLocaleString()}</p>
                          <hr />
                        </li>
                      ))}
                    </ul>
                  )}
                  <h3 className="generatedPhoneNumberSectionTitle">Number History</h3>
                  {generatedNumberHistory.length === 0 ? (
                    <p className="numberHistorySection">None</p>
                  ) : (
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
                  )}
                </div>
                <div className='phoneStatusButtonsContainer'>
                  <h3 className='callOutcomeTitle'>Call Outcome</h3>
                  <div className="phoneStatusButtons">
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
            )}
            {error && <p style={{ color: 'red' }}>{error}</p>}
          </div>
        </div>
      </div>
      <InterestedFormModal
        showModal={showInterestedModal}
        formData={formData}
        handleChange={handleFormChange}
        handleSubmit={handleFormSubmit}
        closeModal={closeModal}
      />
    </div>
  );
};

export default NumberGeneratorPage;
