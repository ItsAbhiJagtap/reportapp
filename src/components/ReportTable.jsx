import React from 'react';
import { motion } from 'framer-motion';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import Sparkline from './Sparkline';

const ReportTable = ({
  data,
  columnDefinitions,
  visibleColumns,
  sortConfig,
  onSort,
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  onPageChange,
  summaryData,
  isDarkMode,
  onRowClick,
  compact = false
}) => {
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

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <ChevronUp className="w-4 h-4 opacity-30" />;
    }
    return sortConfig.direction === 'asc' 
      ? <ChevronUp className="w-4 h-4 text-blue-600" />
      : <ChevronDown className="w-4 h-4 text-blue-600" />;
  };

  const visibleColumnDefs = columnDefinitions.filter(col => visibleColumns.includes(col.key));

  const salaryMin = React.useMemo(() => Math.min(...data.map(d => d.salary || 0)), [data]);
  const salaryMax = React.useMemo(() => Math.max(...data.map(d => d.salary || 0)), [data]);
  const heatmapBg = (val) => {
    if (val == null || isNaN(val) || salaryMax === salaryMin) return '';
    const t = (val - salaryMin) / (salaryMax - salaryMin);
    const alpha = 0.2 + t * 0.5; // 0.2 - 0.7
    return `bg-[rgba(59,130,246,${alpha})] dark:bg-[rgba(59,130,246,${alpha})]`;
  };

  const StatusBadge = ({ value }) => {
    const isActive = String(value).toLowerCase() === 'active';
    const cls = isActive
      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
      : 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300';
    return <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${cls}`}>{value}</span>;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.1 }}
      className={`gradient-border rounded-2xl shadow-2xl overflow-hidden ${
        isDarkMode ? 'bg-gray-800/90' : 'bg-white/90'
      } backdrop-blur`}
    >
      {/* Summary Row */}
      {summaryData && (
        <div className={`p-4 border-b ${
          isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-blue-50 border-gray-200'
        }`}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-600 dark:text-gray-400">Total Employees:</span>
              <span className="ml-2 font-semibold text-gray-900 dark:text-white">
                {summaryData.totalEmployees}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-600 dark:text-gray-400">Total Salary:</span>
              <span className="ml-2 font-semibold text-gray-900 dark:text-white">
                {formatValue(summaryData.totalSalary, 'currency')}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-600 dark:text-gray-400">Avg Salary:</span>
              <span className="ml-2 font-semibold text-gray-900 dark:text-white">
                {formatValue(summaryData.avgSalary, 'currency')}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-600 dark:text-gray-400">Avg Performance:</span>
              <span className="ml-2 font-semibold text-gray-900 dark:text-white">
                {summaryData.avgPerformance.toFixed(1)}/5.0
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-auto max-h-[60vh]">
        <table className={`min-w-full divide-y divide-gray-200 dark:divide-gray-700 ${compact ? 'text-sm' : 'text-base'}`}>
          <thead className={`${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
          }`}>
            <tr>
              {visibleColumnDefs.map((column) => (
                <th
                  key={column.key}
                  onClick={() => column.sortable && onSort(column.key)}
                  className={`table-header sticky top-0 z-20 backdrop-blur ${compact ? 'py-2' : ''} ${
                    column.sortable ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {column.sortable && getSortIcon(column.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={`divide-y ${
            isDarkMode ? 'divide-gray-700 bg-gray-800' : 'divide-gray-200 bg-white'
          }`}>
            {data.map((row, index) => (
              <motion.tr
                key={row.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: Math.min(index * 0.03, 0.2) }}
                className={`hover:${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                } transition-colors duration-200`}
              onClick={() => onRowClick && onRowClick(row)}
              >
                {visibleColumnDefs.map((column) => {
                  const raw = row[column.key];
                  let content;
                  if (column.key === 'status') {
                    content = <StatusBadge value={raw} />;
                  } else if (column.key === 'performance') {
                    // create a tiny synthetic trend around performance
                    const seed = (row.id % 5) + 3;
                    const points = Array.from({ length: 10 }, (_, i) => ({ v: Math.max(2, Math.min(5, raw + Math.sin((i + seed) * 0.7) * 0.3)) }));
                    content = (
                      <div className="flex items-center gap-2">
                        <span>{formatValue(raw, column.type)}</span>
                        <Sparkline data={points} color="#10B981" />
                      </div>
                    );
                  } else {
                    content = formatValue(raw, column.type);
                  }
                  const cellHeat = column.key === 'salary' ? heatmapBg(raw) : '';
                  return (
                    <td key={column.key} className={`table-cell ${compact ? 'px-3 py-2' : ''} ${cellHeat}`}>
                      {content}
                    </td>
                  );
                })}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className={`px-6 py-4 border-t ${
        isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
      }`}>
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} results
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                currentPage === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => onPageChange(pageNum)}
                    className={`px-3 py-1 rounded-lg text-sm transition-colors duration-200 ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                currentPage === totalPages
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ReportTable;
