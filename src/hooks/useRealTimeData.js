import { useState, useEffect, useCallback } from 'react';

const useRealTimeData = (initialData, interval = 5000) => {
  const [data, setData] = useState(initialData);
  const [isLive, setIsLive] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Simulate real-time data updates
  const updateData = useCallback(() => {
    setData(prevData => 
      prevData.map(item => ({
        ...item,
        // Simulate small changes in performance and salary
        performance: Math.max(1, Math.min(5, item.performance + (Math.random() - 0.5) * 0.2)),
        salary: Math.max(50000, item.salary + (Math.random() - 0.5) * 1000),
        // Occasionally change status
        status: Math.random() > 0.95 ? (item.status === 'Active' ? 'Inactive' : 'Active') : item.status
      }))
    );
    setLastUpdate(new Date());
  }, []);

  useEffect(() => {
    let intervalId;
    
    if (isLive) {
      intervalId = setInterval(updateData, interval);
    }
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isLive, interval, updateData]);

  const toggleLive = useCallback(() => {
    setIsLive(prev => !prev);
  }, []);

  const resetData = useCallback(() => {
    setData(initialData);
    setLastUpdate(new Date());
  }, [initialData]);

  return {
    data,
    isLive,
    lastUpdate,
    toggleLive,
    resetData,
    updateData
  };
};

export default useRealTimeData;
