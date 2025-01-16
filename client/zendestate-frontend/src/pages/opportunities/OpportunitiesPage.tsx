import React, { useEffect, useState } from 'react';
import Filters from '../../components/opportunities_page/Filters';
import StatisticsTable from '../../components/opportunities_page/StatisticsTable';
import LeadsTable from '../../components/opportunities_page/LeadsTable';
import PaginationControls from '../../components/opportunities_page/PaginationControls';
import '../../styles/opportunitiesPage.css';
import StarsBackground from '../../components/background/StarsBackground'; // Import the StarsBackground component
import checkIfUserIsLoggedIn from '../../hooks/authentication/Auth';


// Define filter keys
type FilterKeys = 'code' | 'date and time' | 'stage' | 'contact' | 'creator' | 'assignee';

type Filters = {
  [key in FilterKeys]: string;
};

const OpportunitiesPage: React.FC = () => {
  // User and loading states
  const { user, loading: userLoading } = checkIfUserIsLoggedIn();

  // Filters
  const [filters, setFilters] = useState<Filters>({
    code: 'Any',
    'date and time': 'Any',
    stage: 'Any',
    contact: 'Any',
    creator: 'Any',
    assignee: 'Any',
  });

  const stages = [
    'New Lead',
    'In Progress',
    'To Call Back',
    'Unreachable',
    'Future Callback',
    'Not Interested - Call',
    'Meeting Set',
    'Meeting To Re-Set',
    '2nd Meeting to Set',
    '2nd Meeting Set',
    'Closed',
    'Not Interested - Meeting',
  ];

  const [tableData, setTableData] = useState<any[]>([]);
  const [totalLeads, setTotalLeads] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [statistics, setStatistics] = useState<any>({});

  // Calculate total pages
  const totalPages = Math.ceil(totalLeads / rowsPerPage);

  // Handlers
  const handleFilterChange = (name: FilterKeys, value: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
    setPageNumber(1); // Reset to the first page whenever filters change
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    if (date) {
      const isoDate = date.toISOString();
      handleFilterChange('date and time', isoDate);
    } else {
      handleFilterChange('date and time', 'Any');
    }
  };

  const fetchTableData = async () => {
    try {
      const response = await fetch('http://localhost:8000/leads/all_leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          number_of_rows: rowsPerPage,
          page_number: pageNumber,
          filters: filters,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch leads');
      }

      const data = await response.json();
      if (data.leads) {
        setTableData(data.leads);
        setTotalLeads(data.total_leads_count);

        // Remap the statistics
        const remappedStatistics = {
          'New Lead': data.statistics['New Lead'] || 0,
          'In Progress': data.statistics['In Progress'] || 0,
          'To Call Back': data.statistics['To Call Back'] || 0,
          'Unreachable': data.statistics['Unreachable'] || 0,
          'Future Callback': data.statistics['Future Callback'] || 0,
          'Not Interested: Call': data.statistics['Not Interested - Call'] || 0,
          'Meeting Set': data.statistics['Meeting Set'] || 0,
          'Meeting To Re-Set': data.statistics['Meeting To Re-Set'] || 0,
          '2nd Meeting to Set': data.statistics['2nd Meeting to Set'] || 0,
          '2nd Meeting Set': data.statistics['2nd Meeting Set'] || 0,
          'Closed': data.statistics['Closed'] || 0,
          'Not Interested: Meeting': data.statistics['Not Interested - Meeting'] || 0,
        };

        setStatistics(remappedStatistics); // Set the remapped statistics
      } else {
        setTableData([]);
        setTotalLeads(0); // Set totalLeads to 0 when no data is returned
      }
    } catch (error) {
      console.error('Error fetching table data:', error);
    }
  };

  // Fetch user and table data when page loads or when filters change
  useEffect(() => {
    fetchTableData(); // Fetch data when filters or page number change
  }, [filters, pageNumber, rowsPerPage]); // Depend on filters, pageNumber, and rowsPerPage

  if (userLoading) {
    return (
      <div className="LoadingScreen">
        Loading...
        <div className="spinner"></div>
      </div>
    );
  }
  return (
    <div className="pageContainer">
      <StarsBackground/>
      <div className="pageBodyContainer">
        <div className="opportunitiesContainer">
          {user ? (
            <>
              <StatisticsTable statistics={statistics} />

              {/* Filters */}
              <Filters
                filters={filters}
                stages={stages}
                selectedDate={selectedDate}
                onDateChange={handleDateChange}
                onFilterChange={handleFilterChange}
                rowsPerPage={rowsPerPage}
                onRowsChange={setRowsPerPage}
              />

              {/* Filtered Leads Table */}
              <LeadsTable 
                tableData={tableData} 
                fetchTableData={fetchTableData} // Pass the function to LeadsTable
              />

              {/* Pagination Controls */}
              <PaginationControls
                totalPages={totalPages}
                pageNumber={pageNumber}
                onPageChange={setPageNumber}
              />
            </>
          ) : (
            <div>User data could not be loaded. Please try logging in again.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OpportunitiesPage;
