import { useState } from 'react';
import '../../styles/numberGenerator.css';

interface PhoneNumberGeneratorHook {
  generatingPhoneNumber: boolean;
  generatedNumber: string | null;
  generatedNumberHistory: any[];
  error: string | null;
  generatePhoneNumber: () => Promise<void>;
}

const usePhoneNumberGenerator = (): PhoneNumberGeneratorHook => {
  const [generatingPhoneNumber, setGeneratingPhoneNumber] = useState<boolean>(false);
  const [generatedNumber, setGeneratedNumber] = useState<string | null>(null);
  const [generatedNumberHistory, setGeneratedNumberHistory] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const generatePhoneNumber = async () => {
    setGeneratingPhoneNumber(true);
    try {
      const response = await fetch('http://localhost:8000/assisted_dialer/generatePhoneNumber', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = await response.json();
      setGeneratedNumber(data.generated_number);
      setGeneratedNumberHistory(data.generated_number_history);
      setError(null);
    } catch (error) {
      setError("Failed to generate phone number. Please try again.");
    } finally {
      setGeneratingPhoneNumber(false);
    }
  };

  return {
    generatingPhoneNumber,
    generatedNumber,
    generatedNumberHistory,
    error,
    generatePhoneNumber,
  };
};

export default usePhoneNumberGenerator;
