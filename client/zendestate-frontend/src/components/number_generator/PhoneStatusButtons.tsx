// import React from 'react';

// interface PhoneStatusButtonsProps {
//   phoneStatus: string;
//   handleStatusChange: (status: string) => void;
// }

// const PhoneStatusButtons: React.FC<PhoneStatusButtonsProps> = ({ phoneStatus, handleStatusChange }) => {
//   const statuses = [
//     { label: 'Interested', value: 'interested' },
//     { label: 'Not Interested', value: 'notInterested' },
//     { label: 'Call Back', value: 'callback' },
//     { label: 'Unreachable', value: 'unreachable' },
//     { label: 'Do-Not-Call Requested', value: 'dnc' },
//     { label: 'Skip Number', value: 'skipnumber' },
//   ];

//   return (
//     <div className='phoneStatusButtonsContainer'>
//       <h3 className='callOutcomeTitle'>Call Outcome</h3>
//       <div className="phoneStatusButtons">
//         {statuses.map((status) => (
//           <button
//             key={status.value}
//             className={`statusButton ${phoneStatus === status.value ? 'active' : ''}`}
//             onClick={() => handleStatusChange(status.value)}
//           >
//             {status.label}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default PhoneStatusButtons;
