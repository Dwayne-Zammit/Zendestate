// import React from 'react';

// interface PhoneNumberDisplayProps {
//   number: string;
//   history: any[];
// }

// const PhoneNumberDisplay: React.FC<PhoneNumberDisplayProps> = ({ number, history }) => (
//   <div className="generatedPhoneNumberContentsContainer">
//     <div className="generatedPhoneNumberContainerBox">
//       <h3 className="generatedPhoneNumberSectionTitle">Generated Phone Number</h3>
//       <div className="generatedPhoneNumberBox">
//         <p className="generatedNumber">{number}</p>
//       </div>
//       <h3 className="generatedPhoneNumberSectionTitle">Number History</h3>
//       {history.length === 0 ? (
//         <p className="noneText">None</p>
//       ) : (
//         <ul className="generatedNumberHistoryUl">
//           {history.map((item, index) => (
//             <li key={index}>
//               <p><strong>Call Status:</strong> {item.call_history}</p>
//               <p><strong>Creator:</strong> {item.creator}</p>
//               <p><strong>Assignee:</strong> {item.assignee || 'N/A'}</p>
//               <p><strong>Date Created:</strong> {new Date(item.date_created).toLocaleString()}</p>
//               <hr />
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   </div>
// );

// export default PhoneNumberDisplay;
