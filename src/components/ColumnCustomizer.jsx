import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Check, X } from 'lucide-react';

const ColumnCustomizer = ({ columns, visibleColumns, onColumnToggle, isDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleColumnToggle = (columnKey) => {
    onColumnToggle(columnKey);
  };

  const selectAll = () => {
    columns.forEach(col => {
      if (!visibleColumns.includes(col.key)) {
        onColumnToggle(col.key);
      }
    });
  };

  const deselectAll = () => {
    visibleColumns.forEach(colKey => {
      onColumnToggle(colKey);
    });
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="neon-button flex items-center gap-2"
        aria-label="Customize columns"
      >
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <Menu className="w-4 h-4" />
        Columns
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40">
            <div className="absolute inset-0 bg-black/30" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ x: 320 }}
              animate={{ x: 0 }}
              exit={{ x: 320 }}
              transition={{ type: 'spring', stiffness: 260, damping: 28 }}
              className={`absolute right-0 top-0 bottom-0 w-80 p-4 overflow-y-auto ${
                isDarkMode ? 'bg-gray-800 border-l border-gray-700' : 'bg-white border-l border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Column Visibility
                </h4>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 mb-4">
                {columns.map((column) => (
                  <label
                    key={column.key}
                    className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors duration-200"
                  >
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={visibleColumns.includes(column.key)}
                        onChange={() => handleColumnToggle(column.key)}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                        visibleColumns.includes(column.key)
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 border-blue-600 shadow-md'
                          : isDarkMode
                          ? 'border-gray-600 bg-gray-700 hover:border-gray-500'
                          : 'border-gray-300 bg-white hover:border-gray-400'
                      }`}>
                        {visibleColumns.includes(column.key) && (
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </div>
                    </div>
                    <span className="text-sm text-gray-900 dark:text-white">
                      {column.label}
                    </span>
                  </label>
                ))}
              </div>

              <div className="flex gap-2 pt-3 border-t border-gray-200 dark:border-gray-600">
                <button
                  onClick={selectAll}
                  className="neon-button-green flex items-center gap-2 flex-1"
                >
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  Select All
                </button>
                <button
                  onClick={deselectAll}
                  className="neon-button-red flex items-center gap-2 flex-1"
                >
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  Deselect All
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ColumnCustomizer;
