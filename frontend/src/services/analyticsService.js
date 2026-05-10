import axios from './api';

export const getTicketTrends = () => axios.get('/analytics/trends');
export const getDepartmentStats = () => axios.get('/analytics/departments');
export const getEngineerStats = () => axios.get('/analytics/engineers');
export const getSLAStats = () => axios.get('/analytics/sla');
export const getCategoryStats = () => axios.get('/analytics/categories');
export const exportTicketsPDF = () => axios.get('/export/pdf', { responseType: 'blob' });