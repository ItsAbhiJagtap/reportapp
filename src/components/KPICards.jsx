import React from 'react';
import CountUp from 'react-countup';
import { motion } from 'framer-motion';
import { Users, DollarSign, TrendingUp, Gauge } from 'lucide-react';

const MetricCard = ({ title, value, prefix = '', suffix = '', trend = 0, icon: Icon, isDarkMode }) => {
  const isUp = trend >= 0;
  const trendColor = isUp ? 'text-emerald-600' : 'text-rose-600';
  const bg = isDarkMode
    ? 'backdrop-blur-md bg-white/5 border-white/10'
    : 'backdrop-blur-md bg-white/60 border-white/40';
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 0.95, y: -2 }}
      className={`gradient-border kpi-neon-border ${bg} rounded-2xl p-5 shadow-xl relative overflow-hidden`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className={`w-5 h-5 ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`} />
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{title}</span>
        </div>
        <span className={`text-xs font-semibold ${trendColor}`}>
          {isUp ? '↑' : '↓'} {Math.abs(trend)}%
        </span>
      </div>
      <div className="text-3xl font-bold text-gray-900 dark:text-white">
        {prefix}
        <CountUp end={value || 0} duration={1.2} separator="," decimals={0} />
        {suffix}
      </div>
    </motion.div>
  );
};

const KPICards = ({ kpis, isDarkMode }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <MetricCard
        title="Employees"
        value={kpis.totalEmployees}
        trend={kpis.employeeTrend}
        icon={Users}
        isDarkMode={isDarkMode}
      />
      <MetricCard
        title="Total Salary"
        value={Math.round(kpis.totalSalary)}
        prefix="$"
        trend={kpis.salaryTrend}
        icon={DollarSign}
        isDarkMode={isDarkMode}
      />
      <MetricCard
        title="Avg Salary"
        value={Math.round(kpis.avgSalary)}
        prefix="$"
        trend={kpis.avgSalaryTrend}
        icon={TrendingUp}
        isDarkMode={isDarkMode}
      />
      <MetricCard
        title="Avg Performance"
        value={Number(kpis.avgPerformance || 0).toFixed(1)}
        suffix="/5"
        trend={kpis.performanceTrend}
        icon={Gauge}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

export default KPICards;


