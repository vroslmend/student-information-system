import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/EditStudentForm.css';
import Button from '@mui/material/Button';
import { Link, useNavigate } from 'react-router-dom';
import AttendanceForm from './AttendanceForm';

const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  };


  const EditStudent = () => {
    const { studentId } = useParams();
    const [student, setStudent] = useState({
      name: '',
      address: '',
      dateOfBirth: '',
      contactInformation: '',
    });
    const navigate = useNavigate();
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    
  
  
    useEffect(() => {
      // Fetch the student data for the selected studentId
      fetch(`http://localhost:3001/api/students/${studentId}`)
        .then((response) => response.json())
        .then((data) => {
          console.log("Student records data:", data);
          setStudent({
            name: data.Name,
            address: data.Address,
            contactInformation: data.ContactInformation,
            // Convert the database date to a JavaScript Date object
            dateOfBirth: formatDate(new Date(data.DateOfBirth).toISOString().split('T')[0]),
          });
        })
        .catch((error) => console.error("Error fetching student:", error));
    }, [studentId]);
    

    const handleChange = (event) => {
      const { name, value } = event.target;
      setStudent({ ...student, [name]: value });
    };

    const handleSubmit = (event) => {
      event.preventDefault();
      // Submit the updated student data to the server
      fetch(`http://localhost:3001/api/students/${studentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(student)
      })
        .then((response) => {
          if (response.ok) {
            // Check if the response has a content type of JSON
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
              return response.json(); // Parse the response if it's JSON
            } else {
              return null; // Return null for non-JSON responses
            }
          } else {
            throw new Error(`Error updating student: ${response.status} - ${response.statusText}`);
          }
        })
        .then((data) => {
          if (data) {
            console.log("Server response:", data); // Log the server response for debugging
          }
          alert("Student updated successfully");
        })
        .catch((error) => {
          console.error(error.message);
          // Display error message to the user
          alert("Failed to update student. Please check the console for more details.");
        });
    };

  if (!student) {
    return <div>Loading...</div>;
  }

  const handlePreviousClick = () => {
    // Navigate to a different component when the "Previous" button is clicked
    navigate('/student-list');
  };

  return (
    <div>
      <div className="form-container">
        <div className="previous-button">
          <Button variant="contained" color="primary" size="small" onClick={handlePreviousClick}>
            Back
          </Button>
        </div>
        <h3 className="form-title">Edit Students Details</h3>

        {/* Student Details Form */}
        <div className="form-block">
          <form onSubmit={handleSubmit}>
            <div className="form-field">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={student.name}
                onChange={handleChange}
              />
            </div>
            <div className="form-field">
              <label htmlFor="address">Address:</label>
              <input
                type="text"
                id="address"
                name="address"
                value={student.address}
                onChange={handleChange}
              />
            </div>
            <div className="form-field">
              <label htmlFor="dateOfBirth">Date of Birth:</label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={student.dateOfBirth}
                onChange={handleChange}
              />
            </div>
            <div className="form-field">
              <label htmlFor="contactInformation">Contact Information:</label>
              <input
                type="text"
                id="contactInformation"
                name="contactInformation"
                value={student.contactInformation}
                onChange={handleChange}
              />
            </div>
            <div className="form-field">
              <input type="submit" value="Submit" />
            </div>
          </form>
        </div>
      </div>

      {/* Call the AttendanceForm component */}
      <AttendanceForm studentId={studentId} setAttendanceRecords={setAttendanceRecords} />
    </div>
  );
};

export default EditStudent;