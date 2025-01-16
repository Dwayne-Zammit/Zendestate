import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Lead {
  id: number;
  lead_status: string;
  phone_number: string;
  creator: string;
  assignee: string;
  date_created: string;
  date_modified: string;
}

interface ChartComponentProps {
  leads: Lead[]; // Array of leads
}

const OpportunitiesByDateChart: React.FC<ChartComponentProps> = ({ leads = [] }) => {
    if (!Array.isArray(leads)) {
      console.error('Invalid leads data. Expected an array:', leads);
      return <div>Error: Invalid leads data provided</div>;
    }
  
    const opportunitiesByDate = leads.reduce((acc: Record<string, number>, lead) => {
      const date = lead.date_created.split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});
  
    const labels = Object.keys(opportunitiesByDate).sort();
    const data = Object.values(opportunitiesByDate);
  
    const chartData = {
      labels,
      datasets: [
        {
          label: 'New Opportunities',
          data,
          backgroundColor: '#36a2eb',
        },
      ],
    };
  
    const chartOptions = {
        responsive: true,
        plugins: {
          legend: {
            position: 'right' as const, // Explicitly set as a literal type
          },
          title: {
            display: true,
            text: 'New Opportunities by Date',
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Date',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Number of Opportunities',
            },
            beginAtZero: true,
          },
        },
      };
      
  
    return (
      <div
      style={{
        width: '60%',
        height: '50%',
        margin: '20px auto',
        backgroundColor: '#242424',
        borderRadius: '20px',
        padding: '1%',
      }}

      >
        <Bar data={chartData} options={chartOptions} />
      </div>
    );
  };  

export default OpportunitiesByDateChart;
