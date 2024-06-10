import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api';

export const getTasks = () => {
  return axios.get(`${API_BASE_URL}/todos`);
};

export const createTask = (text) => {
  return axios.post(`${API_BASE_URL}/todos`, { text });
};

export const deleteTask = (id) => {
  return axios.delete(`${API_BASE_URL}/todos/${id}`);
};
