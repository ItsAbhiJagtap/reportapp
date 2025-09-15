import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

const NotificationSystem = ({ kpis, isDarkMode }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const newNotifications = [];
    
    // Check KPI thresholds
    if (kpis.avgSalary < 70000) {
      newNotifications.push({
        id: 'low-salary',
        type: 'warning',
        title: 'Low Average Salary',
        message: `Average salary is $${Math.round(kpis.avgSalary).toLocaleString()}, below recommended threshold.`,
        icon: AlertTriangle,
        color: 'text-yellow-500'
      });
    }
    
    if (kpis.avgPerformance < 3.5) {
      newNotifications.push({
        id: 'low-performance',
        type: 'warning',
        title: 'Performance Alert',
        message: `Average performance is ${kpis.avgPerformance.toFixed(1)}/5.0, needs attention.`,
        icon: TrendingDown,
        color: 'text-red-500'
      });
    }
    
    if (kpis.totalEmployees > 20) {
      newNotifications.push({
        id: 'growth',
        type: 'success',
        title: 'Team Growth',
        message: `Team has grown to ${kpis.totalEmployees} employees. Consider scaling infrastructure.`,
        icon: TrendingUp,
        color: 'text-green-500'
      });
    }

    setNotifications(newNotifications);
  }, [kpis]);

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`max-w-sm p-4 rounded-2xl shadow-xl border backdrop-blur ${
              isDarkMode 
                ? 'bg-gray-800/90 border-gray-700' 
                : 'bg-white/90 border-gray-200'
            }`}
          >
            <div className="flex items-start gap-3">
              <notification.icon className={`w-5 h-5 mt-0.5 ${notification.color}`} />
              <div className="flex-1">
                <h4 className="font-semibold text-sm text-gray-900 dark:text-white">
                  {notification.title}
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                  {notification.message}
                </p>
              </div>
              <button
                onClick={() => removeNotification(notification.id)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default NotificationSystem;
