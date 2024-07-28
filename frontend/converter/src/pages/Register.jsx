import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import register from "../assets/data/register.json";

const Register = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(register);
  }, []);

  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="ref-title">MIPS Register Usage</div>
        <div className="ref-data">
          <table className="ref-table table-light table-striped table-bordered table-responsive-sm">
            <thead className="thead-dark">
              <tr>
                <th>Name</th>
                <th>Number</th>
                <th>Function/Use</th>
                <th>Preserved across a call</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td>{item.Name}</td>
                  <td>{item.Number}</td>
                  <td>{item.Function_Use}</td>
                  <td>{item.Preserved_Across_A_Call}</td>
                </tr>
              ))}{""}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Register;
