import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileSpreadsheet, FileText, Loader } from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ExportButtons = ({ data, visibleColumns, columnDefinitions, isDarkMode, chartImages }) => {
  const [isExporting, setIsExporting] = useState({ excel: false, pdf: false });

  const formatValue = (value, type) => {
    switch (type) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(value);
      case 'date':
        return new Date(value).toLocaleDateString();
      case 'number':
        return typeof value === 'number' ? value.toFixed(1) : value;
      default:
        return value;
    }
  };

  const exportToExcel = async () => {
    setIsExporting(prev => ({ ...prev, excel: true }));
    
    try {
      // Get visible column definitions
      const visibleColumnDefs = columnDefinitions.filter(col => visibleColumns.includes(col.key));
      
      // Prepare data for export
      const exportData = data.map(row => {
        const exportRow = {};
        visibleColumnDefs.forEach(col => {
          exportRow[col.label] = formatValue(row[col.key], col.type);
        });
        return exportRow;
      });

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportData);

      // Set column widths
      const colWidths = visibleColumnDefs.map(col => {
        const maxLength = Math.max(
          col.label.length,
          ...data.map(row => String(formatValue(row[col.key], col.type)).length)
        );
        return { wch: Math.min(maxLength + 2, 30) };
      });
      ws['!cols'] = colWidths;

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Employee Data');

      // Generate and download file
      const fileName = `employee-report-${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(wb, fileName);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      alert('Error exporting to Excel. Please try again.');
    } finally {
      setIsExporting(prev => ({ ...prev, excel: false }));
    }
  };

  const exportToPDF = async () => {
    setIsExporting(prev => ({ ...prev, pdf: true }));
    
    try {
      // Get visible column definitions
      const visibleColumnDefs = columnDefinitions.filter(col => visibleColumns.includes(col.key));
      
      // Create new PDF document
      const doc = new jsPDF('l', 'mm', 'a4'); // landscape orientation
      
      // Add title
      doc.setFontSize(16);
      doc.text('Employee Report', 14, 22);
      
      // Add date
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
      
      // Add charts if available
      let currentY = 30;
      const gap = 4;
      const chartWidth = 80; // mm
      const chartHeight = 60; // mm
      if (chartImages?.pie) {
        doc.addImage(chartImages.pie, 'PNG', 14, currentY, chartWidth, chartHeight, undefined, 'FAST');
      }
      if (chartImages?.bar) {
        doc.addImage(chartImages.bar, 'PNG', 14 + chartWidth + gap, currentY, chartWidth, chartHeight, undefined, 'FAST');
      }
      if (chartImages?.line) {
        doc.addImage(chartImages.line, 'PNG', 14 + (chartWidth + gap) * 2, currentY, chartWidth, chartHeight, undefined, 'FAST');
      }
      currentY += chartHeight + 10;

      // Prepare table data
      const tableData = data.map(row => 
        visibleColumnDefs.map(col => formatValue(row[col.key], col.type))
      );
      
      const tableHeaders = visibleColumnDefs.map(col => col.label);
      
      // Add table
      doc.autoTable({
        head: [tableHeaders],
        body: tableData,
        startY: Math.max(currentY, 40),
        styles: {
          fontSize: 8,
          cellPadding: 3,
        },
        headStyles: {
          fillColor: [59, 130, 246], // blue-500
          textColor: 255,
          fontStyle: 'bold',
        },
        alternateRowStyles: {
          fillColor: [249, 250, 251], // gray-50
        },
        margin: { left: 14, right: 14 },
        tableWidth: 'auto',
        columnStyles: {
          // Make certain columns narrower
          [tableHeaders.findIndex(h => h === 'ID')]: { cellWidth: 15 },
          [tableHeaders.findIndex(h => h === 'Status')]: { cellWidth: 20 },
          [tableHeaders.findIndex(h => h === 'Category')]: { cellWidth: 25 },
        }
      });

      // Add summary information
      const finalY = doc.lastAutoTable.finalY + 10;
      doc.setFontSize(10);
      doc.text(`Total Records: ${data.length}`, 14, finalY);
      
      // Generate and download file
      const fileName = `employee-report-${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      alert('Error exporting to PDF. Please try again.');
    } finally {
      setIsExporting(prev => ({ ...prev, pdf: false }));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="flex gap-3"
    >
      <motion.button
        onClick={exportToExcel}
        disabled={isExporting.excel || data.length === 0}
        className={`neon-button-green flex items-center gap-2 ${
          isExporting.excel ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        {isExporting.excel ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <FileSpreadsheet className="w-4 h-4" />
        )}
        Export to Excel
      </motion.button>

      <motion.button
        onClick={exportToPDF}
        disabled={isExporting.pdf || data.length === 0}
        className={`neon-button-red flex items-center gap-2 ${
          isExporting.pdf ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        {isExporting.pdf ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <FileText className="w-4 h-4" />
        )}
        Export to PDF
      </motion.button>

      {data.length === 0 && (
        <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
          No data to export
        </span>
      )}
    </motion.div>
  );
};

export default ExportButtons;
