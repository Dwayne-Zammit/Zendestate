import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../../styles/opportunities_page/OpportunitiesTableFilters.css';

type FilterKeys = 'code' | 'date and time' | 'stage' | 'contact' | 'creator' | 'assignee';

interface FiltersProps {
  filters: { [key in FilterKeys]: string };
  stages: string[];
  selectedDate: Date | null;
  onDateChange: (date: Date | null) => void;
  onFilterChange: (name: FilterKeys, value: string) => void;
  rowsPerPage: number;
  onRowsChange: (rows: number) => void;
}

const Filters: React.FC<FiltersProps> = ({
  filters,
  stages,
  selectedDate,
  onDateChange,
  onFilterChange,
  rowsPerPage,
  onRowsChange,
}) => {
  const [creators, setCreators] = useState<{ value: string; label: string }[]>([]); // State for creators
  const [assignees, setAssignees] = useState<{ value: string; label: string }[]>([]); // State for assignees
  const [isLoadingCreators, setIsLoadingCreators] = useState<boolean>(false);
  const [isLoadingAssignees, setIsLoadingAssignees] = useState<boolean>(false);

  // Fetch creators from backend
  useEffect(() => {
    const fetchCreators = async () => {
      setIsLoadingCreators(true);
      try {
        const response = await fetch('http://localhost:8000/leads/lead_creators', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        const data = await response.json();
        setCreators(
          data.creators.map((creator: string) => ({
            value: creator,
            label: creator,
          }))
        );
      } catch (error) {
        console.error('Error fetching creators:', error);
      } finally {
        setIsLoadingCreators(false);
      }
    };

    fetchCreators();
  }, []);

  // Fetch assignees from backend
  useEffect(() => {
    const fetchAssignees = async () => {
      setIsLoadingAssignees(true);
      try {
        const response = await fetch('http://localhost:8000/leads/lead_assignees', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        const data = await response.json();
        setAssignees(
          data.assignees.map((assignee: string) => ({
            value: assignee,
            label: assignee,
          }))
        );
      } catch (error) {
        console.error('Error fetching assignees:', error);
      } finally {
        setIsLoadingAssignees(false);
      }
    };

    fetchAssignees();
  }, []);

  return (
    <div className="filtersContainer">
      {Object.keys(filters).map((key) => (
        <div className="filterDropdown" key={key}>
          <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
          {key === 'date and time' ? (
            <DatePicker
              selected={selectedDate}
              onChange={onDateChange}
              isClearable
              placeholderText="All Time"
              className="dateInput"
            />
          ) : key === 'stage' ? (
            <select
              onChange={(e) => onFilterChange(key as FilterKeys, e.target.value)}
              value={filters[key as FilterKeys]}
            >
              <option value="Any">Any</option>
              {stages.map((stage, index) => (
                <option key={index} value={stage}>
                  {stage}
                </option>
              ))}
            </select>
          ) : key === 'code' || key === 'contact' ? (
            <input
              type="text"
              value={filters[key as FilterKeys]}
              onChange={(e) => onFilterChange(key as FilterKeys, e.target.value)}
              onFocus={(e) => {
                if (e.target.value === 'Any') {
                  onFilterChange(key as FilterKeys, ''); // Clear the input when clicked
                }
              }}
              placeholder="Any"
              className={`${key}Input`}
            />
          ) : key === 'creator' ? (
            <select
              onChange={(e) => onFilterChange(key as FilterKeys, e.target.value)}
              value={filters[key as FilterKeys]}
              disabled={isLoadingCreators}
            >
              <option value="Any">Any</option>
              {creators.map((creator, index) => (
                <option key={index} value={creator.value}>
                  {creator.label}
                </option>
              ))}
            </select>
          ) : key === 'assignee' ? (
            <select
              onChange={(e) => onFilterChange(key as FilterKeys, e.target.value)}
              value={filters[key as FilterKeys]}
              disabled={isLoadingAssignees}
            >
              <option value="Any">Any</option>
              {assignees.map((assignee, index) => (
                <option key={index} value={assignee.value}>
                  {assignee.label}
                </option>
              ))}
            </select>
          ) : (
            <select
              onChange={(e) => onFilterChange(key as FilterKeys, e.target.value)}
              value={filters[key as FilterKeys]}
            >
              <option value="Any">Any</option>
            </select>
          )}
        </div>
      ))}
      <div className="filterDropdown">
        <span>Rows</span>
        <select onChange={(e) => onRowsChange(Number(e.target.value))} value={rowsPerPage}>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
        </select>
      </div>
    </div>
  );
};

export default Filters;
