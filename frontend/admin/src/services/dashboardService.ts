import api from "./axiosInstance";

// Get performance metrics
export const getPerformanceMetrics = () => {
    return api.get('/api/performance/metrics');
  };