import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download } from 'lucide-react';
import { sampleData, columnDefinitions } from './data/sampleData';
import SearchPanel from './components/SearchPanel';
import ReportTable from './components/ReportTable';
import ColumnCustomizer from './components/ColumnCustomizer';
import ExportButtons from './components/ExportButtons';
import DarkModeToggle from './components/DarkModeToggle';
import KPICards from './components/KPICards';
import ChartsPanel from './components/ChartsPanel';
import html2canvas from 'html2canvas';
import CSSParticlesBackground from './components/CSSParticlesBackground';
import EmployeeDetailCard from './components/EmployeeDetailCard';
import NotificationSystem from './components/NotificationSystem';
import CustomReportModal from './components/CustomReportModal';
import useRealTimeData from './hooks/useRealTimeData';

function App() {
  const { data } = useRealTimeData(sampleData);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    department: '',
    status: '',
    category: '',
    location: '',
    dateRange: { start: '', end: '' }
  });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [visibleColumns, setVisibleColumns] = useState(
    columnDefinitions.map(col => col.key)
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [chartImages, setChartImages] = useState({ pie: null, bar: null, line: null });
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [animateCharts, setAnimateCharts] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [showCustomReport, setShowCustomReport] = useState(false);
  const [columnOrder, setColumnOrder] = useState(columnDefinitions.map(col => col.key));

  // Refs for chart snapshots
  const pieRef = useRef(null);
  const barRef = useRef(null);
  const lineRef = useRef(null);

  // Filter and search data
  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchesSearch = Object.values(item).some(value =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      );

      const matchesFilters = Object.entries(filters).every(([key, filterValue]) => {
        if (key === 'dateRange') {
          if (!filterValue.start && !filterValue.end) return true;
          const itemDate = new Date(item.startDate);
          const startDate = filterValue.start ? new Date(filterValue.start) : null;
          const endDate = filterValue.end ? new Date(filterValue.end) : null;
          
          if (startDate && endDate) {
            return itemDate >= startDate && itemDate <= endDate;
          } else if (startDate) {
            return itemDate >= startDate;
          } else if (endDate) {
            return itemDate <= endDate;
          }
          return true;
        }
        
        if (!filterValue) return true;
        return String(item[key]).toLowerCase().includes(filterValue.toLowerCase());
      });

      return matchesSearch && matchesFilters;
    });
  }, [data, searchTerm, filters]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleColumnToggle = (columnKey) => {
    setVisibleColumns(prev => 
      prev.includes(columnKey)
        ? prev.filter(col => col !== columnKey)
        : [...prev, columnKey]
    );
  };

  const handleColumnReorder = (newOrder) => {
    setColumnOrder(newOrder);
    setVisibleColumns(newOrder.filter(col => visibleColumns.includes(col)));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Calculate summary data
  const summaryData = useMemo(() => {
    if (sortedData.length === 0) return null;
    
    const totalSalary = sortedData.reduce((sum, item) => sum + item.salary, 0);
    const avgSalary = totalSalary / sortedData.length;
    const avgPerformance = sortedData.reduce((sum, item) => sum + item.performance, 0) / sortedData.length;
    
    return {
      totalEmployees: sortedData.length,
      totalSalary,
      avgSalary,
      avgPerformance
    };
  }, [sortedData]);

  // KPI metrics
  const kpis = useMemo(() => {
    if (!summaryData) return {
      totalEmployees: 0, totalSalary: 0, avgSalary: 0, avgPerformance: 0,
      employeeTrend: 0, salaryTrend: 0, avgSalaryTrend: 0, performanceTrend: 0
    };
    // Basic trend placeholders (could be computed vs previous filter state)
    return {
      totalEmployees: summaryData.totalEmployees,
      totalSalary: summaryData.totalSalary,
      avgSalary: summaryData.avgSalary,
      avgPerformance: summaryData.avgPerformance,
      employeeTrend: 2,
      salaryTrend: 1.5,
      avgSalaryTrend: 0.8,
      performanceTrend: 0.3,
    };
  }, [summaryData]);

  // Persist preferences to localStorage
  useEffect(() => {
    const storedDark = localStorage.getItem('isDarkMode');
    const storedCols = localStorage.getItem('visibleColumns');
    const storedSearch = localStorage.getItem('searchTerm');
    const storedFilters = localStorage.getItem('filters');
    if (storedDark !== null) setIsDarkMode(storedDark === 'true');
    if (storedCols) {
      try {
        const parsed = JSON.parse(storedCols);
        if (Array.isArray(parsed)) setVisibleColumns(parsed);
      } catch {}
    }
    if (storedSearch) setSearchTerm(storedSearch);
    if (storedFilters) {
      try { 
        const f = JSON.parse(storedFilters); 
        if (f && typeof f === 'object') {
          // Validate filters to ensure they don't break the app
          const validFilters = {
            department: f.department || '',
            status: f.status || '',
            category: f.category || '',
            location: f.location || '',
            dateRange: f.dateRange || { start: '', end: '' }
          };
          setFilters(validFilters);
        }
      } catch {}
    }
    // Detect reduced motion
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mq.matches);
    const handler = (e) => setReduceMotion(e.matches);
    mq.addEventListener ? mq.addEventListener('change', handler) : mq.addListener(handler);
    return () => {
      mq.removeEventListener ? mq.removeEventListener('change', handler) : mq.removeListener(handler);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('isDarkMode', String(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('visibleColumns', JSON.stringify(visibleColumns));
  }, [visibleColumns]);

  useEffect(() => {
    localStorage.setItem('searchTerm', searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    localStorage.setItem('filters', JSON.stringify(filters));
  }, [filters]);

  // Capture chart images for PDF export when data changes
  useEffect(() => {
    const capture = async () => {
      const opts = { backgroundColor: isDarkMode ? '#111827' : '#ffffff', scale: 2 };
      const [pieEl, barEl, lineEl] = [pieRef.current, barRef.current, lineRef.current];
      const imgs = { pie: null, bar: null, line: null };
      if (pieEl) imgs.pie = (await html2canvas(pieEl, opts)).toDataURL('image/png');
      if (barEl) imgs.bar = (await html2canvas(barEl, opts)).toDataURL('image/png');
      if (lineEl) imgs.line = (await html2canvas(lineEl, opts)).toDataURL('image/png');
      setChartImages(imgs);
    };
    // Debounce capture to avoid rapid consecutive renders
    const id = setTimeout(capture, 50);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortedData, isDarkMode]);

  // Disable heavy chart animations after first paint to keep interactions smooth
  useEffect(() => {
    if (!animateCharts) return;
    const id = setTimeout(() => setAnimateCharts(false), 1200);
    return () => clearTimeout(id);
  }, [animateCharts]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      {/* Professional background gradient */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="pointer-events-none fixed inset-0 -z-10"
      >
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full blur-3xl opacity-30"
             style={{ background: 'radial-gradient(circle at center, rgba(59,130,246,0.6), rgba(59,130,246,0))' }}></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full blur-3xl opacity-22"
             style={{ background: 'radial-gradient(circle at center, rgba(16,185,129,0.55), rgba(16,185,129,0))' }}></div>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full blur-3xl opacity-18"
             style={{ background: 'radial-gradient(circle at center, rgba(245,158,11,0.45), rgba(245,158,11,0))' }}></div>
      </motion.div>
        <CSSParticlesBackground isDarkMode={isDarkMode} reduceMotion={reduceMotion} />
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex justify-between items-start mb-8">
            <div className="flex-1 pr-8">
              <h1 className="premium-title gradient-text">
                Employee Reporting Dashboard
              </h1>
              <motion.p 
                initial={{ opacity: 0, y: 6 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.4, delay: 0.05 }} 
                className="premium-subtitle text-gray-600 dark:text-gray-300"
              >
                Search, analyze, and export workforce insights with advanced filtering and real-time data visualization
              </motion.p>
            </div>
            <div className="flex items-center gap-3">
              <ColumnCustomizer
                columns={columnDefinitions}
                visibleColumns={visibleColumns}
                onColumnToggle={handleColumnToggle}
                isDarkMode={isDarkMode}
              />
              <DarkModeToggle isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
            </div>
          </div>

          <KPICards kpis={kpis} isDarkMode={isDarkMode} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <SearchPanel
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filters={filters}
              setFilters={setFilters}
              isDarkMode={isDarkMode}
            />
            <div className="hidden lg:block" />
          </div>

          <ChartsPanel
            data={sortedData}
            isDarkMode={isDarkMode}
            onFilterFromChart={({ key, value }) => setFilters(prev => ({ ...prev, [key]: value }))}
            chartRefs={{ pieRef, barRef, lineRef }}
            reduceMotion={reduceMotion}
            animateCharts={animateCharts}
            activeFilters={filters}
          />

          <div className="mb-4 flex justify-between items-center">
            <div className="flex gap-3">
              <ExportButtons
                data={sortedData}
                visibleColumns={visibleColumns}
                columnDefinitions={columnDefinitions}
                isDarkMode={isDarkMode}
                chartImages={chartImages}
              />
              <button
                onClick={() => setShowCustomReport(true)}
                className="neon-button flex items-center gap-2"
              >
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <Download className="w-4 h-4" />
                Custom Report
              </button>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Showing {sortedData.length} of {data.length} employees
            </div>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ReportTable
              data={paginatedData}
              columnDefinitions={columnDefinitions}
              visibleColumns={visibleColumns}
              sortConfig={sortConfig}
              onSort={handleSort}
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              totalItems={sortedData.length}
              onPageChange={handlePageChange}
              summaryData={summaryData}
              isDarkMode={isDarkMode}
              onRowClick={(row) => setSelectedEmployee(row)}
              compact={true}
            />
          </motion.div>
        </AnimatePresence>

        {selectedEmployee && (
          <EmployeeDetailCard employee={selectedEmployee} onClear={() => setSelectedEmployee(null)} isDarkMode={isDarkMode} />
        )}

        <NotificationSystem kpis={kpis} isDarkMode={isDarkMode} />
        
        <CustomReportModal
          isOpen={showCustomReport}
          onClose={() => setShowCustomReport(false)}
          data={sortedData}
          columnDefinitions={columnDefinitions}
          isDarkMode={isDarkMode}
        />
      </div>
    </div>
  );
}

export default App;
