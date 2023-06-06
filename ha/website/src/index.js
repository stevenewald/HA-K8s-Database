import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import axios from "axios";
import Swal from "sweetalert2";

const FormComponent = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [date, setDate] = useState("");

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
      const response = await axios.get("https://ha-cluster.steve.ee/api/users");

      if (response.data.status === "success") {
        const formattedData = response.data.data.map((info, index) => (
          `<p><b>Instance ${
            index + 1
          }:</b> ${info.InstanceId} - ${info.State}</p>`
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
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
    <FormComponent />
  </>,
);
