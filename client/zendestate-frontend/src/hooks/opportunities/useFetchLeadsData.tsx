// src/hooks/useFetchLeadsData.ts

import { useState, useEffect } from 'react';

const useFetchLeadsData = () => {
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const leadStatuses = [
    "New Lead", "In Progress", "To Call Back", "Unreachable", "Future Callback", 
    "Not Interested - Call", "Meeting Set", "Meeting To Re-Set", 
    "2nd Meeting to Set", "2nd Meeting Set", "Closed", "Not Interested - Meeting"
  ];

  const statusColors: Record<string, string> = {
    "New Lead": "rgba(54, 162, 235, 0.6)",
    "In Progress": "rgba(75, 192, 192, 0.6)",
    "To Call Back": "rgba(255, 159, 64, 0.6)",
    "Unreachable": "rgba(153, 102, 255, 0.6)",
    "Future Callback": "rgba(255, 99, 132, 0.6)",
    "Not Interested - Call": "rgba(255, 205, 86, 0.6)",
    "Meeting Set": "rgba(75, 192, 192, 0.6)",
    "Meeting To Re-Set": "rgba(201, 203, 207, 0.6)",
    "2nd Meeting to Set": "rgba(255, 159, 64, 0.6)",
    "2nd Meeting Set": "rgba(54, 162, 235, 0.6)",
    "Closed": "rgba(153, 102, 255, 0.6)",
    "Not Interested - Meeting": "rgba(255, 99, 132, 0.6)"
  };

  useEffect(() => {
    fetch('http://localhost:8000/leads/all_leads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        "number_of_rows": 0,
        "page_number": 1
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        const leads = data.leads;
        const creatorAssigneeStatusCount: any = {};

        leads.forEach((lead: any) => {
          const creator = lead.creator;
          const assignee = lead.assignee;
          const status = lead.lead_status;

          if (!creatorAssigneeStatusCount[creator]) {
            creatorAssigneeStatusCount[creator] = {};
          }
          if (!creatorAssigneeStatusCount[creator][status]) {
            creatorAssigneeStatusCount[creator][status] = 0;
          }
          creatorAssigneeStatusCount[creator][status]++;

          if (assignee) {
            if (!creatorAssigneeStatusCount[assignee]) {
              creatorAssigneeStatusCount[assignee] = {};
            }
            if (!creatorAssigneeStatusCount[assignee][status]) {
              creatorAssigneeStatusCount[assignee][status] = 0;
            }
            creatorAssigneeStatusCount[assignee][status]++;
          }
        });

        const chartLabels = Object.keys(creatorAssigneeStatusCount);
        const reversedLeadStatuses = [...leadStatuses].reverse();

        const datasets = reversedLeadStatuses.map((status) => {
          return {
            label: status,
            data: chartLabels.map((user) => creatorAssigneeStatusCount[user][status] || 0),
            backgroundColor: statusColors[status],
            borderColor: statusColors[status].replace('0.6', '1'),
            borderWidth: 1,
            stack: 'stack1',
          };
        });

        const newChartData = {
          labels: chartLabels,
          datasets: datasets,
        };

        setChartData(newChartData);
      })
      .catch((error) => console.error('Error fetching leads data:', error))
      .finally(() => setLoading(false));
  }, []);

  return { chartData, loading };
};

export default useFetchLeadsData;
