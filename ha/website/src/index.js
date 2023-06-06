import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import axios from "axios";
import Swal from "sweetalert2";

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
})

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
          Toast.fire({icon:'success',title:'Successfully rebooted ' + node});
        } catch (error) {
            console.error(error);
          Toast.fire({icon:'error',title:'Failed to reboot ' + node});
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
      Toast.fire({icon:'success',title:'Successfully added new user'});
    } catch (error) {
      console.error(error);
      Toast.fire({icon:'error',title:'Failed to add new user'});
    }
  };

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get("https://ha-cluster.steve.ee/api/users?limit=5");

     if (response.data.status === "success") {
        const formattedData = response.data.data.map((info, index) => (
          `<p><b>User ${
            index + 1
          }:</b> ${info.first_name} - ${info.last_name} - ${info.birth_date.split("T")[0]}</p>`
        )).join("");

        Swal.fire({
          title: "User Info",
          html: formattedData,
          confirmButtonText: "Close",
        });
      } 
    } catch (error) {
      console.error(error);
      Toast.fire({icon:'error',title:'Failed to retrieve user information'});
    }
  };
  const reverseIM = {
  "i-07500046b93073c66":"node-1",
  "i-0dd289054e0ad6fd3":"node-2",
  "i-0e1da344b591f45ce":"node-3",
  "i-05671c346e9be6aee":"etcd",
  "i-0b98a2c01e34765eb":"haproxy"
};

const fetchNodeInfo = async () => {
    try {
      const response = await axios.get("https://ha-cluster.steve.ee/api/status");

     if (response.data.status === "success") {
        const formattedData = response.data.data.map((info, index) => (
          `<p><b>Node ${
            index + 1
          }:</b> ${reverseIM[info.InstanceId]} - ${info.State}</p>`
        )).join("");

        Swal.fire({
          title: "Node Info",
          html: formattedData,
          confirmButtonText: "Close",
        });
      } 
    } catch (error) {
      console.error(error);
      Toast.fire({icon:'error',title:'Failed to retrieve node status'});
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
      <button onClick={fetchNodeInfo} style={buttonStyle}>
        View Node Status
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
          <button onClick={handleReboot} style={buttonStyle}>Reboot Node</button>
        </div>
      <a target="_blank" href="http://ha-status.steve.ee:7000" stlye={buttonStyle}>
        View DB/Cluster Status
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
