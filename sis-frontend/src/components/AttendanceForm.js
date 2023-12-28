// AttendanceForm.js
import React, { useState, useEffect } from 'react';

const AttendanceForm = ({ studentId }) => {
  const [formData, setFormData] = useState({
    courseCode: '',
    attendanceDate: '',
    status: '',  // Updated to include status field
    semesterId: '',
  });
  const [courseOptions, setCourseOptions] = useState([]);
  const [semesterOptions, setSemesterOptions] = useState([]);
  const [statusOptions, setStatusOptions] = useState(['PRESENT', 'ABSENT']);

  useEffect(() => {
    // Fetch the list of courses from the API
    fetch('http://localhost:3001/api/courses')
      .then((response) => response.json())
      .then((data) => {
        console.log('Courses:', data);
        if (data && data.courses && Array.isArray(data.courses)) {
          // Extract course codes from the response
          const courseOptionsData = data.courses.map((course) => ({
            id: course.CourseCode,
            label: course.CourseCode,
          }));
          setCourseOptions(courseOptionsData);
        } else {
          console.error('Courses data is not in the expected format:', data);
        }
      })
      .catch((error) => console.error('Error fetching courses:', error));
  
    // Fetch the list of Semester IDs from the API
    fetch('http://localhost:3001/api/semesters')
      .then((response) => response.json())
      .then((data) => {
        console.log('Semesters:', data);
        if (data && data.semesters && Array.isArray(data.semesters)) {
          // Extract Semester IDs from the response
          const semesterOptionsData = data.semesters.map((semester) => ({
            id: semester.SemesterID,
            label: semester.SemesterID,
          }));
          setSemesterOptions(semesterOptionsData);
        } else {
          console.error('Semesters data is not in the expected format:', data);
        }
      })
      .catch((error) => console.error('Error fetching semesters:', error));
  }, []);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  
    // Perform necessary validation (you can add your validation logic here)
  
    // Create a new attendance record
    const newAttendanceRecord = {
      studentId: studentId,
      courseCode: formData.courseCode,
      attendanceDate: formData.attendanceDate,
      status: formData.status,
      semesterId: formData.semesterId,
    };
  
    // Send the data to the server for attendance record creation
    fetch(`http://localhost:3001/api/students/${studentId}/attendance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newAttendanceRecord),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to create attendance record');
        }
        return response.json();
      })
      // Inside the handleSubmit function
  .then((data) => {
    console.log('Attendance record created successfully:', data);
    alert('Attendance record added successfully');
  })
  .catch((error) => {
    console.error('Error creating attendance record:', error.message);
    // Optionally, you can also show an error message
    alert('Failed to create attendance record. Please try again.');
  });
  
    // Clear form input values after submission
    setFormData({
      courseCode: '',
      attendanceDate: '',
      status: '',
      semesterId: '',
    });
  };

  return (
    <div className="form-container" style={{ marginTop: '20px' }}>
      <div className="form-block">
        <h3>Attendance Form</h3>
  
        {/* Attendance Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="courseCode">Course Code:</label>
            <select
            id="courseCode"
            name="courseCode"
            value={formData.courseCode}
            onChange={handleChange}
          >
            <option value="" disabled>Select a course</option>
            {courseOptions.map((courseOption) => (
              <option key={courseOption.id} value={courseOption.id}>
                {courseOption.label}
              </option>
            ))}
          </select>
          </div>
          <div className="form-field">
            <label htmlFor="attendanceDate">Attendance Date:</label>
            <input
              type="date"
              id="attendanceDate"
              name="attendanceDate"
              value={formData.attendanceDate}
              onChange={handleChange}
            />
          </div>
          <div className="form-field">
            <label htmlFor="status">Status:</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="" disabled>Select a status</option>
              {statusOptions.map((statusOption) => (
                <option key={statusOption} value={statusOption}>
                  {statusOption}
                </option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="semesterId">Semester ID:</label>
            <select
            id="semesterId"
            name="semesterId"
            value={formData.semesterId}
            onChange={handleChange}
          >
            <option value="" disabled>Select a semester</option>
            {semesterOptions.map((semesterOption) => (
              <option key={semesterOption.id} value={semesterOption.id}>
                {semesterOption.label}
              </option>
            ))}
          </select>
          </div>
          <div className="form-field">
            <input type="submit" value="Submit" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AttendanceForm;
