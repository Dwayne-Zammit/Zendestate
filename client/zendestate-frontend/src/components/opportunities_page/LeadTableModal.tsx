import React, { useState, useEffect } from 'react';
import { IoMdClose } from "react-icons/io";
import '../../styles/opportunities_page/OpportunitiesLeadInfoModal.css';

// Define a type for the item (lead) structure
interface LeadItem {
  id: string;
  date_created: string;
  lead_status: string;
  phone_number: string;
  creator: string;
  assignee?: string | null;
  contact_name: string;
}

interface LeadTableModalProps {
  isModalOpen: boolean;
  selectedItem: LeadItem | null;
  handleCloseModal: () => void;
  handleSaveChanges: (updatedItem: LeadItem) => void;
}

const LeadTableModal: React.FC<LeadTableModalProps> = ({
  isModalOpen,
  selectedItem,
  handleCloseModal,
  handleSaveChanges,
}) => {
  const [editedItem, setEditedItem] = useState<LeadItem | null>(selectedItem);
  const [assignees, setAssignees] = useState<string[]>([]); // State for assignees
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Define the stages array
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

  const handleInputChange = (field: keyof LeadItem, value: string) => {
    if (editedItem) {
      setEditedItem({
        ...editedItem,
        [field]: value,
      });
    }
  };

  const handleSubmit = async () => {
    if (!editedItem) return;

    const { id, lead_status, assignee } = editedItem;

    try {
      setIsSubmitting(true);
      setError(null);

      const response = await fetch('http://localhost:8000/leads/update_leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          code: id,
          status: lead_status,
          assignee: assignee || '',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update lead');
      }

      handleSaveChanges(editedItem); // Pass the updated item to parent
      handleCloseModal(); // Close the modal after submitting
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    setEditedItem(selectedItem); // Update edited item when selectedItem changes
  }, [selectedItem]);

  // Fetch assignees from backend
  useEffect(() => {
    const fetchAssignees = async () => {
      try {
        const response = await fetch('http://localhost:8000/leads/lead_assignees', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch assignees');
        }

        const data = await response.json();
        setAssignees(data.assignees || []); // Set assignees from backend response
      } catch (error) {
        console.error('Error fetching assignees:', error);
      }
    };

    fetchAssignees();
  }, []);

  if (!isModalOpen || !selectedItem) return null;

  return (
    <div className="modalOverlay" onClick={handleCloseModal}>
      <div className="modalContent" onClick={(e) => e.stopPropagation()}>
        <button className="closeModalButton" onClick={handleCloseModal}><IoMdClose /></button>
        <h2 className='modalTitle'>Lead Details</h2>
        <table className="modalTable">
          <tbody>
            <tr>
              <td><strong>Code:</strong></td>
              <td>{selectedItem.id}</td>
            </tr>
            <tr>
              <td><strong>Date & Time:</strong></td>
              <td>{new Date(selectedItem.date_created).toLocaleString()}</td>
            </tr>
            <tr>
              <td><strong>Stage:</strong></td>
              <td>
                <select
                  value={editedItem?.lead_status}
                  onChange={(e) => handleInputChange('lead_status', e.target.value)}
                >
                  {stages.map((stage, index) => (
                    <option key={index} value={stage}>
                      {stage}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
            <tr>
              <td><strong>Contact Name:</strong></td>
              <td>{selectedItem.contact_name}</td>
            </tr>
            <tr>
              <td><strong>Contact:</strong></td>
              <td>{selectedItem.phone_number}</td>
            </tr>
            <tr>
              <td><strong>Creator:</strong></td>
              <td>{selectedItem.creator}</td>
            </tr>
            <tr>
              <td><strong>Assignee:</strong></td>
              <td>
                <select
                  value={editedItem?.assignee || ''}
                  onChange={(e) => handleInputChange('assignee', e.target.value)}
                >
                  <option value="">Select Assignee</option>
                  {assignees.map((assignee, index) => (
                    <option key={index} value={assignee}>
                      {assignee}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
            <tr>
              <td>Notes</td>
              <td>Old Notes</td>
            </tr>
            {/* <tr>
              <td>New Notes</td>
              <td><input className='NotesInput'></input></td>
            </tr> */}
          </tbody>
        </table>
        <div className='newNotesContainer'>
          <h3>Notes</h3>
          <input className='NotesInput'></input>
        </div>
        {error && <div className="errorMessage">{error}</div>}

        <div className="modalButtons">
          <button
            className="saveModalButton"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeadTableModal;
