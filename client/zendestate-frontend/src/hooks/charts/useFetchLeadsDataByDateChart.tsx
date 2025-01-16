import { useState, useEffect } from 'react';

const useFetchLeadsDataByDate = () => {
  const [leads, setLeads] = useState<any[]>([]); // Store raw leads
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch('http://localhost:8000/leads/all_leads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        number_of_rows: 0,
        page_number: 1,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setLeads(data.leads || []);
      })
      .catch((error) => console.error('Error fetching leads data:', error))
      .finally(() => setLoading(false));
  }, []);

  return { leads, loading };
};

export default useFetchLeadsDataByDate;
