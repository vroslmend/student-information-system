import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";


const Dashboard = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    // Fetch the list of students when the component mounts
    fetch("http://localhost:3001/api/students")
      .then((response) => response.json())
      .then((data) => setStudents(data))
      .catch((error) => console.error("Error fetching students:", error));
  }, []);

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <Link to="/student-list">
        <div className="dashboard-block">Student List</div>
      </Link>
      <Link to="/create-student">
        <div className="dashboard-block">Add New Student</div>
      </Link>
    </div>
  );
};

export default Dashboard;
