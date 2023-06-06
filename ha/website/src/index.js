import { React, useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import axios from "axios";

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
      const response = await axios.post("http:/ha-cluster.steve.ee:3000", data);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const inputStyle = {
    margin: "10px",
    padding: "10px",
    fontSize: "16px",
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

  return (
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
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
    <FormComponent />
  </>,
);
