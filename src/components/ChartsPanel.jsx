import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  PieChart, Pie, Cell, Tooltip as ReTooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line
} from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

const ChartsPanel = ({
  data,
  isDarkMode,
  onFilterFromChart,
  chartRefs,
  reduceMotion = false,
  animateCharts = true,
  activeFilters = {}
}) => {
  const pieData = React.useMemo(() => {
    const counts = data.reduce((acc, item) => {
      acc[item.department] = (acc[item.department] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [data]);

  const barData = React.useMemo(() => {
    const byStatus = data.reduce((acc, item) => {
      const key = item.status;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(byStatus).map((k) => ({ status: k, count: byStatus[k] }));
  }, [data]);

  const lineData = React.useMemo(() => {
    // Group hires by month from startDate
    const byMonth = data.reduce((acc, item) => {
      const d = new Date(item.startDate);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    const sorted = Object.keys(byMonth).sort();
    return sorted.map((k) => ({ month: k, hires: byMonth[k] }));
  }, [data]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <motion.div
        ref={chartRefs.pieRef}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className={`gradient-border rounded-2xl p-4 shadow-xl ${isDarkMode ? 'bg-gray-800/80' : 'bg-white/80'} backdrop-blur`}
      >
        <div className="text-sm font-semibold mb-2 gradient-text">Department Distribution</div>
        <div className="w-full h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <ReTooltip formatter={(v, name) => [v, name]} contentStyle={{ backgroundColor: isDarkMode ? '#1F2937' : '#fff', borderRadius: 8, border: `1px solid ${isDarkMode ? '#374151' : '#E5E7EB'}` }} />
            <Legend wrapperStyle={{ color: isDarkMode ? '#D1D5DB' : '#374151' }} />
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              onClick={(d) => {
                const isActive = activeFilters.department === d.name;
                onFilterFromChart({ 
                  key: 'department', 
                  value: isActive ? '' : d.name 
                });
              }}
              isAnimationActive={animateCharts && !reduceMotion}
              animationDuration={reduceMotion ? 0 : 500}
            >
              {pieData.map((entry, index) => {
                const isActive = activeFilters.department === entry.name;
                return (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={isActive ? COLORS[index % COLORS.length] : COLORS[index % COLORS.length]}
                    stroke={isActive ? '#fff' : 'none'}
                    strokeWidth={isActive ? 2 : 0}
                    cursor="pointer" 
                  />
                );
              })}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div
        ref={chartRefs.barRef}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className={`gradient-border rounded-2xl p-4 shadow-xl ${isDarkMode ? 'bg-gray-800/80' : 'bg-white/80'} backdrop-blur`}
      >
        <div className="text-sm font-semibold mb-2 gradient-text">Status Breakdown</div>
        <div className="w-full h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#E5E7EB'} />
            <XAxis dataKey="status" stroke={isDarkMode ? '#9CA3AF' : '#6B7280'} />
            <YAxis stroke={isDarkMode ? '#9CA3AF' : '#6B7280'} />
            <ReTooltip contentStyle={{ backgroundColor: isDarkMode ? '#1F2937' : '#fff', borderRadius: 8, border: `1px solid ${isDarkMode ? '#374151' : '#E5E7EB'}` }} />
            <Bar 
              dataKey="count" 
              fill="#3B82F6" 
              onClick={(d) => {
                const isActive = activeFilters.status === d.activeLabel;
                onFilterFromChart({ 
                  key: 'status', 
                  value: isActive ? '' : d.activeLabel 
                });
              }} 
              cursor="pointer" 
              isAnimationActive={animateCharts && !reduceMotion} 
              animationDuration={reduceMotion ? 0 : 500} 
            />
          </BarChart>
        </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div
        ref={chartRefs.lineRef}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className={`gradient-border rounded-2xl p-4 shadow-xl ${isDarkMode ? 'bg-gray-800/80' : 'bg-white/80'} backdrop-blur`}
      >
        <div className="text-sm font-semibold mb-2 gradient-text">Hires Over Time</div>
        <div className="w-full h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={lineData}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#E5E7EB'} />
            <XAxis dataKey="month" stroke={isDarkMode ? '#9CA3AF' : '#6B7280'} />
            <YAxis stroke={isDarkMode ? '#9CA3AF' : '#6B7280'} />
            <ReTooltip contentStyle={{ backgroundColor: isDarkMode ? '#1F2937' : '#fff', borderRadius: 8, border: `1px solid ${isDarkMode ? '#374151' : '#E5E7EB'}` }} />
            <Line type="monotone" dataKey="hires" stroke="#10B981" strokeWidth={2} dot={false} isAnimationActive={animateCharts && !reduceMotion} animationDuration={reduceMotion ? 0 : 600} />
          </LineChart>
        </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
};

export default ChartsPanel;


