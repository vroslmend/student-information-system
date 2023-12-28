import React, { useState } from 'react';

const EnrollmentForm = () => {
  const [isEnrollmentChecked, setIsEnrollmentChecked] = useState(false);
  const [additionalFormData, setAdditionalFormData] = useState({
    courseCode: '',
    enrollmentDate: '',
    status: '',
    // ... (other enrollment fields)
  });

  const handleAdditionalFieldChange = (event) => {
    setAdditionalFormData({
      ...additionalFormData,
      [event.target.name]: event.target.value,
    });
  };

  const handleEnrollmentSubmit = (event) => {
    event.preventDefault();
    const combinedData = { ...newStudent, ...(isEnrollmentChecked && additionalFormData) };

    fetch('http://localhost:3001/api/enrollments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(combinedData),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(
            `Error adding new enrollment: ${response.status} - ${response.statusText}`
          );
        }
      })
      .then((data) => {
        console.log('Server response:', data);
        alert('New enrollment added successfully');
        // Optionally, navigate to the enrollment list or another page
        navigate('/enrollment-list');
      })
      .catch((error) => {
        console.error(error.message);
        alert(
          `Failed to add new enrollment. Check the console for more details. Error: ${error.message}`
        );
      });
  };

  return (
    <div>
      {/* Checkbox for enrollment */}
      <div
        className="form-container checkbox-container"
        style={{
          backgroundColor: 'transparent',
          border: 'none',
          boxShadow: 'none',
        }}
      >
        <label>
          <input
            type="checkbox"
            checked={isEnrollmentChecked}
            onChange={(e) => setIsEnrollmentChecked(e.target.checked)}
          />
          Add Enrollment Details
        </label>
      </div>

      {/* Form container for enrollment */}
      <div
        className="form-container"
        style={{
          display: isEnrollmentChecked ? 'block' : 'none',
          opacity: isEnrollmentChecked ? 1 : 0,
        }}
      >
        <h3 className="form-title">Add Enrollment</h3>
        <form
          onSubmit={handleEnrollmentSubmit}
          style={{ display: isEnrollmentChecked ? 'block' : 'none' }}
        >
          {/* Existing form fields */}
          <div className="form-field">
            <label htmlFor="courseCode">Course Code:</label>
            <input
              type="text"
              id="courseCode"
              name="courseCode"
              value={additionalFormData.courseCode}
              onChange={handleAdditionalFieldChange}
            />
          </div>
          <div className="form-field">
            <label htmlFor="enrollmentDate">Enrollment Date:</label>
            <input
              type="date"
              id="enrollmentDate"
              name="enrollmentDate"
              value={additionalFormData.enrollmentDate}
              onChange={handleAdditionalFieldChange}
            />
          </div>
          <div className="form-field">
            <label htmlFor="status">Status:</label>
            <input
              type="text"
              id="status"
              name="status"
              value={additionalFormData.status}
              onChange={handleAdditionalFieldChange}
            />
          </div>
          {/* ... (other enrollment fields) ... */}
          <div className="form-field">
            <Button type="submit" variant="contained" color="primary">
              Add Enrollment
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnrollmentForm;