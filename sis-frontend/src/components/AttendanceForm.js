// AttendanceForm.js
import React, { useState, useEffect } from 'react';

const AttendanceForm = ({ studentId }) => {
  const [formData, setFormData] = useState({
    courseCode: '',
    attendanceDate: '',
    status: '',
    semesterId: '',
  });
  const [courseOptions, setCourseOptions] = useState([]);
  const [semesterOptions, setSemesterOptions] = useState([]);

  useEffect(() => {
    // Fetch the list of courses from the API
    fetch('http://localhost:3001/api/courses') // Replace with your actual API endpoint
      .then((response) => response.json())
      .then((data) => {
        // Extract course codes from the response
        const courseCodes = data.map((course) => course.CourseCode);
        setCourseOptions(courseCodes);
      })
      .catch((error) => console.error('Error fetching courses:', error));

    // Fetch the list of Semester IDs from the API
    fetch('http://localhost:3001/api/semesters') // Replace with your actual API endpoint
      .then((response) => response.json())
      .then((data) => {
        // Extract Semester IDs from the response
        const semesterIds = data.map((semester) => semester.SemesterID);
        setSemesterOptions(semesterIds);
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

    // Perform the necessary validation and submit the form data to the API
    // You can use the formData state to send the data to the API

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
              {courseOptions.map((courseCode) => (
                <option key={courseCode} value={courseCode}>{courseCode}</option>
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
            <input
              type="text"
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            />
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
              {semesterOptions.map((semesterId) => (
                <option key={semesterId} value={semesterId}>{semesterId}</option>
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
