import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import '../../styles/charts/charts.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const callOutcomeColors: Record<string, string> = {
  notSet: "rgba(201, 203, 207, 0.6)",
  callback: "rgba(54, 162, 235, 0.6)",
  dnc: "rgba(255, 99, 132, 0.6)",
  ineligible: "rgba(153, 102, 255, 0.6)",
  interested: "rgba(75, 192, 192, 0.6)",
  leadAssigned: "rgba(255, 159, 64, 0.6)",
  notInterested: "rgba(255, 205, 86, 0.6)",
};

const CallOutcomesByUserChart: React.FC = () => {
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchChartData = async () => {
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/leads/call_history_reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({}),
      });

      const data = await response.json();
      setChartData(formatChartData(data.calls));
    } catch (error) {
      console.error('Error fetching call outcomes:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatChartData = (calls: any[]) => {
    const userOutcomeCount: Record<string, Record<string, number>> = {};

    calls.forEach((call) => {
      const user = call.assignee || call.creator || 'Unassigned';
      const status = call.call_status || 'notSet';
      userOutcomeCount[user] = userOutcomeCount[user] || {};
      userOutcomeCount[user][status] = (userOutcomeCount[user][status] || 0) + 1;
    });

    const users = Object.keys(userOutcomeCount);
    const datasets = Object.keys(callOutcomeColors).map((outcome) => ({
      label: outcome,
      data: users.map((user) => userOutcomeCount[user][outcome] || 0),
      backgroundColor: callOutcomeColors[outcome],
      borderColor: callOutcomeColors[outcome].replace('0.6', '1'),
      borderWidth: 1,
      stack: 'stack1',
    }));

    return { labels: users, datasets };
  };

  useEffect(() => {
    fetchChartData();
  }, []);

  if (loading) return <div><div className="LoadingScreen">Loading...<div className="spinner"></div></div></div>;

  return (
    <div className="chart-container"
    style={{
      width: '60%',
      height: '50%',
      margin: '20px auto',
      backgroundColor: '#242424',
      borderRadius: '20px',
      padding: '1%',
    }}>
      <Bar
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Call Outcomes by User',
            },
            legend: {
              position: 'right',
            },
          },
          scales: {
            x: {
              stacked: true,
              title: {
                display: true,
                text: 'Users',
              },
            },
            y: {
              stacked: true,
              title: {
                display: true,
                text: 'Number of Calls',
              },
              beginAtZero: true,
            },
          },
        }}
      />
    </div>
  );
};

export default CallOutcomesByUserChart;
