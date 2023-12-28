import React, { useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ExportData = () => {
  const [studentId, setStudentId] = useState('');

  const handleStudentIdChange = (event) => {
    setStudentId(event.target.value);
  };

  const handleExportData = async () => {
    try {
      const responses = await Promise.all([
        fetch(`http://localhost:3001/api/students/${studentId}`),
        fetch(`http://localhost:3001/api/students/${studentId}/attendance`),
        fetch(`http://localhost:3001/api/students/${studentId}/enrollments`),
        fetch(`http://localhost:3001/api/students/${studentId}/transcript`),
      ]);

      const data = await Promise.all(responses.map((response) => response.json()));

      // Generate PDF
      const doc = new jsPDF();
      doc.text('Fetched Data:', 10, 20);

      let y = 30; // Starting y-coordinate for the text

      data.forEach((item, index) => {
        const lines = doc.splitTextToSize(JSON.stringify(item, null, 2), 180);
        doc.text(lines, 10, y);
        y += lines.length * 10 + 10; // Increase the y-coordinate for the next set of data
      });

      // Save the PDF
      doc.save('FetchedData.pdf');
    } catch (error) {
      console.error('Error fetching or exporting data:', error.message);
    }
  };

  return (
    <div>
      <div>
        <label htmlFor="studentId">Enter Student ID:</label>
        <input
          type="text"
          id="studentId"
          value={studentId}
          onChange={handleStudentIdChange}
          placeholder="Enter Student ID"
        />
        <button onClick={handleExportData}>Fetch and Export Data</button>
      </div>
    </div>
  );
};

export default ExportData;