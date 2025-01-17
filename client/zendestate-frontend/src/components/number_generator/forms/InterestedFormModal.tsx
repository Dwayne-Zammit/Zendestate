import React, { useEffect } from 'react';
import ReactModal from 'react-modal';
import '../../../styles/number_generator/forms/InterestedFormModal.css';
import { IoMdClose } from "react-icons/io";

interface InterestedFormModalProps {
  showModal: boolean;
  formData: {
    contact_name: string;
    email: string;
    phone_number: string;
    interestedProducts: string;
    age: string;
    hasPartner: boolean;
    country: string;
    locality_of_meeting: string;
    occupation: string;
    tracking_source: string;
    notes: string;
    lead_status: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  closeModal: () => void;
}

const InterestedFormModal: React.FC<InterestedFormModalProps> = ({
  showModal,
  formData,
  handleChange,
  handleSubmit,
  closeModal,
}) => {

  useEffect(() => {
    // Bind modal to app element for accessibility
    ReactModal.setAppElement('#root');
  }, []);

  return (
    <ReactModal
      isOpen={showModal}
      onRequestClose={closeModal} // Close modal when clicked outside
      contentLabel="Interested Form Modal"
      className="modalContent"
      overlayClassName="modalOverlay"
      closeTimeoutMS={200} // Timeout to animate close transition
      
    >
      <button className="closeModalButton" onClick={closeModal}>
        <IoMdClose />
      </button>
      <form onSubmit={handleSubmit}>
        <div className="formGroup">
          <label>Full Name</label>
          <input
            type="text"
            name="contact_name"
            value={formData.contact_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="formGroup">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="formGroup">
          <label>Phone Number</label>
          <input
            type="text"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
          />
        </div>
        <div className="formGroup">
          <label>Interested Products</label>
          <textarea
            name="interestedProducts"
            value={formData.interestedProducts}
            onChange={handleChange}
            required
          />
        </div>
        <div className="formGroup">
          <label>Age</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
          />
        </div>
        <div className="formGroup">
          <label>Do you have a partner?</label>
          <input
            type="checkbox"
            name="hasPartner"
            checked={formData.hasPartner}
            onChange={handleChange}
          />
        </div>
        <div className="formGroup">
          <label>Country</label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
          />
        </div>
        <div className="formGroup">
          <label>Locality of meeting</label>
          <input
            type="text"
            name="locality_of_meeting"
            value={formData.locality_of_meeting}
            onChange={handleChange}
          />
        </div>
        <div className="formGroup">
          <label>Occupation</label>
          <input
            type="text"
            name="occupation"
            value={formData.occupation}
            onChange={handleChange}
          />
        </div>
        <div className="formGroup">
          <label>Tracking Source</label>
          <input
            type="text"
            name="tracking_source"
            value={formData.tracking_source}
            onChange={handleChange}
          />
        </div>
        <div className="formGroup">
          <label>Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
          />
        </div>
        <div className="submitButtonContainer">
          <button className="submitButton" type="submit">Submit</button>
        </div>
      </form>
    </ReactModal>
  );
};

export default InterestedFormModal;
