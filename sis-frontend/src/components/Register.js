import React, { useState } from "react";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const onRegisterClick = async () => {
    // Validate that username, password, and email are not null or empty
    if (!username || !password || !email) {
      setError("Username, password, and email are required");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, email }),
      });

      if (response.status === 201) {
        // Registration successful
        setError("");
        console.log("User registered successfully");

         // Show a prompt
      const promptResult = window.confirm("Registration successful! Returning to Homepage.");

      // Redirect immediately if user chooses to go to the home page
      if (promptResult) {
        // Redirect to the root URL or any other logic you need
        window.location.href = "/";
      }

      } else if (response.status === 400) {
        // Validation error or user already exists
        const data = await response.json();
        setError(data.message);
      } else {
        // Handle other error cases
        throw new Error("Registration failed");
      }
    } catch (error) {
      console.error("Error during registration:", error.message);
      setError("Registration failed. Please try again later.");
    }
  };

  return (
    <div className="mainContainer">
      <h2>Signup</h2>
      {error && <div className="errorLabel">{error}</div>}
      <div className="inputContainer">
        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="inputBox"
        />
      </div>
      <div className="inputContainer">
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="inputBox"
        />
      </div>
      <div className="inputContainer">
        <label>Email:</label>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="inputBox"
        />
      </div>
      <div className="inputContainer">
        <button className="inputButton" onClick={onRegisterClick}>Register</button>
      </div>
    </div>
  );
};

export default Register;
