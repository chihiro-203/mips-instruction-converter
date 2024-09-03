import React from "react";

const BinHexDec = ({ searchResults }) => {
  return (
    <div>
      {searchResults && searchResults.instruction !== "" ? (
        <p>{searchResults.instruction}</p>
      ) : (
        <p>No value available.</p>
      )}
    </div>
  );
};

export default BinHexDec;
