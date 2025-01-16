import React from 'react';
import checkIfUserIsLoggedIn from '../../hooks/authentication/Auth';
import useFetchLeadsData from '../../hooks/opportunities/useFetchLeadsData';
import useFetchLeadsDataByDate from '../../hooks/charts/useFetchLeadsDataByDateChart';
import OpportunitiesStagesChart from '../../components/charts/OpportunitiesStagesChart';
import OpportunitiesByDateChart from '../../components/charts/NewOpportunitiesByDateChart';
import CallOutcomesByUserChart from '../../components/charts/CallOutcomesByUserChart';
import '../../styles/dashboard/dashboard.css';
import StarsBackground from '../../components/background/StarsBackground';

const DashboardPage: React.FC = () => {
  const { user, loading: userLoading } = checkIfUserIsLoggedIn();
  const { chartData, loading: loadingChartData } = useFetchLeadsData();
  const { leads, loading: loadingLeads } = useFetchLeadsDataByDate();

  if (userLoading || loadingChartData || loadingLeads) {
    return (
      <div className="LoadingScreen">
        Loading...
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="pageContainer">
      <StarsBackground />
      <div className='ChartContainer'>
        {user ? (
          <>
            <OpportunitiesStagesChart chartData={chartData} />
            <OpportunitiesByDateChart leads={leads} />
            <CallOutcomesByUserChart/>
          </>
        ) : (
          <div>
            <p>User data could not be loaded. Please try logging in again.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
