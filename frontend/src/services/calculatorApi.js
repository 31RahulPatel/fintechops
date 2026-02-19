import axios from 'axios';

const API_URL = process.env.REACT_APP_CALCULATOR_API_URL || 'http://localhost:6000/api/calculators';

const getAuthToken = () => localStorage.getItem('authToken');

export const calculate = async (type, params) => {
  const response = await axios.post(`${API_URL}/calculate`, { type, params });
  return response.data;
};

export const saveCalculation = async (type, params, result) => {
  const response = await axios.post(
    `${API_URL}/save`,
    { type, params, result },
    { headers: { Authorization: `Bearer ${getAuthToken()}` } }
  );
  return response.data;
};

export const getHistory = async (type = null) => {
  const response = await axios.get(`${API_URL}/history${type ? `?type=${type}` : ''}`, {
    headers: { Authorization: `Bearer ${getAuthToken()}` }
  });
  return response.data;
};

export const deleteHistory = async (id) => {
  const response = await axios.delete(`${API_URL}/history/${id}`, {
    headers: { Authorization: `Bearer ${getAuthToken()}` }
  });
  return response.data;
};
