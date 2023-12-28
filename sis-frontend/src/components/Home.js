// Home.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Home = (props) => {
  const { loggedIn, email, setLoggedIn } = props;
  const navigate = useNavigate();

  const onButtonClick = () => {
    if (loggedIn) {
      // If logged in, log out
      localStorage.removeItem("user");
      setLoggedIn(false);
    } else {
      // If not logged in, navigate to the login page
      navigate("/login");
    }
  };

  const onSignUpClick = () => {
    // Navigate to the signup page
    navigate("/register");
  };

  return (
    <div className="mainContainer">
      <div className={"titleContainer"}>
        <h1>Student Information System</h1>
      </div>
      <p>Created by Vroslmend.</p>
      <div className={"buttonContainer"}>
        <input
          className={"inputButton"}
          type="button"
          onClick={onButtonClick}
          value={loggedIn ? "Log out" : "Log in"}
        />
        {loggedIn ? (
          <div>Your email address is {email}</div>
        ) : (
          <div>
            <button className={"inputButton"} onClick={onSignUpClick}>
              Sign Up
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
