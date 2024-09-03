import React from 'react'
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
            </tr>
          </thead>
          <tbody>
          </tbody>
        </table>
      </div>
    </div>
    </div>
  )
}

export default Opcode;