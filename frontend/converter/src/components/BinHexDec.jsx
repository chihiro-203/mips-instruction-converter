import React from "react";

const Result = ({ table, instruction }) => {
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
      {binary.every((item) => /^[0-9X]+$/.test(item.value)) ? (
        <div>
          <div
            style={{
              textAlign: "left",
              marginBottom: "0.2rem",
              fontSize: "1.2vw",
              fontWeight: "bold",
            }}
          >
            {instruction.mips}
          </div>
          <div
            style={{
              textAlign: "left",
              marginBottom: "0.5rem",
              fontSize: "1vw",
            }}
          >
            <li>
              <strong>Binary:</strong> {instruction.bin}
            </li>
            <li>
              <strong>Hex:</strong> {instruction.hex}
            </li>
            <li>
              <strong>Dec:</strong> {instruction.dec}
            </li>
          </div>
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
          <div
            style={{
              textAlign: "left",
              marginTop: "0.5rem",
              fontSize: "1.1vw",
            }}
          >
            <span style={{ textDecoration: "underline" }}>Operation</span>:{" "}
            {instruction.ope}
            <br />
            <span style={{ textDecoration: "underline" }}>Purpose</span>:{" "}
            {instruction.action}
            {/* {instruction.action} ({instruction.ope}) */}
          </div>
        </div>
      ) : (
        <div style={{ marginTop: "0.5rem", fontSize: "1.1vw" }}>
          {instruction.bin}
        </div>
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
            instruction={searchResults.instruction}
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
