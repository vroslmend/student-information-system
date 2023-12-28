const express = require("express");
const sql = require("mssql");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const config = {
  user: 'Budibase',
  password: 'budibase',
  server: '192.168.100.15',
  database: 'SMSDB',
  options: {
    enableArithAbort: true,
    encrypt: false,
  }
};

const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect();

// Authentication
app.post("/auth", async (req, res) => {
  await poolConnect;

  const { username, password } = req.body;

  try {
    const result = await pool
      .request()
      .input("username", sql.VarChar, username)
      .query("SELECT * FROM [User] WHERE Username = @username");

    const user = result.recordset[0];

    if (user) {
      if (user.Password === password) {
        res.status(200).json({ message: "success" });
      } else {
        res.status(401).json({ message: "Invalid username or password" });
      }
    } else {
      res.status(401).json({ message: "Invalid username or password" });
    }
  } catch (error) {
    console.error("Error authenticating user:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Register a new user
app.post('/register', async (req, res) => {
  const { username, password, email } = req.body;

  // Validate that username, password, and email are not null or empty
  if (!username || !password || !email) {
    return res.status(400).json({ message: "Username, password, and email are required" });
  }

  try {
    const result = await pool
      .request()
      .input("username", sql.VarChar, username)
      .input("email", sql.VarChar, email)
      .query("SELECT * FROM [User] WHERE Username = @username OR Email = @email");

    const userExists = result.recordset.length > 0;

    if (userExists) {
      return res.status(400).json({ message: "Username or email already exists" });
    }

    // If username and email are unique, add the user to the database with plain text password
    await pool
      .request()
      .input("username", sql.VarChar, username)
      .input("password", sql.VarChar, password)
      .input("email", sql.VarChar, email)
      .query("INSERT INTO [User] (Username, Password, Email) VALUES (@username, @password, @email)");

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// For student list
app.get("/api/students", async (req, res) => {
    await poolConnect;
  
    try {
      const result = await pool
        .request()
        .query("SELECT * FROM Student");
  
      const students = result.recordset;
      res.json(students);
    } catch (error) {
      console.error("Error fetching students:", error.message);
      res.status(500).json({ message: "Internal server error" });
    }
});

// For student details
app.get("/api/students/:id", async (req, res) => {
  await poolConnect;

  const studentId = req.params.id;

  try {
    const result = await pool
      .request()
      .input("studentId", sql.Int, studentId)
      .query("SELECT * FROM Student WHERE StudentID = @studentId");

    const student = result.recordset[0];

    if (student) {
      res.json(student);
    } else {
      res.status(404).json({ message: "Student not found" });
    }
  } catch (error) {
    console.error("Error fetching student details:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// For course information for specific student that is registered in the course
app.get("/api/students/:id/courses", async (req, res) => {
  await poolConnect;

  const studentId = req.params.id;

  try {
    const result = await pool
      .request()
      .input("studentId", sql.Int, studentId)
      .query("SELECT CourseCode FROM Enrollment WHERE StudentID = @studentId");

    const courses = result.recordset;

    res.json({ courses });
  } catch (error) {
    console.error("Error fetching student courses:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});


// Endpoint to get enrollment information for a specific student
app.get("/api/students/:id/enrollments", async (req, res) => {
  await poolConnect;

  const studentId = req.params.id;

  try {
    const result = await pool
      .request()
      .input("studentId", sql.Int, studentId)
      .query("SELECT * FROM Enrollment WHERE StudentID = @studentId");

    const enrollments = result.recordset;

    if (enrollments.length > 0) {
      res.json(enrollments);
    } else {
      res.status(404).json({ message: "No enrollments found for this student" });
    }
  } catch (error) {
    console.error("Error fetching student enrollments:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});


// Endpoint to get transcript information for a specific student
app.get("/api/students/:id/transcript", async (req, res) => {
  await poolConnect;

  const studentId = req.params.id;

  try {
    const result = await pool
      .request()
      .input("studentId", sql.Int, studentId)
      .query("SELECT * FROM Transcript WHERE StudentID = @studentId");

    const transcript = result.recordset;

    if (transcript.length > 0) {
      res.json(transcript);
    } else {
      res.status(404).json({ message: "No transcript found for this student" });
    }
  } catch (error) {
    console.error("Error fetching student transcript:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});





// Endpoint to get all CourseCode from the Course table
app.get("/api/courses", async (req, res) => {
  await poolConnect;

  try {
    const result = await pool.request().query("SELECT CourseCode FROM Course");

    const courses = result.recordset;

    res.json({ courses });
  } catch (error) {
    console.error("Error fetching course codes:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});


// Endpoint to get all SemesterID from the Semester table
app.get("/api/semesters", async (req, res) => {
  await poolConnect;

  try {
    const result = await pool.request().query("SELECT SemesterID FROM Semester");

    const semesters = result.recordset;

    res.json({ semesters });
  } catch (error) {
    console.error("Error fetching semester IDs:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});




// For deleting student
app.delete("/api/students/:id", async (req, res) => {
  await poolConnect;

  const studentId = req.params.id;

  try {
    // Check if the student exists in the Student table
    const existsResult = await pool
      .request()
      .input("studentId", sql.Int, studentId)
      .query("SELECT * FROM Student WHERE StudentID = @studentId");

    const studentExists = existsResult.recordset.length > 0;

    if (!studentExists) {
      res.status(404).json({ message: "Student not found" });
      return;
    }

    // Perform cascading delete on related tables
    await pool
    .request()
    .input("studentId", sql.Int, studentId)
    .query("DELETE FROM Enrollment WHERE StudentID = @studentId");

    await pool
    .request()
    .input("studentId", sql.Int, studentId)
    .query("DELETE FROM Attendance WHERE StudentID = @studentId");

    await pool
    .request()
    .input("studentId", sql.Int, studentId)
    .query("DELETE FROM Transcript WHERE StudentID = @studentId");

    // Delete the student from the Student table
    await pool
    .request()
    .input("studentId", sql.Int, studentId)
    .query("DELETE FROM Student WHERE StudentID = @studentId");

    res.sendStatus(204);
  } catch (error) {
    console.error("Error deleting student:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// For updating student
app.put('/api/students/:id', async (req, res) => {
  await poolConnect;

  const studentId = req.params.id;
  const updatedStudent = req.body;
  
  

  try {
    console.log('Request Payload:', updatedStudent);
    // Check if the student exists in the Student table
    const existsResult = await pool
      .request()
      .input("studentId", sql.Int, studentId)
      .query("SELECT * FROM Student WHERE StudentID = @studentId");

    const studentExists = existsResult.recordset.length > 0;

    if (!studentExists) {
      res.status(404).json({ message: "Student not found" });
      return;
    }

    // Update the student record in the database
    await pool
      .request()
      .input("studentId", sql.Int, studentId)
      .input("name", sql.VarChar, updatedStudent.name)
      .input("address", sql.VarChar, updatedStudent.address)
      .input("dateOfBirth", sql.Date, new Date(updatedStudent.dateOfBirth)) // Ensure proper date format
      .input("contactInformation", sql.VarChar, updatedStudent.contactInformation)
      .query("UPDATE Student SET Name = @name, Address = @address, DateOfBirth = @dateOfBirth, ContactInformation = @contactInformation WHERE StudentID = @studentId");

    res.sendStatus(204);
  } catch (error) {
    console.error("Error updating student:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update the server code for adding a new student
app.post('/api/students', async (req, res) => {
  await poolConnect;

  const newStudent = req.body;

  try {
    // Get the last student ID from the Student table
    const lastStudentResult = await pool
      .request()
      .query("SELECT TOP 1 StudentID FROM Student ORDER BY StudentID DESC");

    const lastStudentId = lastStudentResult.recordset[0].StudentID;

    // Increment the last student ID to generate a new student ID
    const newStudentId = lastStudentId + 1;

    // Insert the new student into the Student table
    await pool
      .request()
      .input("studentId", sql.Int, newStudentId)
      .input("name", sql.VarChar, newStudent.name)
      .input("address", sql.VarChar, newStudent.address)
      .input("dateOfBirth", sql.Date, newStudent.dateOfBirth)
      .input("contactInformation", sql.VarChar, newStudent.contactInformation)
      .query("INSERT INTO Student (StudentID, Name, Address, DateOfBirth, ContactInformation) VALUES (@studentId, @name, @address, @dateOfBirth, @contactInformation)");

    res.status(201).json({ message: "New student added successfully" });
  } catch (error) {
    console.error("Error adding new student:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// For getting attendance
app.get("/api/students/:id/attendance", async (req, res) => {
  await poolConnect;

  const studentId = req.params.id;

  try {
    const result = await pool
      .request()
      .input("studentId", sql.Int, studentId)
      .query("SELECT AttendanceID, StudentID, CourseCode, AttendanceDate, Status, SemesterID FROM Attendance WHERE StudentID = @studentId");

    const attendance = result.recordset[0];

    if (attendance) {
      res.json(attendance);
    } else {
      res.status(404).json({ message: "Attendance not found" });
    }
  } catch (error) {
    console.error("Error fetching attendance details:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

//For updating attendance
app.put("/api/students/:id/attendance", async (req, res) => {
  await poolConnect;

  const studentId = req.params.id;
  const updatedAttendance = req.body;

  try {
    const result = await pool
      .request()
      .input("studentId", sql.Int, studentId)
      .input("courseCode", sql.VarChar, updatedAttendance.courseCode)
      .input("attendanceDate", sql.Date, new Date(updatedAttendance.attendanceDate))
      .input("status", sql.VarChar, updatedAttendance.status)
      .input("semesterId", sql.Int, updatedAttendance.semesterId)
      .query("UPDATE Attendance SET CourseCode = @courseCode, AttendanceDate = @attendanceDate, Status = @status, SemesterID = @semesterId WHERE StudentID = @studentId");
  }

  catch (error) {
    console.error("Error updating attendance details:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});


app.post("/api/students/:id/attendance", async (req, res) => {
  const newAttendance = req.body;

  try {
    // Get the current maximum AttendanceID
    const resultMaxId = await pool
      .request()
      .query("SELECT MAX(AttendanceID) AS MaxID FROM Attendance");

    // Calculate the new AttendanceID
    const newAttendanceID = resultMaxId.recordset[0].MaxID + 1;

    // Insert the new record with the calculated AttendanceID
    const result = await pool
      .request()
      .input("attendanceId", sql.Int, newAttendanceID)
      .input("studentId", sql.Int, req.params.id)
      .input("courseCode", sql.VarChar, newAttendance.courseCode)
      .input("attendanceDate", sql.Date, new Date(newAttendance.attendanceDate))
      .input("status", sql.VarChar, newAttendance.status)
      .input("semesterId", sql.VarChar, newAttendance.semesterId)
      .query("INSERT INTO Attendance (AttendanceID, StudentID, CourseCode, AttendanceDate, Status, SemesterID) VALUES (@attendanceId, @studentId, @courseCode, @attendanceDate, @status, @semesterId)");

    res.status(201).json({ message: 'Attendance record added successfully' });
  } catch (error) {
    console.error("Error adding attendance record:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});



//For adding enrollment
app.post("/api/students/:id/enrollment", async (req, res) => {
  const newEnrollment = req.body;

  try {
    await poolConnect;

    // Query to get the last EnrollmentID from the Enrollment table
    const getLastEnrollmentIdResult = await pool
      .request()
      .query("SELECT TOP 1 EnrollmentID FROM Enrollment ORDER BY EnrollmentID DESC");

    const lastEnrollmentId = getLastEnrollmentIdResult.recordset[0].EnrollmentID;
    const newEnrollmentId = lastEnrollmentId + 1;

    const result = await pool
      .request()
      .input("enrollmentId", sql.Int, newEnrollmentId)
      .input("studentId", sql.Int, newEnrollment.studentId)
      .input("courseId", sql.Int, newEnrollment.courseId)
      .input("semesterId", sql.Int, newEnrollment.semesterId)
      .query("INSERT INTO Enrollment (EnrollmentID, StudentID, CourseID, SemesterID) VALUES (@enrollmentId, @studentId, @courseId, @semesterId)");

    res.status(201).json({ message: "New enrollment added successfully" });
  } catch (error) {
    console.error("Error adding new enrollment:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});


app.listen(3001, () => {
  console.log("Server is running on port 3001");
});