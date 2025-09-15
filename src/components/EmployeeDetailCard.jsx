import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Briefcase, MapPin, Calendar, DollarSign, Activity } from 'lucide-react';

const Row = ({ label, value }) => (
  <div className="flex items-center justify-between text-sm">
    <span className="text-gray-500 dark:text-gray-400">{label}</span>
    <span className="font-medium text-gray-900 dark:text-gray-100">{value}</span>
  </div>
);

const EmployeeDetailCard = ({ employee, onClear, isDarkMode }) => {
  if (!employee) return null;
  return (
    <motion.div
      initial={{ x: 40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 40, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      className={`fixed top-24 right-6 z-40 w-[360px] max-w-[90vw] rounded-2xl p-5 shadow-2xl border ${isDarkMode ? 'bg-gray-800/90 border-gray-700' : 'bg-white/90 border-gray-200'} backdrop-blur`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-base font-semibold">Employee Details</h3>
        </div>
        <button onClick={onClear} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">Clear</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Row label="Name" value={employee.name} />
        <Row label="Email" value={employee.email} />
        <Row label="Department" value={employee.department} />
        <Row label="Position" value={employee.position} />
        <Row label="Location" value={employee.location} />
        <Row label="Status" value={employee.status} />
        <Row label="Start Date" value={new Date(employee.startDate).toLocaleDateString()} />
        <Row label="Salary" value={new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(employee.salary)} />
        <Row label="Performance" value={`${employee.performance.toFixed(1)}/5`} />
      </div>
    </motion.div>
  );
};

export default EmployeeDetailCard;


