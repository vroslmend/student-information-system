// src/components/StudentDetails.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/StudentDetails.css';
import { Link, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';

const StudentDetails = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [courses, setCourses] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        // Fetch student details
        const studentResponse = await fetch(`http://localhost:3001/api/students/${id}`);
        const studentData = await studentResponse.json();
        console.log('Student Data:', studentData);
        setStudent(studentData);

        // Fetch student courses (CourseCode only)
        const coursesResponse = await fetch(`http://localhost:3001/api/students/${id}/courses`);
        const coursesData = await coursesResponse.json();
        console.log('Courses Data:', coursesData);
        setCourses(coursesData.courses);
      } catch (error) {
        console.error('Error fetching student details:', error);
      }
    };

    fetchStudentDetails();
  }, [id]);

  if (!student || !courses) {
    return <p>Loading...</p>;
  }

  const handlePreviousClick = () => {
    // Navigate to a different component when the "Previous" button is clicked
    navigate('/student-list');
  };

  // Convert the database date to a JavaScript Date object
  const dateOfBirth = new Date(student.DateOfBirth);

  // Format date of birth to display only the date
  const formattedDateOfBirth = `${dateOfBirth.getFullYear()}-${(dateOfBirth.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${dateOfBirth.getDate().toString().padStart(2, '0')}`;

  return (
    <div className="student-details-container">
      <div className='button-container'>
      <Button variant="contained" color="primary" size="small" onClick={handlePreviousClick}>
          Back
        </Button>
      </div>
    <h2>Student Details</h2>
    <p><strong>Name:</strong> {student.Name}</p>
    <p><strong>Address:</strong> {student.Address}</p>
    <p><strong>Date of Birth:</strong> {formattedDateOfBirth}</p>
    <p><strong>Contact Information:</strong> {student.ContactInformation}</p>

    <h3>Enrolled Courses</h3>
    <div className="enrolled-courses">
      {courses.length > 0 ? (
        <p>{courses.map(course => course.CourseCode).join(', ')}</p>
      ) : (
        <p>No courses enrolled.</p>
      )}
    </div>
  </div>
);
};

export default StudentDetails;
