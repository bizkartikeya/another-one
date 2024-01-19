import React, { useState } from "react";
import CustomerDetailsTable from "./CustomerDetailsTable";

// ... (previous imports)

const DataTable = ({ dictionaries }) => {
  const [selectedDict, setSelectedDict] = useState(null);
  const [selectedDictName, setSelectedDictName] = useState(null);

  const handleButtonClick = (dictIndex) => {
    setSelectedDict(dictionaries[dictIndex][1]);
    setSelectedDictName(dictionaries[dictIndex][0]);
  };

  return (
    <div>
      {Object.keys(dictionaries).map((dictIndex, index) => (
        <button key={index} onClick={() => handleButtonClick(dictIndex)}>
          {dictionaries[dictIndex][0]}
        </button>
      ))}

      <CustomerDetailsTable
        customerDetails={selectedDict}
        selectedDictName={selectedDictName}
      />
    </div>
  );
};

// ...

export default DataTable;
