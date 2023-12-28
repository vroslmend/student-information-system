import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import '../styles/NewStudentForm.css';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const NewStudentForm = () => {
  const navigate = useNavigate();

  // State for student data
  const [newStudent, setNewStudent] = useState({
    studentId: null,
    name: '',
    address: '',
    dateOfBirth: '',
    contactInformation: '',
  });


  // Submit handler for adding a new student
  const handleStudentSubmit = (event) => {
    event.preventDefault();
    // Submit student data to the server
    fetch('http://localhost:3001/api/students', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newStudent),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(`Error adding new student: ${response.status} - ${response.statusText}`);
        }
      })
      .then((data) => {
        console.log('Server response:', data);
        alert('New student added successfully');
        // Optionally, navigate to the student list or another page
        navigate('/student-list');
      })
      .catch((error) => {
        console.error(error.message);
        alert(`Failed to add new student. Check the console for more details. Error: ${error.message}`);
      });
  };


  // Change handler for student data
  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewStudent({ ...newStudent, [name]: value });
  };

  const handlePreviousClick = () => {
    // Navigate to a different component when the "Previous" button is clicked
    navigate('/dashboard');
  };


  return (
    <div className="main-container">
      {/* Form container for adding a new student */}
      <div className="form-container">
      <div className="previous-button">
      <Button variant="contained" color="primary" size="small" onClick={handlePreviousClick}>
          Back
        </Button>
      </div>
        <h3 className="form-title">Add New Student</h3>
        <form onSubmit={handleStudentSubmit}>
          {/* Existing form fields */}
          <div className="form-field">
            <label htmlFor="studentId">Student ID:</label>
            <input
              type="text"
              id="studentId"
              name="studentId"
              value={newStudent.studentId || ''}
              onChange={handleChange}
              disabled
            />
          </div>
          <div className="form-field">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={newStudent.name}
              onChange={handleChange}
            />
          </div>
          <div className="form-field">
            <label htmlFor="address">Address:</label>
            <input
              type="text"
              id="address"
              name="address"
              value={newStudent.address}
              onChange={handleChange}
            />
          </div>
          <div className="form-field">
            <label htmlFor="dateOfBirth">Date of Birth:</label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={newStudent.dateOfBirth}
              onChange={handleChange}
            />
          </div>
          <div className="form-field">
            <label htmlFor="contactInformation">Contact Information:</label>
            <input
              type="text"
              id="contactInformation"
              name="contactInformation"
              value={newStudent.contactInformation}
              onChange={handleChange}
            />
          </div>
          {/* Existing form fields */}
          <div className="form-field">
            <Button type="submit" variant="contained" color="primary">
              Add Student
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewStudentForm;
