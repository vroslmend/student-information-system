import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onButtonClick = () => {
    // Clear previous errors
    setError("");

    // Check if username and password are provided
    if (!username || !password) {
      setError("Please enter both username and password");
      return;
    }

    // Make a fetch request to the server
    fetch("http://localhost:3001/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Invalid username or password");
        }
        return response.json();
      })
      .then((data) => {
        // Handle successful login
        // You might want to store the authentication token or user information here
        navigate("/dashboard"); // Redirect to the dashboard page
      })
      .catch((error) => {
        // Handle errors
        setError(error.message || "An error occurred");
      });
  };

  return (
    <div className={"mainContainer"}>
      <div className={"titleContainer"}>
        <h1>Login</h1>
      </div>
      <br />
      <div className={"inputContainer"}>
        <input
          value={username}
          placeholder="Enter your username here"
          onChange={(ev) => setUsername(ev.target.value)}
          className={"inputBox"}
        />
      </div>
      <br />
      <div className={"inputContainer"}>
        <input
          value={password}
          type="password"
          placeholder="Enter your password here"
          onChange={(ev) => setPassword(ev.target.value)}
          className={"inputBox"}
        />
      </div>
      <br />
      <div className={"inputContainer"}>
        <input
          className={"inputButton"}
          type="button"
          onClick={onButtonClick}
          value={"Log in"}
        />
        {error && <div className="errorLabel">{error}</div>}
      </div>
    </div>
  );
};

export default Login;
