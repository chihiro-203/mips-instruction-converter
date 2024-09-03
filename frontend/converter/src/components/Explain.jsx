import React, { useEffect } from "react";

const Description = ({ table, data }) => {
  const explanation = (table || []).map((item, index) => {
    const [field, colspan, bit] = item.split(",");
    return { key: `${field}-${index}`, field: field.trim(), colspan: parseInt(colspan.trim(), 10) || 1, bit: bit.trim() };
  });

  return (
    <div>
      <table className="w-full border-2 border-[#5f3c9180] text-[1.2vw] table-fixed">
        <thead>
          <tr>
            {explanation.map((item) => (
              <th key={item.key} colSpan={item.colspan}>
                {item.field}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {explanation.map((item) => (
              <td key={item.key} colSpan={item.colspan}>
                {item.bit}-bit
              </td>
            ))}
          </tr>
        </tbody>
      </table>
      <div className="text-left text-[0.95vw] mt-[0.75rem]">
        {data.map((item, index) => (
          <li key={`${item.field}-${index}`}>
            <strong>{item.field}:</strong> {item.description} ({item.bits} bits)
          </li>
        ))}
      </div>
    </div>
  );
};

const Explain = ({ searchResults }) => {
  const hasValidData =
    searchResults &&
    searchResults.explain &&
    Array.isArray(searchResults.explain.table) &&
    searchResults.explain.table.length > 0;

  return (
    <div>
      {hasValidData ? (
        <div>
          <div dangerouslySetInnerHTML={{ __html: searchResults.definition }} />
          <Description
            table={searchResults.explain.table}
            data={searchResults.explain.data}
          />
        </div>
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
};

export default Explain;
