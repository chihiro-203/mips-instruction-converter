import React from "react";

const Description = ({ table, data }) => {
  const explanation = table.map((item) => {
    const [field, colspan, bit] = item.split(",");
    return { field: field.trim(), colspan: parseInt(colspan.trim(), 10) || 1, bit: bit.trim() };
  });

  return (
    <div>
      <table className="w-full border-2 border-[#5f3c9180] text-[1.2vw] table-fixed">
        <thead>
          <tr>
            {explanation.map((item, index) => (
              <th key={index} colSpan={item.colspan}>
                {item.field}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {explanation.map((item, index) => (
              <td key={index} colSpan={item.colspan}>
                {item.bit}-bit
              </td>
            ))}
          </tr>
        </tbody>
      </table>
      <div className="text-left text-[0.95vw] mt-[0.75rem]"></div>
    </div>
  );
};

const Explain = ({ searchResults }) => {
  return (
    <div>
      {searchResults ? (
        <Description
          table={searchResults?.explain?.table}
          data={searchResults?.explain?.data}
        />
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
};

export default Explain;
