import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import './App.css';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Register from './components/Register';
import StudentList from "./components/StudentList";
import StudentListDisplay from './components/StudentListDisplay';
import StudentDetails from './components/StudentDetails';
import EditStudentForm from './components/EditStudentForm';
import NewStudentForm from './components/NewStudentForm';
import ExportData from './components/ExportData';
import { useEffect, useState } from 'react';

function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [email, setEmail] = useState("")

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home email={email} loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>} />
          <Route path="/login" element={<Login setLoggedIn={setLoggedIn} setEmail={setEmail} />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/register" element={<Register />} />
          <Route path="/student-list" element={<StudentList />} />
          <Route path="/student-list-display" element={<StudentListDisplay />} />
          <Route exact path="/" component={StudentList} />
          <Route path="/students/:id" element={<StudentDetails />} />
          <Route path="/edit-student/:studentId" element={<EditStudentForm />} />
          <Route path="/create-student" element={<NewStudentForm />} />
          <Route path="/export-data" element={<ExportData />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
