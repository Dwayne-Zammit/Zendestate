import React from 'react';
import '../../styles/opportunities_page/OpportunitiesTableStatistics.css';

type StatisticsProps = {
  statistics: {
    'New Lead': number;
    'In Progress': number;
    'To Call Back': number;
    'Unreachable': number;
    'Future Callback': number;
    'Not Interested: Call': number;
    'Meeting Set': number;
    'Meeting To Re-Set': number;
    '2nd Meeting to Set': number;
    '2nd Meeting Set': number;
    'Closed': number;
    'Not Interested: Meeting': number;
  };
};

const StatisticsTable: React.FC<StatisticsProps> = ({ statistics }) => {
  return (
    <div className="statisticsContainer">
      {Object.entries(statistics).map(([key, value]) => (
        <div className="statisticsBox" key={key}>
          <div className="statisticsValue">{value}</div>
          <div className="statisticsLabel">{key}</div>
        </div>
      ))}
    </div>
  );
};

export default StatisticsTable;
