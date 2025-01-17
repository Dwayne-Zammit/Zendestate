import { useState } from 'react';
import '../../styles/numberGenerator.css';

interface PhoneStatusHandlerHook {
  phoneStatus: string;
  handleStatusChange: (status: string, phoneNumber: string | null, refreshNumbers: () => Promise<void>) => Promise<void>;
}

const usePhoneStatusHandler = (): PhoneStatusHandlerHook => {
  const [phoneStatus, setPhoneStatus] = useState<string>('notSet');

  const handleStatusChange = async (
    selectedStatus: string,
    phone_number: string | null,
    refreshNumbers: () => Promise<void>
  ) => {
    setPhoneStatus(selectedStatus);

    try {
      const response = await fetch('http://localhost:8000/leads/new_call_history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ call_status: selectedStatus, phone_number: phone_number }),
      });

      if (!response.ok) throw new Error('Failed to update phone status');
      await refreshNumbers(); // Refresh the numbers list
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return {
    phoneStatus,
    handleStatusChange,
  };
};

export default usePhoneStatusHandler;
