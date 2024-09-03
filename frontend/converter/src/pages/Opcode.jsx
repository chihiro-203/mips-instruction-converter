import React from "react";
import Navbar from "../components/Navbar";
import opcode from "../assets/data/opcode.json";

const Opcode = () => {
  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="ref-title">MIPS Opcode Reference</div>
        <div className="ref-data">
          <table className="ref-table table-light table-striped table-bordered table-responsive-sm">
            <thead className="thead-dark">
              <tr>
                <th>Opcode</th>
                <th>Name</th>
                <th>Mnemonic</th>
                <th>Format</th>
                <th>Action</th>
                <th colSpan={6}>Fields</th>
              </tr>
            </thead>
            <tbody>
              {opcode.map((section) => (
                <React.Fragment key={section.section}>
                  <tr>
                    <td colSpan={11}>
                      <b>{section.section}</b>
                    </td>
                  </tr>
                  {section.instructions.map((instruction, index) => (
                    <tr key={index}>
                      <td>{instruction.opcode}</td>
                      <td>{instruction.name}</td>
                      <td>{instruction.mnemonic}</td>
                      <td>{instruction.format}</td>
                      <td>{instruction.action}</td>
                      {instruction.fields.map((field, fieldIndex) => (
                        <td key={fieldIndex} colSpan={field === "imm" || field === "offset" ? 3 : field === "code" ? 4 : field === "target" ? 5 : 1}>
                          {field}
                        </td>
                      ))}
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Opcode;
