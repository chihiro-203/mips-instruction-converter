import React from "react";

const Result = ({ table, bin }) => {
  const binary = (table || []).map((item, index) => {
    const [name, register, value, colspan] = item.split(",");
    return {
      key: `${name}-${index}`,
      name: name.trim(),
      register: register.trim(),
      value: value.trim(),
      colspan: parseInt(colspan.trim(), 10) || 1,
    };
  });

  return (
    <div>
      <div
        style={{ textAlign: "left", marginBottom: "0.5rem", fontSize: "1vw" }}
      >
        {bin}
      </div>
      {binary.every((item) => /^[0-9]+$/.test(item.value)) ? (
        <table className="w-full border-2 border-[#5f3c9180] text-[1vw] table-fixed">
          <thead>
            <tr>
              {binary.map((item) => (
                <th
                  key={item.key}
                  colSpan={item.colspan}
                  className="p-1 leading-tight"
                >
                  {item.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {binary.map((item) => (
                <td
                  key={item.key}
                  colSpan={item.colspan}
                  className="p-1 leading-tight"
                >
                  {item.register}
                </td>
              ))}
            </tr>
            <tr>
              {binary.map((item) => (
                <td
                  key={item.key}
                  colSpan={item.colspan}
                  className="p-1 leading-tight"
                >
                  {item.value}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      ) : (
        <div> </div>
      )}
    </div>
  );
};

const BinHexDec = ({ searchResults }) => {
  const hasValidData =
    searchResults &&
    searchResults.instruction &&
    Array.isArray(searchResults.instruction.table) &&
    searchResults.instruction.table.length > 0;

  return (
    <div>
      {hasValidData ? (
        <div>
          <Result
            table={searchResults.instruction.table}
            bin={searchResults.instruction.bin}
          />
        </div>
      ) : (
        <p>No mnemonic found.</p>
      )}
    </div>
    // <div>
    //   {searchResults && searchResults.instruction !== "" ? (
    //     <p>{searchResults.instruction}</p>
    //   ) : (
    //     <p>No value available.</p>
    //   )}
    // </div>
  );
};

export default BinHexDec;
