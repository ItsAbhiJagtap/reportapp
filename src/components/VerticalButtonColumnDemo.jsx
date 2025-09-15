import React, { useState } from 'react';
import VerticalButtonColumn from './VerticalButtonColumn';
import './VerticalButtonColumn.css';

// Sample data for demonstration
const sampleData = [
  { id: 1, name: 'John Doe', email: 'john@example.com', department: 'Engineering', salary: 75000 },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', department: 'Marketing', salary: 65000 },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', department: 'Sales', salary: 70000 },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', department: 'HR', salary: 60000 },
  { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', department: 'Engineering', salary: 80000 },
  { id: 6, name: 'Diana Davis', email: 'diana@example.com', department: 'Finance', salary: 72000 },
  { id: 7, name: 'Eve Miller', email: 'eve@example.com', department: 'Operations', salary: 68000 },
  { id: 8, name: 'Frank Garcia', email: 'frank@example.com', department: 'Engineering', salary: 78000 },
  { id: 9, name: 'Grace Lee', email: 'grace@example.com', department: 'Marketing', salary: 62000 },
  { id: 10, name: 'Henry Taylor', email: 'henry@example.com', department: 'Sales', salary: 71000 }
];

const VerticalButtonColumnDemo = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showCustomReport, setShowCustomReport] = useState(false);

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection);
  };

  const handleCustomReport = (selectedIndices) => {
    console.log('Custom report for rows:', selectedIndices);
    setShowCustomReport(true);
    // Here you would typically open a modal or navigate to a custom report page
  };

  return (
    <div className={`demo-container ${isDarkMode ? 'dark' : ''}`}>
      <div className="demo-header">
        <h2>Vertical Button Column Demo</h2>
        <button 
          className="theme-toggle"
          onClick={() => setIsDarkMode(!isDarkMode)}
        >
          {isDarkMode ? '☀️ Light' : '🌙 Dark'} Mode
        </button>
      </div>

      <div className="demo-content">
        {/* Data Table */}
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selectedRows.length === sampleData.length && sampleData.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedRows(sampleData.map((_, index) => index));
                      } else {
                        setSelectedRows([]);
                      }
                    }}
                  />
                </th>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Salary</th>
              </tr>
            </thead>
            <tbody>
              {sampleData.map((row, index) => (
                <tr 
                  key={row.id}
                  className={selectedRows.includes(index) ? 'selected' : ''}
                >
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(index)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedRows([...selectedRows, index]);
                        } else {
                          setSelectedRows(selectedRows.filter(i => i !== index));
                        }
                      }}
                    />
                  </td>
                  <td>{row.id}</td>
                  <td>{row.name}</td>
                  <td>{row.email}</td>
                  <td>{row.department}</td>
                  <td>${row.salary.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Vertical Button Column */}
        <VerticalButtonColumn
          data={sampleData}
          selectedRows={selectedRows}
          onSelectionChange={handleSelectionChange}
          onCustomReport={handleCustomReport}
          isDarkMode={isDarkMode}
          showTooltips={true}
          enableKeyboardShortcuts={true}
          enableConfirmation={true}
        />
      </div>

      {/* Custom Report Modal */}
      {showCustomReport && (
        <div className="modal-overlay" onClick={() => setShowCustomReport(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Custom Report</h3>
            <p>Selected {selectedRows.length} rows for custom report generation.</p>
            <p>This would typically open a form to select fields, filters, and export options.</p>
            <button 
              className="modal-close"
              onClick={() => setShowCustomReport(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerticalButtonColumnDemo;
