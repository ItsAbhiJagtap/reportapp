import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckSquare, 
  Square, 
  FileSpreadsheet, 
  FileText, 
  FileBarChart, 
  Loader,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const VerticalButtonColumn = ({
  data = [],
  selectedRows = [],
  onSelectionChange,
  onCustomReport,
  isDarkMode = false,
  className = '',
  showTooltips = true,
  enableKeyboardShortcuts = true,
  enableConfirmation = true
}) => {
  const [isExporting, setIsExporting] = useState({ excel: false, pdf: false });
  const [showConfirm, setShowConfirm] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isAllSelected, setIsAllSelected] = useState(false);

  // Check if all rows are selected
  useEffect(() => {
    setIsAllSelected(selectedRows.length === data.length && data.length > 0);
  }, [selectedRows, data]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!enableKeyboardShortcuts) return;

    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'a':
            e.preventDefault();
            handleSelectAll();
            break;
        }
      } else if (e.key === 'Escape') {
        if (showConfirm) {
          setShowConfirm(false);
        } else {
          handleDeselectAll();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [enableKeyboardShortcuts, showConfirm, selectedRows, data]);

  // Show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Select All functionality
  const handleSelectAll = useCallback(() => {
    if (isAllSelected) {
      onSelectionChange([]);
      showNotification('All rows deselected', 'info');
    } else {
      onSelectionChange(data.map((_, index) => index));
      showNotification(`All ${data.length} rows selected`, 'success');
    }
  }, [isAllSelected, data, onSelectionChange]);

  // Deselect All functionality
  const handleDeselectAll = useCallback(() => {
    if (enableConfirmation && selectedRows.length > 0) {
      setShowConfirm(true);
    } else {
      onSelectionChange([]);
      showNotification('Selection cleared', 'info');
    }
  }, [selectedRows, onSelectionChange, enableConfirmation]);

  const confirmDeselectAll = () => {
    onSelectionChange([]);
    setShowConfirm(false);
    showNotification('Selection cleared', 'info');
  };

  // Export to Excel
  const handleExportExcel = async () => {
    if (selectedRows.length === 0) return;
    
    setIsExporting(prev => ({ ...prev, excel: true }));
    
    try {
      const selectedData = selectedRows.map(index => data[index]);
      const ws = XLSX.utils.json_to_sheet(selectedData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Data');
      
      const fileName = `export-${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(wb, fileName);
      
      showNotification(`Exported ${selectedRows.length} rows to Excel`, 'success');
    } catch (error) {
      console.error('Excel export error:', error);
      showNotification('Excel export failed', 'error');
    } finally {
      setIsExporting(prev => ({ ...prev, excel: false }));
    }
  };

  // Export to PDF
  const handleExportPDF = async () => {
    if (selectedRows.length === 0) return;
    
    setIsExporting(prev => ({ ...prev, pdf: true }));
    
    try {
      const selectedData = selectedRows.map(index => data[index]);
      const doc = new jsPDF('l', 'mm', 'a4');
      
      // Add title
      doc.setFontSize(16);
      doc.text('Data Export', 14, 22);
      doc.setFontSize(10);
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30);
      doc.text(`Records: ${selectedRows.length}`, 14, 35);
      
      // Prepare table data
      if (selectedData.length > 0) {
        const headers = Object.keys(selectedData[0]);
        const tableData = selectedData.map(row => 
          headers.map(header => row[header] || '')
        );
        
        doc.autoTable({
          head: [headers],
          body: tableData,
          startY: 40,
          styles: { fontSize: 8 },
          headStyles: { fillColor: [220, 38, 38] }, // Red header
          alternateRowStyles: { fillColor: [249, 250, 251] }
        });
      }
      
      const fileName = `export-${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      
      showNotification(`Exported ${selectedRows.length} rows to PDF`, 'success');
    } catch (error) {
      console.error('PDF export error:', error);
      showNotification('PDF export failed', 'error');
    } finally {
      setIsExporting(prev => ({ ...prev, pdf: false }));
    }
  };

  // Custom Report
  const handleCustomReport = () => {
    if (onCustomReport) {
      onCustomReport(selectedRows);
    }
  };

  // Button configurations
  const buttons = [
    {
      id: 'select-all',
      label: isAllSelected ? 'Deselect All' : 'Select All',
      icon: isAllSelected ? CheckSquare : Square,
      color: 'green',
      onClick: handleSelectAll,
      disabled: data.length === 0,
      tooltip: isAllSelected ? 'Deselect all rows' : 'Select all rows',
      shortcut: 'Ctrl+A'
    },
    {
      id: 'export-excel',
      label: 'Export to Excel',
      icon: FileSpreadsheet,
      color: 'green',
      onClick: handleExportExcel,
      disabled: selectedRows.length === 0,
      loading: isExporting.excel,
      tooltip: selectedRows.length === 0 ? 'Select rows to export' : `Export ${selectedRows.length} rows to Excel`
    },
    {
      id: 'export-pdf',
      label: 'Export to PDF',
      icon: FileText,
      color: 'red',
      onClick: handleExportPDF,
      disabled: selectedRows.length === 0,
      loading: isExporting.pdf,
      tooltip: selectedRows.length === 0 ? 'Select rows to export' : `Export ${selectedRows.length} rows to PDF`
    },
    {
      id: 'custom-report',
      label: 'Custom Report',
      icon: FileBarChart,
      color: 'blue',
      onClick: handleCustomReport,
      disabled: false,
      tooltip: 'Create custom report with filters'
    },
    {
      id: 'deselect-all',
      label: 'Clear Selection',
      icon: XCircle,
      color: 'red',
      onClick: handleDeselectAll,
      disabled: selectedRows.length === 0,
      tooltip: selectedRows.length === 0 ? 'No selection to clear' : `Clear ${selectedRows.length} selected rows`
    }
  ];

  return (
    <div className={`vertical-button-column ${isDarkMode ? 'dark' : ''} ${className}`}>
      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`notification notification-${notification.type}`}
          >
            {notification.type === 'success' && <CheckCircle className="w-4 h-4" />}
            {notification.type === 'error' && <XCircle className="w-4 h-4" />}
            {notification.type === 'info' && <AlertTriangle className="w-4 h-4" />}
            <span>{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="confirmation-overlay"
            onClick={() => setShowConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="confirmation-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <h3>Clear Selection?</h3>
              <p>This will deselect all {selectedRows.length} selected rows.</p>
              <div className="confirmation-buttons">
                <button 
                  className="btn-confirm-cancel"
                  onClick={() => setShowConfirm(false)}
                >
                  Cancel
                </button>
                <button 
                  className="btn-confirm-danger"
                  onClick={confirmDeselectAll}
                >
                  Clear Selection
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Button Column */}
      <div className="button-column">
        {buttons.map((button, index) => {
          const IconComponent = button.icon;
          return (
            <motion.button
              key={button.id}
              className={`action-button action-button-${button.color} ${
                button.disabled ? 'disabled' : ''
              } ${button.loading ? 'loading' : ''}`}
              onClick={button.onClick}
              disabled={button.disabled}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={!button.disabled ? { scale: 1.02 } : {}}
              whileTap={!button.disabled ? { scale: 0.98 } : {}}
              aria-label={button.tooltip}
              title={showTooltips ? button.tooltip : undefined}
            >
              <span className="button-border"></span>
              <span className="button-border"></span>
              <span className="button-border"></span>
              <span className="button-border"></span>
              
              <div className="button-content">
                {button.loading ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <IconComponent className="w-4 h-4" />
                )}
                <span className="button-label">{button.label}</span>
                {button.shortcut && (
                  <span className="button-shortcut">{button.shortcut}</span>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Status Info */}
      <div className="status-info">
        <div className="selection-count">
          {selectedRows.length} of {data.length} selected
        </div>
        {enableKeyboardShortcuts && (
          <div className="keyboard-hints">
            <small>Ctrl+A: Select All • Esc: Clear</small>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerticalButtonColumn;
