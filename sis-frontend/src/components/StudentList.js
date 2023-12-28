import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import '../styles/StudentList.css'; // Import your CSS file



const StudentList = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    // Fetch the student data from the database
    fetch("http://localhost:3001/api/students")
      .then((response) => response.json())
      .then((data) => setStudents(data))
      .catch((error) => console.error("Error fetching students:", error));
  }, []);

  const handlePreviousClick = () => {
    // Navigate to a different component when the "Previous" button is clicked
    navigate('/dashboard');
  };

  const handleEditClick = (studentId) => {
    // Set the selected student based on the studentId
    navigate(`/edit-student/${studentId}`);
  };

  const handleDeleteClick = (studentId) => {
    // Send a DELETE request to delete the student record
    fetch(`http://localhost:3001/api/students/${studentId}`, {
      method: "DELETE"
    })
      .then((response) => {
        if (response.status === 204) {
          // Deletion successful, update the student list
          setStudents(students.filter((student) => student.StudentID !== studentId));
          alert("Student deleted successfully");
        } else if (response.status === 404) {
          // Student not found, display error message
          alert("Student not found");
        } else {
          // Other error occurred, display generic error message
          alert("Error deleting student");
        }
      })
      .catch((error) => {
        console.error("Error deleting student:", error.message);
        // Display error message to user
        alert("Internal server error");
      });
  };

  const studentsPerPage = 10;
  const indexOfLastStudent = page * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = students.slice(indexOfFirstStudent, indexOfLastStudent);

  return (
    <Container>
      <Box mt={4} mb={4}>
        <Typography variant="h4" gutterBottom>
          Student List
        </Typography>
      </Box>

      <Box display="flex" justifyContent="flex-start" alignItems="center" mb={2}>
        <Button variant="contained" color="primary" onClick={handlePreviousClick}>
         Back
        </Button>
      </Box>

      <Box>
      <Table className="student-table">
        <TableHead>
          <TableRow>
            <TableCell style={{ width: '20%' }}>Name</TableCell>
            <TableCell style={{ width: '20%' }}>Address</TableCell>
            <TableCell style={{ width: '15%' }}>Date of Birth</TableCell>
            <TableCell style={{ width: '25%' }}>Contact Information</TableCell>
            <TableCell style={{ width: '20%' }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currentStudents.map((student) => (
            <TableRow key={student.StudentID}>
              <TableCell>{student.Name}</TableCell>
              <TableCell>{student.Address}</TableCell>
              <TableCell>{formatDateOfBirth(student.DateOfBirth)}</TableCell>
              <TableCell>{student.ContactInformation}</TableCell>
              <TableCell>
                <Link to={`/students/${student.StudentID}`}>
                  <button className="view-button">View</button>
                </Link>
                <Link to={`/edit-student/${student.StudentID}`}>
                <button className='edit-button'>Edit</button>
                </Link>
                <button className='delete-button' onClick={() => handleDeleteClick(student.StudentID)}>Delete</button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </Box>

      <Box mt={2} display="flex" justifyContent="center">
        <Pagination
          count={Math.ceil(students.length / studentsPerPage)}
          page={page}
          onChange={(event, newPage) => setPage(newPage)}
          shape="rounded"
          color="primary"
        />
      </Box>
    </Container>
  );
};

// Function to format date of birth
const formatDateOfBirth = (dateString) => {
  const dateOfBirth = new Date(dateString);
  return `${dateOfBirth.getFullYear()}-${(dateOfBirth.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${dateOfBirth.getDate().toString().padStart(2, '0')}`;
};

export default StudentList;
