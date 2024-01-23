import React from "react";

const CustomerDetailsTable = ({ customerDetails, selectedDictName }) => {
  if (!customerDetails) {
    return null;
  }

  const headers = Object.keys(customerDetails[0]);

  return (
    <div>
      <h2>{selectedDictName} Details</h2>
      <table border="1" className="borderedtable">
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {customerDetails.map((customer, index) => (
            <tr key={index}>
              {headers.map((header) => (
                <td key={header}>{customer[header]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerDetailsTable;
