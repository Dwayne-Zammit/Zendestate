// src/services/api.ts

export const getLeadsData = (token: string) => {
  return fetch('http://localhost:8000/leads/all_leads', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ number_of_rows: 0, page_number: 1 }),
  })
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => {
      throw new Error('Error fetching leads data: ' + error);
    });
};
