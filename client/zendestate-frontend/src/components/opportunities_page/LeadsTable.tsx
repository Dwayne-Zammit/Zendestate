import React, { useState } from 'react';
import LeadTableModal from './LeadTableModal';
import '../../styles/opportunities_page/OpportunitiesTable.css';

interface LeadsTableProps {
  tableData: any[];
  fetchTableData: () => Promise<void>; // Accept fetchTableData as a prop
}

const LeadsTable: React.FC<LeadsTableProps> = ({ tableData, fetchTableData }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  const handleRowClick = (item: any) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleSaveChanges = async (updatedItem: any) => {
    // Here you would update the table data or send updated data to the backend
    const updatedTableData = tableData.map((item) =>
      item.id === updatedItem.id ? updatedItem : item
    );

    // Log the updated data (you can skip this in production)
    console.log('Updated Item:', updatedItem);
    console.log('Updated Table Data:', updatedTableData);

    // Refetch the data after saving
    await fetchTableData(); // This ensures the table is refetched with updated data
  };

  return (
    <div>
      {tableData.length > 0 ? (
        <table className="opportunitiesTable">
          <thead>
            <tr>
              <th className='opportunitiesTableTh'>Code</th>
              <th className='opportunitiesTableTh'>Date & Time</th>
              <th className='opportunitiesTableTh'>Stage</th>
              <th className='opportunitiesTableTh'>Contact Name</th>
              <th className='opportunitiesTableTh'>Contact</th>
              <th className='opportunitiesTableTh'>Creator</th>
              <th className='opportunitiesTableTh'>Assignee</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((item, index) => (
              <tr key={index} onClick={() => handleRowClick(item)}>
                <td className='opportunitiesTableTd'>{item.id}</td>
                <td className='opportunitiesTableTd'>{new Date(item.date_created).toLocaleString()}</td>
                <td className='opportunitiesTableTd'>{item.lead_status}</td>
                <td className='opportunitiesTableTd'>{item.contact_name}</td>
                <td className='opportunitiesTableTd'>{item.phone_number}</td>
                <td className='opportunitiesTableTd'>{item.creator}</td>
                <td className='opportunitiesTableTd'>{item.assignee || 'No Assignee'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="noResultsMessage">No results found.</div>
      )}

      {isModalOpen && selectedItem && (
        <LeadTableModal
          isModalOpen={isModalOpen}
          selectedItem={selectedItem}
          handleCloseModal={handleCloseModal}
          handleSaveChanges={handleSaveChanges}
        />
      )}
    </div>
  );
};

export default LeadsTable;
