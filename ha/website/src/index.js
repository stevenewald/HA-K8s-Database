import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import axios from "axios";
import Swal from "sweetalert2";

const FormComponent = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [date, setDate] = useState("");
  const [node, setNode] = useState('');

  const options = ['node-1', 'node-2', 'node-3', 'etcd', 'haproxy'];
    
  const handleReboot = async () => {
        try {
            const data = {
                instanceId: node,
            };
            const response = await axios.post('https://ha-cluster.steve.ee/api/reboot', data);
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = {
      first: firstName,
      last: lastName,
      date: date,
    };

    try {
      const response = await axios.post(
        "https://ha-cluster.steve.ee/api/add",
        data,
      );
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get("https://ha-cluster.steve.ee/api/users?limit=5");

     if (response.data.status === "success") {
        const formattedData = response.data.data.map((info, index) => (
          `<p><b>User ${
            index + 1
          }:</b> ${info.first_name} - ${info.last_name} - ${info.birth_date}</p>`
        )).join("");

        Swal.fire({
          title: "User Info",
          html: formattedData,
          confirmButtonText: "Close",
        });
      } 
    } catch (error) {
      console.error(error);
    }
  };

  const selectStyle = {
        margin: '10px',
        padding: '10px',
        fontSize: '16px',
    };

  const buttonStyle = {
    margin: "10px",
    padding: "10px",
    backgroundColor: "#007BFF",
    color: "white",
    fontSize: "16px",
    border: "none",
    cursor: "pointer",
  };

  const inputStyle = {
    margin: "10px",
    padding: "10px",
    fontSize: "16px",
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="First Name"
          style={inputStyle}
        />
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Last Name"
          style={inputStyle}
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={inputStyle}
        />
        <button type="submit" style={buttonStyle}>Submit</button>
      </form>
      <button onClick={fetchUserInfo} style={buttonStyle}>
        Fetch User Info
      </button>
      <div>
        <select
            value={node}
            onChange={e => setNode(e.target.value)}
            style={selectStyle}>
            <option value="">Select a node</option>
            {options.map((option, index) => (
                <option key={index} value={option}>
                    {option}
                </option>
            ))}
          </select>
          <button onClick={handleReboot} style={buttonStyle}>Submit</button>
        </div>
      <a href="http://ha-status.steve.ee:7000" stlye={buttonStyle}>
        View Server status
      </a>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
    <FormComponent />
  </>,
);
